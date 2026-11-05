/**
 * The choice controls: chips, a multiselect, swatches, a file picker and a
 * gallery. Their values stay JSON: a picked file's name, never the file
 * (the files go out on the event channel, see {@link DialEvent}).
 */

export type ChipOption = {
  value: string;
  label: string;
  /** Shows a remove button that sends a `remove` event. The app takes the chip out of its options. */
  removable?: boolean;
};

/** One of a set of chips that wrap onto more lines. The value is the chosen chip's value. */
export type ChipsConfig = {
  type: 'chips';
  options: ChipOption[];
  default?: string;
};

export type MultiSelectOption = {
  value: string;
  label: string;
  /** One quiet line under the label, such as what the option contains. */
  hint?: string;
  /** A small badge next to the label, such as 'local' or 'cloud'. */
  tag?: string;
};

/**
 * Checkbox rows. The value is the checked values, in option order. An
 * option is a `{ value, label }` row or a string (its own value and label).
 */
export type MultiSelectConfig = {
  type: 'multiselect';
  options: (string | MultiSelectOption)[];
  default?: string[];
};

export type SwatchOption = {
  value: string;
  label: string;
  /** One color shows a chip; more show a strip. */
  colors: string[];
};

/** A dropdown of named palettes. The value is the chosen palette's value. */
export type SwatchConfig = {
  type: 'swatch';
  options: SwatchOption[];
  default?: string;
};

/**
 * A file picker. The value is the picked file's name ("3 files" for more
 * than one), or '' when none is picked; the files go out as a `file` event.
 */
export type FileConfig = {
  type: 'file';
  /** The file input's `accept`, such as 'image/*' or '.svg,image/svg+xml'. */
  accept?: string;
  multiple?: boolean;
};

export type GalleryItem = {
  id: string;
  src?: string;
  alt?: string;
  /** Kept so old configs still type-check. The image picker draws square thumbnails. */
  aspect?: number;
  /** Kept so old configs still type-check. Items without `src` do not show. */
  render?: () => unknown;
};

/** One image from a grid of thumbnails, shown in the image picker. The value is the chosen item's id. */
export type GalleryConfig = {
  type: 'gallery';
  items: GalleryItem[];
  default?: string;
  /** Kept so old configs still type-check. The image picker sets its own columns. */
  columns?: number;
};

/**
 * What a control tells the app that is not a value: files picked, a chip
 * removed, a list changed. Hear them with `DialStore.subscribeEvents` or
 * the `onEvent` option of `useDialKit`.
 */
export type DialEvent =
  | { kind: 'file'; files: FileList }
  | { kind: 'remove'; value: string }
  | { kind: 'list'; op: 'add' | 'remove' | 'move' | 'set' | 'rename'; index?: number; from?: number; to?: number; itemType?: string };

export function normalizeMultiSelectOptions(options: (string | MultiSelectOption)[]): MultiSelectOption[] {
  return options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
}

/** The checked values after one option is toggled, in option order and not click order. */
export function toggleMultiSelect(value: string[], options: { value: string }[], toggled: string): string[] {
  const next = new Set(value);
  if (next.has(toggled)) next.delete(toggled);
  else next.add(toggled);
  return options.filter((option) => next.has(option.value)).map((option) => option.value);
}

/**
 * A stored multiselect value made valid, in option order: values whose
 * option is gone are dropped, and a value that is not a list of strings
 * becomes the fallback.
 * An empty list stays: no option checked is a real state.
 */
export function normalizeMultiSelectValue(value: unknown, options: { value: string }[], fallback: string[] = []): string[] {
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) return fallback.slice();
  const checked = new Set(value as string[]);
  return options.filter((option) => checked.has(option.value)).map((option) => option.value);
}

/** A stored single choice made valid: a value that names no option becomes the fallback. */
export function normalizeChoice(value: unknown, values: string[], fallback: string): string {
  return typeof value === 'string' && values.includes(value) ? value : fallback;
}

/** The file control's value for a pick: the file's name, or a count. */
export function fileValue(files: ArrayLike<{ name: string }>): string {
  if (files.length === 0) return '';
  return files.length === 1 ? files[0].name : `${files.length} files`;
}

/** The gallery's items that the image picker can show, as image options. */
export function galleryImageOptions(items: GalleryItem[]): { value: string; label: string }[] {
  return items.filter((item) => !!item.src).map((item) => ({ value: item.src!, label: item.alt || item.id }));
}

/** The image the gallery shows for an item id, and back. */
export function gallerySrcOf(items: GalleryItem[], id: string): string {
  return items.find((item) => item.id === id)?.src ?? '';
}

export function galleryIdOf(items: GalleryItem[], src: string): string | undefined {
  return src ? items.find((item) => item.src === src)?.id : undefined;
}
