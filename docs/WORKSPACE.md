# Research Workspace (Program BV)

A place to do research on top of the encyclopedia — save what you find, organise it, annotate it, cite
it, and take it with you — built with one uncompromising rule: **your data never leaves your browser.**

## Privacy by construction

The workspace is private not by policy but by design. The store (`src/lib/workspace/store.ts`):

- reads and writes **only `localStorage`**, under the single key `asteriastar:workspace:v1`;
- holds **no account** and requires no sign-in;
- **never makes a network request** — there is no `fetch`, no beacon, no socket;
- **sets no cookie** and records **no analytics**;
- offers a single control on the privacy page that **erases everything**.

The build gate greps every module in `src/lib/workspace` for `fetch(`, `XMLHttpRequest`,
`navigator.sendBeacon`, `document.cookie`, and `new WebSocket`, and **fails the build** if any appears.
Privacy here is an enforced property of the code, not a promise.

## What you can do

- **Save entities** — bookmark any real graph entity (planet, star, mission, galaxy, method). Only real
  science entities can be saved; platform-feature meta-nodes are excluded from the picker.
- **Collections** — group saved entities into collections, ordered **reading lists**, and **observation
  projects** (target lists that pair with the observing suite).
- **Notes** — free-text notes, optionally attached to a saved entity.
- **Citation folder** — collect the **real, source-backed** citations behind your entities and render
  them in APA, Chicago, MLA, Harvard, BibTeX, or RIS. This **reuses the platform's citation engine**
  (`src/lib/citations.ts`); every field comes from a verifiable citation record — none is invented.
- **Exports & printable packet** — export the whole workspace to **JSON, Markdown, BibTeX, or CSV**, or
  print a clean packet. JSON can be re-imported, so you move your workspace between devices yourself.

## Architecture

- **Store** (`src/lib/workspace/store.ts`, `"use client"`): a `useSyncExternalStore`-backed localStorage
  store. SSR renders the empty workspace and hydrates to the local data; every mutation writes through
  and notifies subscribers and other tabs (via the `storage` event).
- **Exports** (`src/lib/workspace/exports.ts`): pure functions `toJSON` / `toMarkdown` / `toBibTeX` /
  `toCSV`, reusing `formatCitation`. Isomorphic and testable.
- **Components** (`src/components/workspace/`): the find-and-save `EntityPicker` (over a server-built
  entity index, so the graph never enters the client bundle), the hub, and the collections, notes,
  citations, exports, and privacy managers.
- **Catalog** (`workspace-catalog`, entity type `workspace_feature`): the capabilities as meta-nodes,
  excluded from scientific traversal via `isMetaNode`. `engine.researchWorkspace` resolves them.

## Pages

`/workspace` (hub), `/workspace/collections`, `/workspace/notes`, `/workspace/citations`,
`/workspace/exports`, `/workspace/privacy`.

## Provenance

The workspace holds references to real entities and real citation records; it computes and fabricates
nothing. Saved data is the user's own and is stored only on their device.
