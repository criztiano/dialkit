import { useRef, useState, useLayoutEffect, useCallback } from 'react';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; top: number; height: number } | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector('[data-active="true"]') as HTMLElement | null;
    // A zero-width button means layout has not settled — the control is hidden,
    // or its host is still sizing. Measuring then would pin the pill to the
    // padding box for good; the resize observer calls back with a real box.
    if (!activeButton || activeButton.offsetWidth === 0) return;
    // All four edges, not just left/width: a host can let the control wrap onto
    // several rows, and the pill must hug the active button's row.
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      top: activeButton.offsetTop,
      height: activeButton.offsetHeight,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [value, options.length, measure]);

  // Buttons that share the row (a full-width tab bar) resize with their host, so
  // the pill has to follow rather than trust one reading taken at mount.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  // Enable transition after first render
  const shouldAnimate = hasAnimated.current;
  hasAnimated.current = true;

  return (
    <div className="tweakers-segmented" ref={containerRef}>
      {pillStyle && (
        <div
          className="tweakers-segmented-pill"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            top: pillStyle.top,
            height: pillStyle.height,
            bottom: 'auto',
            transition: shouldAnimate
              ? 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1), top 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
        />
      )}

      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="tweakers-segmented-button"
            data-active={String(isActive)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
