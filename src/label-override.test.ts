import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TweakStore, type ControlMeta } from './store/TweakStore';

// `labels` overrides the name derived from a control's config key. It is keyed by
// path for the same reason as `hints`: the controls that most need a label their
// key can't express are bare shorthand, with nowhere to hang a property.

let seq = 0;
const nextId = () => `label-override-${++seq}`;

function find(nodes: ControlMeta[], path: string): ControlMeta | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    const hit = node.children ? find(node.children, path) : undefined;
    if (hit) return hit;
  }
  return undefined;
}

const control = (id: string, path: string): ControlMeta | undefined =>
  find(TweakStore.getPanel(id)?.controls ?? [], path);

describe('label overrides', () => {
  it('replaces the key-derived label on a shorthand slider', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { paramA: [0.5, 0, 1] }, undefined, {
      labels: { paramA: 'Turbulence' }
    });
    assert.equal(control(id, 'paramA')?.label, 'Turbulence');
  });

  it('derives the label from the key when no override is given', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { paramA: [0.5, 0, 1] });
    assert.equal(control(id, 'paramA')?.label, 'Param A');
  });

  it('applies to nested controls and to the folder itself', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { physics: { elastic: [0.5, 0, 1] } }, undefined, {
      labels: { physics: 'Feel', 'physics.elastic': 'Bounce' }
    });
    assert.equal(control(id, 'physics')?.label, 'Feel');
    assert.equal(control(id, 'physics.elastic')?.label, 'Bounce');
  });

  it('relabels without changing identity, so the value survives', () => {
    // The whole point: renaming the key to change the text would reset the value.
    const id = nextId();
    TweakStore.registerPanel(id, id, { paramA: [0.5, 0, 1] }, undefined, {
      labels: { paramA: 'Wander' }
    });
    TweakStore.updateValue(id, 'paramA', 0.9);
    TweakStore.updatePanel(id, id, { paramA: [0.5, 0, 1] }, undefined, {
      labels: { paramA: 'Drift' }
    });
    assert.equal(control(id, 'paramA')?.label, 'Drift');
    assert.equal(TweakStore.getValue(id, 'paramA'), 0.9);
  });

  it('retains labels across an updatePanel that omits them', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { paramA: [0.5, 0, 1] }, undefined, {
      labels: { paramA: 'Kept' }
    });
    TweakStore.updatePanel(id, id, { paramA: [0.5, 0, 1] });
    assert.equal(control(id, 'paramA')?.label, 'Kept');
  });

  it('ignores an empty override rather than blanking the label', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { paramA: [0.5, 0, 1] }, undefined, {
      labels: { paramA: '' }
    });
    assert.equal(control(id, 'paramA')?.label, 'Param A');
  });

  it('still honours ActionConfig.label, and lets a keyed label win', () => {
    const id = nextId();
    TweakStore.registerPanel(id, id, { go: { type: 'action', label: 'Inline' } });
    assert.equal(control(id, 'go')?.label, 'Inline');

    const id2 = nextId();
    TweakStore.registerPanel(id2, id2, { go: { type: 'action', label: 'Inline' } }, undefined, {
      labels: { go: 'Keyed' }
    });
    assert.equal(control(id2, 'go')?.label, 'Keyed');
  });
});
