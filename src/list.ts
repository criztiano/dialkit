import type { SwatchConfig, SwatchOption } from './choice';

/**
 * The list control: rows the user adds, renames, reorders and removes. Each
 * row is one of the config's item types and holds that type's fields.
 */

/** One row: its item type and its field values. Plain JSON, so presets keep it. */
export type ListItemValue = {
  type: string;
  params: Record<string, number | boolean | string>;
  /** The row's own name, shown in place of its type's label. Absent (never '') without one. */
  title?: string;
};

/**
 * A field of an item type, in the panel's shorthand, scalars only: a slider
 * tuple or number, a boolean, a string (a hex color or text), or a select,
 * color, swatch or text config.
 */
export type ListItemField =
  | [number, number, number, number?]
  | number
  | boolean
  | string
  | { type: 'select'; options: (string | { value: string; label: string })[]; default?: string }
  | { type: 'color'; default?: string }
  | SwatchConfig
  | { type: 'text'; default?: string; placeholder?: string };

export type ListItemType = {
  /** Shown in the add menu, and as a row's title when the row has none of its own. */
  label: string;
  /** The type's fields, by param name. */
  schema: Record<string, ListItemField>;
  /** A hint per field, by param name. */
  hints?: Record<string, string>;
  /**
   * A section per field, by param name. Fields without one stay at the top
   * of the row; each section is a folder below them, the first one open.
   */
  groups?: Record<string, string>;
};

export type ListConfig = {
  type: 'list';
  /** The item types a user can add. */
  itemTypes: Record<string, ListItemType>;
  /** The first rows. Each row's missing params take its type's defaults. */
  default?: ListItemValue[];
  /** The most rows the list takes. */
  max?: number;
  /** The add button's text. Default 'Add'. */
  addLabel?: string;
};

export type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'swatch' | 'text';

/** One field of a row, ready to draw. */
export type ListField = {
  key: string;
  label: string;
  kind: ListFieldKind;
  hint?: string;
  group?: string;
  swatchOptions?: SwatchOption[];
  min?: number;
  max?: number;
  step?: number;
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
  defaultValue: number | boolean | string;
};

export type ListFieldGroup = { label: string; fields: ListField[] };

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}

function inferStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 1) return 0.01;
  if (range <= 10) return 0.1;
  if (range <= 100) return 1;
  return 10;
}

function inferRange(value: number): { min: number; max: number; step: number } {
  if (value >= 0 && value <= 1) return { min: 0, max: 1, step: 0.01 };
  if (value >= 0 && value <= 10) return { min: 0, max: value * 3 || 10, step: 0.1 };
  if (value >= 0 && value <= 100) return { min: 0, max: value * 3 || 100, step: 1 };
  if (value >= 0) return { min: 0, max: value * 3 || 1000, step: 10 };
  return { min: value * 3, max: -value * 3, step: 1 };
}

const isHex = (value: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);

function typed(def: unknown, type: string): def is { type: string } {
  return typeof def === 'object' && def !== null && !Array.isArray(def) && (def as { type?: unknown }).type === type;
}

/** An item type's schema as fields, in declared order. Fields it cannot read are left out. */
export function parseListItemSchema(
  schema: Record<string, ListItemField>,
  hints?: Record<string, string>,
  groups?: Record<string, string>
): ListField[] {
  const fields: ListField[] = [];
  for (const [key, def] of Object.entries(schema)) {
    const base = { key, label: formatKey(key), hint: hints?.[key], group: groups?.[key] };
    if (Array.isArray(def) && typeof def[0] === 'number') {
      const [d, min, max, step] = def;
      fields.push({ ...base, kind: 'slider', min, max, step: step ?? inferStep(min, max), defaultValue: d });
    } else if (typeof def === 'number') {
      fields.push({ ...base, kind: 'slider', ...inferRange(def), defaultValue: def });
    } else if (typeof def === 'boolean') {
      fields.push({ ...base, kind: 'toggle', defaultValue: def });
    } else if (typeof def === 'string') {
      fields.push({ ...base, kind: isHex(def) ? 'color' : 'text', defaultValue: def });
    } else if (typed(def, 'select') && Array.isArray((def as { options?: unknown }).options)) {
      const select = def as Extract<ListItemField, { type: 'select' }>;
      const first = select.options[0];
      fields.push({ ...base, kind: 'select', options: select.options, defaultValue: select.default ?? (typeof first === 'string' ? first : first?.value ?? '') });
    } else if (typed(def, 'color')) {
      fields.push({ ...base, kind: 'color', defaultValue: (def as { default?: string }).default ?? '#000000' });
    } else if (typed(def, 'swatch') && Array.isArray((def as unknown as SwatchConfig).options)) {
      const swatch = def as unknown as SwatchConfig;
      fields.push({ ...base, kind: 'swatch', swatchOptions: swatch.options, defaultValue: swatch.default ?? swatch.options[0]?.value ?? '' });
    } else if (typed(def, 'text')) {
      const text = def as Extract<ListItemField, { type: 'text' }>;
      fields.push({ ...base, kind: 'text', placeholder: text.placeholder, defaultValue: text.default ?? '' });
    }
  }
  return fields;
}

/** A row's fields split into its top area and its sections, in the order each section's first field is declared. */
export function groupListFields(fields: ListField[]): { flat: ListField[]; groups: ListFieldGroup[] } {
  const flat: ListField[] = [];
  const groups: ListFieldGroup[] = [];
  const byLabel = new Map<string, ListFieldGroup>();
  for (const field of fields) {
    if (!field.group) { flat.push(field); continue; }
    let group = byLabel.get(field.group);
    if (!group) {
      group = { label: field.group, fields: [] };
      byLabel.set(field.group, group);
      groups.push(group);
    }
    group.fields.push(field);
  }
  return { flat, groups };
}

/** The params of a new row of a type. */
export function defaultListItemParams(schema: Record<string, ListItemField>): Record<string, number | boolean | string> {
  const params: Record<string, number | boolean | string> = {};
  for (const field of parseListItemSchema(schema)) params[field.key] = field.defaultValue;
  return params;
}

/**
 * Rows made valid against the item types: rows of an unknown type drop,
 * missing params take their type's defaults, and a blank title drops. A
 * value that is not a list becomes the fallback.
 */
export function normalizeListItems(value: unknown, itemTypes: Record<string, ListItemType>, fallback: ListItemValue[] = []): ListItemValue[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item, params: { ...item.params } }));
  const rows: ListItemValue[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null || typeof item.type !== 'string' || !itemTypes[item.type]) continue;
    const params = typeof item.params === 'object' && item.params !== null ? item.params : {};
    const row: ListItemValue = { type: item.type, params: { ...defaultListItemParams(itemTypes[item.type].schema), ...params } };
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    if (title) row.title = title;
    rows.push(row);
  }
  return rows;
}

/** The rows with one row moved from `from` to `to`. */
export function moveListItem<T>(items: T[], from: number, to: number): T[] {
  const out = items.slice();
  const [moved] = out.splice(from, 1);
  if (moved !== undefined) out.splice(to, 0, moved);
  return out;
}

/** The rows with one row renamed. A blank name takes the title away, so the row shows its type's label again. */
export function renameListItem(items: ListItemValue[], index: number, raw: string): ListItemValue[] {
  const title = raw.trim();
  return items.map((item, i) => {
    if (i !== index) return item;
    const row: ListItemValue = { type: item.type, params: item.params };
    if (title) row.title = title;
    return row;
  });
}

/**
 * Where a dragged row lands: before or after the row under the pointer,
 * counted after the dragged row leaves its place.
 */
export function listDropIndex(from: number, over: number, after: boolean): number {
  const to = after ? over + 1 : over;
  return from < to ? to - 1 : to;
}
