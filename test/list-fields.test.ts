import { describe, it, expect } from 'vitest';
import { parseListItemSchema, groupListFields, defaultListItemParams } from '../src/store/TweakStore';
import type { ListItemField, SwatchOption } from '../src/store/TweakStore';

const PALETTES: SwatchOption[] = [
  { value: 'sunset', label: 'Sunset', colors: ['#ff8a3c', '#c4456b'] },
  { value: 'ice', label: 'Ice', colors: ['#7dd3fc', '#4f46e5'] },
];

// A body's colour should look the same inside a list row as it does anywhere
// else in the app — which means the same two colour controls, not a plain one.
describe('colour fields in list rows', () => {
  it('carries `palette` through to the field descriptor', () => {
    const [field] = parseListItemSchema({ tint: { type: 'color', default: '#ff0000', palette: true } });

    expect(field.kind).toBe('color');
    expect(field.palette).toBe(true);
    expect(field.defaultValue).toBe('#ff0000');
  });

  it('leaves palette off for a plain colour field', () => {
    const [field] = parseListItemSchema({ tint: { type: 'color' } });

    expect(field.palette).toBeUndefined();
  });

  it('recognises a swatch field and its options', () => {
    const [field] = parseListItemSchema({ palette: { type: 'swatch', options: PALETTES } });

    expect(field.kind).toBe('swatch');
    expect(field.swatchOptions).toEqual(PALETTES);
    // No declared default falls back to the first option, as at top level.
    expect(field.defaultValue).toBe('sunset');
  });

  it('honours a declared swatch default', () => {
    const schema: Record<string, ListItemField> = {
      palette: { type: 'swatch', options: PALETTES, default: 'ice' },
    };

    expect(defaultListItemParams(schema)).toEqual({ palette: 'ice' });
  });
});

// Grouping is keyed by param name for the same reason hints are: most schema
// fields are bare shorthand (`mass: [1, 0, 10]`) with nowhere to hang a property.
describe('grouping fields in a list row', () => {
  const schema: Record<string, ListItemField> = {
    label: 'Body',
    mass: [1, 0, 10],
    friction: [0.5, 0, 1],
    tint: { type: 'color' },
  };
  const groups = { mass: 'Physics', friction: 'Physics', tint: 'Appearance' };

  it('keeps ungrouped fields flat so the row\'s primary control stays visible', () => {
    const { flat } = groupListFields(parseListItemSchema(schema, undefined, groups));

    expect(flat.map((f) => f.key)).toEqual(['label']);
  });

  it('buckets fields by group, in declaration order', () => {
    const { groups: sections } = groupListFields(parseListItemSchema(schema, undefined, groups));

    expect(sections.map((s) => s.label)).toEqual(['Physics', 'Appearance']);
    expect(sections[0].fields.map((f) => f.key)).toEqual(['mass', 'friction']);
    expect(sections[1].fields.map((f) => f.key)).toEqual(['tint']);
  });

  it('reunites fields of one group declared apart', () => {
    const interleaved = { mass: [1, 0, 10], tint: { type: 'color' as const }, friction: [0.5, 0, 1] };
    const { groups: sections } = groupListFields(
      parseListItemSchema(interleaved as Record<string, ListItemField>, undefined, groups)
    );

    expect(sections.map((s) => s.label)).toEqual(['Physics', 'Appearance']);
    expect(sections[0].fields.map((f) => f.key)).toEqual(['mass', 'friction']);
  });

  it('leaves every field flat when no groups are declared', () => {
    const { flat, groups: sections } = groupListFields(parseListItemSchema(schema));

    expect(flat).toHaveLength(4);
    expect(sections).toHaveLength(0);
  });
});
