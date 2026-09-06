import { useEffect, useRef, type CSSProperties, type ReactElement } from 'react';

/** A row: a plain string, or a value with a separate display label and an
 * optional inline tag pinned to the row's right end. `muted` marks a row the
 * host has nothing to act on — it still walks and selects, it just never
 * brightens, so a list can carry information alongside its choices. */
export type ListScreenItem =
  | string
  | { value: string; label?: string; tag?: string; muted?: boolean };

export interface ListScreenProps {
  /** Rows in display order. */
  items: ListScreenItem[];
  /** The selected item's value. */
  value?: string;
  /** Called with a row's value when it is clicked. */
  onSelect?: (value: string) => void;
  /** 400px with left-aligned rows, instead of the 200px centered default. */
  wide?: boolean;
  /**
   * How the view follows the selection. `nearest` (the default) scrolls only
   * far enough to bring the row into view; `center` holds the selection in
   * the middle of the screen, so a long list runs past a still row and only
   * the two ends of it can push the selection off centre.
   */
  follow?: 'nearest' | 'center';
  className?: string;
  style?: CSSProperties;
}

function itemValue(item: ListScreenItem): string {
  return typeof item === 'string' ? item : item.value;
}

function itemLabel(item: ListScreenItem): string {
  return typeof item === 'string' ? item : item.label ?? item.value;
}

function itemTag(item: ListScreenItem): string | undefined {
  return typeof item === 'string' ? undefined : item.tag;
}

function itemMuted(item: ListScreenItem): boolean {
  return typeof item === 'string' ? false : Boolean(item.muted);
}

/**
 * The Move's dark list screen (Figma node "list screen"): a column of
 * single-line rows on the display surface. Unselected rows sit dim at 22%
 * text opacity; the selected row reads at full brightness on a soft
 * highlight. Ten and a half rows show before the screen scrolls — the cut
 * row is the hint that there's more below — and the view follows the
 * selection as it moves. A `muted` row stays dim even when it is the
 * selection: it is information the list carries, not a choice. Purely
 * presentational: the host owns the selection state and any wheel or
 * arrow-key stepping.
 */
export function ListScreen({
  items,
  value,
  onSelect,
  wide,
  follow = 'nearest',
  className,
  style,
}: ListScreenProps): ReactElement {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // `data-over-top` / `data-over-bottom` mark rows scrolled out of sight,
    // for hosts that soften the edge they went behind: an edge hiding
    // nothing must stay crisp, or the end of a list reads as damage.
    const sync = () => {
      root.querySelector('[data-selected]')?.scrollIntoView?.({ block: follow });
      const end = root.scrollHeight - root.clientHeight;
      root.toggleAttribute?.('data-over-top', root.scrollTop > 1);
      root.toggleAttribute?.('data-over-bottom', root.scrollTop < end - 1);
    };
    sync();

    // A host can resize the screen under the list — the Move slot grows one
    // to the whole list while it is touched — which changes both what is
    // hidden and where the middle is.
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(sync);
    observer.observe(root);
    return () => observer.disconnect();
  }, [value, follow, items.length]);

  const rootClassName = ['tweakers-list-screen', className].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={style}
      data-wide={wide || undefined}
      role="listbox"
    >
      {items.map((item) => {
        const rowValue = itemValue(item);
        const selected = rowValue === value;
        const tag = itemTag(item);
        return (
          <button
            key={rowValue}
            type="button"
            role="option"
            aria-selected={selected}
            className="tweakers-list-screen-row"
            data-selected={selected || undefined}
            data-tagged={tag ? true : undefined}
            data-muted={itemMuted(item) || undefined}
            onClick={() => onSelect?.(rowValue)}
          >
            <span className="tweakers-list-screen-label">{itemLabel(item)}</span>
            {tag && <span className="tweakers-list-screen-tag">{tag}</span>}
          </button>
        );
      })}
    </div>
  );
}
