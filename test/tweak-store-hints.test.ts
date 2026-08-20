import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore, parseListItemSchema, hintDomId, type ControlMeta } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `hints-test-${++panelSeq}`;

const registered: string[] = [];
const register = (
  id: string,
  config: Parameters<typeof TweakStore.registerPanel>[2],
  hints?: Record<string, string>
) => {
  TweakStore.registerPanel(id, id, config, undefined, { hints });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const find = (id: string, path: string): ControlMeta | undefined => {
  const walk = (controls: ControlMeta[]): ControlMeta | undefined => {
    for (const control of controls) {
      if (control.path === path) return control;
      const hit = control.children && walk(control.children);
      if (hit) return hit;
    }
    return undefined;
  };
  return walk(TweakStore.getPanel(id)?.controls ?? []);
};

const config = {
  gravity: [9.8, 0, 20] as [number, number, number],
  physics: {
    elastic: [0.5, 0, 1] as [number, number, number],
    frozen: false,
  },
};

// Hints are keyed by path rather than declared inline because most controls are
// bare shorthand (`gravity: [9.8, 0, 20]`) with nowhere to hang a property —
// which is exactly the case that has to work.
describe('control hints', () => {
  it('reaches a bare-tuple slider, a nested control, and a folder alike', () => {
    const id = freshId();
    register(id, config, {
      gravity: 'Downward pull on every body.',
      physics: 'How bodies respond to force.',
      'physics.elastic': 'Elastic bodies bounce back; clay keeps the dent.',
    });

    expect(find(id, 'gravity')?.hint).toBe('Downward pull on every body.');
    expect(find(id, 'physics')?.hint).toBe('How bodies respond to force.');
    expect(find(id, 'physics.elastic')?.hint).toBe('Elastic bodies bounce back; clay keeps the dent.');
  });

  it('leaves controls the map does not name untouched', () => {
    const id = freshId();
    register(id, config, { gravity: 'Downward pull.' });

    expect(find(id, 'physics.frozen')?.hint).toBeUndefined();
  });

  it('ignores a path that matches no control', () => {
    const id = freshId();
    expect(() => register(id, config, { 'physics.nope': 'Orphaned.' })).not.toThrow();
    expect(find(id, 'gravity')?.hint).toBeUndefined();
  });

  it('retains hints across an updatePanel that does not restate them', () => {
    const id = freshId();
    register(id, config, { gravity: 'Downward pull.' });

    TweakStore.updatePanel(id, id, config);

    expect(find(id, 'gravity')?.hint).toBe('Downward pull.');
  });

  it('replaces the whole map when an updatePanel does restate it', () => {
    const id = freshId();
    register(id, config, { gravity: 'Downward pull.' });

    TweakStore.updatePanel(id, id, config, undefined, { hints: { 'physics.frozen': 'Pause the sim.' } });

    expect(find(id, 'gravity')?.hint).toBeUndefined();
    expect(find(id, 'physics.frozen')?.hint).toBe('Pause the sim.');
  });
});

describe('hint tooltip ids', () => {
  // aria-describedby holds a space-separated id list, so an unescaped panel name
  // like "Photo Stack" would split one reference into two dangling ones.
  it('collapses whitespace so the id stays a single reference', () => {
    expect(hintDomId('Photo Stack-:r1:', 'shadowTint')).toBe('tweakers-hint-Photo-Stack-:r1:-shadowTint');
    expect(hintDomId('Photo Stack', 'x')).not.toContain(' ');
  });

  it('leaves a whitespace-free id alone', () => {
    expect(hintDomId('panel-1', 'physics.elastic')).toBe('tweakers-hint-panel-1-physics.elastic');
  });
});

describe('list-row field hints', () => {
  it('carries a hint onto the matching field descriptor', () => {
    const fields = parseListItemSchema(
      { mass: [1, 0, 10], frozen: false },
      { mass: 'Heavier bodies resist force.' }
    );

    expect(fields.find((f) => f.key === 'mass')?.hint).toBe('Heavier bodies resist force.');
    expect(fields.find((f) => f.key === 'frozen')?.hint).toBeUndefined();
  });
});
