# Control dictionary

## Move dial slots (React)

`MOVE_SLOT_LIBRARY` is the executable dictionary, checked against `MoveSlotKind`.
Slot bodies are presentational fragments, not standalone interactive controls.
Use declarative configs and `MovePanel` in apps: it owns pointer capture, fine
adjustment, modulation, readouts and hardware column alignment.

| Kind | Choose for | Configuration / body | Hardware space |
| --- | --- | --- | --- |
| `default` | Bounded continuous quantity; signed values use `bipolar` / `origin` | Slider tuple, `slider`, bounded `number`; `MoveSlotDefaultBody` | 1 dial |
| `value` | A value that is the headline, including a substituted value chip | Panel-selected presentation of `MoveSlotDefaultBody` | 1 dial |
| `enum` | A stepped choice | `select.options`; `MoveSlotEnumBody` | 1 dial |
| `icon` | A choice recognized by its picture | Select option `icon`; `MoveSlotEnumBody` | 1 dial |
| `curve` | A choice whose value is a shape | Select `preview(option)` sampler; `MoveSlotEnumBody` | 1 dial |
| `xy` | Two axes that form one gesture | `xy`; `MoveSlotXYBody` | Column knob X, touched + volume Y |
| `range` | Low/high bounds of one interval | `range`; `MoveSlotRangeBody` | Column knob low, touched + volume high |
| `filter` | Cutoff and resonance with a response display | `filter`; `MoveSlotFilterBody` | 2 adjacent dials |

`MoveSlotGlyph`, `MoveSlotReadout`, and `MoveSlotShape` provide the shared visual
parts. The XY face also accepts a shape path for the modulation curve preview.
The parent supplies normalized screen coordinates (Y down), grid division count,
and the formatted readout. It retains every gesture and store subscription.

### Small slots and companion components

| Component / API | Purpose |
| --- | --- |
| `movePads` option | Place toggles, numeric value chips, and explicitly mapped actions under their related dial columns |
| `MoveActionButton` / `MoveFunctions` | Hardware-named action pills and one shared action registry |
| `MoveWaveform` / `MoveWaveformStore` | Sample display, navigation, loop and scrub state |
| `MoveVolumeDisplay` | Contextual volume-knob readout |
| `MoveSurfaceStore` | Mirror app-owned raw pads, step buttons and screen state |
| `ListScreen` | Controlled list presentation matching the device display |
| `ModulationStore` | LFO, sample-and-hold, ADSR and curve modulation; settings layouts and assignments |

## General controls and artifacts

These are React exports from `tweakers`. Config syntax is in the README and
`src/store/TweakStore.ts`; an exported component does not imply a Move dial mapping.

| Need | Available controls |
| --- | --- |
| Numeric | `Slider`, `NumberControl`, `RangeSlider` |
| Boolean | `Checkbox`, `Toggle` |
| Choice | `SelectControl`, `SegmentedControl`, `SwatchControl`, `ChipsControl`, `MultiSelectControl` |
| Text and assets | `TextControl`, `FileControl`, `GalleryControl` |
| Color | `ColorControl`, `ColorPickerPanel`, `GradientControl`, `GradientPanel` |
| Coupled axes / filter | `XYPad`, `XYControl`, `FilterControl` |
| Animation and curves | `SpringControl`, `TransitionControl`, `SpringVisualization`, `EasingVisualization`, `CurveComposer`, `CurvePreview` |
| Audio and signal | `WaveformVisualization`, `AnalyserVisualization`, `AnalyserRow`, `AudioLevelMeter` |
| Collections / timeline | `ListControl`, `TweakTimeline` (prototype) |
| Structure | `TweakRoot`, `Folder`, `Module`, `ControlShell`, `ControlRenderer` |
| Commands / panel tools | `ButtonGroup`, `PresetManager`, `ShortcutsMenu` |

A read-only `curve` preview is not the editable `CurveComposer`, and a Move
`curve` slot is a select presentation, not a new config type. Keep these distinct.
Unmapped controls need a general panel or an artifact editor; do not assume they
will appear on hardware. Inspect `buildMovePages` output when designing a page.

## Framework boundaries

MovePanel and its slot library are currently React-only. The general control
set also has `tweakers/solid`, `tweakers/svelte`, and `tweakers/vue` adapters.
Check that adapter's export barrel and renderer before selecting a specialized
control; React exports do not establish parity. Framework-neutral entry points
include `tweakers/store`, `tweakers/timeline`, `tweakers/curve-composer-core`,
`tweakers/modulation-core`, and `tweakers/modulation-store`.
