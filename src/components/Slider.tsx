import { useRef, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import type { ShortcutConfig } from '../store/DialStore';
import { decimalsForStep, roundValue, snapToDecile, formatSliderShortcut } from '../shortcut-utils';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /**
   * Override the displayed value text. When provided, the formatter owns the
   * full label and `unit` is not auto-appended. Inline editing still operates
   * on the raw numeric value.
   */
  formatValue?: (value: number) => string;
  /**
   * Render a custom node (e.g. an icon or gauge) in the value slot instead of
   * the editable numeric text. Sliders with a `valueIcon` are not editable.
   */
  valueIcon?: ReactNode;
  /**
   * Anchor the fill at this value instead of `min`. For bipolar parameters
   * (e.g. -1..1) the fill grows out from the origin toward the handle in
   * either direction, and a soft, escapable detent snaps the value to the
   * origin while dragging. Defaults to `min` (classic left-anchored fill,
   * no detent — fully backwards compatible).
   */
  origin?: number;
  /** Convenience for `origin={0}` on a symmetric range. */
  bipolar?: boolean;
  /**
   * `vertical` renders the 77px column card: fill grows bottom-up, label sits
   * at the base, and the value readout appears over the fill on hover/drag.
   * Vertical sliders flex to their container width — place them in a flex row.
   */
  orientation?: 'horizontal' | 'vertical';
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

const CLICK_THRESHOLD = 3;
const DEAD_ZONE = 32;
const MAX_CURSOR_RANGE = 200;
const MAX_STRETCH = 8;
/** Half-width of the origin snap zone, in pixels of track travel. */
const DETENT_PX = 6;

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit,
  formatValue,
  valueIcon,
  origin,
  bipolar,
  orientation = 'horizontal',
  shortcut,
  shortcutActive,
}: SliderProps) {
  const isVertical = orientation === 'vertical';
  // Resolve the fill anchor. `min` (the default) preserves the classic
  // left-anchored fill and disables the detent.
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? (bipolar ? 0 : min)));
  const hasOrigin = resolvedOrigin > min;
  const originPercent = ((resolvedOrigin - min) / (max - min)) * 100;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isValueHovered, setIsValueHovered] = useState(false);
  const [isValueEditable, setIsValueEditable] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click-vs-drag detection refs
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const wrapperRectRef = useRef<DOMRect | null>(null);
  const scaleRef = useRef(1);

  const percentage = ((value - min) / (max - min)) * 100;
  const isActive = isInteracting || isHovered;

  // Motion values for imperative animation
  const fillPercent = useMotionValue(percentage);
  // Origin-anchored fill: the bar spans between the origin and the handle, so
  // a centered origin fills toward either side of it. Without an origin this
  // reduces exactly to the classic min-anchored fill.
  const fillExtent = useTransform(fillPercent, (pct) =>
    hasOrigin ? `${Math.abs(pct - originPercent)}%` : `${pct}%`
  );
  const fillStart = useTransform(fillPercent, (pct) =>
    hasOrigin ? `${Math.min(pct, originPercent)}%` : '0%'
  );
  const handleLeft = useTransform(fillPercent, (pct) =>
    `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`
  );

  // Rubber band motion values. Horizontal maps stretch to width/x; vertical to
  // height/y (negative stretch = overshoot past the max end: left or top).
  const rubberStretchPx = useMotionValue(0);
  const rubberBandSize = useTransform(
    rubberStretchPx,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`
  );
  const rubberBandShift = useTransform(
    rubberStretchPx,
    (stretch) => (stretch < 0 ? stretch : 0)
  );

  // Sync from props when not interacting (skip if spring animation is active)
  useEffect(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage);
    }
  }, [percentage, isInteracting, fillPercent]);

  const trackExtent = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    return isVertical ? el.offsetHeight : el.offsetWidth;
  }, [isVertical]);

  const positionToValue = useCallback(
    (clientX: number, clientY: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value;
      const screenPos = isVertical ? clientY - rect.top : clientX - rect.left;
      const scenePos = screenPos / scaleRef.current;
      const nativeExtent = trackExtent() || (isVertical ? rect.height : rect.width);
      let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
      // Vertical: top of the card is max, bottom is min.
      if (isVertical) percent = 1 - percent;
      const rawValue = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max, value, isVertical, trackExtent]
  );

  const percentFromValue = useCallback(
    (v: number) => ((v - min) / (max - min)) * 100,
    [min, max]
  );

  // Escapable magnetic snap to the origin: within DETENT_PX of track travel
  // the value sticks to the origin; drag past the zone and it releases.
  const applyDetent = useCallback(
    (v: number) => {
      if (!hasOrigin) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = (DETENT_PX / extent) * (max - min);
      return Math.abs(v - resolvedOrigin) <= detentValue ? resolvedOrigin : v;
    },
    [hasOrigin, max, min, resolvedOrigin, trackExtent]
  );

  const computeRubberStretch = useCallback(
    (clientPos: number, sign: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return 0;
      const nearEdge = isVertical ? rect.top : rect.left;
      const farEdge = isVertical ? rect.bottom : rect.right;
      const distancePast =
        sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return (
        sign *
        MAX_STRETCH *
        Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1.0))
      );
    },
    [isVertical]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (showInput) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);

      // Capture wrapper rect at pointer down for stable reference
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical
          ? wrapperRectRef.current.height
          : wrapperRectRef.current.width;
        scaleRef.current = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    },
    [showInput, isVertical, trackExtent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current) return;

      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickRef.current && distance > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }

      if (!isClickRef.current) {
        // Drag mode — instant update
        const rect = wrapperRectRef.current;
        if (rect) {
          const clientPos = isVertical ? e.clientY : e.clientX;
          const nearEdge = isVertical ? rect.top : rect.left;
          const farEdge = isVertical ? rect.bottom : rect.right;
          if (clientPos < nearEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
          } else if (clientPos > farEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }

        const newValue = applyDetent(positionToValue(e.clientX, e.clientY));
        const newPct = percentFromValue(newValue);
        if (animRef.current) {
          animRef.current.stop();
          animRef.current = null;
        }
        fillPercent.jump(newPct);
        onChange(roundValue(newValue, step));
      }
    },
    [
      isInteracting,
      isVertical,
      positionToValue,
      percentFromValue,
      applyDetent,
      onChange,
      fillPercent,
      rubberStretchPx,
      computeRubberStretch,
      step,
    ]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting) return;

      if (isClickRef.current) {
        // When steps are coarse (≤10 positions), click snaps to the nearest step.
        // Otherwise, the original decile-magnetic behavior is preserved
        const rawValue = positionToValue(e.clientX, e.clientY);
        const discreteSteps = (max - min) / step;
        const snappedValue = discreteSteps <= 10
          ? Math.max(min, Math.min(max, min + Math.round((rawValue - min) / step) * step))
          : snapToDecile(rawValue, min, max);

        const newPct = percentFromValue(snappedValue);

        if (animRef.current) {
          animRef.current.stop();
        }
        animRef.current = animate(fillPercent, newPct, {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => { animRef.current = null; },
        });
        onChange(roundValue(snappedValue, step));
      }

      // Spring rubber band back
      if (rubberStretchPx.get() !== 0) {
        animate(rubberStretchPx, 0, {
          type: 'spring',
          visualDuration: 0.35,
          bounce: 0.15,
        });
      }

      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
    },
    [
      isInteracting,
      positionToValue,
      percentFromValue,
      onChange,
      min,
      max,
      step,
      fillPercent,
      rubberStretchPx,
    ]
  );

  // Handle value hover delay for editable state
  useEffect(() => {
    if (isValueHovered && !showInput && !isValueEditable) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsValueEditable(true);
      }, 800);
    } else if (!isValueHovered && !showInput) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsValueEditable(false);
    }
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isValueHovered, showInput, isValueEditable]);

  // Focus input when it appears
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(roundValue(clamped, step));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };

  const handleValueClick = (e: React.MouseEvent) => {
    if (isValueEditable) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(value.toFixed(decimalsForStep(step)));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(decimalsForStep(step));

  // The ≤ 10 threshold separates discrete sliders
  // (like step=2 on a 0–10 range → 5 steps) from continuous ones.
  const discreteSteps = (max - min) / step;
  const hashMarks = discreteSteps <= 10
    ? Array.from({ length: discreteSteps - 1 }, (_, i) => {
        const pct = ((i + 1) * step) / (max - min) * 100;
        return (
          <div
            key={i}
            className="dialkit-slider-hashmark"
            style={{ left: `${pct}%` }}
          />
        );
      })
    : Array.from({ length: 9 }, (_, i) => {
        const pct = (i + 1) * 10;
        return (
          <div
            key={i}
            className="dialkit-slider-hashmark"
            style={{ left: `${pct}%` }}
          />
        );
      });

  const cardClassName = [
    'dialkit-slider',
    isVertical ? 'dialkit-slider-vertical' : '',
    isActive ? 'dialkit-slider-active' : '',
    isInteracting ? 'dialkit-slider-engaged' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (isVertical) {
    return (
      <div
        ref={wrapperRef}
        className="dialkit-slider-wrapper dialkit-slider-wrapper-vertical"
      >
        <motion.div
          className={cardClassName}
          data-origin={hasOrigin ? 'true' : undefined}
          {...pointerHandlers}
          style={{ height: rubberBandSize, y: rubberBandShift }}
        >
          <div className="dialkit-slider-fill-area">
            <motion.div
              className="dialkit-slider-fill-vertical"
              style={{ bottom: fillStart, height: fillExtent }}
            />
          </div>

          {showInput ? (
            <input
              ref={inputRef}
              type="text"
              className="dialkit-slider-input dialkit-slider-input-vertical"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`dialkit-slider-value-vertical ${isValueEditable ? 'dialkit-slider-value-editable' : ''}`}
              onMouseEnter={() => setIsValueHovered(true)}
              onMouseLeave={() => setIsValueHovered(false)}
              onClick={handleValueClick}
              onPointerDown={(e) => isValueEditable && e.stopPropagation()}
              style={{ cursor: isValueEditable ? 'text' : 'default' }}
            >
              {displayValue}
              {unit && <span className="dialkit-slider-unit">{unit}</span>}
            </span>
          )}

          <span className="dialkit-slider-label-vertical">
            {label}
            {shortcut && (
              <span className={`dialkit-shortcut-pill${shortcutActive ? ' dialkit-shortcut-pill-active' : ''}`}>
                {formatSliderShortcut(shortcut)}
              </span>
            )}
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="dialkit-slider-wrapper">
      <motion.div
        className={cardClassName}
        data-origin={hasOrigin ? 'true' : undefined}
        {...pointerHandlers}
        style={{ width: rubberBandSize, x: rubberBandShift }}
      >
        <div className="dialkit-slider-track">
          <motion.div
            className="dialkit-slider-fill"
            style={{
              left: fillStart,
              width: fillExtent,
            }}
          />
          <motion.div
            className="dialkit-slider-handle"
            style={{ left: handleLeft }}
            animate={{ opacity: isDragging ? 0.9 : 0 }}
            transition={{ opacity: { duration: 0.15 } }}
          />
        </div>

        <div className="dialkit-slider-hashmarks">{hashMarks}</div>

        <span className="dialkit-slider-label">
          {label}
          {shortcut && (
            <span className={`dialkit-shortcut-pill${shortcutActive ? ' dialkit-shortcut-pill-active' : ''}`}>
              {formatSliderShortcut(shortcut)}
            </span>
          )}
        </span>

        {valueIcon != null ? (
          <span className="dialkit-slider-value dialkit-slider-value-icon">
            {valueIcon}
          </span>
        ) : showInput ? (
          <input
            ref={inputRef}
            type="text"
            className="dialkit-slider-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={`dialkit-slider-value ${isValueEditable ? 'dialkit-slider-value-editable' : ''}`}
            onMouseEnter={() => setIsValueHovered(true)}
            onMouseLeave={() => setIsValueHovered(false)}
            onClick={handleValueClick}
            onPointerDown={(e) => isValueEditable && e.stopPropagation()}
            style={{ cursor: isValueEditable ? 'text' : 'default' }}
          >
            {displayValue}
            {unit && <span className="dialkit-slider-unit">{unit}</span>}
          </span>
        )}
      </motion.div>
    </div>
  );
}
