import { PaletteSlots } from './color-core.js';

/**
 * Shared persistence for the color picker's saved-swatch palette.
 * One palette per machine (localStorage), shared by every panel and framework.
 *
 * Kept separate from color-core so the core stays side-effect-free and
 * node-testable. All storage access is fail-soft: when localStorage is
 * unavailable (SSR, Safari private mode, blocked-cookie contexts) the palette
 * silently degrades to session-only — a broken shelf must never break the picker.
 */

type PaletteListener = (slots: PaletteSlots) => void;
declare function loadPalette(): PaletteSlots;
declare function savePalette(slots: PaletteSlots): void;
/**
 * Same-page panels sync through the listener set; other tabs via the storage
 * event. Caveat: mixed-framework pages load one module copy per bundle, and
 * the storage event doesn't fire in the writing document — so same-page sync
 * only spans panels from the same bundle. Cross-tab sync always works.
 */
declare function subscribePalette(cb: PaletteListener): () => void;

export { loadPalette, savePalette, subscribePalette };
