# Rollback runbook — Netlify → Vercel

Written **before** cutover, so no decision has to be improvised during an
incident. Everything needed to reverse the migration is recorded here as literal
values, not as descriptions of where to find them.

Rollback is a **DNS change only**. No code is reverted, nothing is rebuilt, and
no Netlify resource is deleted. The Vercel deployment is deliberately left intact
and serving, so reversing the cutover means pointing two records back at values
that are already working.

## 1. Retained Vercel state — do not delete any of this

| Asset | State | Needed for rollback |
| --- | --- | --- |
| Vercel project & production deployment | **intact and running** — `wwwpetrohryscoms-projects/asteriastar` | yes — this is the rollback target |
| Vercel domain configuration for `asteriastar.com` and `www.asteriastar.com` | **left attached** | yes — required for Vercel to answer for the hostnames |
| Vercel environment variables | **unchanged** | yes |
| Vercel Git integration | **unchanged** | yes — a rebuild must remain possible |
| Vercel deployment id observed in production HTML | `dpl_8pnGAPD5sfVbZjogoVjnyvEdYSzU` | identifies the exact build being rolled back to |

Deleting the Vercel project, removing its domains, or unsetting its environment
variables destroys the rollback path. None of that may happen until the
observation window in §6 has completed.

## 2. Previous DNS records — the exact values to restore

Captured `2026-08-19T22:09:25Z`. Authoritative nameservers are Namecheap
BasicDNS (`dns1.registrar-servers.com`, `dns2.registrar-servers.com`); the
records are edited in the Namecheap **Advanced DNS** panel for `asteriastar.com`.

| Host | Type | Value | TTL |
| --- | --- | --- | --- |
| `@` (apex) | `A` | `216.150.1.1` | 1800 |
| `www` | `CNAME` | `9d8ba2f577984053.vercel-dns-016.com.` | 1800 |

Restoring **those two records exactly** is the complete rollback.

### Records that must never be touched — not during cutover, not during rollback

These are unrelated to hosting. Changing or dropping them breaks email and
third-party domain verification, and they are the reason this migration keeps DNS
at Namecheap rather than delegating the zone to Netlify DNS.

| Host | Type | Value | TTL |
| --- | --- | --- | --- |
| `@` | `MX` | `eforward1.registrar-servers.com.` (10) | 1800 |
| `@` | `MX` | `eforward2.registrar-servers.com.` (10) | 1800 |
| `@` | `MX` | `eforward3.registrar-servers.com.` (10) | 1800 |
| `@` | `MX` | `eforward4.registrar-servers.com.` (15) | 1800 |
| `@` | `MX` | `eforward5.registrar-servers.com.` (20) | 1800 |
| `@` | `TXT` | `v=spf1 include:spf.efwd.registrar-servers.com ~all` | 1800 |
| `@` | `TXT` | `google-site-verification=9RZdrDwjlVTCOFN1xxwtWOISfknaRz6IbaiLVgMH7uI` | 1800 |
| `@` | `TXT` | `openai-domain-verification=dv-x0RZFKJdQOiu3zS0vYbAxT6o` | 1800 |

There is no `CAA` record and no `AAAA` record on either hostname. The absence of
`CAA` is what lets both Vercel and Netlify issue certificates without a further
DNS change, in either direction.

A machine-readable capture of the full zone as it stood before cutover is at
`docs/dns-before-cutover.txt`.

## 3. Rollback triggers

Roll back — do not debug in production — if any of these is observed after
cutover:

| Trigger | How it is detected |
| --- | --- |
| Widespread 5xx | `npm run netlify:smoke -- --origin https://www.asteriastar.com` fails on multiple page groups, or Netlify function error rate is non-trivial |
| Broken API contract | the parity suite reports a **critical** difference on any `/api/v0/*` target |
| Unavailable media | `next/image` returns non-2xx, or raw `/media/**` assets 404 |
| Broken canonical | canonical, `og:url` or sitemap emits a `*.netlify.app` host |
| TLS failure | certificate invalid, not yet issued, or not covering both apex and `www` |
| Severe performance regression | homepage TTFB or LCP materially worse than the recorded Vercel baseline and not recovering |
| Critical search failure | `/api/v0/search?q=jupiter` returns no results, or the search index shards 404 |
| Major SEO routing regression | apex stops redirecting to `www`, a redirect loop appears, or `robots.txt` / `sitemap.xml` / `llms.txt` stops returning 200 |

## 4. Rollback procedure

1. **Restore the two DNS records** in the Namecheap Advanced DNS panel for
   `asteriastar.com`, exactly as listed in §2:
   - `@` `A` → `216.150.1.1`
   - `www` `CNAME` → `9d8ba2f577984053.vercel-dns-016.com.`
   Leave every `MX` and `TXT` record untouched.

2. **Do not remove the domains from Netlify.** Leaving them attached costs
   nothing, keeps the Netlify TLS certificate valid, and means a second attempt
   at cutover needs only a DNS change rather than a fresh domain verification.

3. **Wait for propagation.** With TTL lowered to 300 s before cutover (§5), the
   world converges within ~5 minutes. If the TTL was still 1800 s, allow 30
   minutes.

## 5. TTL handling

Lower both records' TTL to **300** at least 30 minutes (one full old-TTL period)
before cutover. That is what makes both the cutover and any rollback fast. Raise
the TTL back to 1800 only after the observation window in §6 closes.

## 6. Verification commands

Run these after a rollback. They are the same commands used to verify the
cutover, which is the point: one definition of healthy, in both directions.

```sh
# Who is serving? Expect `server: Vercel` and an x-vercel-id header after rollback.
curl -sSI https://www.asteriastar.com/ | grep -Ei '^(HTTP|server|x-vercel|x-nf|strict-transport)'

# Apex must still 308 to www.
curl -sSI https://asteriastar.com/ | grep -Ei '^(HTTP|location)'

# DNS actually resolving to the restored targets.
dig +short A asteriastar.com          # expect 216.150.1.1
dig +short CNAME www.asteriastar.com  # expect 9d8ba2f577984053.vercel-dns-016.com.

# Full functional smoke — 93 absolute checks, no baseline needed.
npm run netlify:smoke -- --origin https://www.asteriastar.com --expect-canonical-host asteriastar.com

# Semantic parity against the recorded pre-migration snapshot.
npm run netlify:parity -- --compare docs/parity-baseline-vercel.json --candidate https://www.asteriastar.com
```

A rollback is complete when the smoke suite passes and `server: Vercel` is back on
the production response.

## 7. What rollback does *not* undo

- The merged pull request. `netlify.toml` and the new scripts stay in `main`;
  they are inert while Vercel serves the domain.
- The Netlify site, its build history, or its environment variables.
- Any IndexNow submission already made. IndexNow submits **URLs**, never a host's
  infrastructure, and every submitted URL stays valid on either platform — which
  is why a rollback needs no IndexNow action at all.
