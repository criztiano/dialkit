import { useRef, useState } from 'react';
import { ICON_CHEVRON, ICON_PLUS, ICON_TRASH } from '../icons';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { SelectControl } from './SelectControl';
import { ColorControl } from './ColorControl';
import { TextControl } from './TextControl';
import {
  parseListItemSchema,
  defaultListItemParams,
  type ListItemValue,
  type ListItemType,
  type ListField,
  type DialEvent,
} from '../store/DialStore';

interface ListControlProps {
  label: string;
  value: ListItemValue[];
  itemTypes: Record<string, ListItemType>;
  addLabel?: string;
  maxItems?: number;
  onChange: (value: ListItemValue[]) => void;
  /** Structural signal for engines that bridge list ops imperatively. */
  onEvent: (event: DialEvent) => void;
}

type Scalar = number | boolean | string;

/** Renders one list-item field by reusing the matching primitive control. */
function FieldControl({ field, value, onChange }: { field: ListField; value: Scalar; onChange: (v: Scalar) => void }) {
  switch (field.kind) {
    case 'slider':
      return <Slider label={field.label} value={value as number} min={field.min} max={field.max} step={field.step} onChange={onChange} />;
    case 'toggle':
      return <Toggle label={field.label} checked={value as boolean} onChange={onChange} />;
    case 'select':
      return <SelectControl label={field.label} value={value as string} options={field.options ?? []} onChange={onChange} />;
    case 'color':
      return <ColorControl label={field.label} value={value as string} onChange={onChange} />;
    case 'text':
      return <TextControl label={field.label} value={value as string} onChange={onChange} placeholder={field.placeholder} />;
    default:
      return null;
  }
}

export function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }: ListControlProps) {
  const idCounter = useRef(0);
  const mkId = () => `li-${idCounter.current++}`;
  // One stable key per row so reorder/remove animate (and React reconciles) by
  // identity, not index. Handlers keep `ids` in lockstep with `value`.
  const [ids, setIds] = useState<string[]>(() => value.map(mkId));
  const [picking, setPicking] = useState(false);

  // Reconcile only when the array length changes outside our handlers (preset
  // load / reset). The guard converges, so React's adjust-state-on-render is safe.
  if (ids.length !== value.length) {
    setIds((cur) => value.map((_, i) => cur[i] ?? mkId()));
  }

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
    if (to < 0 || to >= value.length) return;
    const reorder = <T,>(arr: T[]): T[] => {
      const out = arr.slice();
      const [moved] = out.splice(from, 1);
      out.splice(to, 0, moved);
      return out;
    };
    setIds(reorder);
    onChange(reorder(value));
    onEvent({ kind: 'list', op: 'move', from, to });
  };

  const setParam = (index: number, key: string, v: Scalar) => {
    onChange(value.map((item, i) => (i === index ? { ...item, params: { ...item.params, [key]: v } } : item)));
    onEvent({ kind: 'list', op: 'set', index });
  };

  const handleAdd = () => {
    if (typeEntries.length === 1) addItem(typeEntries[0][0]);
    else setPicking((p) => !p);
  };

  return (
    <div className="dialkit-list">
      {label && <span className="dialkit-list-label">{label}</span>}

      <div className="dialkit-list-items">
        {value.map((item, index) => {
          const type = itemTypes[item.type];
          if (!type) return null;
          const fields = parseListItemSchema(type.schema);
          return (
            <div key={ids[index]} className="dialkit-list-item">
                <div className="dialkit-list-item-head">
                  <span className="dialkit-list-item-title">{type.label}</span>
                  <div className="dialkit-list-item-actions">
                    <button
                      type="button"
                      className="dialkit-list-icon-btn"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                        <path d={ICON_CHEVRON} />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="dialkit-list-icon-btn"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === value.length - 1}
                      aria-label="Move down"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={ICON_CHEVRON} />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="dialkit-list-icon-btn dialkit-list-remove"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove ${type.label}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        {ICON_TRASH.map((d, i) => <path key={i} d={d} />)}
                      </svg>
                    </button>
                  </div>
                </div>
                {fields.length > 0 && (
                  <div className="dialkit-list-item-fields">
                    {fields.map((field) => (
                      <FieldControl
                        key={field.key}
                        field={field}
                        value={item.params[field.key]}
                        onChange={(v) => setParam(index, field.key, v)}
                      />
                    ))}
                  </div>
                )}
            </div>
          );
        })}

        {value.length === 0 && !picking && <div className="dialkit-list-empty">No items yet</div>}
      </div>

      {!atCapacity && (
        <div className="dialkit-list-add">
          <button type="button" className="dialkit-list-add-btn" data-open={String(picking)} onClick={handleAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICON_PLUS} />
            </svg>
            <span>{addLabel ?? 'Add'}</span>
          </button>

          {typeEntries.length > 1 && (
            <div className="dialkit-list-picker" data-open={String(picking)}>
              <div className="dialkit-list-picker-inner">
                {typeEntries.map(([key, type]) => (
                  <button
                    key={key}
                    type="button"
                    className="dialkit-list-picker-chip"
                    onClick={() => { addItem(key); setPicking(false); }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
