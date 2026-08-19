# DNS / domain cutover runbook — asteriastar.com

Zero-downtime cutover of `asteriastar.com` and `www.asteriastar.com` from Vercel
to Netlify. The rollback path for everything below is `docs/netlify-rollback.md`,
which is written first on purpose.

## 0. Authoritative facts (measured, not assumed)

| Fact | Value |
| --- | --- |
| Registrar / DNS provider | **Namecheap**, BasicDNS (`dns1.registrar-servers.com`, `dns2.registrar-servers.com`) |
| Where records are edited | Namecheap dashboard → Domain List → `asteriastar.com` → **Advanced DNS** |
| Current apex | `A` → `216.150.1.1` (Vercel), TTL 1800 |
| Current `www` | `CNAME` → `9d8ba2f577984053.vercel-dns-016.com.` (Vercel), TTL 1800 |
| Current serving host | `www` answers 200; apex answers **308** → `https://www.asteriastar.com/` |
| Netlify site | `asteriastar-production` — `21355df0-d3f8-4a27-98a3-115368ba7472` |
| Netlify hostname | `asteriastar-production.netlify.app` |
| `CAA` record | **none** — so no CA restriction blocks certificate issuance in either direction |
| `AAAA` record | **none** on either hostname |

**The zone stays at Namecheap.** Delegating it to Netlify DNS would move five `MX`
records (Namecheap email forwarding) and three `TXT` records (SPF, Google Search
Console verification, OpenAI domain verification) — none of which are hosting
concerns, all of which break if the zone moves and they are not recreated exactly.
Two record edits at Namecheap achieve the cutover with none of that risk.

## 0b. One access setting to restore before cutover

The site was created with the account's default `sso_login` (require a Netlify
login to view). It was turned **off** on this site during migration so the
candidate deployment could be tested over HTTP at all.

Before cutover, set it to match the account's other production site
(`globalcityintelligence`), which is the pattern already proven to work here:

```sh
netlify api updateSite --data '{"site_id":"21355df0-d3f8-4a27-98a3-115368ba7472","body":{"sso_login":true,"sso_login_context":"non_production"}}'
```

That leaves **production public** — which it must be — while restoring login
protection on Deploy Previews and branch deploys. Verify afterwards that the
production hostname still answers 200 before touching DNS; a site that requires
a login would serve the public web a 401.

## 1. Gates that must be green before any DNS change

Do not proceed until every one of these is satisfied. This is the checklist, not
a summary of one.

- [ ] PR merged to `main` and `main` is green
- [ ] Netlify **production** deploy from `main` is `ready`
- [ ] `npm run netlify:smoke -- --origin https://<netlify-host> --preview` passes
- [ ] `npm run netlify:parity -- --compare docs/parity-baseline-vercel.json --candidate https://<netlify-host>` reports **0 critical**
- [ ] Full crawl of the candidate reports no unexpected 404 and no `*.netlify.app` canonical
- [ ] Representative Lighthouse shows no material regression vs the Vercel baseline
- [ ] `INDEXNOW_KEY` present on Netlify, **production context only**
- [ ] Rollback values recorded (`docs/netlify-rollback.md` §2) and re-verified against live DNS
- [ ] Vercel project, domains and environment variables **untouched and still serving**

## 2. Lower the TTL first — at least 30 minutes ahead

In Namecheap Advanced DNS, change **only the TTL** on the two hosting records:

| Host | Type | Value (unchanged) | TTL: `1800` → `300` |
| --- | --- | --- | --- |
| `@` | `A` | `216.150.1.1` | **300** |
| `www` | `CNAME` | `9d8ba2f577984053.vercel-dns-016.com.` | **300** |

Nothing is served differently; this only shortens how long resolvers cache the
answer, which is what makes both the cutover and any rollback converge in minutes
rather than half an hour. Wait one full **old** TTL (30 min) before step 4.

Confirm the new TTL is live:

```sh
dig +noall +answer A asteriastar.com www.asteriastar.com CNAME www.asteriastar.com
# the TTL column should count down from 300, not 1800
```

## 3. Attach the domains to Netlify — before touching DNS

Adding a domain to a Netlify site does **not** change DNS and does **not** affect
what production serves. It registers the hostnames so Netlify will answer for them
and can request a certificate the moment DNS points its way.

```sh
netlify api addDomainToSite --data '{"site_id":"21355df0-d3f8-4a27-98a3-115368ba7472","body":{"domain":"www.asteriastar.com"}}'
netlify api updateSite --data '{"site_id":"21355df0-d3f8-4a27-98a3-115368ba7472","body":{"custom_domain":"www.asteriastar.com","domain_aliases":["asteriastar.com"]}}'
```

`www.asteriastar.com` is the **primary** domain and `asteriastar.com` an alias —
matching the current Vercel arrangement exactly, and matching Netlify's own
recommendation to make a subdomain primary when using external DNS (an apex on
external DNS resolves to a single load-balancer IP and cannot use direct CDN
routing; a `CNAME`'d subdomain can).

Netlify will report the domains as awaiting DNS. That is the expected state until
step 4.

> **Order matters.** Step 3 must happen *before* step 4. Netlify only answers for
> hostnames assigned to a site: if DNS is repointed first, apex and `www` reach
> Netlify's load balancer as unknown hosts and get Netlify's own 404 page, not
> the site — an outage caused purely by ordering. The `[[redirects]]` rules in
> `netlify.toml` are subject to the same rule: a domain-level redirect from
> `https://asteriastar.com/*` is inert until the apex is a domain alias of this
> site.

## 4. The cutover — two record edits

In Namecheap Advanced DNS for `asteriastar.com`:

| Host | Type | Old value | **New value** | TTL |
| --- | --- | --- | --- | --- |
| `www` | `CNAME` | `9d8ba2f577984053.vercel-dns-016.com.` | **`asteriastar-production.netlify.app.`** | 300 |
| `@` | `ALIAS` *(preferred)* | — | **`apex-loadbalancer.netlify.com.`** | 300 |
| `@` | `A` *(fallback, only if ALIAS is unavailable)* | `216.150.1.1` | **`75.2.60.5`** | 300 |

Namecheap BasicDNS supports `ALIAS`; use it and delete the old `A` record. Only
if the panel refuses an `ALIAS` at the apex, keep an `A` record and change its
value to `75.2.60.5`. Both eventually resolve to Netlify's load balancer; `ALIAS`
is the more resilient of the two because it is not pinned to one IP.

**Do not touch any `MX` or `TXT` record.** They are listed verbatim in
`docs/netlify-rollback.md` §2 so a mistake is recoverable.

## 5. Wait for DNS and TLS

```sh
# 1 — DNS has moved
dig +short CNAME www.asteriastar.com   # expect asteriastar-production.netlify.app.
dig +short A asteriastar.com           # expect 75.2.60.5 (and/or 99.83.231.61 via ALIAS)

# 2 — Netlify has issued the certificate for both hostnames
netlify api showSiteTLSCertificate --data '{"site_id":"21355df0-d3f8-4a27-98a3-115368ba7472"}'

# 3 — TLS actually valid on the wire, covering apex and www
echo | openssl s_client -servername www.asteriastar.com -connect www.asteriastar.com:443 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

Certificate issuance normally takes a few minutes after DNS resolves. Do not
proceed to step 6 until the certificate covers **both** `asteriastar.com` and
`www.asteriastar.com`.

## 6. Verify the cutover

```sh
# Netlify — not stale Vercel — is answering.
curl -sSI https://www.asteriastar.com/ | grep -Ei '^(HTTP|server|x-nf-request-id|x-vercel|strict-transport|cache-control)'
#   expect: HTTP/2 200, an x-nf-request-id header, NO x-vercel-id,
#           strict-transport-security: max-age=63072000

# Apex still 308s to www, exactly as before.
curl -sSI https://asteriastar.com/ | grep -Ei '^(HTTP|location)'
#   expect: HTTP/2 308  ·  location: https://www.asteriastar.com/

# Protocol files.
for p in /robots.txt /sitemap.xml /llms.txt /c292fa58c74f45f9ad982e152b4f7c1c.txt; do
  printf '%-45s %s\n' "$p" "$(curl -sS -o /dev/null -w '%{http_code} %{content_type}' https://www.asteriastar.com$p)"
done

# The IndexNow key file must be the key and nothing else — no trailing newline.
curl -sS https://www.asteriastar.com/c292fa58c74f45f9ad982e152b4f7c1c.txt | xxd | tail -2

# Full functional smoke and semantic parity on the real production domain.
npm run netlify:smoke -- --origin https://www.asteriastar.com --expect-canonical-host asteriastar.com
npm run netlify:parity -- --compare docs/parity-baseline-vercel.json --candidate https://www.asteriastar.com
```

Cutover is successful when the smoke suite passes on the production domain and the
parity comparison reports **0 critical** differences.

## 7. After cutover

1. **Leave Vercel entirely alone** for the observation window. It is the rollback
   path; see `docs/netlify-rollback.md` §1.
2. Run the existing IndexNow workflow (`gh workflow run indexnow.yml`) only once
   production is confirmed healthy. It reads the live sitemap from the canonical
   host, so it needs no change — and it must never be run against a preview.
3. Confirm WebmasterID traffic is still arriving.
4. Raise both TTLs back to `1800` only when the observation window closes.
5. Only then consider decommissioning Vercel — and that is a separate decision,
   not part of this migration.
