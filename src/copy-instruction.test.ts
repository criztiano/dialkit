import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCopyInstruction } from './copy-instruction';

describe('copy instructions', () => {
  it('leaves a production handoff note for timeline authoring', () => {
    const instruction = buildCopyInstruction('useTweakTimeline', 'Hero', {
      'card.at': 0.45,
    });

    assert.match(instruction, /Keep the existing `clip\.current` bindings/);
    assert.match(instruction, /do not convert the animation or remove Tweakers yet/);
    assert.match(instruction, /TODO\(production\)/);
    assert.match(instruction, /real Motion animations/);
    assert.match(instruction, /remove useTweakTimeline and <TweakTimeline \/>/);
  });

  it('uses the same production handoff for create-style framework adapters', () => {
    const instruction = buildCopyInstruction('createTweakTimeline', 'Hero', {
      'card.at': 0.45,
    });

    assert.match(instruction, /Keep the existing `clip\.current` bindings/);
    assert.match(instruction, /TODO\(production\)/);
    assert.match(instruction, /remove createTweakTimeline and <TweakTimeline \/>/);
  });

  it('does not add timeline guidance to ordinary panels', () => {
    const instruction = buildCopyInstruction('useTweakers', 'Card', { radius: 12 });

    assert.doesNotMatch(instruction, /clip\.current/);
    assert.doesNotMatch(instruction, /TODO\(production\)/);
  });
});
