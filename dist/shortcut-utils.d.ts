import { C as ControlMeta, S as ShortcutConfig } from './TweakStore-ChWM8M9D.js';
import './range-slider-core.js';

declare function decimalsForStep(step: number): number;
declare function roundValue(val: number, step: number): number;
declare function getEffectiveStep(control: ControlMeta, shortcut: ShortcutConfig): number;
declare function applySliderDelta(panelId: string, path: string, control: ControlMeta, effectiveStep: number, direction: number): void;
declare function snapToDecile(rawValue: number, min: number, max: number): number;
declare function isInputFocused(): boolean;
declare function getActiveModifier(e: KeyboardEvent | WheelEvent | MouseEvent): 'alt' | 'shift' | 'meta' | undefined;
declare function findControl(controls: ControlMeta[], path: string): ControlMeta | null;
declare const DRAG_SENSITIVITY = 4;
/**
 * Fine-tuning while a pointer drag is in progress: pointer travel applies at
 * `factor` (default 0.1×) as a RELATIVE delta from `startValue` — the value at
 * the moment shift went down — so the handle stops tracking the cursor
 * absolutely and creeps precisely. Callers rebase `startValue`/`startPos` on
 * every shift transition (press mid-drag, release mid-drag) so the value never
 * jumps; releasing shift continues at factor 1 from the release point.
 * Positions are px along the drag axis; `extentPx` is the track's full travel.
 */
declare function fineDragValue(opts: {
    startValue: number;
    startPos: number;
    pos: number;
    extentPx: number;
    min: number;
    max: number;
    factor?: number;
}): number;
declare function formatInteractionLabel(interaction: string): string;
declare function formatSliderShortcut(sc: ShortcutConfig): string;
declare function formatToggleShortcut(sc: ShortcutConfig): string;

export { DRAG_SENSITIVITY, applySliderDelta, decimalsForStep, findControl, fineDragValue, formatInteractionLabel, formatSliderShortcut, formatToggleShortcut, getActiveModifier, getEffectiveStep, isInputFocused, roundValue, snapToDecile };
