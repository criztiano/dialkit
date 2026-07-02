/**
 * Shared persistence for the color picker's saved-swatch palette.
 * One palette per machine (localStorage), shared by every panel and framework.
 *
 * Kept separate from color-core so the core stays side-effect-free and
 * node-testable. All storage access is fail-soft: when localStorage is
 * unavailable (SSR, Safari private mode, blocked-cookie contexts) the palette
 * silently degrades to session-only — a broken shelf must never break the picker.
 */
import {
  deserializePalette,
  serializePalette,
  emptyPalette,
  PALETTE_STORAGE_KEY,
  type PaletteSlots,
} from './color-core';

type PaletteListener = (slots: PaletteSlots) => void;

let cache: PaletteSlots | null = null;
const listeners = new Set<PaletteListener>();
let storageListenerAttached = false;

function readStorage(): PaletteSlots {
  try {
    if (typeof window === 'undefined') return emptyPalette();
    return deserializePalette(window.localStorage.getItem(PALETTE_STORAGE_KEY));
  } catch {
    // Property access itself can throw when storage is blocked — degrade to empty.
    return emptyPalette();
  }
}

function notify() {
  const slots = cache ?? emptyPalette();
  listeners.forEach((cb) => cb(slots));
}

/** Cross-tab sync: another document wrote the palette. */
function onStorageEvent(e: StorageEvent) {
  if (e.key !== PALETTE_STORAGE_KEY) return;
  cache = deserializePalette(e.newValue);
  notify();
}

export function loadPalette(): PaletteSlots {
  if (cache === null) cache = readStorage();
  return cache;
}

export function savePalette(slots: PaletteSlots): void {
  cache = slots;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, serializePalette(slots));
    }
  } catch {
    // Quota / private mode — keep the in-memory palette for this session.
  }
  notify();
}

/** Same-page panels sync through the listener set; other tabs via the storage event. */
export function subscribePalette(cb: PaletteListener): () => void {
  listeners.add(cb);
  if (!storageListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorageEvent);
    storageListenerAttached = true;
  }
  return () => {
    listeners.delete(cb);
  };
}
