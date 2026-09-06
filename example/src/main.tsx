import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TweakRoot, TweakStore, MovePanel, MoveFunctions, ModulationStore } from 'tweakers';
import 'tweakers/styles.css';
import { PhotoStack } from './PhotoStack';
import { Release } from './Release';
import { Library } from './Library';
import { SpecializedShowcase } from './SpecializedShowcase';

// A Move demo page (track 2 on the panel) with the two-handed dials: the xy
// pad and the range span (knob = X / low end, volume knob = Y / high end
// while that knob is touched), plus a bipolar slider anchored at centre.
TweakStore.registerPanel('move-xy', 'Move Demo', {
  spot: {
    type: 'xy',
    x: { min: -1, max: 1, bipolar: true },
    y: { min: 0, max: 10, bipolar: true },
    default: { x: 0, y: 5 },
    returnToCenter: true,   /* joystick: springs back on release, knob or pointer */
  },
  band: { type: 'range', min: 0, max: 100, default: { min: 20, max: 80 } },
  bias: { type: 'slider', min: -1, max: 1, default: 0, bipolar: true },
  amount: [0.5, 0, 1],
  sweep: [0, 0, 1],
});

// Modulation demo: an LFO in the first step slot breathing the Move demo's
// Amount slider — a pulsing circle in the track row, and a ring on the
// control whose arc runs from the slider's own value to where the
// modulation is holding it. The slider keeps its base value; read the live
// number with ModulationStore.getValue('move-xy', 'amount'). (Slots
// persist across reloads, hence the guard.)
if (!ModulationStore.getSlot(0)) {
  ModulationStore.createSlot(0);
  ModulationStore.assign('move-xy', 'amount', 0, 0.6);
}

// The second slot holds an ADSR pumping the Bias slider. An ADSR rests until
// something gates it — a real app calls ModulationStore.gate(1, true/false)
// on its notes — so this demo turns Loop on to let it play its own gate and
// show the shape. Hold the slot's circle (or step 2) for its Attack / Decay
// / Sustain / Release page.
if (!ModulationStore.getSlot(1)) {
  ModulationStore.createSlot(1, 'adsr');
  ModulationStore.updateSlotParams(1, {
    attack: 40, decay: 250, sustain: 0.4, release: 700, loop: true,
  });
  ModulationStore.assign('move-xy', 'bias', 1, 0.8);
}

// The third slot holds a curve on the Sweep slider: a series of eased clips
// read once per pass. Tap its circle (or step 3) to open the page — the
// composer floats above the panel, the arrows walk its clips, Delete drops
// one, and a tap on the Curve knob moves a clip to the next shape.
if (!ModulationStore.getSlot(2)) {
  ModulationStore.createSlot(2, 'curve');
  ModulationStore.assign('move-xy', 'sweep', 2, 0.8);
}

// Function buttons: the Move's Copy puts every panel's current values on the
// clipboard as JSON. Unattached buttons keep the surface built-ins.
MoveFunctions.attach('copy', () => {
  const all = Object.fromEntries(TweakStore.getPanels().map(p => [p.id, TweakStore.getValues(p.id)]));
  navigator.clipboard?.writeText(JSON.stringify(all, null, 2)).catch(() => {});
});

// Physical controls: bind the Ableton Move bridge when it's running (no-op otherwise).
// @ts-ignore — remote module, no types
import(/* @vite-ignore */ 'http://localhost:7787/kit.js')
  .then(m => m.bindMove(TweakStore, { functions: MoveFunctions, modulation: ModulationStore }))
  .catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><PhotoStack /><TweakRoot position="top-right" /><MovePanel /></>} />
        <Route path="/release-1.2" element={<Release />} />
        <Route path="/library" element={<Library />} />
        <Route path="/specialized" element={<SpecializedShowcase />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
