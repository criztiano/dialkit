import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ICON_CHEVRON, ICON_CHECK } from '../icons';
import type { GalleryItem } from '../store/TweakStore';

interface GalleryControlProps {
  label: string;
  value: string;
  items: GalleryItem[];
  onChange: (id: string) => void;
  /** Masonry column count for the open grid. Default 2. */
  columns?: number;
}

/** Resolves an item's visual with one priority everywhere: custom `render` wins,
 *  else its image — as a skeleton-loading tile in the grid, or a plain thumbnail
 *  in the trigger preview. */
function itemContent(item: GalleryItem, skeleton: boolean): ReactNode {
  // reason: store types render as () => unknown to stay framework-agnostic; here it's a ReactNode.
  if (item.render) return item.render() as ReactNode;
  if (!item.src) return null;
  return skeleton ? <GalleryImage item={item} /> : <img src={item.src} alt="" draggable={false} />;
}

/** A grid image that shows a shimmer skeleton until it loads, then blur-fades in. */
function GalleryImage({ item }: { item: GalleryItem }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Native listener + complete check: reliably catches loads that race React's
  // onLoad (cached images, or a lazy image that finishes between render/effect).
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) { setLoaded(true); return; }
    const done = () => setLoaded(true);
    img.addEventListener('load', done);
    img.addEventListener('error', done);
    return () => {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
    };
  }, []);
  return (
    <span
      className="tweakers-gallery-media"
      data-fixed={item.aspect ? 'true' : 'false'}
      style={item.aspect ? { aspectRatio: String(item.aspect) } : undefined}
    >
      <span className="tweakers-gallery-skeleton" data-done={String(loaded)} aria-hidden="true" />
      <img
        ref={imgRef}
        className="tweakers-gallery-img"
        data-loaded={String(loaded)}
        src={item.src}
        alt={item.alt ?? ''}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}

export function GalleryControl({ label, value, items, onChange, columns = 2 }: GalleryControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = items.find((it) => it.id === value) ?? items[0];
  const preview = selected ? itemContent(selected, false) : null;

  return (
    <div className="tweakers-gallery" data-open={String(isOpen)}>
      <button
        type="button"
        className="tweakers-gallery-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="tweakers-gallery-label">{label}</span>
        <span className="tweakers-gallery-right">
          {preview && <span className="tweakers-gallery-preview" aria-hidden="true">{preview}</span>}
          <svg
            className="tweakers-gallery-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICON_CHEVRON} />
          </svg>
        </span>
      </button>

      {/* The reveal animates height via a grid 0fr → 1fr transition: pure CSS,
          no measurement, so it can't get stuck on re-renders or resizes. */}
      <div className="tweakers-gallery-reveal" aria-hidden={!isOpen}>
        <div className="tweakers-gallery-reveal-inner">
          <div className="tweakers-gallery-box">
            <div className="tweakers-gallery-masonry" style={{ columnCount: columns }}>
              {items.map((item) => {
                const isSelected = item.id === value;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="tweakers-gallery-item"
                    data-selected={String(isSelected)}
                    aria-pressed={isSelected}
                    tabIndex={isOpen ? 0 : -1}
                    style={item.aspect && !item.src ? { aspectRatio: String(item.aspect) } : undefined}
                    onClick={() => onChange(item.id)}
                  >
                    {itemContent(item, true)}
                    <span className="tweakers-gallery-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d={ICON_CHECK} />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
