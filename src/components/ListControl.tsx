import { useEffect, useRef, useState } from 'react';
import { ICON_GRIP, ICON_PLUS, ICON_TRASH } from '../icons';
import { useHints } from '../hooks/useHints';
import type { DialEvent } from '../choice';
import {
  defaultListItemParams,
  groupListFields,
  listDropIndex,
  moveListItem,
  parseListItemSchema,
  renameListItem,
  type ListField,
  type ListItemType,
  type ListItemValue,
} from '../list';
import { Folder } from './Folder';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { SelectControl } from './SelectControl';
import { ColorControl } from './ColorControl';
import { TextControl } from './TextControl';
import { SwatchControl } from './SwatchControl';

interface ListControlProps {
  label: string;
  value: ListItemValue[];
  itemTypes: Record<string, ListItemType>;
  addLabel?: string;
  maxItems?: number;
  onChange: (value: ListItemValue[]) => void;
  /** What changed, for apps that apply list changes one at a time. Sent after each `onChange`. */
  onEvent: (event: Extract<DialEvent, { kind: 'list' }>) => void;
  hint?: string;
}

type Scalar = number | boolean | string;

const LIST_HINTS = {
  drag: 'Drag to change the order. Alt+Up and Alt+Down move the row.',
  title: 'Click to rename this row.',
  remove: 'Removes this row.',
  add: 'Adds a row.',
};

/** One field of a row, drawn with the panel's own control for its kind. */
function FieldControl({ field, value, onChange }: { field: ListField; value: Scalar; onChange: (v: Scalar) => void }) {
  switch (field.kind) {
    case 'slider':
      return <Slider label={field.label} hint={field.hint} value={value as number} min={field.min} max={field.max} step={field.step} onChange={onChange} />;
    case 'toggle':
      return <Toggle label={field.label} hint={field.hint} checked={value as boolean} onChange={onChange} />;
    case 'select':
      return <SelectControl label={field.label} hint={field.hint} value={value as string} options={field.options ?? []} onChange={onChange} />;
    case 'color':
      return <ColorControl label={field.label} hint={field.hint} value={value as string} onChange={onChange} />;
    case 'swatch':
      return <SwatchControl label={field.label} hint={field.hint} value={value as string} options={field.swatchOptions ?? []} onChange={onChange} />;
    case 'text':
      return <TextControl label={field.label} hint={field.hint} value={value as string} placeholder={field.placeholder} onChange={onChange} />;
    default:
      return null;
  }
}

function FieldList({ fields, params, onChange }: { fields: ListField[]; params: Record<string, Scalar>; onChange: (key: string, value: Scalar) => void }) {
  return (
    <div className="dialkit-list-item-fields">
      {fields.map((field) => (
        <FieldControl key={field.key} field={field} value={params[field.key] ?? field.defaultValue} onChange={(v) => onChange(field.key, v)} />
      ))}
    </div>
  );
}

/**
 * Rows the user adds, renames, drags into order and removes. Each row is one
 * of the item types and shows that type's fields; fields in a section show
 * in a folder under the row's own fields, the first section open.
 */
export function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent, hint }: ListControlProps) {
  useHints(true);
  const idCounter = useRef(0);
  const mkId = () => `row-${idCounter.current++}`;
  // A stable key per row, so the right row stays mounted through a remove
  // or a reorder. The handlers keep `ids` in step with `value`.
  const [ids, setIds] = useState<string[]>(() => value.map(mkId));
  const [picking, setPicking] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  // A row drags only from its handle (armedRef), so a drag on a slider
  // never moves the row.
  const armedRef = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [over, setOver] = useState<{ index: number; after: boolean } | null>(null);

  // A value from outside (a preset, a reset) with another row count gets new keys.
  if (ids.length !== value.length) {
    setIds((cur) => value.map((_, i) => cur[i] ?? mkId()));
  }

  // A press on the handle that does not become a drag disarms its row.
  useEffect(() => {
    const disarm = () => { armedRef.current = null; };
    window.addEventListener('pointerup', disarm);
    return () => window.removeEventListener('pointerup', disarm);
  }, []);

  const typeEntries = Object.entries(itemTypes);
  const atCapacity = maxItems != null && value.length >= maxItems;

  const addItem = (type: string) => {
    if (atCapacity || !itemTypes[type]) return;
    const next = [...value, { type, params: defaultListItemParams(itemTypes[type].schema) }];
    setIds((cur) => [...cur, mkId()]);
    onChange(next);
    onEvent({ kind: 'list', op: 'add', index: next.length - 1, itemType: type });
  };

  const removeItem = (index: number) => {
    setIds((cur) => cur.filter((_, i) => i !== index));
    onChange(value.filter((_, i) => i !== index));
    onEvent({ kind: 'list', op: 'remove', index });
  };

  const moveItem = (from: number, to: number) => {
    if (from === to || to < 0 || to >= value.length) return;
    setIds((cur) => moveListItem(cur, from, to));
    onChange(moveListItem(value, from, to));
    onEvent({ kind: 'list', op: 'move', from, to });
  };

  const commitTitle = (index: number, raw: string) => {
    setEditing(null);
    if ((value[index]?.title ?? '') === raw.trim()) return;
    onChange(renameListItem(value, index, raw));
    onEvent({ kind: 'list', op: 'rename', index });
  };

  const setParam = (index: number, key: string, v: Scalar) => {
    onChange(value.map((item, i) => (i === index ? { ...item, params: { ...item.params, [key]: v } } : item)));
    onEvent({ kind: 'list', op: 'set', index });
  };

  const endDrag = () => {
    armedRef.current = null;
    setDragIndex(null);
    setOver(null);
  };

  const onDrop = () => {
    if (dragIndex !== null && over !== null) moveItem(dragIndex, listDropIndex(dragIndex, over.index, over.after));
    endDrag();
  };

  return (
    <Folder title={label} defaultOpen hint={hint}>
      <div className="dialkit-list" onDragOver={(e) => { if (dragIndex !== null) e.preventDefault(); }} onDrop={onDrop}>
        {value.map((item, index) => {
          const type = itemTypes[item.type];
          if (!type) return null;
          const { flat, groups } = groupListFields(parseListItemSchema(type.schema, type.hints, type.groups));
          const rowTitle = item.title ?? type.label;
          return (
            <div
              key={ids[index]}
              className="dialkit-list-item"
              // A draggable parent blocks text selection, so a row being renamed does not drag.
              draggable={editing !== index}
              data-dragging={dragIndex === index ? 'true' : undefined}
              data-over={over?.index === index ? (over.after ? 'after' : 'before') : undefined}
              onDragStart={(e) => {
                if (armedRef.current !== index) { e.preventDefault(); return; }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index)); // Firefox needs a payload
                setDragIndex(index);
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const after = e.clientY > rect.top + rect.height / 2;
                setOver((o) => (o?.index === index && o.after === after ? o : { index, after }));
              }}
              onDragEnd={endDrag}
            >
              <div className="dialkit-list-item-head">
                <button
                  type="button"
                  className="dialkit-list-icon-button dialkit-list-drag"
                  aria-label={`Move ${rowTitle}`}
                  data-hint={LIST_HINTS.drag}
                  onPointerDown={() => { armedRef.current = index; }}
                  onKeyDown={(e) => {
                    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                    e.preventDefault();
                    moveItem(index, index + (e.key === 'ArrowUp' ? -1 : 1));
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {ICON_GRIP.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r="1.5" />)}
                  </svg>
                </button>
                {editing === index ? (
                  // The field keeps its own draft, so Escape can put the old
                  // title back and the blur that follows changes nothing.
                  <input
                    className="dialkit-list-item-title"
                    defaultValue={item.title ?? ''}
                    placeholder={type.label}
                    autoFocus
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => commitTitle(index, e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      else if (e.key === 'Escape') {
                        e.currentTarget.value = item.title ?? '';
                        e.currentTarget.blur();
                      }
                    }}
                  />
                ) : (
                  <button type="button" className="dialkit-list-item-title" aria-label={`Rename ${rowTitle}`} data-hint={LIST_HINTS.title} onClick={() => setEditing(index)}>
                    {rowTitle}
                  </button>
                )}
                <button type="button" className="dialkit-list-icon-button dialkit-list-remove" aria-label={`Remove ${rowTitle}`} data-hint={LIST_HINTS.remove} onClick={() => removeItem(index)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICON_TRASH.map((d) => <path key={d} d={d} />)}
                  </svg>
                </button>
              </div>
              {flat.length > 0 && <FieldList fields={flat} params={item.params} onChange={(key, v) => setParam(index, key, v)} />}
              {/* Only the first section starts open, so a deep row does not read as a wall of controls. */}
              {groups.map((group, groupIndex) => (
                <Folder key={group.label} title={group.label} defaultOpen={groupIndex === 0}>
                  <FieldList fields={group.fields} params={item.params} onChange={(key, v) => setParam(index, key, v)} />
                </Folder>
              ))}
            </div>
          );
        })}

        {value.length === 0 && !picking && <div className="dialkit-list-empty">No items yet</div>}

        {!atCapacity && (
          <div className="dialkit-list-add">
            <button
              type="button"
              className="dialkit-list-add-button"
              data-open={String(picking)}
              aria-expanded={typeEntries.length > 1 ? picking : undefined}
              data-hint={LIST_HINTS.add}
              onClick={() => (typeEntries.length === 1 ? addItem(typeEntries[0][0]) : setPicking((p) => !p))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICON_PLUS.map((d) => <path key={d} d={d} />)}
              </svg>
              <span>{addLabel ?? 'Add'}</span>
            </button>
            {typeEntries.length > 1 && picking && (
              <div className="dialkit-list-picker">
                {typeEntries.map(([key, type]) => (
                  <button key={key} type="button" className="dialkit-list-picker-chip" onClick={() => { addItem(key); setPicking(false); }}>
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Folder>
  );
}
