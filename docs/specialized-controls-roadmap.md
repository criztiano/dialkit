# Specialized controls

Source audit: Tweakers examples and Move slot library, Grasso's Move pages,
Tracker's Sound/FX/Mix/Pattern panels and waveform editor, and the Move bridge.
The catalogue consolidates repeated values into reusable control families.

## Design contract

- Preserve the compact instrument layout: label, changing diagram, precise value.
- Opt into a visual explicitly; never infer semantics from a parameter's name.
- Derive diagrams from the control's actual value and domain. A schematic must
  not imply measured audio activity or an exact engine response.
- Keep high-frequency edits immediate. No idle loops or geometry tweening.
- Keep meaning visible without hover, motion or colour perception.
- Retain units, keyboard adjustment, fine control and numeric editing.
- Use the existing slot gestures and hardware mappings.

A slot means one Move dial column, not one stored value. Existing XY and range
controls use one column with a secondary hardware gesture. The audio filter uses
two adjacent columns with a knob per parameter. Larger proposed spans below are
future layout work, not support implied by this catalogue.

## First implementation

Six one-column presentations: opacity, blur, pan, stereo width, pitch and playback
direction. These extend scalar/enum controls rather than introducing new value
types. Their example page is `/specialized`.

## Next shared surfaces

| Candidate | Source | Proposed columns | Visual and behaviour |
| --- | --- | --- | --- |
| ADSR | Grasso, Tracker, modulation | 4 | One envelope with A/D/S/R handles and one parameter per knob; times and sustain level remain distinct. |
| Palette | Tweakers | 1 selector; 3–4 editor | Adjacent colour bands preview a named palette; selected swatch opens precise colour editing. Saved colours and palette presets remain distinct. |
| Shadow | Tweakers | 4 | Card and shadow specimen jointly shows blur, opacity, Y offset and scale; tint opens the existing picker. |
| EQ | Tracker | 5 | Shared response graph with five fixed-frequency gain handles, zero line and independent dB readouts. |

## Icon families

| Candidate | Source | Proposed columns | Visual and behaviour |
| --- | --- | --- | --- |
| Sample playback mode | Grasso, Tracker | 1 | Continuous sample versus sliced blocks; mode exposes relevant slice controls. |
| Audio filter type | Grasso, Tracker | 1 | Actual supported LP/HP/BP/notch/etc. silhouettes; explicit bypass state. |
| Curve/window shape | Grasso, modulation | 1 | Shape thumbnails incorporate current modifiers and flip. Extend existing preview samplers. |
| Saturation mode | Tracker | 1 | Named transfer-curve silhouettes for clean and clipping variants. |
| Interpolation quality | Grasso | 1 | Stepped/linear/smooth reconstruction specimens with named quality options. |
| Aspect ratio / variant | Tweakers | 1 | Proportioned outlines or solid/outline/ghost specimen tiles. |
| Fill strategy | Tracker | 1 per selector | Miniature step strips for placement and flat/ramped/scattered value patterns. |
| Loop/reverse/sync/flip | Shared | Pad | Labelled state icons; persistent selected state, settings retained. |
| Processing enable | Grasso, Tracker | Pad | Distinct splice, crush, envelope, decorrelation and all-pass symbols. |
| Actions/navigation | Shared | Pad | Audition, auto-slice, copy/paste, clear, reroll, reset and back; momentary feedback. |

## Reactive scalar families

| Candidate | Source | Proposed columns | Visual and behaviour |
| --- | --- | --- | --- |
| Brightness | Tweakers | 1 | Tonal specimen with neutral 1× reference. |
| Colour saturation | Tweakers | 1 | Colour bars move from grey to vivid; neutral 1× marked. |
| Hue rotation | Tweakers | 1 | Wheel and rotating marker with degrees. |
| Corner radius | Tweakers | 1 | Corner contour changes from square to round; pixel readout. |
| Scale | Tweakers | 1 | Growing rectangle against fixed reference, 1× marked. |
| Rotation/fan | Tweakers | 1 | Rotating axis or spreading cards with zero reference. |
| Gain/volume | Grasso, Tracker | 1 | dB scale and 0 dB reference; measured level is a separate optional companion. |
| Speed | Grasso | 1 | Spacing ruler and readhead with 1× reference; distinct from pitch. |
| Dry/wet/source mix | Grasso | 1 | Two named regions exchange area to show contribution. |
| Offset/delay | Shared | 1 | Separated reference marks and bracket; correct pixels/ms/% units. |
| Density/probability | Grasso, Tracker | 1 | Stable dot field changes density; probability changes remain deterministic until rerolled. |
| Jitter/randomness | Grasso, modulation | 1 | Marks spread around centre without idle shuffling. |
| Feedback | Grasso | 1 | Echo marks decay more slowly as feedback increases. |
| Splice window | Grasso | 1 | Joined waveform edges overlap through a changing fade wedge. |

## Additional combined controls

| Candidate | Source | Proposed columns | Visual and behaviour |
| --- | --- | --- | --- |
| Colour + alpha | Tweakers | 1 compact; 2 expanded | Checkerboard specimen, colour field and alpha rail; reuse picker formats. |
| Gradient | Tweakers | 1 preview; 3–4 editor | Reuse stop ramp and transform pad; explicitly identify active stop/axis. |
| Tint | Tweakers | 2 | Swatch and tint-strength specimen. |
| Transform | Tweakers | 1 XY; 3–4 expanded | Position field plus scale/rotation with origin references. |
| Audio filter | Grasso, Tracker | 2, existing | App-supplied response, log frequency, cutoff/resonance readouts and bypass. |
| Grain envelope | Grasso | 2–3 | Window selection, softness and flip share a curve. |
| Pitch arc/filter sweep | Grasso | 3–4 | Shape, amount, offset and bell width share a signed curve; correct st/oct units. |
| Limiter | Tracker | 3 | Threshold and attack/release contour; reduction meter only with engine telemetry. |
| Bitcrusher | Grasso | 2 | Staircase resolution shows bits vertically and rate reduction horizontally. |
| Comb/formants | Grasso | 4 | Resonance peaks show count, feedback, shift and mix; measured or explicitly schematic. |
| Sample region/loop bounds | Tracker, Tweakers | 2–4 | Waveform, labelled bounds, valid interval constraints and audition. |
| Slice map | Tracker | 2–4 | Numbered regions with selected/muted/overridden states, editable boundaries and audition. |
| Value/random range | Tracker, Tweakers | 1 range; 2 expanded | Two endpoints with filled interval; distribution preview for random fill. |
| Pattern fill/Euclidean rhythm | Tracker | 3–4 | Exact step preview for current strategy; Apply commits and Reroll changes seed. |
| Root + scale | Tracker | 2 | Keyboard highlights root and allowed notes. |
| Grain stream | Grasso | 4 | Parallel lane combines level, mode, offset and pitch; speed/enable/reverse nearby. |
| Visual effect stack | Tweakers | 3–4 | Ordered effect tiles with meaningful glyphs; select/edit/reorder/bypass/remove. |

## Time and signal presentations

| Candidate | Source | Proposed columns | Visual and behaviour |
| --- | --- | --- | --- |
| Tempo/division | Shared | 1–2 | Transport-driven beat marker; explicit free/synced state and subdivision spacing. |
| Grain density + size | Grasso | 2 | Capsule frequency and duration; identify schematic versus engine activity. |
| Scan position + rate | Grasso | 2 | Readhead travels over source while scanning, stops at current position. |
| Sling/run-up | Tracker | 3 | Lead-in approaches fixed beat marker; time, pitch and shape jointly visible. |
| Spring/easing | Tweakers | 2–3 | Existing curve with replayable moving specimen, no perpetual idle loop. |
| LFO/sample-and-hold | Modulation | 3–4 | Trace and phase marker show rate/depth/offset plus jitter/smoothing. |
| Curve sequence | Modulation | 4–8/editor | Existing composer with selected segment settings and playback position. |
| Modulation assignment | Tweakers, Move | Indicator/2 expanded | Source identity and separate base/driven value; real signal activity. |
| Meter/analyser | Tracker, Tweakers | 1/2–4 | Reuse measured levels, peaks and spectrum; editable settings remain separate. |

## Release boundaries

Slot graphics are an on-screen presentation. Preserve the bridge's existing
numeric and enum protocol; new graphical rendering on the physical Move screen
is separate work. Larger surfaces must reserve contiguous columns and account
for the eight-knob limit before being exposed as supported controls.
