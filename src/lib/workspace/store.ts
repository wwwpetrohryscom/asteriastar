"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_WORKSPACE,
  type Collection,
  type CollectionKind,
  type CitationRef,
  type SavedEntity,
  type WorkspaceNote,
  type WorkspaceState,
} from "@/lib/workspace/types";

/**
 * The Research Workspace store (Program BV). Privacy-first by construction: it reads and writes ONLY
 * `localStorage` under a single key, holds no account, sets no cookie, makes NO network request, and
 * records no analytics. The data never leaves the browser. `useWorkspace()` subscribes React to it via
 * useSyncExternalStore (SSR renders the empty workspace, then hydrates to the local data), and every
 * mutation writes through to localStorage and notifies subscribers and other tabs.
 */

const KEY = "asteriastar:workspace:v1";

let cache: WorkspaceState | null = null;
const listeners = new Set<() => void>();

function read(): WorkspaceState {
  if (typeof window === "undefined") return EMPTY_WORKSPACE;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY_WORKSPACE, ...(JSON.parse(raw) as Partial<WorkspaceState>) } : EMPTY_WORKSPACE;
  } catch {
    cache = EMPTY_WORKSPACE; // corrupt or unavailable storage ⇒ start empty, never throw
  }
  return cache;
}

function write(next: WorkspaceState) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked — the in-memory cache still reflects the change for this session */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  if (typeof window !== "undefined" && listeners.size === 1) {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(l);
    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/** Cross-tab sync: another tab wrote the workspace ⇒ drop the cache and notify. */
function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return;
  cache = null;
  listeners.forEach((l) => l());
}

function getSnapshot(): WorkspaceState {
  return read();
}
function getServerSnapshot(): WorkspaceState {
  return EMPTY_WORKSPACE;
}

/** Subscribe a component to the workspace. */
export function useWorkspace(): WorkspaceState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Read the current state imperatively (e.g. for an export). */
export function getWorkspace(): WorkspaceState {
  return read();
}

/* ---------------------------------------------------------------- ids */

let seq = 0;
function newId(prefix: string): string {
  seq += 1;
  const t = typeof performance !== "undefined" ? Math.floor(performance.now()) : 0;
  return `${prefix}-${Date.now().toString(36)}-${t.toString(36)}${seq.toString(36)}`;
}

/* -------------------------------------------------------- saved entities */

export function saveEntity(e: Omit<SavedEntity, "addedAt">): void {
  const s = read();
  if (s.savedEntities.some((x) => x.id === e.id)) return; // already saved — no duplicate
  write({ ...s, savedEntities: [{ ...e, addedAt: Date.now() }, ...s.savedEntities] });
}

export function removeEntity(id: string): void {
  const s = read();
  write({
    ...s,
    savedEntities: s.savedEntities.filter((x) => x.id !== id),
    collections: s.collections.map((c) => ({ ...c, entityIds: c.entityIds.filter((e) => e !== id) })),
    notes: s.notes.map((n) => (n.entityId === id ? { ...n, entityId: undefined } : n)),
  });
}

export function isSaved(id: string, state?: WorkspaceState): boolean {
  return (state ?? read()).savedEntities.some((x) => x.id === id);
}

/* ------------------------------------------------------------ collections */

export function addCollection(name: string, kind: CollectionKind, description?: string): string {
  const s = read();
  const id = newId("col");
  const now = Date.now();
  const c: Collection = { id, name, kind, description, entityIds: [], createdAt: now, updatedAt: now };
  write({ ...s, collections: [c, ...s.collections] });
  return id;
}

export function updateCollection(id: string, patch: Partial<Pick<Collection, "name" | "description" | "entityIds">>): void {
  const s = read();
  write({ ...s, collections: s.collections.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)) });
}

export function removeCollection(id: string): void {
  const s = read();
  write({ ...s, collections: s.collections.filter((c) => c.id !== id) });
}

export function addToCollection(collectionId: string, entityId: string): void {
  const s = read();
  write({
    ...s,
    collections: s.collections.map((c) =>
      c.id === collectionId && !c.entityIds.includes(entityId)
        ? { ...c, entityIds: [...c.entityIds, entityId], updatedAt: Date.now() }
        : c,
    ),
  });
}

export function removeFromCollection(collectionId: string, entityId: string): void {
  const s = read();
  write({
    ...s,
    collections: s.collections.map((c) =>
      c.id === collectionId ? { ...c, entityIds: c.entityIds.filter((e) => e !== entityId), updatedAt: Date.now() } : c,
    ),
  });
}

/* ----------------------------------------------------------------- notes */

export function addNote(title: string, body: string, entityId?: string): string {
  const s = read();
  const id = newId("note");
  const now = Date.now();
  const n: WorkspaceNote = { id, title, body, entityId, createdAt: now, updatedAt: now };
  write({ ...s, notes: [n, ...s.notes] });
  return id;
}

export function updateNote(id: string, patch: Partial<Pick<WorkspaceNote, "title" | "body">>): void {
  const s = read();
  write({ ...s, notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)) });
}

export function removeNote(id: string): void {
  const s = read();
  write({ ...s, notes: s.notes.filter((n) => n.id !== id) });
}

/* ------------------------------------------------------------- citations */

export function addCitation(ref: Omit<CitationRef, "id" | "addedAt">): void {
  const s = read();
  if (s.citations.some((c) => c.citationId === ref.citationId && c.entityId === ref.entityId)) return;
  write({ ...s, citations: [{ ...ref, id: newId("cite"), addedAt: Date.now() }, ...s.citations] });
}

export function removeCitation(id: string): void {
  const s = read();
  write({ ...s, citations: s.citations.filter((c) => c.id !== id) });
}

/* --------------------------------------------------------- whole state */

/** Replace the whole workspace (used by JSON import). */
export function importWorkspace(next: WorkspaceState): void {
  write({ ...EMPTY_WORKSPACE, ...next });
}

/** Erase everything — the privacy "delete all my data" control. */
export function clearWorkspace(): void {
  write(EMPTY_WORKSPACE);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}
