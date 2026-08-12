import { describe, it, expect, afterEach } from 'vitest';
import { DialStore, resolveDialValues } from '../src/store/DialStore';
import type { CurveConfig, DialConfig, ResolvedValues } from '../src/store/DialStore';

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
const register = (id: string, config: DialConfig) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
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
    register(id, { arc: curve({ sample, domain: [-1, 1], height: 80 }) });

    const control = DialStore.getPanel(id)!.controls[0];
    expect(control.type).toBe('curve');
    expect(control.label).toBe('Arc');
    expect(control.sample).toBe(sample);
    expect(control.domain).toEqual([-1, 1]);
    expect(control.height).toBe(80);
    expect(control.hideLabel).toBeUndefined();
  });

  it('label: false marks the row full-bleed; a string overrides the derived label', () => {
    const id = freshId();
    register(id, { a: curve({ label: false }), b: curve({ label: 'Pitch arc' }) });

    const [a, b] = DialStore.getPanel(id)!.controls;
    expect(a.hideLabel).toBe(true);
    expect(b.label).toBe('Pitch arc');
    expect(b.hideLabel).toBeUndefined();
  });

  it('requires a sample function — otherwise the object parses as a folder', () => {
    const id = freshId();
    register(id, { arc: { type: 'curve' } as unknown as DialConfig });
    expect(DialStore.getPanel(id)!.controls[0].type).toBe('folder');
  });
});

describe('curve rows stay out of the value layer', () => {
  const config = (): DialConfig => ({
    gravity: [9.8, 0, 20],
    arc: curve(),
    shape: { detail: [0.5, 0, 1], preview: curve() },
  });

  it('flattens no value for a curve row, at any depth', () => {
    const id = freshId();
    register(id, config());
    const values = DialStore.getValues(id);
    expect(Object.keys(values).sort()).toEqual(['gravity', 'shape.detail']);
  });

  it('never lands in a saved preset', () => {
    const id = freshId();
    register(id, config());
    DialStore.savePreset(id, 'snapshot');
    const preset = DialStore.getPresets(id)[0];
    expect(Object.keys(preset.values).sort()).toEqual(['gravity', 'shape.detail']);
  });

  it('is omitted from resolved values', () => {
    const id = freshId();
    register(id, config());
    const resolved = resolveDialValues(config(), DialStore.getValues(id));
    expect('arc' in resolved).toBe(false);
    expect('preview' in (resolved as { shape: object }).shape).toBe(false);
    expect(resolved).toEqual({ gravity: 9.8, shape: { detail: 0.5 } });
  });

  it('survives a dynamic panel update without inventing a value', () => {
    const id = freshId();
    register(id, config());
    DialStore.updateValue(id, 'gravity', 12);
    DialStore.updatePanel(id, id, config());
    const values = DialStore.getValues(id);
    expect(values.gravity).toBe(12);
    expect('arc' in values).toBe(false);
  });
});

describe('syncCurveSamples', () => {
  it('swaps a replaced sampler in place and notifies the control-state channel', () => {
    const id = freshId();
    register(id, { arc: curve() });

    let notified = 0;
    const unsubscribe = DialStore.subscribeControlState(id, () => notified++);

    const next = (t: number) => 1 - t;
    DialStore.syncCurveSamples(id, { arc: curve({ sample: next }) });
    expect(DialStore.getPanel(id)!.controls[0].sample).toBe(next);
    expect(notified).toBe(1);

    unsubscribe();
  });

  it('is silent when the function identity is unchanged', () => {
    const id = freshId();
    const stable = curve();
    register(id, { arc: stable });

    let notified = 0;
    const unsubscribe = DialStore.subscribeControlState(id, () => notified++);

    DialStore.syncCurveSamples(id, { arc: stable });
    expect(notified).toBe(0);

    unsubscribe();
  });

  it('reaches curve rows nested inside folders', () => {
    const id = freshId();
    register(id, { shape: { detail: [0.5, 0, 1], preview: curve() } });

    const next = (t: number) => t * t;
    DialStore.syncCurveSamples(id, { shape: { detail: [0.5, 0, 1], preview: curve({ sample: next }) } });

    const folder = DialStore.getPanel(id)!.controls[0];
    const preview = folder.children!.find((c) => c.type === 'curve')!;
    expect(preview.sample).toBe(next);
  });

  it('does not leak the sampler into the value snapshot', () => {
    const id = freshId();
    register(id, { arc: curve() });
    const before = DialStore.getValues(id);
    DialStore.syncCurveSamples(id, { arc: curve({ sample: (t) => -t }) });
    // Presentation-only refresh: the value snapshot must not churn.
    expect(DialStore.getValues(id)).toBe(before);
  });
});
