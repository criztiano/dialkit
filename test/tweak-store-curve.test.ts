import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore, resolveTweakValues } from '../src/store/TweakStore';
import type { CurveConfig, TweakConfig, ResolvedValues } from '../src/store/TweakStore';

// Compile-time contract: ResolvedValues drops curve keys entirely (not just
// types them as undefined) — at the root and inside folders.
type CurveShape = {
  gravity: [number, number, number];
  arc: CurveConfig;
  shape: { detail: [number, number, number]; preview: CurveConfig };
};
type CurveResolved = ResolvedValues<CurveShape>;
const _rootOmitted: 'arc' extends keyof CurveResolved ? never : true = true;
const _nestedOmitted: 'preview' extends keyof CurveResolved['shape'] ? never : true = true;
void _rootOmitted;
void _nestedOmitted;

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `curve-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: TweakConfig) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const curve = (extra: Partial<CurveConfig> = {}): CurveConfig => ({
  type: 'curve',
  sample: (t: number) => t,
  ...extra,
});

describe('curve config parsing', () => {
  it('produces a curve row carrying the sampler and display options', () => {
    const id = freshId();
    const sample = (t: number) => t * 2;
    register(id, { arc: curve({ sample, domain: [-1, 1], markers: [0.25, 0.5], height: 80 }) });

    const control = TweakStore.getPanel(id)!.controls[0];
    expect(control.type).toBe('curve');
    expect(control.label).toBe('Arc');
    expect(control.sample).toBe(sample);
    expect(control.domain).toEqual([-1, 1]);
    expect(control.markers).toEqual([0.25, 0.5]);
    expect(control.height).toBe(80);
    expect(control.hideLabel).toBeUndefined();
  });

  it('leaves markers undefined when the config declares none', () => {
    const id = freshId();
    register(id, { arc: curve() });
    expect(TweakStore.getPanel(id)!.controls[0].markers).toBeUndefined();
  });

  it('label: false marks the row full-bleed; a string overrides the derived label', () => {
    const id = freshId();
    register(id, { a: curve({ label: false }), b: curve({ label: 'Pitch arc' }) });

    const [a, b] = TweakStore.getPanel(id)!.controls;
    expect(a.hideLabel).toBe(true);
    expect(b.label).toBe('Pitch arc');
    expect(b.hideLabel).toBeUndefined();
  });

  it('requires a sample function — otherwise the object parses as a folder', () => {
    const id = freshId();
    register(id, { arc: { type: 'curve' } as unknown as TweakConfig });
    expect(TweakStore.getPanel(id)!.controls[0].type).toBe('folder');
  });
});

describe('curve rows stay out of the value layer', () => {
  const config = (): TweakConfig => ({
    gravity: [9.8, 0, 20],
    arc: curve(),
    shape: { detail: [0.5, 0, 1], preview: curve() },
  });

  it('flattens no value for a curve row, at any depth', () => {
    const id = freshId();
    register(id, config());
    const values = TweakStore.getValues(id);
    expect(Object.keys(values).sort()).toEqual(['gravity', 'shape.detail']);
  });

  it('never lands in a saved preset', () => {
    const id = freshId();
    register(id, config());
    TweakStore.savePreset(id, 'snapshot');
    const preset = TweakStore.getPresets(id)[0];
    expect(Object.keys(preset.values).sort()).toEqual(['gravity', 'shape.detail']);
  });

  it('is omitted from resolved values', () => {
    const id = freshId();
    register(id, config());
    const resolved = resolveTweakValues(config(), TweakStore.getValues(id));
    expect('arc' in resolved).toBe(false);
    expect('preview' in (resolved as { shape: object }).shape).toBe(false);
    expect(resolved).toEqual({ gravity: 9.8, shape: { detail: 0.5 } });
  });

  it('survives a dynamic panel update without inventing a value', () => {
    const id = freshId();
    register(id, config());
    TweakStore.updateValue(id, 'gravity', 12);
    TweakStore.updatePanel(id, id, config());
    const values = TweakStore.getValues(id);
    expect(values.gravity).toBe(12);
    expect('arc' in values).toBe(false);
  });
});

describe('syncCurveConfigs', () => {
  it('swaps a replaced sampler in place and notifies the control-state channel', () => {
    const id = freshId();
    register(id, { arc: curve() });

    let notified = 0;
    const unsubscribe = TweakStore.subscribeControlState(id, () => notified++);

    const next = (t: number) => 1 - t;
    TweakStore.syncCurveConfigs(id, { arc: curve({ sample: next }) });
    expect(TweakStore.getPanel(id)!.controls[0].sample).toBe(next);
    expect(notified).toBe(1);

    unsubscribe();
  });

  it('is silent when the function identity is unchanged', () => {
    const id = freshId();
    const stable = curve();
    register(id, { arc: stable });

    let notified = 0;
    const unsubscribe = TweakStore.subscribeControlState(id, () => notified++);

    TweakStore.syncCurveConfigs(id, { arc: stable });
    expect(notified).toBe(0);

    unsubscribe();
  });

  it('updates changed marker values in place and notifies', () => {
    const id = freshId();
    const sample = (t: number) => t;
    register(id, { arc: curve({ sample, markers: [0.5] }) });

    let notified = 0;
    const unsubscribe = TweakStore.subscribeControlState(id, () => notified++);

    TweakStore.syncCurveConfigs(id, { arc: curve({ sample, markers: [0.5, 0.75] }) });
    expect(TweakStore.getPanel(id)!.controls[0].markers).toEqual([0.5, 0.75]);
    expect(notified).toBe(1);

    unsubscribe();
  });

  it('compares markers by value: a rebuilt-but-equal array is silent', () => {
    const id = freshId();
    const sample = (t: number) => t;
    register(id, { arc: curve({ sample, markers: [0.25, 0.5] }) });
    const before = TweakStore.getPanel(id)!.controls[0].markers;

    let notified = 0;
    const unsubscribe = TweakStore.subscribeControlState(id, () => notified++);

    // The per-render rebuild path: same values, fresh array identity.
    TweakStore.syncCurveConfigs(id, { arc: curve({ sample, markers: [0.25, 0.5] }) });
    expect(notified).toBe(0);
    expect(TweakStore.getPanel(id)!.controls[0].markers).toBe(before);

    unsubscribe();
  });

  it('reaches curve rows nested inside folders', () => {
    const id = freshId();
    register(id, { shape: { detail: [0.5, 0, 1], preview: curve() } });

    const next = (t: number) => t * t;
    TweakStore.syncCurveConfigs(id, { shape: { detail: [0.5, 0, 1], preview: curve({ sample: next, markers: [0.5] }) } });

    const folder = TweakStore.getPanel(id)!.controls[0];
    const preview = folder.children!.find((c) => c.type === 'curve')!;
    expect(preview.sample).toBe(next);
    expect(preview.markers).toEqual([0.5]);
  });

  it('does not leak the sampler into the value snapshot', () => {
    const id = freshId();
    register(id, { arc: curve() });
    const before = TweakStore.getValues(id);
    TweakStore.syncCurveConfigs(id, { arc: curve({ sample: (t) => -t, markers: [0.5] }) });
    // Presentation-only refresh: the value snapshot must not churn.
    expect(TweakStore.getValues(id)).toBe(before);
  });
});
