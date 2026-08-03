import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';

export type AudioLevelMeterMode = 'mono' | 'stereo' | 'spectrum';

export type AudioLevelMeterColors = readonly [
  low: string,
  middle?: string,
  high?: string,
];

interface AudioLevelMeterBaseProps {
  /** Accessible name for the read-only visualization. */
  label?: string;
  /** One to three colors, ordered from the lowest to the highest cells. */
  colors?: AudioLevelMeterColors;
  /** Number of cells in each band. Rounded and clamped to 8–12. */
  cellCount?: number;
  className?: string;
  style?: CSSProperties;
}

export interface MonoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
  mode?: 'mono';
  /** Current normalized audio level. Values above 1 trigger clipping. */
  levels: number;
}

export interface StereoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
  mode: 'stereo';
  /** Current normalized left and right audio levels. */
  levels: readonly [left: number, right: number];
}

export interface SpectrumAudioLevelMeterProps extends AudioLevelMeterBaseProps {
  mode: 'spectrum';
  /** Current normalized spectrum levels. The first 1–12 entries become bands. */
  levels: readonly number[];
}

export type AudioLevelMeterProps =
  | MonoAudioLevelMeterProps
  | StereoAudioLevelMeterProps
  | SpectrumAudioLevelMeterProps;

const DEFAULT_CELL_COUNT = 10;
const MIN_CELL_COUNT = 8;
const MAX_CELL_COUNT = 12;
const MAX_SPECTRUM_BANDS = 12;
const PEAK_HOLD_MS = 560;
const PEAK_FALL_INTERVAL_MS = 120;

interface PeakState {
  index: number;
  holdStartedAt: number;
  lastDropAt: number;
}

function clampLevel(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function normalizeCellCount(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_CELL_COUNT;
  return Math.min(MAX_CELL_COUNT, Math.max(MIN_CELL_COUNT, Math.round(value)));
}

function levelToCellCount(level: number, cellCount: number): number {
  return level === 0 ? 0 : Math.ceil(level * cellCount);
}

function formatPercentage(level: number): string {
  return `${Math.round(level * 100)}%`;
}

function getValueSummary(mode: AudioLevelMeterMode, levels: readonly number[]): string {
  if (mode === 'mono') {
    return `Level ${formatPercentage(levels[0])}`;
  }

  if (mode === 'stereo') {
    return `Left ${formatPercentage(levels[0])}, right ${formatPercentage(levels[1])}`;
  }

  return `Band levels ${levels.map(formatPercentage).join(', ')}`;
}

function getRawLevels(props: AudioLevelMeterProps): number[] {
  if (props.mode === 'stereo') {
    return props.levels.map((level) => (Number.isFinite(level) ? level : 0));
  }

  if (props.mode === 'spectrum') {
    const levels = props.levels
      .slice(0, MAX_SPECTRUM_BANDS)
      .map((level) => (Number.isFinite(level) ? level : 0));
    return levels.length > 0 ? levels : [0];
  }

  return [Number.isFinite(props.levels) ? props.levels : 0];
}

function getCellColor(
  colors: readonly string[],
  indexFromBottom: number,
  cellCount: number
): string | undefined {
  if (colors.length === 0) return undefined;
  const colorIndex = Math.min(
    colors.length - 1,
    Math.floor((indexFromBottom / cellCount) * colors.length)
  );
  return colors[colorIndex];
}

function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
}

function createPeakState(index: number, timestamp: number): PeakState {
  return { index, holdStartedAt: timestamp, lastDropAt: timestamp };
}

function remapPeakIndex(index: number, previousCellCount: number, cellCount: number): number {
  if (index < 0) return -1;
  return Math.min(
    cellCount - 1,
    Math.ceil(((index + 1) / previousCellCount) * cellCount) - 1
  );
}

function getDefaultLabel(mode: AudioLevelMeterMode, bandCount: number): string {
  if (mode === 'mono') {
    return 'Audio level meter, mono';
  }

  if (mode === 'stereo') {
    return 'Audio level meter, stereo';
  }

  return `Audio spectrum analyzer, ${bandCount} bands`;
}

function getBandName(mode: AudioLevelMeterMode, index: number): string {
  if (mode === 'mono') return 'mono';
  if (mode === 'stereo') return index === 0 ? 'left' : 'right';
  return `band ${index + 1}`;
}

export function AudioLevelMeter(props: AudioLevelMeterProps): ReactElement {
  const mode: AudioLevelMeterMode = props.mode ?? 'mono';
  const cellCount = normalizeCellCount(props.cellCount);
  const rawLevels = getRawLevels(props);
  const levels = rawLevels.map(clampLevel);
  const clippedBands = rawLevels.map((level) => level > 1);
  const activeCellCounts = levels.map((level) => levelToCellCount(level, cellCount));
  const activeCellKey = activeCellCounts.join(':');
  const clippedBandKey = clippedBands.map(Number).join(':');
  const currentTopCellsRef = useRef(activeCellCounts.map((count) => count - 1));
  const currentClippedBandsRef = useRef(clippedBands);
  const cellCountRef = useRef(cellCount);
  const peakStatesRef = useRef<PeakState[]>([]);
  const clipHoldUntilRef = useRef(clippedBands.map(() => 0));
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [peakIndices, setPeakIndices] = useState(() =>
    activeCellCounts.map((count) => count - 1)
  );
  const [heldClippedBands, setHeldClippedBands] = useState(clippedBands.map(() => false));
  const displayedClippedBands = heldClippedBands.map(
    (isHeld, index) => isHeld || clippedBands[index]
  );
  const displayedPeakIndices = peakIndices.map((index) =>
    remapPeakIndex(index, cellCountRef.current, cellCount)
  );

  const colors = (props.colors ?? [])
    .slice(0, 3)
    .filter(
      (color): color is string => typeof color === 'string' && color.trim().length > 0
    );

  useEffect(() => {
    const timestamp = performance.now();
    const currentTopCells = activeCellKey
      .split(':')
      .map(Number)
      .map((count) => count - 1);
    const currentClippedBands = clippedBandKey.split(':').map((value) => value === '1');
    const previousCellCount = cellCountRef.current;
    const cellCountChanged = previousCellCount !== cellCount;
    const previousCurrentClippedBands = currentClippedBandsRef.current;
    let previousTopCells = currentTopCellsRef.current;

    if (cellCountChanged) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      previousTopCells = previousTopCells.map((index) =>
        remapPeakIndex(index, previousCellCount, cellCount)
      );
      peakStatesRef.current = peakStatesRef.current.map((peak) => ({
        ...peak,
        index: remapPeakIndex(peak.index, previousCellCount, cellCount),
      }));
      cellCountRef.current = cellCount;
    }

    currentTopCellsRef.current = currentTopCells;
    currentClippedBandsRef.current = currentClippedBands;

    const nextClipHoldUntil = currentClippedBands.map((isCurrentlyClipped, index) => {
      if (isCurrentlyClipped) return Number.POSITIVE_INFINITY;
      if (previousCurrentClippedBands[index]) return timestamp + PEAK_HOLD_MS;
      return clipHoldUntilRef.current[index] ?? 0;
    });
    clipHoldUntilRef.current = nextClipHoldUntil;

    if (reducedMotion) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      peakStatesRef.current = currentTopCells.map((index) => createPeakState(index, timestamp));
      clipHoldUntilRef.current = currentClippedBands.map(() => 0);
      setPeakIndices(currentTopCells);
      setHeldClippedBands(currentClippedBands.map(() => false));
      return;
    }

    const nextPeakStates = currentTopCells.map((currentTop, index) => {
      const previous = peakStatesRef.current[index];
      if (!previous || currentTop > previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if (currentTop === previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if ((previousTopCells[index] ?? -1) >= previous.index) {
        return {
          ...previous,
          holdStartedAt: timestamp,
          lastDropAt: timestamp,
        };
      }
      return previous;
    });

    peakStatesRef.current = nextPeakStates;
    setPeakIndices(nextPeakStates.map((peak) => peak.index));
    setHeldClippedBands(
      nextClipHoldUntil.map(
        (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
      )
    );

    if (animationFrameRef.current !== null) return;
    const hasFallingPeak = nextPeakStates.some(
      (peak, index) => peak.index > currentTopCells[index]
    );
    const hasClipHold = nextClipHoldUntil.some(
      (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
    );
    if (!hasFallingPeak && !hasClipHold) return;

    const animatePeaks = (frameTimestamp: number) => {
      let peakChanged = false;
      let clipHoldChanged = false;
      let needsAnotherFrame = false;

      const next = peakStatesRef.current.map((peak, index) => {
        const currentTop = currentTopCellsRef.current[index] ?? -1;
        if (peak.index <= currentTop) {
          return createPeakState(currentTop, frameTimestamp);
        }

        const fallStartedAt = peak.holdStartedAt + PEAK_HOLD_MS;
        if (frameTimestamp >= fallStartedAt) {
          const dropFrom = Math.max(peak.lastDropAt, fallStartedAt);
          const dropCount = Math.floor((frameTimestamp - dropFrom) / PEAK_FALL_INTERVAL_MS);
          if (dropCount > 0) {
            const nextIndex = Math.max(currentTop, peak.index - dropCount);
            peakChanged = peakChanged || nextIndex !== peak.index;
            peak = {
              ...peak,
              index: nextIndex,
              lastDropAt: dropFrom + dropCount * PEAK_FALL_INTERVAL_MS,
            };
          }
        }

        needsAnotherFrame = needsAnotherFrame || peak.index > currentTop;
        return peak;
      });

      const nextClipHolds = clipHoldUntilRef.current.map((holdUntil, index) => {
        const isCurrentlyClipped = currentClippedBandsRef.current[index] ?? false;
        if (isCurrentlyClipped || holdUntil === 0) return holdUntil;
        if (holdUntil <= frameTimestamp) {
          clipHoldChanged = true;
          return 0;
        }
        needsAnotherFrame = true;
        return holdUntil;
      });

      peakStatesRef.current = next;
      clipHoldUntilRef.current = nextClipHolds;
      if (peakChanged) setPeakIndices(next.map((peak) => peak.index));
      if (clipHoldChanged) {
        setHeldClippedBands(
          nextClipHolds.map(
            (holdUntil, index) =>
              !currentClippedBandsRef.current[index] && holdUntil > frameTimestamp
          )
        );
      }

      if (needsAnotherFrame) {
        animationFrameRef.current = requestAnimationFrame(animatePeaks);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animatePeaks);
  }, [activeCellKey, cellCount, clippedBandKey, reducedMotion]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );

  const defaultLabel = getDefaultLabel(mode, levels.length);
  const valueSummary = getValueSummary(mode, levels);
  const currentClippedBandNames = clippedBands.flatMap((isClipped, index) =>
    isClipped ? [getBandName(mode, index)] : []
  );
  const heldClippedBandNames = heldClippedBands.flatMap((isHeld, index) =>
    isHeld && !clippedBands[index] ? [getBandName(mode, index)] : []
  );
  const clippingSummary = [
    currentClippedBandNames.length > 0
      ? `Clipping: ${currentClippedBandNames.join(', ')}`
      : undefined,
    heldClippedBandNames.length > 0
      ? `Clipping held: ${heldClippedBandNames.join(', ')}`
      : undefined,
  ]
    .filter(Boolean)
    .join('. ');
  const hasClipping = displayedClippedBands.some(Boolean);
  const accessibleSummary = [props.label, defaultLabel, valueSummary, clippingSummary]
    .filter(Boolean)
    .join('. ');

  const rootClassName = ['dialkit-root', 'dialkit-audio-meter', props.className]
    .filter(Boolean)
    .join(' ');
  const rootStyle = {
    ...props.style,
    '--dial-meter-band-count': levels.length,
    '--dial-meter-cell-count': cellCount,
  } as CSSProperties;

  return (
    <div
      className={rootClassName}
      style={rootStyle}
      data-mode={mode}
      data-clipping={hasClipping || undefined}
      role="img"
      aria-label={accessibleSummary}
    >
      <div className="dialkit-audio-meter__bands" aria-hidden="true">
        {activeCellCounts.map((activeCellCount, bandIndex) => (
          <div className="dialkit-audio-meter__band" key={bandIndex}>
            {Array.from({ length: cellCount }, (_, visualIndex) => {
              const indexFromBottom = cellCount - visualIndex - 1;
              const isActive = indexFromBottom < activeCellCount;
              const isPeak = indexFromBottom === displayedPeakIndices[bandIndex];
              const isClipped =
                displayedClippedBands[bandIndex] && indexFromBottom === cellCount - 1;
              const color = getCellColor(colors, indexFromBottom, cellCount);
              const cellStyle = color
                ? ({ '--dial-meter-cell-color': color } as CSSProperties)
                : undefined;

              return (
                <span
                  className="dialkit-audio-meter__cell"
                  data-active={isActive || undefined}
                  data-peak={isPeak || undefined}
                  data-clipped={isClipped || undefined}
                  style={cellStyle}
                  key={visualIndex}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
