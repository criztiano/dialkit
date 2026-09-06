"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/solid/index.ts
var solid_exports = {};
__export(solid_exports, {
  AnalyserVisualization: () => AnalyserVisualization,
  ButtonGroup: () => ButtonGroup,
  Checkbox: () => Checkbox,
  ColorControl: () => ColorControl,
  ColorPickerPanel: () => ColorPickerPanel,
  ControlRenderer: () => ControlRenderer,
  ControlShell: () => ControlShell,
  CurveComposer: () => CurveComposer,
  DEFAULT_GRADIENT: () => import_gradient_core5.DEFAULT_GRADIENT,
  EasingVisualization: () => EasingVisualization,
  Folder: () => Folder,
  GradientControl: () => GradientControl,
  GradientPanel: () => GradientPanel,
  Module: () => Module,
  NumberControl: () => NumberControl,
  PresetManager: () => PresetManager,
  RangeSlider: () => RangeSlider,
  SegmentedControl: () => SegmentedControl,
  SelectControl: () => SelectControl,
  Slider: () => Slider,
  SpringControl: () => SpringControl,
  SpringVisualization: () => SpringVisualization,
  TextControl: () => TextControl,
  TimelineToggleButton: () => TimelineToggleButton,
  Toggle: () => Toggle,
  TransitionControl: () => TransitionControl,
  TweakRoot: () => TweakRoot,
  TweakStore: () => import_store12.TweakStore,
  TweakTimeline: () => TweakTimeline,
  WaveformVisualization: () => WaveformVisualization,
  XYControl: () => XYControl,
  XYPad: () => XYPad,
  XY_DEFAULT_STEP: () => import_xy_pad_core2.XY_DEFAULT_STEP,
  XY_DETENT_PX: () => import_xy_pad_core2.XY_DETENT_PX,
  applyDetentAxis: () => import_xy_pad_core2.applyDetentAxis,
  centerValue: () => import_xy_pad_core2.centerValue,
  clamp: () => import_xy_pad_core2.clamp,
  createTweakTimeline: () => createTweakTimeline,
  createTweakers: () => createTweakers,
  gradientToCss: () => import_gradient_core5.gradientToCss,
  invertY: () => import_xy_pad_core2.invertY,
  normToValue: () => import_xy_pad_core2.normToValue,
  normalizeValue: () => import_xy_pad_core2.normalizeValue,
  nudge: () => import_xy_pad_core2.nudge,
  pointFromValue: () => import_xy_pad_core2.pointFromValue,
  resolveAxis: () => import_xy_pad_core2.resolveAxis,
  snapToStep: () => import_xy_pad_core2.snapToStep,
  springify: () => import_curve_composer_core2.springify,
  valueFromPoint: () => import_xy_pad_core2.valueFromPoint,
  valueToNorm: () => import_xy_pad_core2.valueToNorm
});
module.exports = __toCommonJS(solid_exports);

// src/solid/createTweakers.ts
var import_solid_js = require("solid-js");
var import_store = require("tweakers/store");
var import_gradient_core = require("tweakers/gradient-core");
function createTweakers(name, config, options) {
  const id = (0, import_solid_js.createUniqueId)();
  const panelId = `${name}-${id}`;
  const [values, setValues] = (0, import_solid_js.createSignal)(
    import_store.TweakStore.getValues(panelId)
  );
  (0, import_solid_js.onMount)(() => {
    import_store.TweakStore.registerPanel(panelId, name, config, options?.shortcuts, {
      hints: options?.hints,
      affordances: options?.affordances,
      labels: options?.labels
    });
    setValues(import_store.TweakStore.getValues(panelId));
    const unsubValues = import_store.TweakStore.subscribe(panelId, () => {
      setValues(import_store.TweakStore.getValues(panelId));
    });
    const unsubActions = options?.onAction ? import_store.TweakStore.subscribeActions(panelId, options.onAction) : void 0;
    (0, import_solid_js.onCleanup)(() => {
      unsubValues();
      unsubActions?.();
      import_store.TweakStore.unregisterPanel(panelId);
    });
  });
  (0, import_solid_js.createEffect)(() => {
    const declared = options?.presets;
    import_store.TweakStore.setPresetsHidden(panelId, declared === false);
    const provider = declared === false ? null : declared ?? null;
    if (provider) JSON.stringify(provider);
    import_store.TweakStore.setPresetProvider(panelId, provider);
  });
  return (0, import_solid_js.createMemo)(() => buildResolvedValues(config, values(), ""));
}
function buildResolvedValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed" || key === "_collapsible") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === "number") {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === "number" || typeof configValue === "boolean" || typeof configValue === "string") {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "#000000";
    } else if (isGradientConfig(configValue)) {
      result[key] = flatValues[path] ?? (0, import_gradient_core.normalizeGradient)(configValue.default ?? import_gradient_core.DEFAULT_GRADIENT);
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "";
    } else if (typeof configValue === "object" && configValue !== null) {
      result[key] = buildResolvedValues(configValue, flatValues, path);
    }
  }
  return result;
}
function hasType(value, type) {
  return typeof value === "object" && value !== null && "type" in value && value.type === type;
}
function isSpringConfig(value) {
  return hasType(value, "spring");
}
function isActionConfig(value) {
  return hasType(value, "action");
}
function isSelectConfig(value) {
  return hasType(value, "select") && "options" in value && Array.isArray(value.options);
}
function isColorConfig(value) {
  return hasType(value, "color");
}
function isGradientConfig(value) {
  return hasType(value, "gradient");
}
function isTextConfig(value) {
  return hasType(value, "text");
}
function getFirstOptionValue(options) {
  const first = options[0];
  return typeof first === "string" ? first : first.value;
}

// src/solid/createTweakTimeline.ts
var import_solid_js2 = require("solid-js");
var import_web = require("solid-js/web");
var import_store2 = require("tweakers/store");
var import_timeline = require("tweakers/timeline");
var import_timeline2 = require("tweakers/timeline");
function createTweakTimeline(name, config, options) {
  const instanceId = (0, import_solid_js2.createUniqueId)();
  const hasStableId = options?.id !== void 0;
  const panelId = options?.id ?? `${name}-${instanceId}`;
  const parsed = (0, import_solid_js2.createMemo)(() => (0, import_timeline2.parseTimelineConfig)(config));
  const [flatValues, setFlatValues] = (0, import_solid_js2.createSignal)(import_store2.TweakStore.getValues(panelId));
  const [transport, setTransport] = (0, import_solid_js2.createSignal)(import_timeline.TimelineStore.getTransport(panelId));
  const [loopRegion, setLoopRegion] = (0, import_solid_js2.createSignal)(
    import_timeline.TimelineStore.getLoopRegion(panelId)
  );
  const staticTimeline = (0, import_solid_js2.createMemo)(() => (0, import_timeline2.computeStaticTimeline)(parsed(), flatValues()));
  let mounted = false;
  const play = () => import_timeline.TimelineStore.play(panelId);
  const pause = () => import_timeline.TimelineStore.pause(panelId);
  const replay = () => import_timeline.TimelineStore.replay(panelId);
  const seek = (time) => import_timeline.TimelineStore.seek(panelId, time);
  if (!import_web.isServer) {
    const unsubscribeValues = import_store2.TweakStore.subscribe(panelId, () => {
      setFlatValues(import_store2.TweakStore.getValues(panelId));
    });
    const unsubscribeTransport = import_timeline.TimelineStore.subscribe(panelId, () => {
      setTransport(import_timeline.TimelineStore.getTransport(panelId));
      setLoopRegion(import_timeline.TimelineStore.getLoopRegion(panelId));
    });
    (0, import_solid_js2.onCleanup)(() => {
      unsubscribeValues();
      unsubscribeTransport();
    });
  }
  (0, import_solid_js2.onMount)(() => {
    import_store2.TweakStore.registerPanel(panelId, name, parsed().tweakConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    setFlatValues(import_store2.TweakStore.getValues(panelId));
    const currentStatic = staticTimeline();
    import_timeline.TimelineStore.register(
      (0, import_timeline2.buildTimelineMeta)(panelId, name, currentStatic.duration, parsed(), options?.loop),
      { autoplay: options?.autoplay ?? true, persist: options?.persist }
    );
    setTransport(import_timeline.TimelineStore.getTransport(panelId));
    setLoopRegion(import_timeline.TimelineStore.getLoopRegion(panelId));
    mounted = true;
    (0, import_solid_js2.onCleanup)(() => {
      mounted = false;
      import_timeline.TimelineStore.unregister(panelId);
      import_store2.TweakStore.unregisterPanel(panelId);
    });
  });
  (0, import_solid_js2.createEffect)(() => {
    const currentParsed = parsed();
    const currentStatic = staticTimeline();
    if (!mounted) return;
    import_timeline.TimelineStore.update(
      (0, import_timeline2.buildTimelineMeta)(panelId, name, currentStatic.duration, currentParsed, options?.loop)
    );
  });
  return (0, import_solid_js2.createMemo)(() => {
    const currentStatic = staticTimeline();
    const region = loopRegion();
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return (0, import_timeline2.buildTimelineValues)(
      currentStatic.clips,
      transport(),
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}

// src/solid/components/TweakRoot.tsx
var import_web198 = require("solid-js/web");
var import_web199 = require("solid-js/web");
var import_web200 = require("solid-js/web");
var import_web201 = require("solid-js/web");
var import_web202 = require("solid-js/web");
var import_web203 = require("solid-js/web");
var import_solid_js27 = require("solid-js");
var import_web204 = require("solid-js/web");
var import_store10 = require("tweakers/store");
var import_timeline4 = require("tweakers/timeline");

// src/solid/components/ShortcutListener.tsx
var import_web2 = require("solid-js/web");
var import_solid_js3 = require("solid-js");
var import_store3 = require("tweakers/store");
var import_shortcut_utils = require("tweakers/shortcut-utils");
var defaultState = {
  activePanelId: null,
  activePath: null
};
var ShortcutContext = (0, import_solid_js3.createContext)(() => defaultState);
function useShortcutContext() {
  return (0, import_solid_js3.useContext)(ShortcutContext);
}
function ShortcutListener(props) {
  const [activeShortcut, setActiveShortcut] = (0, import_solid_js3.createSignal)(defaultState);
  const activeKeys = /* @__PURE__ */ new Set();
  let isDragging = false;
  let lastMouseX = null;
  let dragAccumulator = 0;
  const resolveActiveTarget = (interaction) => {
    for (const key of activeKeys) {
      const panels = import_store3.TweakStore.getPanels();
      for (const panel of panels) {
        for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
          if (!shortcut.key) continue;
          if (shortcut.key.toLowerCase() !== key) continue;
          if ((shortcut.interaction ?? "scroll") !== interaction) continue;
          const control = import_store3.TweakStore.getPanel(panel.id)?.controls ? (0, import_shortcut_utils.findControl)(panel.controls, path) : null;
          if (control && control.type === "slider") {
            return {
              panelId: panel.id,
              path,
              control,
              shortcut
            };
          }
        }
      }
    }
    return null;
  };
  (0, import_solid_js3.onMount)(() => {
    const handleKeyDown = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeys.size > 0) {
          const target2 = resolveActiveTarget("scroll") || resolveActiveTarget("drag") || resolveActiveTarget("move");
          if (target2 && target2.control.type === "slider") {
            e.preventDefault();
            const direction = key === "arrowright" || key === "arrowup" ? 1 : -1;
            const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(target2.control, target2.shortcut);
            (0, import_shortcut_utils.applySliderDelta)(target2.panelId, target2.path, target2.control, effectiveStep, direction);
            return;
          }
        }
      }
      const wasAlreadyHeld = activeKeys.has(key);
      activeKeys.add(key);
      const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
      const target = import_store3.TweakStore.resolveShortcutTarget(key, modifier);
      if (target) {
        setActiveShortcut({
          activePanelId: target.panelId,
          activePath: target.path
        });
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = import_store3.TweakStore.getValue(target.panelId, target.path);
          import_store3.TweakStore.updateValue(target.panelId, target.path, !currentValue);
        }
      }
      if (!wasAlreadyHeld) {
        lastMouseX = null;
        dragAccumulator = 0;
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      activeKeys.delete(key);
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
      if (activeKeys.size === 0) {
        setActiveShortcut({
          activePanelId: null,
          activePath: null
        });
      } else {
        let found = false;
        for (const remainingKey of activeKeys) {
          const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
          const target = import_store3.TweakStore.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            setActiveShortcut({
              activePanelId: target.panelId,
              activePath: target.path
            });
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveShortcut({
            activePanelId: null,
            activePath: null
          });
        }
      }
    };
    const handleWheel = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
      if (activeKeys.size > 0) {
        for (const key of activeKeys) {
          const target = import_store3.TweakStore.resolveShortcutTarget(key, modifier);
          if (!target) continue;
          const {
            panelId,
            path,
            control
          } = target;
          const interaction = control.shortcut?.interaction ?? "scroll";
          if (interaction !== "scroll" || control.type !== "slider") continue;
          e.preventDefault();
          const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(control, control.shortcut);
          const direction = e.deltaY > 0 ? 1 : -1;
          (0, import_shortcut_utils.applySliderDelta)(panelId, path, control, effectiveStep, direction);
          return;
        }
      }
      const scrollOnlyTargets = import_store3.TweakStore.resolveScrollOnlyTargets();
      for (const {
        panelId,
        path,
        control,
        shortcut
      } of scrollOnlyTargets) {
        if (control.type !== "slider") continue;
        e.preventDefault();
        const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(control, shortcut);
        const direction = e.deltaY > 0 ? 1 : -1;
        (0, import_shortcut_utils.applySliderDelta)(panelId, path, control, effectiveStep, direction);
        return;
      }
    };
    const handleMouseDown = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      if (activeKeys.size === 0) return;
      const target = resolveActiveTarget("drag");
      if (target) {
        isDragging = true;
        lastMouseX = e.clientX;
        dragAccumulator = 0;
        e.preventDefault();
      }
    };
    const handleMouseUp = () => {
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
    };
    const handleMouseMove = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      if (activeKeys.size === 0) return;
      if (isDragging) {
        const target = resolveActiveTarget("drag");
        if (target && lastMouseX !== null) {
          const deltaX = e.clientX - lastMouseX;
          lastMouseX = e.clientX;
          dragAccumulator += deltaX;
          const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulator / import_shortcut_utils.DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulator -= steps * import_shortcut_utils.DRAG_SENSITIVITY;
            (0, import_shortcut_utils.applySliderDelta)(target.panelId, target.path, target.control, effectiveStep, steps);
          }
        }
        return;
      }
      const moveTarget = resolveActiveTarget("move");
      if (moveTarget) {
        if (lastMouseX === null) {
          lastMouseX = e.clientX;
          return;
        }
        const deltaX = e.clientX - lastMouseX;
        lastMouseX = e.clientX;
        dragAccumulator += deltaX;
        const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulator / import_shortcut_utils.DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulator -= steps * import_shortcut_utils.DRAG_SENSITIVITY;
          (0, import_shortcut_utils.applySliderDelta)(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep, steps);
        }
      }
    };
    const handleWindowBlur = () => {
      activeKeys.clear();
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
      setActiveShortcut({
        activePanelId: null,
        activePath: null
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, {
      passive: false
    });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleWindowBlur);
    (0, import_solid_js3.onCleanup)(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    });
  });
  return (0, import_web2.createComponent)(ShortcutContext.Provider, {
    value: activeShortcut,
    get children() {
      return props.children;
    }
  });
}

// src/solid/components/Panel.tsx
var import_web184 = require("solid-js/web");
var import_web185 = require("solid-js/web");
var import_web186 = require("solid-js/web");
var import_web187 = require("solid-js/web");
var import_web188 = require("solid-js/web");
var import_web189 = require("solid-js/web");
var import_web190 = require("solid-js/web");
var import_web191 = require("solid-js/web");
var import_solid_js25 = require("solid-js");
var import_motion8 = require("motion");
var import_icons5 = require("tweakers/icons");
var import_store9 = require("tweakers/store");

// src/solid/components/Folder.tsx
var import_web7 = require("solid-js/web");
var import_web8 = require("solid-js/web");
var import_web9 = require("solid-js/web");
var import_web10 = require("solid-js/web");
var import_web11 = require("solid-js/web");
var import_web12 = require("solid-js/web");
var import_web13 = require("solid-js/web");
var import_web14 = require("solid-js/web");
var import_web15 = require("solid-js/web");
var import_web16 = require("solid-js/web");
var import_web17 = require("solid-js/web");
var import_solid_js4 = require("solid-js");
var import_motion = require("motion");
var import_icons = require("tweakers/icons");

// src/solid/components/Checkbox.tsx
var import_web3 = require("solid-js/web");
var import_web4 = require("solid-js/web");
var import_web5 = require("solid-js/web");
var import_web6 = require("solid-js/web");
var _tmpl$ = /* @__PURE__ */ (0, import_web3.template)(`<button type=button role=checkbox class=tweakers-checkbox><svg viewBox="0 0 22 22"width=22 height=22 aria-hidden=true><path class=tweakers-checkbox-slash d="M6 16 16 6"fill=none></path><rect class=tweakers-checkbox-chip x=5 y=5 width=12 height=12 rx=2></rect><path class=tweakers-checkbox-dash d="M6 11h10"fill=none>`);
function Checkbox(props) {
  const disabled = () => props.disabled ?? false;
  return (() => {
    var _el$ = _tmpl$();
    _el$.$$click = (e) => {
      e.stopPropagation();
      if (!disabled()) props.onChange(!props.checked);
    };
    (0, import_web6.effect)((_p$) => {
      var _v$ = props.id, _v$2 = disabled() ? "mixed" : props.checked, _v$3 = props.label, _v$4 = disabled() || void 0, _v$5 = props.checked && !disabled() ? "true" : void 0, _v$6 = disabled() ? "true" : void 0;
      _v$ !== _p$.e && (0, import_web5.setAttribute)(_el$, "id", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web5.setAttribute)(_el$, "aria-checked", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web5.setAttribute)(_el$, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web5.setAttribute)(_el$, "aria-disabled", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web5.setAttribute)(_el$, "data-checked", _p$.i = _v$5);
      _v$6 !== _p$.n && (0, import_web5.setAttribute)(_el$, "data-disabled", _p$.n = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    });
    return _el$;
  })();
}
(0, import_web4.delegateEvents)(["click"]);

// src/solid/components/Folder.tsx
var _tmpl$2 = /* @__PURE__ */ (0, import_web7.template)(`<div class=tweakers-panel-toolbar>`);
var _tmpl$22 = /* @__PURE__ */ (0, import_web7.template)(`<span class=tweakers-hint role=tooltip>`);
var _tmpl$3 = /* @__PURE__ */ (0, import_web7.template)(`<div class=tweakers-folder-content><div class=tweakers-folder-inner>`);
var _tmpl$4 = /* @__PURE__ */ (0, import_web7.template)(`<div><div><div class=tweakers-folder-header-top>`);
var _tmpl$5 = /* @__PURE__ */ (0, import_web7.template)(`<div class=tweakers-folder-title-row><span class="tweakers-folder-title tweakers-folder-title-root">`);
var _tmpl$6 = /* @__PURE__ */ (0, import_web7.template)(`<div class=tweakers-folder-title-row><span class=tweakers-folder-title>`);
var _tmpl$7 = /* @__PURE__ */ (0, import_web7.template)(`<svg class=tweakers-panel-icon viewBox="0 0 16 16"fill=none><path opacity=0.5 fill=currentColor></path><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25>`);
var _tmpl$8 = /* @__PURE__ */ (0, import_web7.template)(`<svg class=tweakers-folder-icon viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$9 = /* @__PURE__ */ (0, import_web7.template)(`<div class="tweakers-panel-inner tweakers-panel-inline">`);
var _tmpl$0 = /* @__PURE__ */ (0, import_web7.template)(`<div class=tweakers-panel-inner>`);
function Folder(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js4.createSignal)(props.defaultOpen ?? true);
  const [isCollapsed, setIsCollapsed] = (0, import_solid_js4.createSignal)(!(props.defaultOpen ?? true));
  const [contentHeight, setContentHeight] = (0, import_solid_js4.createSignal)(void 0);
  const [windowHeight, setWindowHeight] = (0, import_solid_js4.createSignal)(typeof window !== "undefined" ? window.innerHeight : 800);
  const isModule = () => !!props.isRoot && props.enabled !== void 0 && props.onEnabledChange !== void 0;
  const bodyOpen = () => isOpen() && (!isModule() || !!props.enabled);
  if (props.isRoot) {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    (0, import_solid_js4.onCleanup)(() => window.removeEventListener("resize", onResize));
  }
  const [contentMounted, setContentMounted] = (0, import_solid_js4.createSignal)(props.defaultOpen ?? true);
  let skipFirstAnim = props.defaultOpen ?? true;
  let sectionContentRef;
  let sectionAnim = null;
  let folderChevronRef;
  let chevronAnim = null;
  let chevronInitialized = false;
  let panelTapAnim = null;
  let contentRef;
  (0, import_solid_js4.createEffect)(() => {
    if (!props.isRoot || !isOpen()) return;
    const el = contentRef;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      setContentHeight((prev) => prev === h ? prev : h);
    });
    ro.observe(el);
    (0, import_solid_js4.onCleanup)(() => ro.disconnect());
  });
  (0, import_solid_js4.createEffect)(() => {
    if (props.isRoot || !folderChevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    if (!chevronInitialized) {
      folderChevronRef.style.transform = `rotate(${open ? 0 : 180}deg)`;
      chevronInitialized = true;
      return;
    }
    chevronAnim = (0, import_motion.animate)(folderChevronRef, {
      rotate: open ? 0 : 180
    }, {
      type: "spring",
      visualDuration: 0.35,
      bounce: 0.15
    });
    (0, import_solid_js4.onCleanup)(() => chevronAnim?.stop());
  });
  const handleToggle = () => {
    if (props.collapsible === false) return;
    if (props.inline && props.isRoot) return;
    const next = !isOpen();
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
      if (!props.isRoot) {
        sectionAnim?.stop();
        sectionAnim = null;
        if (sectionContentRef) {
          sectionAnim = (0, import_motion.animate)(sectionContentRef, {
            height: "auto",
            opacity: 1
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              sectionAnim = null;
            }
          });
        } else {
          setContentMounted(true);
        }
      }
    } else {
      setIsCollapsed(true);
      if (!props.isRoot) {
        if (sectionContentRef) {
          const currentHeight = sectionContentRef.getBoundingClientRect().height;
          sectionContentRef.style.height = `${currentHeight}px`;
          sectionAnim?.stop();
          sectionAnim = (0, import_motion.animate)(sectionContentRef, {
            height: 0,
            opacity: 0
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              setContentMounted(false);
              sectionAnim = null;
              sectionContentRef = void 0;
            }
          });
        } else {
          setContentMounted(false);
        }
      }
    }
    props.onOpenChange?.(next);
  };
  const folderContent = () => (() => {
    var _el$ = _tmpl$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
    (0, import_web17.use)((el) => {
      if (props.isRoot) contentRef = el;
    }, _el$);
    (0, import_web16.addEventListener)(_el$2, "click", props.collapsible === false ? void 0 : handleToggle, true);
    (0, import_web14.insert)(_el$3, (() => {
      var _c$ = (0, import_web15.memo)(() => !!props.isRoot);
      return () => _c$() ? (0, import_web13.createComponent)(import_solid_js4.Show, {
        get when() {
          return isOpen();
        },
        get children() {
          var _el$8 = _tmpl$5(), _el$9 = _el$8.firstChild;
          (0, import_web14.insert)(_el$8, (0, import_web13.createComponent)(import_solid_js4.Show, {
            get when() {
              return isModule();
            },
            get children() {
              return (0, import_web13.createComponent)(Checkbox, {
                get checked() {
                  return props.enabled;
                },
                get onChange() {
                  return props.onEnabledChange;
                },
                get label() {
                  return props.title;
                }
              });
            }
          }), _el$9);
          (0, import_web14.insert)(_el$9, () => props.title);
          return _el$8;
        }
      }) : (() => {
        var _el$0 = _tmpl$6(), _el$1 = _el$0.firstChild;
        (0, import_web14.insert)(_el$1, () => props.title);
        return _el$0;
      })();
    })(), null);
    (0, import_web14.insert)(_el$3, (() => {
      var _c$2 = (0, import_web15.memo)(() => !!(props.isRoot && !props.inline));
      return () => _c$2() && (() => {
        var _el$10 = _tmpl$7(), _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
        (0, import_web12.effect)((_p$) => {
          var _v$5 = import_icons.ICON_PANEL.path, _v$6 = import_icons.ICON_PANEL.circles[0].cx, _v$7 = import_icons.ICON_PANEL.circles[0].cy, _v$8 = import_icons.ICON_PANEL.circles[0].r, _v$9 = import_icons.ICON_PANEL.circles[1].cx, _v$0 = import_icons.ICON_PANEL.circles[1].cy, _v$1 = import_icons.ICON_PANEL.circles[1].r, _v$10 = import_icons.ICON_PANEL.circles[2].cx, _v$11 = import_icons.ICON_PANEL.circles[2].cy, _v$12 = import_icons.ICON_PANEL.circles[2].r;
          _v$5 !== _p$.e && (0, import_web11.setAttribute)(_el$11, "d", _p$.e = _v$5);
          _v$6 !== _p$.t && (0, import_web11.setAttribute)(_el$12, "cx", _p$.t = _v$6);
          _v$7 !== _p$.a && (0, import_web11.setAttribute)(_el$12, "cy", _p$.a = _v$7);
          _v$8 !== _p$.o && (0, import_web11.setAttribute)(_el$12, "r", _p$.o = _v$8);
          _v$9 !== _p$.i && (0, import_web11.setAttribute)(_el$13, "cx", _p$.i = _v$9);
          _v$0 !== _p$.n && (0, import_web11.setAttribute)(_el$13, "cy", _p$.n = _v$0);
          _v$1 !== _p$.s && (0, import_web11.setAttribute)(_el$13, "r", _p$.s = _v$1);
          _v$10 !== _p$.h && (0, import_web11.setAttribute)(_el$14, "cx", _p$.h = _v$10);
          _v$11 !== _p$.r && (0, import_web11.setAttribute)(_el$14, "cy", _p$.r = _v$11);
          _v$12 !== _p$.d && (0, import_web11.setAttribute)(_el$14, "r", _p$.d = _v$12);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0,
          r: void 0,
          d: void 0
        });
        return _el$10;
      })();
    })(), null);
    (0, import_web14.insert)(_el$3, (() => {
      var _c$3 = (0, import_web15.memo)(() => !!(!props.isRoot && props.collapsible !== false));
      return () => _c$3() && (() => {
        var _el$15 = _tmpl$8(), _el$16 = _el$15.firstChild;
        var _ref$ = folderChevronRef;
        typeof _ref$ === "function" ? (0, import_web17.use)(_ref$, _el$15) : folderChevronRef = _el$15;
        (0, import_web11.setAttribute)(_el$16, "d", import_icons.ICON_CHEVRON);
        return _el$15;
      })();
    })(), null);
    (0, import_web14.insert)(_el$2, (0, import_web13.createComponent)(import_solid_js4.Show, {
      get when() {
        return (0, import_web15.memo)(() => !!(props.isRoot && props.toolbar))() && isOpen();
      },
      get children() {
        var _el$4 = _tmpl$2();
        _el$4.$$click = (e) => e.stopPropagation();
        (0, import_web14.insert)(_el$4, () => props.toolbar);
        return _el$4;
      }
    }), null);
    (0, import_web14.insert)(_el$2, (0, import_web13.createComponent)(import_solid_js4.Show, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$5 = _tmpl$22();
        (0, import_web14.insert)(_el$5, () => props.hint);
        (0, import_web12.effect)(() => (0, import_web11.setAttribute)(_el$5, "id", props.hintId));
        return _el$5;
      }
    }), null);
    (0, import_web14.insert)(_el$, (0, import_web13.createComponent)(import_solid_js4.Show, {
      get when() {
        return (0, import_web15.memo)(() => !!props.isRoot)() ? bodyOpen() : contentMounted();
      },
      get children() {
        var _el$6 = _tmpl$3(), _el$7 = _el$6.firstChild;
        (0, import_web17.use)((el) => {
          if (props.isRoot) return;
          sectionContentRef = el;
          if (skipFirstAnim) {
            skipFirstAnim = false;
            return;
          }
          sectionAnim?.stop();
          el.style.height = "0px";
          el.style.opacity = "0";
          sectionAnim = (0, import_motion.animate)(el, {
            height: "auto",
            opacity: 1
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              sectionAnim = null;
            }
          });
        }, _el$6);
        (0, import_web14.insert)(_el$7, () => props.children);
        (0, import_web12.effect)((_$p) => (0, import_web10.style)(_el$6, !props.isRoot ? {
          "clip-path": "inset(0 -20px)"
        } : void 0, _$p));
        return _el$6;
      }
    }), null);
    (0, import_web12.effect)((_p$) => {
      var _v$ = `tweakers-folder ${props.isRoot ? "tweakers-folder-root" : ""}`, _v$2 = `tweakers-folder-header ${props.isRoot ? "tweakers-panel-header" : ""} ${props.collapsible === false ? "tweakers-folder-header-static" : ""}`, _v$3 = props.hint ? "true" : void 0, _v$4 = props.hint ? props.hintId : void 0;
      _v$ !== _p$.e && (0, import_web9.className)(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web9.className)(_el$2, _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web11.setAttribute)(_el$2, "data-hint", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web11.setAttribute)(_el$2, "aria-describedby", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
  if (props.isRoot) {
    if (props.inline) {
      return (() => {
        var _el$17 = _tmpl$9();
        (0, import_web14.insert)(_el$17, folderContent);
        return _el$17;
      })();
    }
    let panelRef;
    let rootPanelAnim = null;
    let rootPanelInitialized = false;
    let lastRootOpen = isOpen();
    (0, import_solid_js4.createEffect)(() => {
      if (!panelRef || isOpen()) return;
      const handler = (e) => {
        e.stopPropagation();
        handleToggle();
      };
      panelRef.addEventListener("click", handler);
      (0, import_solid_js4.onCleanup)(() => panelRef.removeEventListener("click", handler));
    });
    (0, import_solid_js4.createEffect)(() => {
      if (!panelRef) return;
      const open = isOpen();
      const measuredOpenHeight = contentHeight() !== void 0 ? Math.min(contentHeight() + 10, windowHeight() - 32) : panelRef.getBoundingClientRect().height;
      const target = {
        width: open ? 280 : 42,
        height: open ? measuredOpenHeight : 42,
        borderRadius: open ? 14 : 21,
        boxShadow: open ? "var(--tweak-shadow)" : "var(--tweak-shadow-collapsed)"
      };
      panelRef.style.cursor = open ? "" : "pointer";
      panelRef.style.overflow = open ? "hidden auto" : "hidden";
      if (!rootPanelInitialized) {
        rootPanelInitialized = true;
        panelRef.style.width = `${target.width}px`;
        panelRef.style.height = `${target.height}px`;
        panelRef.style.borderRadius = `${target.borderRadius}px`;
        panelRef.style.boxShadow = target.boxShadow;
        lastRootOpen = open;
        return;
      }
      if (open !== lastRootOpen) {
        rootPanelAnim?.stop();
        rootPanelAnim = (0, import_motion.animate)(panelRef, target, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3,
          onComplete: () => {
            rootPanelAnim = null;
          }
        });
        lastRootOpen = open;
        return;
      }
      if (open) {
        panelRef.style.height = `${target.height}px`;
      }
    });
    (0, import_solid_js4.onCleanup)(() => {
      rootPanelAnim?.stop();
      panelTapAnim?.stop();
    });
    return (() => {
      var _el$18 = _tmpl$0();
      _el$18.addEventListener("pointerleave", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$18.addEventListener("pointercancel", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$18.$$pointerup = () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      _el$18.$$pointerdown = () => {
        if (isOpen()) return;
        document.activeElement?.blur?.();
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 0.9
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      var _ref$2 = panelRef;
      typeof _ref$2 === "function" ? (0, import_web17.use)(_ref$2, _el$18) : panelRef = _el$18;
      (0, import_web14.insert)(_el$18, folderContent);
      (0, import_web12.effect)(() => (0, import_web11.setAttribute)(_el$18, "data-collapsed", String(isCollapsed())));
      return _el$18;
    })();
  }
  return folderContent();
}
(0, import_web8.delegateEvents)(["click", "pointerdown", "pointerup"]);

// src/solid/components/ControlRenderer.tsx
var import_web168 = require("solid-js/web");
var import_web169 = require("solid-js/web");
var import_web170 = require("solid-js/web");
var import_web171 = require("solid-js/web");
var import_web172 = require("solid-js/web");
var import_web173 = require("solid-js/web");
var import_solid_js23 = require("solid-js");
var import_store7 = require("tweakers/store");

// src/solid/components/ModuleFolder.tsx
var import_web18 = require("solid-js/web");
var import_web19 = require("solid-js/web");
var import_web20 = require("solid-js/web");
var import_web21 = require("solid-js/web");
var import_web22 = require("solid-js/web");
var import_web23 = require("solid-js/web");
var import_solid_js5 = require("solid-js");
var _tmpl$10 = /* @__PURE__ */ (0, import_web18.template)(`<span class=tweakers-hint role=tooltip>`);
var _tmpl$23 = /* @__PURE__ */ (0, import_web18.template)(`<div class="tweakers-module tweakers-module-folder"><div class="tweakers-module-header tweakers-module-header-toggle"><span class=tweakers-module-title></span></div><div class=tweakers-module-collapse><div class=tweakers-module-collapse-clip><div class=tweakers-module-inner>`);
function ModuleFolder(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js5.createSignal)(props.defaultOpen ?? true);
  const handleEnabledChange = (next) => {
    props.onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return (() => {
    var _el$ = _tmpl$23(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$2.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild;
    _el$2.$$click = () => {
      if (props.enabled) setIsOpen((open) => !open);
    };
    (0, import_web22.insert)(_el$2, (0, import_web23.createComponent)(Checkbox, {
      get checked() {
        return props.enabled;
      },
      onChange: handleEnabledChange,
      get label() {
        return props.title;
      }
    }), _el$3);
    (0, import_web22.insert)(_el$3, () => props.title);
    (0, import_web22.insert)(_el$2, (0, import_web23.createComponent)(import_solid_js5.Show, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$4 = _tmpl$10();
        (0, import_web22.insert)(_el$4, () => props.hint);
        (0, import_web21.effect)(() => (0, import_web20.setAttribute)(_el$4, "id", props.hintId));
        return _el$4;
      }
    }), null);
    (0, import_web22.insert)(_el$7, () => props.children);
    (0, import_web21.effect)((_p$) => {
      var _v$ = props.enabled && isOpen() ? "true" : "false", _v$2 = props.hint ? "true" : void 0, _v$3 = props.hint ? props.hintId : void 0, _v$4 = props.enabled && isOpen();
      _v$ !== _p$.e && (0, import_web20.setAttribute)(_el$, "data-open", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web20.setAttribute)(_el$2, "data-hint", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web20.setAttribute)(_el$2, "aria-describedby", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web20.setAttribute)(_el$5, "data-open", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
(0, import_web19.delegateEvents)(["click"]);

// src/solid/components/ControlShell.tsx
var import_web24 = require("solid-js/web");
var import_web25 = require("solid-js/web");
var import_web26 = require("solid-js/web");
var import_web27 = require("solid-js/web");
var import_web28 = require("solid-js/web");
var import_web29 = require("solid-js/web");
var import_web30 = require("solid-js/web");
var import_web31 = require("solid-js/web");
var import_web32 = require("solid-js/web");
var import_web33 = require("solid-js/web");
var import_solid_js6 = require("solid-js");
var import_web34 = require("solid-js/web");
var import_store4 = require("tweakers/store");
var import_affordance_core = require("tweakers/affordance-core");
var _tmpl$11 = /* @__PURE__ */ (0, import_web24.template)(`<span class=tweakers-hint role=tooltip>`);
var _tmpl$24 = /* @__PURE__ */ (0, import_web24.template)(`<button type=button class=tweakers-affordance-dot>`);
var _tmpl$32 = /* @__PURE__ */ (0, import_web24.template)(`<div class=tweakers-control-tip>`);
var _tmpl$42 = /* @__PURE__ */ (0, import_web24.template)(`<div class=tweakers-affordance-popover role=dialog tabindex=-1><span class=tweakers-affordance-popover-title>`);
function ControlShell(props) {
  const hasAffordance = () => Boolean(props.affordance && props.panelId && props.path);
  const label = () => props.affordance?.label ?? "Options";
  const [open, setOpen] = (0, import_solid_js6.createSignal)(false);
  const [status, setStatus] = (0, import_solid_js6.createSignal)("off");
  const [disabled, setDisabled] = (0, import_solid_js6.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js6.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js6.createSignal)(null);
  let dotEl;
  let popoverEl;
  (0, import_solid_js6.createEffect)(() => {
    const panelId = props.panelId;
    const path = props.path;
    if (!panelId || !path) return;
    const read = () => {
      setStatus(import_store4.TweakStore.getAffordanceStatus(panelId, path));
      setDisabled(import_store4.TweakStore.isDisabled(panelId, path));
    };
    read();
    (0, import_solid_js6.onCleanup)(import_store4.TweakStore.subscribeControlState(panelId, read));
  });
  (0, import_solid_js6.createEffect)(() => {
    if (!dotEl) return;
    setPortalTarget(dotEl.closest(".tweakers-root") ?? document.body);
  });
  const place = () => {
    const rect = dotEl?.getBoundingClientRect();
    if (!rect) return;
    const next = (0, import_affordance_core.placePopover)(rect, popoverEl?.offsetHeight ?? 0, window.innerHeight);
    setPos((cur) => cur && cur.top === next.top && cur.left === next.left ? cur : next);
  };
  (0, import_solid_js6.createEffect)(() => {
    if (!open()) {
      setPos(null);
      return;
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotEl?.contains(target) || popoverEl?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      dotEl?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    (0, import_solid_js6.onCleanup)(() => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  });
  (0, import_solid_js6.createEffect)(() => {
    if (open() && pos() && popoverEl) place();
  });
  (0, import_solid_js6.createEffect)(() => {
    if (!open() || !popoverEl) return;
    const first = popoverEl.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
    (first ?? popoverEl).focus();
  });
  const ctx = () => ({
    panelId: props.panelId,
    path: props.path,
    status: status(),
    setStatus: (next) => import_store4.TweakStore.setAffordanceStatus(props.panelId, props.path, next)
  });
  return [(() => {
    var _el$ = _tmpl$32();
    (0, import_web33.insert)(_el$, () => props.children, null);
    (0, import_web33.insert)(_el$, (0, import_web30.createComponent)(import_solid_js6.Show, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$2 = _tmpl$11();
        (0, import_web33.insert)(_el$2, () => props.hint);
        (0, import_web32.effect)(() => (0, import_web31.setAttribute)(_el$2, "id", props.id));
        return _el$2;
      }
    }), null);
    (0, import_web33.insert)(_el$, (0, import_web30.createComponent)(import_solid_js6.Show, {
      get when() {
        return hasAffordance();
      },
      get children() {
        var _el$3 = _tmpl$24();
        _el$3.$$click = () => setOpen(!open());
        var _ref$ = dotEl;
        typeof _ref$ === "function" ? (0, import_web29.use)(_ref$, _el$3) : dotEl = _el$3;
        (0, import_web32.effect)((_p$) => {
          var _v$ = status(), _v$2 = String(open()), _v$3 = label(), _v$4 = open();
          _v$ !== _p$.e && (0, import_web31.setAttribute)(_el$3, "data-status", _p$.e = _v$);
          _v$2 !== _p$.t && (0, import_web31.setAttribute)(_el$3, "data-open", _p$.t = _v$2);
          _v$3 !== _p$.a && (0, import_web31.setAttribute)(_el$3, "aria-label", _p$.a = _v$3);
          _v$4 !== _p$.o && (0, import_web31.setAttribute)(_el$3, "aria-expanded", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$3;
      }
    }), null);
    (0, import_web32.effect)((_p$) => {
      var _v$5 = props.hint ? "true" : void 0, _v$6 = hasAffordance() ? "true" : void 0, _v$7 = open() ? "true" : void 0, _v$8 = disabled() ? "true" : void 0, _v$9 = disabled() ? "true" : void 0, _v$0 = props.hint ? "group" : void 0, _v$1 = props.hint ? props.id : void 0, _v$10 = props.hint ? void 0 : props.title;
      _v$5 !== _p$.e && (0, import_web31.setAttribute)(_el$, "data-hint", _p$.e = _v$5);
      _v$6 !== _p$.t && (0, import_web31.setAttribute)(_el$, "data-affordance", _p$.t = _v$6);
      _v$7 !== _p$.a && (0, import_web31.setAttribute)(_el$, "data-affordance-open", _p$.a = _v$7);
      _v$8 !== _p$.o && (0, import_web31.setAttribute)(_el$, "data-disabled", _p$.o = _v$8);
      _v$9 !== _p$.i && (0, import_web31.setAttribute)(_el$, "aria-disabled", _p$.i = _v$9);
      _v$0 !== _p$.n && (0, import_web31.setAttribute)(_el$, "role", _p$.n = _v$0);
      _v$1 !== _p$.s && (0, import_web31.setAttribute)(_el$, "aria-describedby", _p$.s = _v$1);
      _v$10 !== _p$.h && (0, import_web31.setAttribute)(_el$, "title", _p$.h = _v$10);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    });
    return _el$;
  })(), (0, import_web30.createComponent)(import_solid_js6.Show, {
    get when() {
      return (0, import_web28.memo)(() => !!(open() && hasAffordance()))() && portalTarget();
    },
    get children() {
      return (0, import_web30.createComponent)(import_web34.Portal, {
        get mount() {
          return portalTarget();
        },
        get children() {
          var _el$4 = _tmpl$42(), _el$5 = _el$4.firstChild;
          var _ref$2 = popoverEl;
          typeof _ref$2 === "function" ? (0, import_web29.use)(_ref$2, _el$4) : popoverEl = _el$4;
          (0, import_web27.setStyleProperty)(_el$4, "width", `${import_affordance_core.AFFORDANCE_POPOVER_WIDTH}px`);
          (0, import_web33.insert)(_el$5, label);
          (0, import_web33.insert)(_el$4, (0, import_web30.createComponent)(import_web34.Dynamic, (0, import_web26.mergeProps)({
            get component() {
              return props.affordance.content;
            }
          }, ctx)), null);
          (0, import_web32.effect)((_p$) => {
            var _v$11 = label(), _v$12 = `${pos()?.left ?? 0}px`, _v$13 = `${pos()?.top ?? 0}px`, _v$14 = pos() ? void 0 : "hidden";
            _v$11 !== _p$.e && (0, import_web31.setAttribute)(_el$4, "aria-label", _p$.e = _v$11);
            _v$12 !== _p$.t && (0, import_web27.setStyleProperty)(_el$4, "left", _p$.t = _v$12);
            _v$13 !== _p$.a && (0, import_web27.setStyleProperty)(_el$4, "top", _p$.a = _v$13);
            _v$14 !== _p$.o && (0, import_web27.setStyleProperty)(_el$4, "visibility", _p$.o = _v$14);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$4;
        }
      });
    }
  })];
}
(0, import_web25.delegateEvents)(["click"]);

// src/solid/components/Slider.tsx
var import_web35 = require("solid-js/web");
var import_web36 = require("solid-js/web");
var import_web37 = require("solid-js/web");
var import_web38 = require("solid-js/web");
var import_web39 = require("solid-js/web");
var import_web40 = require("solid-js/web");
var import_web41 = require("solid-js/web");
var import_web42 = require("solid-js/web");
var import_web43 = require("solid-js/web");
var import_web44 = require("solid-js/web");
var import_solid_js7 = require("solid-js");
var import_motion2 = require("motion");
var import_shortcut_utils2 = require("tweakers/shortcut-utils");
var _tmpl$12 = /* @__PURE__ */ (0, import_web35.template)(`<div class=tweakers-slider-hashmark>`);
var _tmpl$25 = /* @__PURE__ */ (0, import_web35.template)(`<span>`);
var _tmpl$33 = /* @__PURE__ */ (0, import_web35.template)(`<div class=tweakers-slider-fill-area><div class=tweakers-slider-fill-vertical>`);
var _tmpl$43 = /* @__PURE__ */ (0, import_web35.template)(`<span class=tweakers-slider-label-vertical>`);
var _tmpl$52 = /* @__PURE__ */ (0, import_web35.template)(`<div><div>`);
var _tmpl$62 = /* @__PURE__ */ (0, import_web35.template)(`<div class=tweakers-slider-track><div class=tweakers-slider-fill></div><div class=tweakers-slider-handle style=opacity:0>`);
var _tmpl$72 = /* @__PURE__ */ (0, import_web35.template)(`<div class=tweakers-slider-hashmarks>`);
var _tmpl$82 = /* @__PURE__ */ (0, import_web35.template)(`<span class=tweakers-slider-label>`);
var _tmpl$92 = /* @__PURE__ */ (0, import_web35.template)(`<span class="tweakers-slider-value tweakers-slider-value-icon">`);
var _tmpl$02 = /* @__PURE__ */ (0, import_web35.template)(`<input type=text class=tweakers-slider-input>`);
var _tmpl$1 = /* @__PURE__ */ (0, import_web35.template)(`<span class=tweakers-slider-unit>`);
var _tmpl$102 = /* @__PURE__ */ (0, import_web35.template)(`<input type=text class="tweakers-slider-input tweakers-slider-input-vertical">`);
var CLICK_THRESHOLD = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var DETENT_PX = 6;
function Slider(props) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;
  const isVertical = () => props.orientation === "vertical";
  const resolvedOrigin = () => Math.min(max(), Math.max(min(), props.origin ?? (props.bipolar ? 0 : min())));
  const hasOrigin = () => resolvedOrigin() > min();
  const originPercent = () => (resolvedOrigin() - min()) / (max() - min()) * 100;
  let wrapperRef;
  let cardRef;
  let fillRef;
  let handleRef;
  let inputRef;
  const [isInteracting, setIsInteracting] = (0, import_solid_js7.createSignal)(false);
  const [isDragging, setIsDragging] = (0, import_solid_js7.createSignal)(false);
  const [isHovered, setIsHovered] = (0, import_solid_js7.createSignal)(false);
  const [isValueHovered, setIsValueHovered] = (0, import_solid_js7.createSignal)(false);
  const [isMetaHeld, setIsMetaHeld] = (0, import_solid_js7.createSignal)(false);
  const [isValueEditable, setIsValueEditable] = (0, import_solid_js7.createSignal)(false);
  const [showInput, setShowInput] = (0, import_solid_js7.createSignal)(false);
  const [inputValue, setInputValue] = (0, import_solid_js7.createSignal)("");
  const fillPercent = (0, import_motion2.motionValue)((props.value - min()) / (max() - min()) * 100);
  const rubberStretchPx = (0, import_motion2.motionValue)(0);
  const handleOpacityMv = (0, import_motion2.motionValue)(0);
  const fillStart = (pct) => hasOrigin() ? `${Math.min(pct, originPercent())}%` : "0%";
  const fillExtent = (pct) => hasOrigin() ? `${Math.abs(pct - originPercent())}%` : `${pct}%`;
  const handleLeft = (pct) => `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`;
  const applyFillStyles = (pct) => {
    if (fillRef) {
      if (isVertical()) {
        fillRef.style.bottom = fillStart(pct);
        fillRef.style.height = fillExtent(pct);
      } else {
        fillRef.style.left = fillStart(pct);
        fillRef.style.width = fillExtent(pct);
      }
    }
    if (!isVertical() && handleRef) handleRef.style.left = handleLeft(pct);
  };
  const applyRubberStyles = (stretch) => {
    if (!cardRef) return;
    const size = `calc(100% + ${Math.abs(stretch)}px)`;
    const shift = stretch < 0 ? stretch : 0;
    if (isVertical()) {
      cardRef.style.height = size;
      cardRef.style.transform = `translateY(${shift}px)`;
    } else {
      cardRef.style.width = size;
      cardRef.style.transform = `translateX(${shift}px)`;
    }
  };
  const applyHandleOpacity = (opacity) => {
    if (handleRef) handleRef.style.opacity = String(opacity);
  };
  (0, import_solid_js7.createEffect)(() => {
    if (!isInteracting() && !snapAnim) {
      fillPercent.jump((props.value - min()) / (max() - min()) * 100);
    }
  });
  const isActive = () => isInteracting() || isHovered();
  let pointerDownPos = null;
  let isClickFlag = true;
  let wrapperRect = null;
  let scaleVal = 1;
  let hoverTimeout = null;
  let snapAnim = null;
  let rubberAnim = null;
  let handleOpacityAnim = null;
  const trackExtent = () => {
    if (!wrapperRef) return 0;
    return isVertical() ? wrapperRef.offsetHeight : wrapperRef.offsetWidth;
  };
  const positionToValue = (clientX, clientY) => {
    if (!wrapperRect) return props.value;
    const screenPos = isVertical() ? clientY - wrapperRect.top : clientX - wrapperRect.left;
    const scenePos = screenPos / scaleVal;
    const nativeExtent = trackExtent() || (isVertical() ? wrapperRect.height : wrapperRect.width);
    let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
    if (isVertical()) percent = 1 - percent;
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };
  const percentFromValue = (v) => (v - min()) / (max() - min()) * 100;
  const applyDetent = (v) => {
    if (!hasOrigin()) return v;
    const extent = trackExtent();
    if (extent <= 0) return v;
    const detentValue = DETENT_PX / extent * (max() - min());
    return Math.abs(v - resolvedOrigin()) <= detentValue ? resolvedOrigin() : v;
  };
  const computeRubberStretch = (clientPos, sign) => {
    if (!wrapperRect) return 0;
    const nearEdge = isVertical() ? wrapperRect.top : wrapperRect.left;
    const farEdge = isVertical() ? wrapperRect.bottom : wrapperRect.right;
    const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
    const overflow = Math.max(0, distancePast - DEAD_ZONE);
    return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
  };
  const cancelInteraction = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    rubberStretchPx.jump(0);
    pointerDownPos = null;
  };
  const handlePointerDown = (e) => {
    if (showInput()) return;
    if (e.metaKey) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownPos = {
      x: e.clientX,
      y: e.clientY
    };
    isClickFlag = true;
    setIsInteracting(true);
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      const nativeExtent = trackExtent();
      const rectExtent = isVertical() ? wrapperRect.height : wrapperRect.width;
      scaleVal = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
    }
  };
  const handlePointerMove = (e) => {
    if (!isInteracting() || !pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      setIsDragging(true);
    }
    if (!isClickFlag) {
      if (wrapperRect) {
        const clientPos = isVertical() ? e.clientY : e.clientX;
        const nearEdge = isVertical() ? wrapperRect.top : wrapperRect.left;
        const farEdge = isVertical() ? wrapperRect.bottom : wrapperRect.right;
        if (clientPos < nearEdge) {
          rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
        } else if (clientPos > farEdge) {
          rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
        } else {
          rubberStretchPx.jump(0);
        }
      }
      const newValue = applyDetent(positionToValue(e.clientX, e.clientY));
      const newPct = percentFromValue(newValue);
      if (snapAnim) {
        snapAnim.stop();
        snapAnim = null;
      }
      fillPercent.jump(newPct);
      props.onChange((0, import_shortcut_utils2.roundValue)(newValue, step()));
    }
  };
  const handlePointerUp = (e) => {
    if (!isInteracting()) return;
    if (isClickFlag) {
      const rawValue = positionToValue(e.clientX, e.clientY);
      const discreteSteps2 = (max() - min()) / step();
      const snappedValue = discreteSteps2 <= 10 ? Math.max(min(), Math.min(max(), min() + Math.round((rawValue - min()) / step()) * step())) : (0, import_shortcut_utils2.snapToDecile)(rawValue, min(), max());
      const newPct = percentFromValue(snappedValue);
      if (snapAnim) snapAnim.stop();
      snapAnim = (0, import_motion2.animate)(fillPercent, newPct, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          snapAnim = null;
        }
      });
      props.onChange((0, import_shortcut_utils2.roundValue)(snappedValue, step()));
    }
    if (rubberStretchPx.get() !== 0) {
      if (rubberAnim) rubberAnim.stop();
      rubberAnim = (0, import_motion2.animate)(rubberStretchPx, 0, {
        type: "spring",
        visualDuration: 0.35,
        bounce: 0.15
      });
    }
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
  };
  const handlePointerCancel = () => {
    cancelInteraction();
  };
  let wheelValue = props.value;
  (0, import_solid_js7.createEffect)(() => {
    wheelValue = props.value;
  });
  (0, import_solid_js7.onMount)(() => {
    const onWheel = (e) => {
      if (showInput()) return;
      e.preventDefault();
      e.stopPropagation();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;
      const stepMultiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step() * stepMultiplier;
      const next = (0, import_shortcut_utils2.roundValue)(Math.max(min(), Math.min(max(), wheelValue + delta)), step());
      wheelValue = next;
      if (snapAnim) {
        snapAnim.stop();
        snapAnim = null;
      }
      fillPercent.jump(percentFromValue(next));
      props.onChange(next);
    };
    wrapperRef.addEventListener("wheel", onWheel, {
      passive: false
    });
    (0, import_solid_js7.onCleanup)(() => wrapperRef.removeEventListener("wheel", onWheel));
  });
  (0, import_solid_js7.createEffect)(() => {
    if (!isHovered()) {
      setIsMetaHeld(false);
      return;
    }
    const sync = (e) => setIsMetaHeld(e.metaKey);
    const clear = () => setIsMetaHeld(false);
    window.addEventListener("keydown", sync);
    window.addEventListener("keyup", sync);
    window.addEventListener("blur", clear);
    (0, import_solid_js7.onCleanup)(() => {
      window.removeEventListener("keydown", sync);
      window.removeEventListener("keyup", sync);
      window.removeEventListener("blur", clear);
    });
  });
  (0, import_solid_js7.createEffect)(() => {
    const hovered = isValueHovered();
    const editing = showInput();
    const editable = isValueEditable();
    (0, import_solid_js7.onCleanup)(() => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });
    if (hovered && !editing && !editable) {
      hoverTimeout = setTimeout(() => setIsValueEditable(true), 800);
    } else if (!hovered && !editing) {
      setIsValueEditable(false);
    }
  });
  (0, import_solid_js7.onCleanup)(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    snapAnim?.stop();
    rubberAnim?.stop();
    handleOpacityAnim?.stop();
  });
  (0, import_solid_js7.onMount)(() => {
    const unsubFill = fillPercent.on("change", applyFillStyles);
    const unsubRubber = rubberStretchPx.on("change", applyRubberStyles);
    const unsubHandleOpacity = handleOpacityMv.on("change", applyHandleOpacity);
    applyFillStyles(fillPercent.get());
    applyRubberStyles(rubberStretchPx.get());
    applyHandleOpacity(handleOpacityMv.get());
    (0, import_solid_js7.onCleanup)(() => {
      unsubFill();
      unsubRubber();
      unsubHandleOpacity();
    });
  });
  (0, import_solid_js7.createEffect)(() => {
    const targetOpacity = isDragging() ? 0.9 : 0;
    handleOpacityAnim?.stop();
    handleOpacityAnim = (0, import_motion2.animate)(handleOpacityMv, targetOpacity, {
      duration: 0.15
    });
  });
  (0, import_solid_js7.createEffect)(() => {
    if (showInput() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      const clamped = Math.max(min(), Math.min(max(), parsed));
      props.onChange((0, import_shortcut_utils2.roundValue)(clamped, step()));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };
  const handleValueClick = (e) => {
    if (isValueEditable() || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(props.value.toFixed((0, import_shortcut_utils2.decimalsForStep)(step())));
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputSubmit();
    else if (e.key === "Escape") {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };
  const displayValue = () => props.formatValue ? props.formatValue(props.value) : props.value.toFixed((0, import_shortcut_utils2.decimalsForStep)(step()));
  const discreteSteps = () => (max() - min()) / step();
  const hashMarks = () => {
    const ds = discreteSteps();
    if (ds <= 10) {
      return Array.from({
        length: ds - 1
      }, (_, i) => {
        const pct = (i + 1) * step() / (max() - min()) * 100;
        return (() => {
          var _el$ = _tmpl$12();
          (0, import_web44.setStyleProperty)(_el$, "left", `${pct}%`);
          return _el$;
        })();
      });
    }
    return Array.from({
      length: 9
    }, (_, i) => {
      const pct = (i + 1) * 10;
      return (() => {
        var _el$2 = _tmpl$12();
        (0, import_web44.setStyleProperty)(_el$2, "left", `${pct}%`);
        return _el$2;
      })();
    });
  };
  const cardClass = () => ["tweakers-slider", isVertical() ? "tweakers-slider-vertical" : "", isActive() ? "tweakers-slider-active" : "", isInteracting() ? "tweakers-slider-engaged" : "", isMetaHeld() ? "tweakers-slider-text-mode" : ""].filter(Boolean).join(" ");
  const shortcutPill = () => (0, import_web40.createComponent)(import_solid_js7.Show, {
    get when() {
      return props.shortcut;
    },
    get children() {
      var _el$3 = _tmpl$25();
      (0, import_web43.insert)(_el$3, () => (0, import_shortcut_utils2.formatSliderShortcut)(props.shortcut));
      (0, import_web42.effect)(() => (0, import_web41.className)(_el$3, `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`));
      return _el$3;
    }
  });
  return (() => {
    var _el$4 = _tmpl$52(), _el$5 = _el$4.firstChild;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? (0, import_web39.use)(_ref$, _el$4) : wrapperRef = _el$4;
    _el$5.addEventListener("mouseleave", () => setIsHovered(false));
    _el$5.addEventListener("mouseenter", (e) => {
      setIsHovered(true);
      setIsMetaHeld(e.metaKey);
    });
    _el$5.addEventListener("pointercancel", handlePointerCancel);
    _el$5.$$pointerup = handlePointerUp;
    _el$5.$$pointermove = handlePointerMove;
    _el$5.$$pointerdown = handlePointerDown;
    var _ref$2 = cardRef;
    typeof _ref$2 === "function" ? (0, import_web39.use)(_ref$2, _el$5) : cardRef = _el$5;
    (0, import_web43.insert)(_el$5, (0, import_web40.createComponent)(import_solid_js7.Show, {
      get when() {
        return isVertical();
      },
      get fallback() {
        return [(() => {
          var _el$9 = _tmpl$62(), _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling;
          var _ref$4 = fillRef;
          typeof _ref$4 === "function" ? (0, import_web39.use)(_ref$4, _el$0) : fillRef = _el$0;
          var _ref$5 = handleRef;
          typeof _ref$5 === "function" ? (0, import_web39.use)(_ref$5, _el$1) : handleRef = _el$1;
          (0, import_web42.effect)((_p$) => {
            var _v$6 = fillStart(fillPercent.get()), _v$7 = fillExtent(fillPercent.get()), _v$8 = handleLeft(fillPercent.get());
            _v$6 !== _p$.e && (0, import_web44.setStyleProperty)(_el$0, "left", _p$.e = _v$6);
            _v$7 !== _p$.t && (0, import_web44.setStyleProperty)(_el$0, "width", _p$.t = _v$7);
            _v$8 !== _p$.a && (0, import_web44.setStyleProperty)(_el$1, "left", _p$.a = _v$8);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$9;
        })(), (() => {
          var _el$10 = _tmpl$72();
          (0, import_web43.insert)(_el$10, hashMarks);
          return _el$10;
        })(), (() => {
          var _el$11 = _tmpl$82();
          (0, import_web43.insert)(_el$11, () => props.label, null);
          (0, import_web43.insert)(_el$11, shortcutPill, null);
          return _el$11;
        })(), (0, import_web38.memo)(() => (0, import_web38.memo)(() => props.valueIcon != null)() ? (() => {
          var _el$12 = _tmpl$92();
          (0, import_web43.insert)(_el$12, () => props.valueIcon);
          return _el$12;
        })() : (0, import_web38.memo)(() => !!showInput())() ? (() => {
          var _el$13 = _tmpl$02();
          _el$13.$$mousedown = (e) => e.stopPropagation();
          _el$13.$$click = (e) => e.stopPropagation();
          _el$13.addEventListener("blur", handleInputSubmit);
          _el$13.$$keydown = handleInputKeyDown;
          _el$13.$$input = (e) => setInputValue(e.currentTarget.value);
          var _ref$6 = inputRef;
          typeof _ref$6 === "function" ? (0, import_web39.use)(_ref$6, _el$13) : inputRef = _el$13;
          (0, import_web42.effect)(() => _el$13.value = inputValue());
          return _el$13;
        })() : (() => {
          var _el$14 = _tmpl$25();
          _el$14.$$pointerdown = (e) => isValueEditable() && e.stopPropagation();
          _el$14.$$click = handleValueClick;
          _el$14.addEventListener("mouseleave", () => setIsValueHovered(false));
          _el$14.addEventListener("mouseenter", () => setIsValueHovered(true));
          (0, import_web43.insert)(_el$14, displayValue, null);
          (0, import_web43.insert)(_el$14, (0, import_web40.createComponent)(import_solid_js7.Show, {
            get when() {
              return props.unit;
            },
            get children() {
              var _el$15 = _tmpl$1();
              (0, import_web43.insert)(_el$15, () => props.unit);
              return _el$15;
            }
          }), null);
          (0, import_web42.effect)((_p$) => {
            var _v$9 = `tweakers-slider-value ${isValueEditable() ? "tweakers-slider-value-editable" : ""}`, _v$0 = isValueEditable() || isMetaHeld() ? "text" : "default";
            _v$9 !== _p$.e && (0, import_web41.className)(_el$14, _p$.e = _v$9);
            _v$0 !== _p$.t && (0, import_web44.setStyleProperty)(_el$14, "cursor", _p$.t = _v$0);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$14;
        })())];
      },
      get children() {
        return [(() => {
          var _el$6 = _tmpl$33(), _el$7 = _el$6.firstChild;
          var _ref$3 = fillRef;
          typeof _ref$3 === "function" ? (0, import_web39.use)(_ref$3, _el$7) : fillRef = _el$7;
          (0, import_web42.effect)((_p$) => {
            var _v$ = fillStart(fillPercent.get()), _v$2 = fillExtent(fillPercent.get());
            _v$ !== _p$.e && (0, import_web44.setStyleProperty)(_el$7, "bottom", _p$.e = _v$);
            _v$2 !== _p$.t && (0, import_web44.setStyleProperty)(_el$7, "height", _p$.t = _v$2);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$6;
        })(), (0, import_web38.memo)(() => (0, import_web38.memo)(() => !!showInput())() ? (() => {
          var _el$16 = _tmpl$102();
          _el$16.$$mousedown = (e) => e.stopPropagation();
          _el$16.$$click = (e) => e.stopPropagation();
          _el$16.addEventListener("blur", handleInputSubmit);
          _el$16.$$keydown = handleInputKeyDown;
          _el$16.$$input = (e) => setInputValue(e.currentTarget.value);
          var _ref$7 = inputRef;
          typeof _ref$7 === "function" ? (0, import_web39.use)(_ref$7, _el$16) : inputRef = _el$16;
          (0, import_web42.effect)(() => _el$16.value = inputValue());
          return _el$16;
        })() : (() => {
          var _el$17 = _tmpl$25();
          _el$17.$$pointerdown = (e) => isValueEditable() && e.stopPropagation();
          _el$17.$$click = handleValueClick;
          _el$17.addEventListener("mouseleave", () => setIsValueHovered(false));
          _el$17.addEventListener("mouseenter", () => setIsValueHovered(true));
          (0, import_web43.insert)(_el$17, displayValue, null);
          (0, import_web43.insert)(_el$17, (0, import_web40.createComponent)(import_solid_js7.Show, {
            get when() {
              return props.unit;
            },
            get children() {
              var _el$18 = _tmpl$1();
              (0, import_web43.insert)(_el$18, () => props.unit);
              return _el$18;
            }
          }), null);
          (0, import_web42.effect)((_p$) => {
            var _v$1 = `tweakers-slider-value-vertical ${isValueEditable() ? "tweakers-slider-value-editable" : ""}`, _v$10 = isValueEditable() || isMetaHeld() ? "text" : "default";
            _v$1 !== _p$.e && (0, import_web41.className)(_el$17, _p$.e = _v$1);
            _v$10 !== _p$.t && (0, import_web44.setStyleProperty)(_el$17, "cursor", _p$.t = _v$10);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$17;
        })()), (() => {
          var _el$8 = _tmpl$43();
          (0, import_web43.insert)(_el$8, () => props.label, null);
          (0, import_web43.insert)(_el$8, shortcutPill, null);
          return _el$8;
        })()];
      }
    }));
    (0, import_web42.effect)((_p$) => {
      var _v$3 = `tweakers-slider-wrapper${isVertical() ? " tweakers-slider-wrapper-vertical" : ""}`, _v$4 = cardClass(), _v$5 = hasOrigin() ? "true" : void 0;
      _v$3 !== _p$.e && (0, import_web41.className)(_el$4, _p$.e = _v$3);
      _v$4 !== _p$.t && (0, import_web41.className)(_el$5, _p$.t = _v$4);
      _v$5 !== _p$.a && (0, import_web37.setAttribute)(_el$5, "data-origin", _p$.a = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$4;
  })();
}
(0, import_web36.delegateEvents)(["pointerdown", "pointermove", "pointerup", "input", "keydown", "click", "mousedown"]);

// src/solid/components/NumberControl.tsx
var import_web45 = require("solid-js/web");
var import_web46 = require("solid-js/web");
var import_web47 = require("solid-js/web");
var import_web48 = require("solid-js/web");
var import_web49 = require("solid-js/web");
var import_web50 = require("solid-js/web");
var import_web51 = require("solid-js/web");
var import_solid_js8 = require("solid-js");
var import_shortcut_utils3 = require("tweakers/shortcut-utils");
var _tmpl$13 = /* @__PURE__ */ (0, import_web45.template)(`<div><span class=tweakers-number-label>`);
var _tmpl$26 = /* @__PURE__ */ (0, import_web45.template)(`<input type=text class=tweakers-number-input>`);
var _tmpl$34 = /* @__PURE__ */ (0, import_web45.template)(`<span class=tweakers-number-value>`);
var _tmpl$44 = /* @__PURE__ */ (0, import_web45.template)(`<span class=tweakers-number-unit>`);
var CLICK_THRESHOLD2 = 3;
function NumberControl(props) {
  const step = () => props.step ?? 0.01;
  const isVertical = () => props.orientation === "vertical";
  let inputRef;
  const [isScrubbing, setIsScrubbing] = (0, import_solid_js8.createSignal)(false);
  const [showInput, setShowInput] = (0, import_solid_js8.createSignal)(false);
  const [inputValue, setInputValue] = (0, import_solid_js8.createSignal)("");
  let pointerDownPos = null;
  let isClickFlag = true;
  let scrubStartValue = 0;
  let isPointerHeld = false;
  const clamp4 = (v) => {
    let out = v;
    if (props.min != null) out = Math.max(props.min, out);
    if (props.max != null) out = Math.min(props.max, out);
    return out;
  };
  const handlePointerDown = (e) => {
    if (showInput()) return;
    if (e.metaKey) return;
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    pointerDownPos = {
      x: e.clientX,
      y: e.clientY
    };
    isClickFlag = true;
    isPointerHeld = true;
    scrubStartValue = props.value;
  };
  const handlePointerMove = (e) => {
    if (!isPointerHeld || !pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (isClickFlag && distance > CLICK_THRESHOLD2) {
      isClickFlag = false;
      setIsScrubbing(true);
    }
    if (!isClickFlag) {
      const travel = isVertical() ? -dy : dx;
      const perPixel = step() * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
      const next = clamp4(scrubStartValue + travel * perPixel);
      props.onChange((0, import_shortcut_utils3.roundValue)(next, step()));
    }
  };
  const handlePointerUp = () => {
    if (!isPointerHeld) return;
    if (isClickFlag) {
      setShowInput(true);
      setInputValue(props.value.toFixed((0, import_shortcut_utils3.decimalsForStep)(step())));
    }
    isPointerHeld = false;
    pointerDownPos = null;
    setIsScrubbing(false);
  };
  (0, import_solid_js8.createEffect)(() => {
    if (showInput() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      props.onChange((0, import_shortcut_utils3.roundValue)(clamp4(parsed), step()));
    }
    setShowInput(false);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setShowInput(false);
    }
  };
  const displayValue = () => props.formatValue ? props.formatValue(props.value) : props.value.toFixed((0, import_shortcut_utils3.decimalsForStep)(step()));
  const className = () => ["tweakers-number-control", isVertical() ? "tweakers-number-control-vertical" : "", isScrubbing() ? "tweakers-number-control-engaged" : ""].filter(Boolean).join(" ");
  return (() => {
    var _el$ = _tmpl$13(), _el$2 = _el$.firstChild;
    _el$.$$pointerup = handlePointerUp;
    _el$.$$pointermove = handlePointerMove;
    _el$.$$pointerdown = handlePointerDown;
    (0, import_web51.insert)(_el$2, () => props.label);
    (0, import_web51.insert)(_el$, (() => {
      var _c$ = (0, import_web50.memo)(() => !!showInput());
      return () => _c$() ? (() => {
        var _el$3 = _tmpl$26();
        _el$3.$$pointerdown = (e) => e.stopPropagation();
        _el$3.$$click = (e) => e.stopPropagation();
        _el$3.addEventListener("blur", handleInputSubmit);
        _el$3.$$keydown = handleInputKeyDown;
        _el$3.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$ = inputRef;
        typeof _ref$ === "function" ? (0, import_web47.use)(_ref$, _el$3) : inputRef = _el$3;
        (0, import_web49.effect)(() => _el$3.value = inputValue());
        return _el$3;
      })() : (() => {
        var _el$4 = _tmpl$34();
        (0, import_web51.insert)(_el$4, displayValue, null);
        (0, import_web51.insert)(_el$4, (() => {
          var _c$2 = (0, import_web50.memo)(() => !!props.unit);
          return () => _c$2() && (() => {
            var _el$5 = _tmpl$44();
            (0, import_web51.insert)(_el$5, () => props.unit);
            return _el$5;
          })();
        })(), null);
        return _el$4;
      })();
    })(), null);
    (0, import_web49.effect)(() => (0, import_web48.className)(_el$, className()));
    return _el$;
  })();
}
(0, import_web46.delegateEvents)(["pointerdown", "pointermove", "pointerup", "input", "keydown", "click"]);

// src/solid/components/RangeSlider.tsx
var import_web52 = require("solid-js/web");
var import_web53 = require("solid-js/web");
var import_web54 = require("solid-js/web");
var import_web55 = require("solid-js/web");
var import_web56 = require("solid-js/web");
var import_web57 = require("solid-js/web");
var import_web58 = require("solid-js/web");
var import_web59 = require("solid-js/web");
var import_solid_js9 = require("solid-js");
var import_motion3 = require("motion");
var import_range_slider_core = require("tweakers/range-slider-core");
var import_shortcut_utils4 = require("tweakers/shortcut-utils");
var _tmpl$14 = /* @__PURE__ */ (0, import_web52.template)(`<input type=text class=tweakers-range-slider-input>`);
var _tmpl$27 = /* @__PURE__ */ (0, import_web52.template)(`<div class=tweakers-range-slider-wrapper><div><div class=tweakers-range-slider-fill></div><div class=tweakers-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><div class=tweakers-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><span class=tweakers-range-slider-label>`);
var _tmpl$35 = /* @__PURE__ */ (0, import_web52.template)(`<span class=tweakers-range-slider-value><span class=tweakers-range-slider-bound></span><span class=tweakers-range-slider-dash>\u2013</span><span class=tweakers-range-slider-bound>`);
var CLICK_THRESHOLD3 = 3;
var HANDLE_HIT_PX = 12;
function RangeSlider(props) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;
  let wrapperRef;
  let trackRef;
  let fillRef;
  let lowHandleRef;
  let highHandleRef;
  let inputRef;
  const [isInteracting, setIsInteracting] = (0, import_solid_js9.createSignal)(false);
  const [isDragging, setIsDragging] = (0, import_solid_js9.createSignal)(false);
  const [isHovered, setIsHovered] = (0, import_solid_js9.createSignal)(false);
  const [editing, setEditing] = (0, import_solid_js9.createSignal)(null);
  const [inputValue, setInputValue] = (0, import_solid_js9.createSignal)("");
  const [dragTarget, setDragTarget] = (0, import_solid_js9.createSignal)(null);
  const value = () => isInteracting() ? props.value : (0, import_range_slider_core.clampRange)(props.value, min(), max());
  const span = () => max() - min();
  const lowPercent = () => span() === 0 ? 0 : (value().min - min()) / span() * 100;
  const highPercent = () => span() === 0 ? 0 : (value().max - min()) / span() * 100;
  const isActive = () => isInteracting() || isHovered();
  const lowMotion = (0, import_motion3.motionValue)(lowPercent());
  const highMotion = (0, import_motion3.motionValue)(highPercent());
  const applyFillStyles = () => {
    const lo = lowMotion.get();
    const hi = highMotion.get();
    if (fillRef) {
      fillRef.style.left = `${lo}%`;
      fillRef.style.width = `${Math.max(0, hi - lo)}%`;
    }
    const handles = (0, import_range_slider_core.handleLeftStyles)(lo, hi);
    if (lowHandleRef) lowHandleRef.style.left = handles.low;
    if (highHandleRef) highHandleRef.style.left = handles.high;
  };
  let pointerDownPos = null;
  let isClickFlag = true;
  let clickMoves = false;
  let wrapperRect = null;
  let scaleVal = 1;
  let dragStartValue = props.value;
  let dragStartValueAt = 0;
  let lowSnapAnim = null;
  let highSnapAnim = null;
  const stopSnaps = () => {
    lowSnapAnim?.stop();
    highSnapAnim?.stop();
    lowSnapAnim = null;
    highSnapAnim = null;
  };
  let lowOpacityAnim = null;
  let highOpacityAnim = null;
  const positionToValue = (clientX) => {
    if (!wrapperRect) return value().min;
    const screenX = clientX - wrapperRect.left;
    const sceneX = screenX / scaleVal;
    const nativeWidth = wrapperRef ? wrapperRef.offsetWidth : wrapperRect.width;
    const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };
  const percentFromValue = (v) => span() === 0 ? 0 : (v - min()) / span() * 100;
  const syncMotion = (next) => {
    lowMotion.jump(percentFromValue(next.min));
    highMotion.jump(percentFromValue(next.max));
  };
  (0, import_solid_js9.createEffect)(() => {
    if (!isInteracting() && !lowSnapAnim && !highSnapAnim) {
      lowMotion.jump(lowPercent());
      highMotion.jump(highPercent());
    }
  });
  const handlePointerDown = (e) => {
    if (editing()) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownPos = {
      x: e.clientX,
      y: e.clientY
    };
    isClickFlag = true;
    setIsInteracting(true);
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      scaleVal = wrapperRect.width / wrapperRef.offsetWidth;
    }
    const current = (0, import_range_slider_core.clampRange)(props.value, min(), max());
    const atValue = positionToValue(e.clientX);
    const trackW = wrapperRef?.offsetWidth ?? 1;
    const hitV = HANDLE_HIT_PX / trackW * (max() - min());
    const target = (0, import_range_slider_core.pickDragTarget)(atValue, current, hitV);
    setDragTarget(target);
    clickMoves = target !== "span" && (0, import_range_slider_core.isOutsideSpan)(atValue, current);
    dragStartValue = current;
    dragStartValueAt = atValue;
  };
  const handlePointerMove = (e) => {
    if (!isInteracting() || !pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (isClickFlag && distance > CLICK_THRESHOLD3) {
      isClickFlag = false;
      setIsDragging(true);
    }
    if (isClickFlag) return;
    const raw = (0, import_shortcut_utils4.roundValue)(positionToValue(e.clientX), step());
    const target = dragTarget();
    const current = value();
    let next;
    if (target === "span") {
      const delta = raw - (0, import_shortcut_utils4.roundValue)(dragStartValueAt, step());
      next = (0, import_range_slider_core.shiftSpan)(delta, dragStartValue, min(), max());
    } else if (target === "min") {
      next = (0, import_range_slider_core.setLow)(raw, current, min());
    } else {
      next = (0, import_range_slider_core.setHigh)(raw, current, max());
    }
    stopSnaps();
    syncMotion(next);
    props.onChange(next);
  };
  const handlePointerUp = (e) => {
    if (!isInteracting()) return;
    if (isClickFlag && clickMoves) {
      const raw = (0, import_shortcut_utils4.roundValue)(positionToValue(e.clientX), step());
      const current = value();
      const which = dragTarget() ?? (0, import_range_slider_core.nearestHandle)(raw, current);
      const next = which === "min" ? (0, import_range_slider_core.setLow)(raw, current, min()) : (0, import_range_slider_core.setHigh)(raw, current, max());
      const handleMotion = which === "min" ? lowMotion : highMotion;
      const targetPct = percentFromValue(which === "min" ? next.min : next.max);
      stopSnaps();
      const anim = (0, import_motion3.animate)(handleMotion, targetPct, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          if (which === "min") lowSnapAnim = null;
          else highSnapAnim = null;
        }
      });
      if (which === "min") lowSnapAnim = anim;
      else highSnapAnim = anim;
      props.onChange(next);
    }
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };
  const handlePointerCancel = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };
  const handleDoubleClick = () => {
    if (editing() !== null) return;
    const d = (0, import_range_slider_core.clampRange)(props.defaultValue ?? {
      min: min(),
      max: max()
    }, min(), max());
    stopSnaps();
    lowSnapAnim = (0, import_motion3.animate)(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowSnapAnim = null;
      }
    });
    highSnapAnim = (0, import_motion3.animate)(highMotion, percentFromValue(d.max), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        highSnapAnim = null;
      }
    });
    props.onChange(d);
  };
  const restOpacity = 0.35;
  const lowOpacityMv = (0, import_motion3.motionValue)(restOpacity);
  const highOpacityMv = (0, import_motion3.motionValue)(restOpacity);
  const applyLowHandleOpacity = () => {
    if (lowHandleRef) lowHandleRef.style.opacity = String(lowOpacityMv.get());
  };
  const applyHighHandleOpacity = () => {
    if (highHandleRef) highHandleRef.style.opacity = String(highOpacityMv.get());
  };
  (0, import_solid_js9.createEffect)(() => {
    const active = isActive();
    const dragging = isDragging();
    const target = dragTarget();
    const lowTarget = !active ? restOpacity : dragging && target === "min" ? 0.95 : 0.7;
    const highTarget = !active ? restOpacity : dragging && target === "max" ? 0.95 : 0.7;
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
    lowOpacityAnim = (0, import_motion3.animate)(lowOpacityMv, lowTarget, {
      duration: 0.15
    });
    highOpacityAnim = (0, import_motion3.animate)(highOpacityMv, highTarget, {
      duration: 0.15
    });
  });
  (0, import_solid_js9.onMount)(() => {
    const unsubLow = lowMotion.on("change", applyFillStyles);
    const unsubHigh = highMotion.on("change", applyFillStyles);
    const unsubLowOpacity = lowOpacityMv.on("change", applyLowHandleOpacity);
    const unsubHighOpacity = highOpacityMv.on("change", applyHighHandleOpacity);
    applyFillStyles();
    applyLowHandleOpacity();
    applyHighHandleOpacity();
    (0, import_solid_js9.onCleanup)(() => {
      unsubLow();
      unsubHigh();
      unsubLowOpacity();
      unsubHighOpacity();
    });
  });
  (0, import_solid_js9.onCleanup)(() => {
    stopSnaps();
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
  });
  (0, import_solid_js9.createEffect)(() => {
    if (editing() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const decimals = () => (0, import_shortcut_utils4.decimalsForStep)(step());
  const openEditor = (which) => {
    setEditing(which);
    setInputValue((which === "min" ? value().min : value().max).toFixed(decimals()));
  };
  const commitEditor = () => {
    const which = editing();
    if (!which) return;
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      const rounded = (0, import_shortcut_utils4.roundValue)(parsed, step());
      const current = value();
      const next = which === "min" ? (0, import_range_slider_core.setLow)(rounded, current, min()) : (0, import_range_slider_core.setHigh)(rounded, current, max());
      props.onChange(next);
    }
    setEditing(null);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") commitEditor();
    else if (e.key === "Escape") setEditing(null);
  };
  const lowText = () => value().min.toFixed(decimals());
  const highText = () => value().max.toFixed(decimals());
  return (() => {
    var _el$ = _tmpl$27(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? (0, import_web59.use)(_ref$, _el$) : wrapperRef = _el$;
    _el$2.addEventListener("mouseleave", () => setIsHovered(false));
    _el$2.addEventListener("mouseenter", () => setIsHovered(true));
    _el$2.$$dblclick = handleDoubleClick;
    _el$2.addEventListener("pointercancel", handlePointerCancel);
    _el$2.$$pointerup = handlePointerUp;
    _el$2.$$pointermove = handlePointerMove;
    _el$2.$$pointerdown = handlePointerDown;
    var _ref$2 = trackRef;
    typeof _ref$2 === "function" ? (0, import_web59.use)(_ref$2, _el$2) : trackRef = _el$2;
    var _ref$3 = fillRef;
    typeof _ref$3 === "function" ? (0, import_web59.use)(_ref$3, _el$3) : fillRef = _el$3;
    var _ref$4 = lowHandleRef;
    typeof _ref$4 === "function" ? (0, import_web59.use)(_ref$4, _el$4) : lowHandleRef = _el$4;
    var _ref$5 = highHandleRef;
    typeof _ref$5 === "function" ? (0, import_web59.use)(_ref$5, _el$5) : highHandleRef = _el$5;
    (0, import_web58.insert)(_el$6, () => props.label);
    (0, import_web58.insert)(_el$2, (0, import_web56.createComponent)(import_solid_js9.Show, {
      get when() {
        return editing() !== null;
      },
      get fallback() {
        return (() => {
          var _el$8 = _tmpl$35(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
          _el$9.$$pointerdown = (e) => e.stopPropagation();
          _el$9.$$click = (e) => {
            e.stopPropagation();
            openEditor("min");
          };
          (0, import_web58.insert)(_el$9, lowText);
          _el$1.$$pointerdown = (e) => e.stopPropagation();
          _el$1.$$click = (e) => {
            e.stopPropagation();
            openEditor("max");
          };
          (0, import_web58.insert)(_el$1, highText);
          return _el$8;
        })();
      },
      get children() {
        var _el$7 = _tmpl$14();
        _el$7.$$pointerdown = (e) => e.stopPropagation();
        _el$7.$$click = (e) => e.stopPropagation();
        _el$7.addEventListener("blur", commitEditor);
        _el$7.$$keydown = handleInputKeyDown;
        _el$7.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$6 = inputRef;
        typeof _ref$6 === "function" ? (0, import_web59.use)(_ref$6, _el$7) : inputRef = _el$7;
        (0, import_web57.effect)(() => _el$7.value = inputValue());
        return _el$7;
      }
    }), null);
    (0, import_web57.effect)((_p$) => {
      var _v$ = `tweakers-range-slider ${isActive() ? "tweakers-range-slider-active" : ""}`, _v$2 = `${lowPercent()}%`, _v$3 = `${Math.max(0, highPercent() - lowPercent())}%`, _v$4 = (0, import_range_slider_core.handleLeftStyles)(lowPercent(), highPercent()).low, _v$5 = (0, import_range_slider_core.handleLeftStyles)(lowPercent(), highPercent()).high;
      _v$ !== _p$.e && (0, import_web55.className)(_el$2, _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web54.setStyleProperty)(_el$3, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web54.setStyleProperty)(_el$3, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web54.setStyleProperty)(_el$4, "left", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web54.setStyleProperty)(_el$5, "left", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}
(0, import_web53.delegateEvents)(["pointerdown", "pointermove", "pointerup", "dblclick", "input", "keydown", "click"]);

// src/solid/components/Toggle.tsx
var import_web60 = require("solid-js/web");
var import_web61 = require("solid-js/web");
var import_web62 = require("solid-js/web");
var import_web63 = require("solid-js/web");
var import_web64 = require("solid-js/web");
var import_solid_js10 = require("solid-js");
var import_shortcut_utils5 = require("tweakers/shortcut-utils");
var _tmpl$15 = /* @__PURE__ */ (0, import_web60.template)(`<span>`);
var _tmpl$28 = /* @__PURE__ */ (0, import_web60.template)(`<div class="tweakers-labeled-control tweakers-labeled-control-check"><span class=tweakers-labeled-control-label>`);
function Toggle(props) {
  return (() => {
    var _el$ = _tmpl$28(), _el$2 = _el$.firstChild;
    (0, import_web63.insert)(_el$, (0, import_web64.createComponent)(Checkbox, {
      get checked() {
        return props.checked;
      },
      get onChange() {
        return props.onChange;
      },
      get label() {
        return props.label;
      }
    }), _el$2);
    (0, import_web63.insert)(_el$2, () => props.label, null);
    (0, import_web63.insert)(_el$2, (0, import_web64.createComponent)(import_solid_js10.Show, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$3 = _tmpl$15();
        (0, import_web63.insert)(_el$3, () => (0, import_shortcut_utils5.formatToggleShortcut)(props.shortcut));
        (0, import_web62.effect)(() => (0, import_web61.className)(_el$3, `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`));
        return _el$3;
      }
    }), null);
    return _el$;
  })();
}

// src/solid/components/SpringControl.tsx
var import_web77 = require("solid-js/web");
var import_web78 = require("solid-js/web");
var import_web79 = require("solid-js/web");
var import_web80 = require("solid-js/web");
var import_solid_js12 = require("solid-js");
var import_store5 = require("tweakers/store");

// src/solid/components/SegmentedControl.tsx
var import_web65 = require("solid-js/web");
var import_web66 = require("solid-js/web");
var import_web67 = require("solid-js/web");
var import_web68 = require("solid-js/web");
var import_web69 = require("solid-js/web");
var import_web70 = require("solid-js/web");
var import_web71 = require("solid-js/web");
var import_web72 = require("solid-js/web");
var import_solid_js11 = require("solid-js");
var _tmpl$16 = /* @__PURE__ */ (0, import_web65.template)(`<div class=tweakers-segmented>`);
var _tmpl$29 = /* @__PURE__ */ (0, import_web65.template)(`<div class=tweakers-segmented-pill>`);
var _tmpl$36 = /* @__PURE__ */ (0, import_web65.template)(`<button class=tweakers-segmented-button>`);
function SegmentedControl(props) {
  let containerRef;
  let hasAnimated = false;
  const [pillStyle, setPillStyle] = (0, import_solid_js11.createSignal)(null);
  const measure = () => {
    if (!containerRef) return;
    const activeButton = containerRef.querySelector('[data-active="true"]');
    if (!activeButton) return;
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth
    });
  };
  (0, import_solid_js11.createEffect)(() => {
    void props.value;
    void props.options.length;
    measure();
  });
  const transition = () => {
    void props.value;
    if (!hasAnimated) {
      hasAnimated = true;
      return "none";
    }
    return "left 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1)";
  };
  return (() => {
    var _el$ = _tmpl$16();
    var _ref$ = containerRef;
    typeof _ref$ === "function" ? (0, import_web72.use)(_ref$, _el$) : containerRef = _el$;
    (0, import_web70.insert)(_el$, (0, import_web71.createComponent)(import_solid_js11.Show, {
      get when() {
        return pillStyle();
      },
      children: (style) => (() => {
        var _el$2 = _tmpl$29();
        (0, import_web69.effect)((_p$) => {
          var _v$ = `${style().left}px`, _v$2 = `${style().width}px`, _v$3 = transition();
          _v$ !== _p$.e && (0, import_web68.setStyleProperty)(_el$2, "left", _p$.e = _v$);
          _v$2 !== _p$.t && (0, import_web68.setStyleProperty)(_el$2, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && (0, import_web68.setStyleProperty)(_el$2, "transition", _p$.a = _v$3);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$2;
      })()
    }), null);
    (0, import_web70.insert)(_el$, (0, import_web71.createComponent)(import_solid_js11.For, {
      get each() {
        return props.options;
      },
      children: (option) => (() => {
        var _el$3 = _tmpl$36();
        _el$3.$$click = () => props.onChange(option.value);
        (0, import_web70.insert)(_el$3, () => option.label);
        (0, import_web69.effect)(() => (0, import_web67.setAttribute)(_el$3, "data-active", String(props.value === option.value)));
        return _el$3;
      })()
    }), null);
    return _el$;
  })();
}
(0, import_web66.delegateEvents)(["click"]);

// src/solid/components/SpringVisualization.tsx
var import_web73 = require("solid-js/web");
var import_web74 = require("solid-js/web");
var import_web75 = require("solid-js/web");
var import_web76 = require("solid-js/web");
var _tmpl$17 = /* @__PURE__ */ (0, import_web73.template)(`<svg><line y1=0 y2=140 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$210 = /* @__PURE__ */ (0, import_web73.template)(`<svg><line x1=0 x2=256 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$37 = /* @__PURE__ */ (0, import_web73.template)(`<svg viewBox="0 0 256 140"class=tweakers-spring-viz><line x1=0 y1=70 x2=256 y2=70 stroke="rgba(255, 255, 255, 0.15)"stroke-width=1 stroke-dasharray=4,4></line><path fill=none stroke="rgba(255, 255, 255, 0.6)"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`);
function generateSpringCurve(stiffness, damping, mass, duration) {
  const points = [];
  const steps = 100;
  const dt = duration / steps;
  let position = 0;
  let velocity = 0;
  const target = 1;
  for (let i = 0; i <= steps; i++) {
    const time = i * dt;
    points.push([time, position]);
    const springForce = -stiffness * (position - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
  }
  return points;
}
function SpringVisualization(props) {
  const width = 256;
  const height = 140;
  const params = () => {
    let stiffness;
    let damping;
    let mass;
    if (props.isSimpleMode) {
      const visualDuration = props.spring.visualDuration ?? 0.3;
      const bounce = props.spring.bounce ?? 0.2;
      mass = 1;
      stiffness = Math.pow(2 * Math.PI / visualDuration, 2);
      const dampingRatio = 1 - bounce;
      damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
    } else {
      stiffness = props.spring.stiffness ?? 400;
      damping = props.spring.damping ?? 17;
      mass = props.spring.mass ?? 1;
    }
    const duration = 2;
    const points = generateSpringCurve(stiffness, damping, mass, duration);
    const values = points.map(([, value]) => value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    const pathData = points.map(([time, value], i) => {
      const x = time / duration * width;
      const normalizedValue = (value - minValue) / (valueRange || 1);
      const y = height - (normalizedValue * height * 0.6 + height * 0.2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    return pathData;
  };
  const gridLines = () => {
    const lines = [];
    for (let i = 1; i < 4; i++) {
      const x = width / 4 * i;
      const y = height / 4 * i;
      lines.push((() => {
        var _el$ = _tmpl$17();
        (0, import_web76.setAttribute)(_el$, "x1", x);
        (0, import_web76.setAttribute)(_el$, "x2", x);
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$210();
        (0, import_web76.setAttribute)(_el$2, "y1", y);
        (0, import_web76.setAttribute)(_el$2, "y2", y);
        return _el$2;
      })());
    }
    return lines;
  };
  return (() => {
    var _el$3 = _tmpl$37(), _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling;
    (0, import_web75.insert)(_el$3, gridLines, _el$4);
    (0, import_web74.effect)(() => (0, import_web76.setAttribute)(_el$5, "d", params()));
    return _el$3;
  })();
}

// src/solid/components/SpringControl.tsx
var _tmpl$18 = /* @__PURE__ */ (0, import_web77.template)(`<div style=display:flex;flex-direction:column;gap:6px><div class=tweakers-labeled-control><span class=tweakers-labeled-control-label>Type`);
function SpringControl(props) {
  const [mode, setMode] = (0, import_solid_js12.createSignal)(import_store5.TweakStore.getSpringMode(props.panelId, props.path));
  (0, import_solid_js12.onMount)(() => {
    const unsub = import_store5.TweakStore.subscribe(props.panelId, () => {
      setMode(import_store5.TweakStore.getSpringMode(props.panelId, props.path));
    });
    (0, import_solid_js12.onCleanup)(unsub);
  });
  const isSimpleMode = () => mode() === "simple";
  const cache = {
    simple: props.spring.visualDuration !== void 0 ? props.spring : {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    },
    advanced: props.spring.stiffness !== void 0 ? props.spring : {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1
    }
  };
  const handleModeChange = (newMode) => {
    if (isSimpleMode()) {
      cache.simple = props.spring;
    } else {
      cache.advanced = props.spring;
    }
    import_store5.TweakStore.updateSpringMode(props.panelId, props.path, newMode);
    if (newMode === "simple") {
      props.onChange(cache.simple);
    } else {
      props.onChange(cache.advanced);
    }
  };
  const handleUpdate = (key, value) => {
    if (isSimpleMode()) {
      const {
        stiffness,
        damping,
        mass,
        ...rest
      } = props.spring;
      props.onChange({
        ...rest,
        [key]: value
      });
    } else {
      const {
        visualDuration,
        bounce,
        ...rest
      } = props.spring;
      props.onChange({
        ...rest,
        [key]: value
      });
    }
  };
  return (0, import_web80.createComponent)(Folder, {
    get title() {
      return props.label;
    },
    defaultOpen: true,
    get children() {
      var _el$ = _tmpl$18(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      (0, import_web79.insert)(_el$, (0, import_web80.createComponent)(SpringVisualization, {
        get spring() {
          return props.spring;
        },
        get isSimpleMode() {
          return isSimpleMode();
        }
      }), _el$2);
      (0, import_web79.insert)(_el$2, (0, import_web80.createComponent)(SegmentedControl, {
        options: [{
          value: "simple",
          label: "Time"
        }, {
          value: "advanced",
          label: "Physics"
        }],
        get value() {
          return mode();
        },
        onChange: handleModeChange
      }), null);
      (0, import_web79.insert)(_el$, (() => {
        var _c$ = (0, import_web78.memo)(() => !!isSimpleMode());
        return () => _c$() ? [(0, import_web80.createComponent)(Slider, {
          label: "Duration",
          get value() {
            return props.spring.visualDuration ?? 0.3;
          },
          onChange: (v) => handleUpdate("visualDuration", v),
          min: 0.1,
          max: 1,
          step: 0.05,
          unit: "s"
        }), (0, import_web80.createComponent)(Slider, {
          label: "Bounce",
          get value() {
            return props.spring.bounce ?? 0.2;
          },
          onChange: (v) => handleUpdate("bounce", v),
          min: 0,
          max: 1,
          step: 0.05
        })] : [(0, import_web80.createComponent)(Slider, {
          label: "Stiffness",
          get value() {
            return props.spring.stiffness ?? 400;
          },
          onChange: (v) => handleUpdate("stiffness", v),
          min: 1,
          max: 1e3,
          step: 10
        }), (0, import_web80.createComponent)(Slider, {
          label: "Damping",
          get value() {
            return props.spring.damping ?? 17;
          },
          onChange: (v) => handleUpdate("damping", v),
          min: 1,
          max: 100,
          step: 1
        }), (0, import_web80.createComponent)(Slider, {
          label: "Mass",
          get value() {
            return props.spring.mass ?? 1;
          },
          onChange: (v) => handleUpdate("mass", v),
          min: 0.1,
          max: 10,
          step: 0.1
        })];
      })(), null);
      return _el$;
    }
  });
}

// src/solid/components/TransitionControl.tsx
var import_web85 = require("solid-js/web");
var import_web86 = require("solid-js/web");
var import_web87 = require("solid-js/web");
var import_web88 = require("solid-js/web");
var import_web89 = require("solid-js/web");
var import_web90 = require("solid-js/web");
var import_web91 = require("solid-js/web");
var import_solid_js14 = require("solid-js");
var import_store6 = require("tweakers/store");

// src/solid/primitives.ts
var import_solid_js13 = require("solid-js");
var import_web81 = require("solid-js/web");
function fromStore(read, subscribe) {
  if (import_web81.isServer) return read;
  const value = (0, import_solid_js13.from)((set) => {
    set(() => read());
    return subscribe(() => set(() => read()));
  });
  return value;
}

// src/solid/components/EasingVisualization.tsx
var import_web82 = require("solid-js/web");
var import_web83 = require("solid-js/web");
var import_web84 = require("solid-js/web");
var _tmpl$19 = /* @__PURE__ */ (0, import_web82.template)(`<svg viewBox="0 0 200 200"preserveAspectRatio="xMidYMid slice"class="tweakers-spring-viz tweakers-easing-viz"><line stroke="rgba(255, 255, 255, 0.15)"stroke-width=1 stroke-dasharray=4,4></line><path fill=none stroke="rgba(255, 255, 255, 0.6)"stroke-width=2 stroke-linecap=round>`);
function EasingVisualization(props) {
  const size = 200;
  const pad = 10;
  const unit = (size - pad * 2) / 2;
  const toSvg = (x, y) => ({
    x: pad + (x + 0.5) * unit,
    y: pad + (1.5 - y) * unit
  });
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);
  const curvePath2 = () => {
    const [x1, y1, x2, y2] = props.easing.ease;
    const first = toSvg(x1, y1);
    const second = toSvg(x2, y2);
    return `M ${start.x} ${start.y} C ${first.x} ${first.y}, ${second.x} ${second.y}, ${end.x} ${end.y}`;
  };
  return (() => {
    var _el$ = _tmpl$19(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    (0, import_web84.effect)((_p$) => {
      var _v$ = start.x, _v$2 = start.y, _v$3 = end.x, _v$4 = end.y, _v$5 = curvePath2();
      _v$ !== _p$.e && (0, import_web83.setAttribute)(_el$2, "x1", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web83.setAttribute)(_el$2, "y1", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web83.setAttribute)(_el$2, "x2", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web83.setAttribute)(_el$2, "y2", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web83.setAttribute)(_el$3, "d", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}

// src/solid/components/TransitionControl.tsx
var _tmpl$20 = /* @__PURE__ */ (0, import_web85.template)(`<div class=tweakers-labeled-control><span class=tweakers-labeled-control-label>Ease</span><input type=text class=tweakers-text-input>`);
var _tmpl$211 = /* @__PURE__ */ (0, import_web85.template)(`<div style=display:flex;flex-direction:column;gap:6px><div class=tweakers-labeled-control><span class=tweakers-labeled-control-label>Type`);
function TransitionControl(props) {
  const mode = fromStore(() => import_store6.TweakStore.getTransitionMode(props.panelId, props.path), (notify) => import_store6.TweakStore.subscribe(props.panelId, notify));
  const [editingEase, setEditingEase] = (0, import_solid_js14.createSignal)(false);
  const [easeDraft, setEaseDraft] = (0, import_solid_js14.createSignal)("");
  const cache = {
    easing: props.value.type === "easing" ? props.value : {
      type: "easing",
      duration: 0.3,
      ease: [1, -0.4, 0.5, 1]
    },
    simple: props.value.type === "spring" && props.value.visualDuration !== void 0 ? props.value : {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    },
    advanced: props.value.type === "spring" && props.value.stiffness !== void 0 ? props.value : {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1
    }
  };
  const isEasing = () => mode() === "easing";
  const isSimple = () => mode() === "simple";
  const spring = () => {
    if (props.value.type === "spring") {
      if (isSimple()) cache.simple = props.value;
      else if (mode() === "advanced") cache.advanced = props.value;
      return props.value;
    }
    return cache.simple;
  };
  const easing = () => {
    if (props.value.type === "easing") {
      cache.easing = props.value;
      return props.value;
    }
    return cache.easing;
  };
  const handleModeChange = (next) => {
    import_store6.TweakStore.updateTransitionMode(props.panelId, props.path, next);
    props.onChange(next === "easing" ? cache.easing : next === "simple" ? cache.simple : cache.advanced);
  };
  const handleSpringUpdate = (key, value) => {
    const current = spring();
    if (isSimple()) {
      const {
        stiffness,
        damping,
        mass,
        ...rest
      } = current;
      props.onChange({
        ...rest,
        [key]: value
      });
    } else {
      const {
        visualDuration,
        bounce,
        ...rest
      } = current;
      props.onChange({
        ...rest,
        [key]: value
      });
    }
  };
  const updateEase = (index, value) => {
    const current = easing();
    const next = [...current.ease];
    next[index] = value;
    props.onChange({
      ...current,
      ease: next
    });
  };
  const formatEase = (value) => value.map((part) => Number(part.toFixed(2))).join(", ");
  const commitEase = () => {
    const parts = easeDraft().split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      props.onChange({
        ...easing(),
        ease: parts
      });
    }
    setEditingEase(false);
  };
  const durationSlider = () => {
    if (props.hideDuration || !isEasing() && !isSimple()) return null;
    const external = props.durationControl;
    return (0, import_web90.createComponent)(Slider, {
      label: "Duration",
      get value() {
        return external?.value ?? (isEasing() ? easing().duration : spring().visualDuration ?? 0.3);
      },
      get onChange() {
        return external?.onChange ?? ((value) => {
          if (isEasing()) props.onChange({
            ...easing(),
            duration: value
          });
          else handleSpringUpdate("visualDuration", value);
        });
      },
      get min() {
        return external?.min ?? 0.1;
      },
      get max() {
        return external?.max ?? (isEasing() ? 2 : 1);
      },
      get step() {
        return external?.step ?? 0.05;
      },
      unit: "s"
    });
  };
  return (0, import_web90.createComponent)(Folder, {
    get title() {
      return props.label;
    },
    defaultOpen: true,
    get children() {
      var _el$ = _tmpl$211(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      (0, import_web89.insert)(_el$, (0, import_web90.createComponent)(import_solid_js14.Show, {
        get when() {
          return isEasing();
        },
        get fallback() {
          return (0, import_web90.createComponent)(SpringVisualization, {
            get spring() {
              return spring();
            },
            get isSimpleMode() {
              return isSimple();
            }
          });
        },
        get children() {
          return (0, import_web90.createComponent)(EasingVisualization, {
            get easing() {
              return easing();
            }
          });
        }
      }), _el$2);
      (0, import_web89.insert)(_el$2, (0, import_web90.createComponent)(SegmentedControl, {
        options: [{
          value: "easing",
          label: "Easing"
        }, {
          value: "simple",
          label: "Time"
        }, {
          value: "advanced",
          label: "Physics"
        }],
        get value() {
          return mode();
        },
        onChange: handleModeChange
      }), null);
      (0, import_web89.insert)(_el$, (0, import_web90.createComponent)(import_solid_js14.Show, {
        get when() {
          return isEasing();
        },
        get children() {
          return [(0, import_web90.createComponent)(Slider, {
            label: "x1",
            get value() {
              return easing().ease[0];
            },
            onChange: (value) => updateEase(0, value),
            min: 0,
            max: 1,
            step: 0.01
          }), (0, import_web90.createComponent)(Slider, {
            label: "y1",
            get value() {
              return easing().ease[1];
            },
            onChange: (value) => updateEase(1, value),
            min: -1,
            max: 2,
            step: 0.01
          }), (0, import_web90.createComponent)(Slider, {
            label: "x2",
            get value() {
              return easing().ease[2];
            },
            onChange: (value) => updateEase(2, value),
            min: 0,
            max: 1,
            step: 0.01
          }), (0, import_web90.createComponent)(Slider, {
            label: "y2",
            get value() {
              return easing().ease[3];
            },
            onChange: (value) => updateEase(3, value),
            min: -1,
            max: 2,
            step: 0.01
          }), (() => {
            var _el$4 = _tmpl$20(), _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling;
            _el$6.$$keydown = (event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            };
            _el$6.addEventListener("blur", commitEase);
            _el$6.addEventListener("focus", () => {
              setEaseDraft(formatEase(easing().ease));
              setEditingEase(true);
            });
            _el$6.$$input = (event) => setEaseDraft(event.currentTarget.value);
            (0, import_web87.setAttribute)(_el$6, "spellcheck", false);
            (0, import_web88.effect)(() => _el$6.value = editingEase() ? easeDraft() : formatEase(easing().ease));
            return _el$4;
          })()];
        }
      }), null);
      (0, import_web89.insert)(_el$, (0, import_web90.createComponent)(import_solid_js14.Show, {
        get when() {
          return isSimple();
        },
        get children() {
          return (0, import_web90.createComponent)(Slider, {
            label: "Bounce",
            get value() {
              return spring().bounce ?? 0.2;
            },
            onChange: (value) => handleSpringUpdate("bounce", value),
            min: 0,
            max: 1,
            step: 0.05
          });
        }
      }), null);
      (0, import_web89.insert)(_el$, (0, import_web90.createComponent)(import_solid_js14.Show, {
        get when() {
          return (0, import_web91.memo)(() => !!!isEasing())() && !isSimple();
        },
        get children() {
          return [(0, import_web90.createComponent)(Slider, {
            label: "Stiffness",
            get value() {
              return spring().stiffness ?? 400;
            },
            onChange: (value) => handleSpringUpdate("stiffness", value),
            min: 1,
            max: 1e3,
            step: 10
          }), (0, import_web90.createComponent)(Slider, {
            label: "Damping",
            get value() {
              return spring().damping ?? 17;
            },
            onChange: (value) => handleSpringUpdate("damping", value),
            min: 1,
            max: 100,
            step: 1
          }), (0, import_web90.createComponent)(Slider, {
            label: "Mass",
            get value() {
              return spring().mass ?? 1;
            },
            onChange: (value) => handleSpringUpdate("mass", value),
            min: 0.1,
            max: 10,
            step: 0.1
          })];
        }
      }), null);
      (0, import_web89.insert)(_el$, durationSlider, null);
      return _el$;
    }
  });
}
(0, import_web86.delegateEvents)(["input", "keydown"]);

// src/solid/components/TextControl.tsx
var import_web92 = require("solid-js/web");
var import_web93 = require("solid-js/web");
var import_web94 = require("solid-js/web");
var import_web95 = require("solid-js/web");
var import_web96 = require("solid-js/web");
var import_solid_js15 = require("solid-js");
var _tmpl$21 = /* @__PURE__ */ (0, import_web92.template)(`<div class=tweakers-text-control><label class=tweakers-text-label></label><input type=text class=tweakers-text-input>`);
function TextControl(props) {
  const inputId = (0, import_solid_js15.createUniqueId)();
  return (() => {
    var _el$ = _tmpl$21(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    (0, import_web96.setAttribute)(_el$2, "for", inputId);
    (0, import_web95.insert)(_el$2, () => props.label);
    _el$3.$$input = (e) => props.onChange(e.currentTarget.value);
    (0, import_web96.setAttribute)(_el$3, "id", inputId);
    (0, import_web94.effect)(() => (0, import_web96.setAttribute)(_el$3, "placeholder", props.placeholder));
    (0, import_web94.effect)(() => _el$3.value = props.value);
    return _el$;
  })();
}
(0, import_web93.delegateEvents)(["input"]);

// src/solid/components/SelectControl.tsx
var import_web97 = require("solid-js/web");
var import_web98 = require("solid-js/web");
var import_web99 = require("solid-js/web");
var import_web100 = require("solid-js/web");
var import_web101 = require("solid-js/web");
var import_web102 = require("solid-js/web");
var import_web103 = require("solid-js/web");
var import_web104 = require("solid-js/web");
var import_web105 = require("solid-js/web");
var import_solid_js16 = require("solid-js");
var import_web106 = require("solid-js/web");
var import_motion4 = require("motion");
var import_icons2 = require("tweakers/icons");
var _tmpl$30 = /* @__PURE__ */ (0, import_web97.template)(`<div class=tweakers-select-dropdown>`);
var _tmpl$212 = /* @__PURE__ */ (0, import_web97.template)(`<div class=tweakers-select-row><button class=tweakers-select-trigger><span class=tweakers-select-label></span><div class=tweakers-select-right><span class=tweakers-select-value></span><svg class=tweakers-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$38 = /* @__PURE__ */ (0, import_web97.template)(`<button class=tweakers-select-option>`);
function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
function normalizeOptions(options) {
  return options.map((opt) => typeof opt === "string" ? {
    value: opt,
    label: toTitleCase(opt)
  } : opt);
}
function SelectControl(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js16.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js16.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js16.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js16.createSignal)(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const normalized = () => normalizeOptions(props.options);
  const selectedOption = () => normalized().find((o) => o.value === props.value);
  (0, import_solid_js16.onMount)(() => {
    const root = triggerRef?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
    }
    (0, import_solid_js16.onCleanup)(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  (0, import_solid_js16.createEffect)(() => {
    if (!chevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    chevronAnim = (0, import_motion4.animate)(chevronRef, {
      rotate: open ? 180 : 0
    }, {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.15
    });
  });
  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const dropdownHeight = 8 + normalized().length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above
    });
  };
  const openDropdown = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    setMounted(true);
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    if (!dropdownRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = (0, import_motion4.animate)(dropdownRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
      }
    });
  };
  (0, import_solid_js16.createEffect)(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handleClick = (e) => {
      const target = e.target;
      if (triggerRef && !triggerRef.contains(target) && dropdownRef && !dropdownRef.contains(target)) {
        closeDropdown();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    (0, import_solid_js16.onCleanup)(() => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const dropdownStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: "fixed",
      left: `${p.left}px`,
      width: `${p.width}px`,
      ...p.above ? {
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom"
      } : {
        top: `${p.top}px`,
        "transform-origin": "top"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$212(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.firstChild;
    _el$2.$$click = () => isOpen() ? closeDropdown() : openDropdown();
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? (0, import_web105.use)(_ref$, _el$2) : triggerRef = _el$2;
    (0, import_web104.insert)(_el$3, () => props.label);
    (0, import_web104.insert)(_el$5, () => selectedOption()?.label ?? props.value);
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? (0, import_web105.use)(_ref$2, _el$6) : chevronRef = _el$6;
    (0, import_web102.setAttribute)(_el$7, "d", import_icons2.ICON_CHEVRON);
    (0, import_web104.insert)(_el$, (0, import_web101.createComponent)(import_solid_js16.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web101.createComponent)(import_web106.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web101.createComponent)(import_solid_js16.Show, {
              get when() {
                return (0, import_web103.memo)(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$30();
                (0, import_web105.use)((el) => {
                  dropdownRef = el;
                  const above = pos()?.above ?? false;
                  (0, import_motion4.animate)(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                (0, import_web104.insert)(_el$8, (0, import_web101.createComponent)(import_solid_js16.For, {
                  get each() {
                    return normalized();
                  },
                  children: (option) => (() => {
                    var _el$9 = _tmpl$38();
                    _el$9.$$click = () => {
                      props.onChange(option.value);
                      closeDropdown();
                    };
                    (0, import_web104.insert)(_el$9, () => option.label);
                    (0, import_web100.effect)(() => (0, import_web102.setAttribute)(_el$9, "data-selected", String(option.value === props.value)));
                    return _el$9;
                  })()
                }));
                (0, import_web100.effect)((_$p) => (0, import_web99.style)(_el$8, dropdownStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web100.effect)(() => (0, import_web102.setAttribute)(_el$2, "data-open", String(isOpen())));
    return _el$;
  })();
}
(0, import_web98.delegateEvents)(["click"]);

// src/solid/components/ColorControl.tsx
var import_web118 = require("solid-js/web");
var import_web119 = require("solid-js/web");
var import_web120 = require("solid-js/web");
var import_web121 = require("solid-js/web");
var import_web122 = require("solid-js/web");
var import_web123 = require("solid-js/web");
var import_web124 = require("solid-js/web");
var import_web125 = require("solid-js/web");
var import_web126 = require("solid-js/web");
var import_web127 = require("solid-js/web");
var import_solid_js18 = require("solid-js");
var import_web128 = require("solid-js/web");
var import_motion5 = require("motion");

// src/solid/components/ColorPickerPanel.tsx
var import_web107 = require("solid-js/web");
var import_web108 = require("solid-js/web");
var import_web109 = require("solid-js/web");
var import_web110 = require("solid-js/web");
var import_web111 = require("solid-js/web");
var import_web112 = require("solid-js/web");
var import_web113 = require("solid-js/web");
var import_web114 = require("solid-js/web");
var import_web115 = require("solid-js/web");
var import_web116 = require("solid-js/web");
var import_web117 = require("solid-js/web");
var import_solid_js17 = require("solid-js");
var import_color_core = require("tweakers/color-core");
var import_color_palette_store = require("tweakers/color-palette-store");
var _tmpl$31 = /* @__PURE__ */ (0, import_web107.template)(`<label class=tweakers-color-field><input type=text inputmode=decimal><span class=tweakers-color-field-label>`);
var _tmpl$213 = /* @__PURE__ */ (0, import_web107.template)(`<label class="tweakers-color-field tweakers-color-field-hex"><input type=text><span class=tweakers-color-field-label>HEX`);
var _tmpl$39 = /* @__PURE__ */ (0, import_web107.template)(`<button class=tweakers-color-palette-slot>`);
var _tmpl$45 = /* @__PURE__ */ (0, import_web107.template)(`<div class="tweakers-color-slider tweakers-color-alpha tweakers-checker"><div class=tweakers-color-alpha-gradient></div><div class=tweakers-color-slider-thumb>`);
var _tmpl$53 = /* @__PURE__ */ (0, import_web107.template)(`<div class=tweakers-color-palette>`);
var _tmpl$63 = /* @__PURE__ */ (0, import_web107.template)(`<div class=tweakers-color-picker><div class=tweakers-color-sv><div class=tweakers-color-sv-thumb></div></div><div class="tweakers-color-slider tweakers-color-hue"><div class=tweakers-color-slider-thumb></div></div><div class=tweakers-color-fields>`);
var FORMAT_OPTIONS = [{
  value: "hex",
  label: "HEX"
}, {
  value: "rgb",
  label: "RGB"
}, {
  value: "hsl",
  label: "HSL"
}, {
  value: "oklch",
  label: "OKLCH"
}];
var stickyFormat = "hex";
var BLACK = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
};
function createAreaDrag(onPoint) {
  let el;
  let dragging = false;
  const readPoint = (e) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };
  return {
    ref: (node) => {
      el = node;
    },
    onPointerDown: (e) => {
      e.preventDefault();
      el?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointerMove: (e) => {
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerUp: () => {
      dragging = false;
    },
    onPointerCancel: () => {
      dragging = false;
    }
  };
}
function ChannelField(props) {
  const [draft, setDraft] = (0, import_solid_js17.createSignal)(null);
  const display = () => draft() ?? String(props.value);
  const commit = () => {
    const d = draft();
    if (d !== null) props.onCommit(Number(d));
    setDraft(null);
  };
  return (() => {
    var _el$ = _tmpl$31(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    _el$2.$$keydown = (e) => {
      if (e.key === "Enter") {
        commit();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setDraft(null);
        e.currentTarget.blur();
      }
    };
    _el$2.addEventListener("blur", commit);
    _el$2.$$input = (e) => setDraft(e.currentTarget.value);
    _el$2.addEventListener("focus", (e) => {
      setDraft(String(props.value));
      e.currentTarget.select();
    });
    (0, import_web116.insert)(_el$3, () => props.spec.label);
    (0, import_web117.effect)(() => _el$2.value = display());
    return _el$;
  })();
}
function HexField(props) {
  const [draft, setDraft] = (0, import_solid_js17.createSignal)(null);
  const commit = () => {
    const d = draft();
    if (d !== null) {
      const normalized = (0, import_color_core.normalizeHex)(d, props.alpha);
      if (normalized) props.onCommit(normalized);
    }
    setDraft(null);
  };
  return (() => {
    var _el$4 = _tmpl$213(), _el$5 = _el$4.firstChild;
    _el$5.$$keydown = (e) => {
      if (e.key === "Enter") {
        commit();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setDraft(null);
        e.currentTarget.blur();
      }
    };
    _el$5.addEventListener("blur", commit);
    _el$5.$$input = (e) => setDraft(e.currentTarget.value);
    _el$5.addEventListener("focus", (e) => {
      setDraft(props.value);
      e.currentTarget.select();
    });
    (0, import_web115.setAttribute)(_el$5, "spellcheck", false);
    (0, import_web117.effect)(() => _el$5.value = (draft() ?? props.value).toUpperCase());
    return _el$4;
  })();
}
function PaletteSlot(props) {
  const [holding, setHolding] = (0, import_solid_js17.createSignal)(false);
  let timer = null;
  let origin = null;
  let fired = false;
  const cancelHold = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    origin = null;
    setHolding(false);
  };
  (0, import_solid_js17.onCleanup)(cancelHold);
  return (() => {
    var _el$6 = _tmpl$39();
    _el$6.$$click = () => {
      if (fired) {
        fired = false;
        return;
      }
      if (props.color) props.onApply();
      else props.onSave();
    };
    _el$6.addEventListener("pointercancel", cancelHold);
    _el$6.addEventListener("pointerleave", cancelHold);
    _el$6.$$pointerup = cancelHold;
    _el$6.$$pointermove = (e) => {
      if (!origin) return;
      if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > import_color_core.PALETTE_DRAG_CANCEL_PX) {
        cancelHold();
      }
    };
    _el$6.$$pointerdown = (e) => {
      fired = false;
      if (!props.color) return;
      origin = {
        x: e.clientX,
        y: e.clientY
      };
      setHolding(true);
      timer = setTimeout(() => {
        fired = true;
        cancelHold();
        props.onClear();
      }, import_color_core.LONG_PRESS_MS);
    };
    _el$6.$$contextmenu = (e) => e.preventDefault();
    (0, import_web117.effect)((_p$) => {
      var _v$ = String(props.color !== null), _v$2 = String(holding()), _v$3 = props.color ? {
        "--swatch-color": props.color
      } : void 0, _v$4 = props.color ? `${props.color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color";
      _v$ !== _p$.e && (0, import_web115.setAttribute)(_el$6, "data-filled", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web115.setAttribute)(_el$6, "data-holding", _p$.t = _v$2);
      _p$.a = (0, import_web114.style)(_el$6, _v$3, _p$.a);
      _v$4 !== _p$.o && (0, import_web115.setAttribute)(_el$6, "title", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$6;
  })();
}
function ColorPickerPanel(props) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const initialRgba = (0, import_color_core.parseHex)(props.value);
  const [hsva, setHsva] = (0, import_solid_js17.createSignal)(initialRgba ? (0, import_color_core.rgbToHsv)(initialRgba) : BLACK);
  const [format, setFormat] = (0, import_solid_js17.createSignal)(stickyFormat);
  const [slots, setSlots] = (0, import_solid_js17.createSignal)(props.palette ? (0, import_color_palette_store.loadPalette)() : (0, import_color_core.emptyPalette)());
  let lastEmitted = props.value;
  (0, import_solid_js17.createEffect)(() => {
    const value = props.value;
    if (value === lastEmitted) return;
    lastEmitted = value;
    const rgba2 = (0, import_color_core.parseHex)(value);
    if (rgba2) setHsva((0, import_color_core.rgbToHsv)(rgba2));
  });
  (0, import_solid_js17.createEffect)(() => {
    if (!palette()) return;
    (0, import_solid_js17.onCleanup)((0, import_color_palette_store.subscribePalette)((s) => setSlots(s)));
  });
  const emit = (next) => {
    setHsva(next);
    const hex = (0, import_color_core.formatHex)((0, import_color_core.hsvToRgb)(next), alpha());
    lastEmitted = hex;
    props.onChange(hex);
  };
  const applyHex = (hex) => {
    const rgba2 = (0, import_color_core.parseHex)(hex);
    if (!rgba2) return;
    const normalized = (0, import_color_core.formatHex)(rgba2, alpha());
    setHsva((0, import_color_core.rgbToHsv)(rgba2));
    lastEmitted = normalized;
    props.onChange(normalized);
  };
  const svDrag = createAreaDrag((x, y) => emit({
    ...hsva(),
    s: x,
    v: 1 - y
  }));
  const hueDrag = createAreaDrag((x) => emit({
    ...hsva(),
    h: Math.min(x * 360, 359.999)
  }));
  const alphaDrag = createAreaDrag((x) => emit({
    ...hsva(),
    a: x
  }));
  const rgba = () => (0, import_color_core.hsvToRgb)(hsva());
  const opaqueHex = () => (0, import_color_core.formatHex)(rgba(), false);
  const currentHex = () => (0, import_color_core.formatHex)(rgba(), alpha());
  const channelSpecs = () => format() === "hex" ? [] : (0, import_color_core.getChannels)(format(), alpha());
  const channelValues = () => format() === "hex" ? [] : (0, import_color_core.rgbaToChannels)(rgba(), format(), alpha());
  const commitChannel = (index, n) => {
    const next = [...channelValues()];
    next[index] = n;
    const committed = (0, import_color_core.channelsToRgba)(next, format(), alpha());
    const nextHsva = (0, import_color_core.rgbToHsv)(committed);
    if (nextHsva.s === 0) nextHsva.h = hsva().h;
    if (nextHsva.v === 0) nextHsva.s = hsva().s;
    emit(nextHsva);
  };
  return (() => {
    var _el$7 = _tmpl$63(), _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$0 = _el$8.nextSibling, _el$1 = _el$0.firstChild, _el$13 = _el$0.nextSibling;
    (0, import_web112.addEventListener)(_el$8, "pointercancel", svDrag.onPointerCancel);
    (0, import_web112.addEventListener)(_el$8, "pointerup", svDrag.onPointerUp, true);
    (0, import_web112.addEventListener)(_el$8, "pointermove", svDrag.onPointerMove, true);
    (0, import_web112.addEventListener)(_el$8, "pointerdown", svDrag.onPointerDown, true);
    var _ref$ = svDrag.ref;
    typeof _ref$ === "function" ? (0, import_web113.use)(_ref$, _el$8) : svDrag.ref = _el$8;
    (0, import_web112.addEventListener)(_el$0, "pointercancel", hueDrag.onPointerCancel);
    (0, import_web112.addEventListener)(_el$0, "pointerup", hueDrag.onPointerUp, true);
    (0, import_web112.addEventListener)(_el$0, "pointermove", hueDrag.onPointerMove, true);
    (0, import_web112.addEventListener)(_el$0, "pointerdown", hueDrag.onPointerDown, true);
    var _ref$2 = hueDrag.ref;
    typeof _ref$2 === "function" ? (0, import_web113.use)(_ref$2, _el$0) : hueDrag.ref = _el$0;
    (0, import_web116.insert)(_el$7, (0, import_web110.createComponent)(import_solid_js17.Show, {
      get when() {
        return alpha();
      },
      get children() {
        var _el$10 = _tmpl$45(), _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling;
        (0, import_web112.addEventListener)(_el$10, "pointercancel", alphaDrag.onPointerCancel);
        (0, import_web112.addEventListener)(_el$10, "pointerup", alphaDrag.onPointerUp, true);
        (0, import_web112.addEventListener)(_el$10, "pointermove", alphaDrag.onPointerMove, true);
        (0, import_web112.addEventListener)(_el$10, "pointerdown", alphaDrag.onPointerDown, true);
        var _ref$3 = alphaDrag.ref;
        typeof _ref$3 === "function" ? (0, import_web113.use)(_ref$3, _el$10) : alphaDrag.ref = _el$10;
        (0, import_web117.effect)((_p$) => {
          var _v$5 = `linear-gradient(to right, transparent, ${opaqueHex()})`, _v$6 = `${hsva().a * 100}%`, _v$7 = opaqueHex(), _v$8 = Math.max(hsva().a, 0.15);
          _v$5 !== _p$.e && (0, import_web111.setStyleProperty)(_el$11, "background", _p$.e = _v$5);
          _v$6 !== _p$.t && (0, import_web111.setStyleProperty)(_el$12, "left", _p$.t = _v$6);
          _v$7 !== _p$.a && (0, import_web111.setStyleProperty)(_el$12, "background", _p$.a = _v$7);
          _v$8 !== _p$.o && (0, import_web111.setStyleProperty)(_el$12, "opacity", _p$.o = _v$8);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$10;
      }
    }), _el$13);
    (0, import_web116.insert)(_el$7, (0, import_web110.createComponent)(SegmentedControl, {
      options: FORMAT_OPTIONS,
      get value() {
        return format();
      },
      onChange: (f) => {
        stickyFormat = f;
        setFormat(f);
      }
    }), _el$13);
    (0, import_web116.insert)(_el$13, (0, import_web110.createComponent)(import_solid_js17.Show, {
      get when() {
        return format() === "hex";
      },
      get fallback() {
        return (0, import_web110.createComponent)(import_solid_js17.For, {
          get each() {
            return channelSpecs();
          },
          children: (spec, i) => (0, import_web110.createComponent)(ChannelField, {
            spec,
            get value() {
              return channelValues()[i()];
            },
            onCommit: (n) => commitChannel(i(), n)
          })
        });
      },
      get children() {
        return [(0, import_web110.createComponent)(HexField, {
          get value() {
            return currentHex();
          },
          get alpha() {
            return alpha();
          },
          onCommit: applyHex
        }), (0, import_web110.createComponent)(import_solid_js17.Show, {
          get when() {
            return alpha();
          },
          get children() {
            return (0, import_web110.createComponent)(ChannelField, {
              spec: {
                key: "a",
                label: "A",
                min: 0,
                max: 100,
                step: 1,
                precision: 0
              },
              get value() {
                return (0, import_color_core.opacityPercent)(rgba());
              },
              onCommit: (n) => emit({
                ...hsva(),
                a: Math.min(1, Math.max(0, n / 100))
              })
            });
          }
        })];
      }
    }));
    (0, import_web116.insert)(_el$7, (0, import_web110.createComponent)(import_solid_js17.Show, {
      get when() {
        return palette();
      },
      get children() {
        var _el$14 = _tmpl$53();
        (0, import_web116.insert)(_el$14, (0, import_web110.createComponent)(import_solid_js17.For, {
          get each() {
            return Array.from({
              length: import_color_core.PALETTE_SIZE
            }, (_, i) => i);
          },
          children: (i) => (0, import_web110.createComponent)(PaletteSlot, {
            get color() {
              return slots()[i] ?? null;
            },
            onSave: () => (0, import_color_palette_store.savePalette)((0, import_color_palette_store.loadPalette)().map((s, j) => j === i ? currentHex() : s)),
            onApply: () => {
              const saved = slots()[i];
              if (saved) applyHex(saved);
            },
            onClear: () => (0, import_color_palette_store.savePalette)((0, import_color_palette_store.loadPalette)().map((s, j) => j === i ? null : s))
          })
        }));
        return _el$14;
      }
    }), null);
    (0, import_web117.effect)((_p$) => {
      var _v$9 = String(hsva().h), _v$0 = `${hsva().s * 100}%`, _v$1 = `${(1 - hsva().v) * 100}%`, _v$10 = opaqueHex(), _v$11 = `${hsva().h / 360 * 100}%`, _v$12 = `hsl(${hsva().h} 100% 50%)`, _v$13 = format();
      _v$9 !== _p$.e && (0, import_web111.setStyleProperty)(_el$7, "--picker-hue", _p$.e = _v$9);
      _v$0 !== _p$.t && (0, import_web111.setStyleProperty)(_el$9, "left", _p$.t = _v$0);
      _v$1 !== _p$.a && (0, import_web111.setStyleProperty)(_el$9, "top", _p$.a = _v$1);
      _v$10 !== _p$.o && (0, import_web111.setStyleProperty)(_el$9, "background", _p$.o = _v$10);
      _v$11 !== _p$.i && (0, import_web111.setStyleProperty)(_el$1, "left", _p$.i = _v$11);
      _v$12 !== _p$.n && (0, import_web111.setStyleProperty)(_el$1, "background", _p$.n = _v$12);
      _v$13 !== _p$.s && (0, import_web115.setAttribute)(_el$13, "data-format", _p$.s = _v$13);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    });
    return _el$7;
  })();
}
(0, import_web108.delegateEvents)(["input", "keydown", "contextmenu", "pointerdown", "pointermove", "pointerup", "click"]);

// src/solid/components/ColorControl.tsx
var import_color_core2 = require("tweakers/color-core");
var _tmpl$40 = /* @__PURE__ */ (0, import_web118.template)(`<input type=text class=tweakers-color-hex-input>`);
var _tmpl$214 = /* @__PURE__ */ (0, import_web118.template)(`<div class=tweakers-color-picker-popover>`);
var _tmpl$310 = /* @__PURE__ */ (0, import_web118.template)(`<div class=tweakers-color-control><span class=tweakers-color-label></span><div class=tweakers-color-inputs><span class=tweakers-color-hex-wrap><span class=tweakers-color-hash aria-hidden=true>#</span></span><button class=tweakers-color-swatch title="Pick color">`);
var _tmpl$46 = /* @__PURE__ */ (0, import_web118.template)(`<span class=tweakers-color-hex>`);
var _tmpl$54 = /* @__PURE__ */ (0, import_web118.template)(`<span class=tweakers-color-divider aria-hidden=true>`);
var _tmpl$64 = /* @__PURE__ */ (0, import_web118.template)(`<span class=tweakers-color-opacity> <span class=tweakers-color-opacity-unit>%`);
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
function ColorControl(props) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const [isEditing, setIsEditing] = (0, import_solid_js18.createSignal)(false);
  const [editValue, setEditValue] = (0, import_solid_js18.createSignal)((0, import_color_core2.bareHex)(props.value));
  const [isOpen, setIsOpen] = (0, import_solid_js18.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js18.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js18.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js18.createSignal)(null);
  let swatchRef;
  let pickerRef;
  let closeAnim = null;
  const rgba = () => (0, import_color_core2.parseHex)(props.value);
  (0, import_solid_js18.createEffect)(() => {
    const value = props.value;
    if (!isEditing()) {
      setEditValue((0, import_color_core2.bareHex)(value));
    }
  });
  (0, import_solid_js18.onMount)(() => {
    const root = swatchRef?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
    (0, import_solid_js18.onCleanup)(() => {
      closeAnim?.stop();
    });
  });
  const updatePos = () => {
    if (!swatchRef) return;
    const rect = swatchRef.getBoundingClientRect();
    const pickerHeight = PICKER_BASE_HEIGHT + (alpha() ? PICKER_ALPHA_HEIGHT : 0) + (palette() ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left,
      above
    });
  };
  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    if (pickerRef) {
      (0, import_motion5.animate)(pickerRef, {
        opacity: 1,
        y: 0,
        scale: 1
      }, {
        type: "spring",
        visualDuration: 0.15,
        bounce: 0
      });
    }
    setMounted(true);
    setIsOpen(true);
  };
  const closePopover = () => {
    setIsOpen(false);
    if (!pickerRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = (0, import_motion5.animate)(pickerRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
        pickerRef = void 0;
      }
    });
  };
  (0, import_solid_js18.createEffect)(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handleMouseDown = (e) => {
      const target = e.target;
      if (swatchRef?.contains(target) || pickerRef?.contains(target)) return;
      closePopover();
    };
    const handleKeyDown2 = (e) => {
      if (e.key === "Escape") {
        closePopover();
        swatchRef?.focus();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown2);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    (0, import_solid_js18.onCleanup)(() => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown2);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const handleTextSubmit = () => {
    setIsEditing(false);
    const normalized = (0, import_color_core2.normalizeHexEdit)(editValue(), alpha(), rgba()?.a ?? 1);
    if (normalized) {
      props.onChange(normalized);
    } else {
      setEditValue((0, import_color_core2.bareHex)(props.value));
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTextSubmit();
    else if (e.key === "Escape") {
      e.stopPropagation();
      setIsEditing(false);
      setEditValue((0, import_color_core2.bareHex)(props.value));
    }
  };
  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: "fixed",
      left: `${p.left}px`,
      width: `${PICKER_WIDTH}px`,
      ...p.above ? {
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom right"
      } : {
        top: `${p.top}px`,
        "transform-origin": "top right"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$310(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$7 = _el$4.nextSibling;
    (0, import_web127.insert)(_el$2, () => props.label);
    _el$4.$$click = () => setIsEditing(true);
    (0, import_web127.insert)(_el$4, (0, import_web123.createComponent)(import_solid_js18.Show, {
      get when() {
        return isEditing();
      },
      get fallback() {
        return (() => {
          var _el$9 = _tmpl$46();
          (0, import_web127.insert)(_el$9, () => (0, import_color_core2.bareHex)(props.value));
          (0, import_web125.effect)(() => (0, import_web124.setAttribute)(_el$9, "aria-label", `Hex color for ${props.label}`));
          return _el$9;
        })();
      },
      get children() {
        var _el$6 = _tmpl$40();
        _el$6.$$keydown = handleKeyDown;
        _el$6.addEventListener("blur", handleTextSubmit);
        _el$6.$$input = (e) => setEditValue(e.currentTarget.value);
        (0, import_web126.use)((el) => queueMicrotask(() => {
          el.focus();
          el.select();
        }), _el$6);
        (0, import_web125.effect)(() => (0, import_web124.setAttribute)(_el$6, "aria-label", `Hex color for ${props.label}`));
        (0, import_web125.effect)(() => _el$6.value = editValue());
        return _el$6;
      }
    }), null);
    (0, import_web127.insert)(_el$3, (0, import_web123.createComponent)(import_solid_js18.Show, {
      get when() {
        return (0, import_web122.memo)(() => !!alpha())() && rgba();
      },
      children: (r) => [_tmpl$54(), (() => {
        var _el$1 = _tmpl$64(), _el$10 = _el$1.firstChild;
        (0, import_web127.insert)(_el$1, () => (0, import_color_core2.opacityPercent)(r()), _el$10);
        return _el$1;
      })()]
    }), _el$7);
    _el$7.$$click = () => isOpen() ? closePopover() : openPopover();
    var _ref$ = swatchRef;
    typeof _ref$ === "function" ? (0, import_web126.use)(_ref$, _el$7) : swatchRef = _el$7;
    (0, import_web127.insert)(_el$, (0, import_web123.createComponent)(import_solid_js18.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web123.createComponent)(import_web128.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web123.createComponent)(import_solid_js18.Show, {
              get when() {
                return (0, import_web122.memo)(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$214();
                (0, import_web126.use)((el) => {
                  pickerRef = el;
                  const above = pos()?.above ?? false;
                  (0, import_motion5.animate)(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                (0, import_web127.insert)(_el$8, (0, import_web123.createComponent)(ColorPickerPanel, {
                  get value() {
                    return props.value;
                  },
                  onChange: (v) => props.onChange(v),
                  get alpha() {
                    return alpha();
                  },
                  get palette() {
                    return palette();
                  }
                }));
                (0, import_web125.effect)((_$p) => (0, import_web121.style)(_el$8, popoverStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web125.effect)((_p$) => {
      var _v$ = props.value, _v$2 = String(isOpen()), _v$3 = `Pick color for ${props.label}`, _v$4 = isOpen();
      _v$ !== _p$.e && (0, import_web120.setStyleProperty)(_el$7, "--swatch-color", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web124.setAttribute)(_el$7, "data-open", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web124.setAttribute)(_el$7, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web124.setAttribute)(_el$7, "aria-expanded", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
(0, import_web119.delegateEvents)(["click", "input", "keydown"]);

// src/solid/components/GradientControl.tsx
var import_web146 = require("solid-js/web");
var import_web147 = require("solid-js/web");
var import_web148 = require("solid-js/web");
var import_web149 = require("solid-js/web");
var import_web150 = require("solid-js/web");
var import_web151 = require("solid-js/web");
var import_web152 = require("solid-js/web");
var import_web153 = require("solid-js/web");
var import_web154 = require("solid-js/web");
var import_web155 = require("solid-js/web");
var import_solid_js21 = require("solid-js");
var import_web156 = require("solid-js/web");
var import_motion6 = require("motion");

// src/solid/components/GradientPanel.tsx
var import_web138 = require("solid-js/web");
var import_web139 = require("solid-js/web");
var import_web140 = require("solid-js/web");
var import_web141 = require("solid-js/web");
var import_web142 = require("solid-js/web");
var import_web143 = require("solid-js/web");
var import_web144 = require("solid-js/web");
var import_web145 = require("solid-js/web");
var import_solid_js20 = require("solid-js");

// src/solid/components/GradientTransformPad.tsx
var import_web129 = require("solid-js/web");
var import_web130 = require("solid-js/web");
var import_web131 = require("solid-js/web");
var import_web132 = require("solid-js/web");
var import_web133 = require("solid-js/web");
var import_web134 = require("solid-js/web");
var import_web135 = require("solid-js/web");
var import_web136 = require("solid-js/web");
var import_web137 = require("solid-js/web");
var import_solid_js19 = require("solid-js");
var import_gradient_core2 = require("tweakers/gradient-core");
var _tmpl$41 = /* @__PURE__ */ (0, import_web129.template)(`<div class=tweakers-gradient-pad-line>`);
var _tmpl$215 = /* @__PURE__ */ (0, import_web129.template)(`<button type=button class=tweakers-gradient-pad-handle data-kind=major aria-label="Gradient size and rotation">`);
var _tmpl$311 = /* @__PURE__ */ (0, import_web129.template)(`<button type=button class=tweakers-gradient-pad-handle data-kind=minor aria-label="Gradient squash">`);
var _tmpl$47 = /* @__PURE__ */ (0, import_web129.template)(`<button type=button class=tweakers-gradient-pad-handle data-kind=angle aria-label="Gradient angle">`);
var _tmpl$55 = /* @__PURE__ */ (0, import_web129.template)(`<button type=button class=tweakers-gradient-pad-handle data-kind=center aria-label="Gradient center">`);
var _tmpl$65 = /* @__PURE__ */ (0, import_web129.template)(`<div class="tweakers-gradient-pad tweakers-checker"><div class=tweakers-gradient-pad-fill>`);
var clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
function GradientTransformPad(props) {
  let padRef;
  let drag = null;
  const [size, setSize] = (0, import_solid_js19.createSignal)({
    w: 0,
    h: 0
  });
  (0, import_solid_js19.onMount)(() => {
    const measure = () => setSize({
      w: padRef.clientWidth,
      h: padRef.clientHeight
    });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(padRef);
    (0, import_solid_js19.onCleanup)(() => ro.disconnect());
  });
  const radial = () => props.value.type === "radial";
  const conic = () => props.value.type === "conic";
  const cx = () => props.value.centerX ?? 50;
  const cy = () => props.value.centerY ?? 50;
  const scale = () => props.value.scale ?? 100;
  const rotation = () => props.value.rotation ?? 0;
  const cxPx = () => cx() / 100 * size().w;
  const cyPx = () => cy() / 100 * size().h;
  const rxPx = () => scale() / 100 * size().w;
  const ryPx = () => Math.max(10, (props.value.squash ?? scale()) / 100 * size().h);
  const theta = () => rotation() * RAD;
  const pin = (x, y) => ({
    x: clamp(x, 5, size().w - 5),
    y: clamp(y, 5, size().h - 5)
  });
  const major = () => pin(cxPx() + Math.cos(theta()) * rxPx(), cyPx() + Math.sin(theta()) * rxPx());
  const minor = () => pin(cxPx() - Math.sin(theta()) * ryPx(), cyPx() + Math.cos(theta()) * ryPx());
  const majorLineLen = () => Math.hypot(major().x - cxPx(), major().y - cyPx());
  const majorLineAngle = () => Math.atan2(major().y - cyPx(), major().x - cxPx()) / RAD;
  const angleOx = () => conic() ? cxPx() : size().w / 2;
  const angleOy = () => conic() ? cyPx() : size().h / 2;
  const spokeR = () => Math.max(10, Math.min(size().w, size().h) / 2 - 8);
  const aTheta = () => props.value.angle * RAD;
  const angleHandle = () => pin(angleOx() + Math.sin(aTheta()) * spokeR(), angleOy() - Math.cos(aTheta()) * spokeR());
  const angleLineLen = () => Math.hypot(angleHandle().x - angleOx(), angleHandle().y - angleOy());
  const angleLineAngle = () => Math.atan2(angleHandle().y - angleOy(), angleHandle().x - angleOx()) / RAD;
  const onHandleDown = (kind) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
    drag = {
      kind,
      pointerId: e.pointerId
    };
  };
  const onHandleMove = (e) => {
    if (!drag || drag.pointerId !== e.pointerId || !padRef) return;
    const kind = drag.kind;
    if (e.buttons === 0) {
      drag = null;
      return;
    }
    const rect = padRef.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (kind === "center") {
      props.onChange((0, import_gradient_core2.setGradientCenter)(props.value, px / rect.width * 100, py / rect.height * 100));
      return;
    }
    if (kind === "angle") {
      const ox = conic() ? cx() / 100 * rect.width : rect.width / 2;
      const oy = conic() ? cy() / 100 * rect.height : rect.height / 2;
      props.onChange((0, import_gradient_core2.setGradientAngle)(props.value, vectorToAngle(px - ox, py - oy)));
      return;
    }
    const dx = px - cx() / 100 * rect.width;
    const dy = py - cy() / 100 * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;
    if (kind === "major") {
      const nextScale = dist / rect.width * 100;
      props.onChange((0, import_gradient_core2.setGradientScale)((0, import_gradient_core2.setGradientRotation)(props.value, deg), nextScale));
      return;
    }
    const nextSquash = dist / rect.height * 100;
    props.onChange((0, import_gradient_core2.setGradientRotation)((0, import_gradient_core2.setGradientSquash)(props.value, nextSquash), deg - 90));
  };
  const onHandleUp = (e) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };
  const fill = () => (0, import_gradient_core2.gradientFillBox)(props.value, size().w, size().h);
  return (() => {
    var _el$ = _tmpl$65(), _el$2 = _el$.firstChild;
    var _ref$ = padRef;
    typeof _ref$ === "function" ? (0, import_web137.use)(_ref$, _el$) : padRef = _el$;
    (0, import_web131.insert)(_el$, (0, import_web133.createComponent)(import_solid_js19.Show, {
      get when() {
        return radial();
      },
      get children() {
        return [(() => {
          var _el$3 = _tmpl$41();
          (0, import_web136.effect)((_p$) => {
            var _v$ = `${cxPx()}px`, _v$2 = `${cyPx()}px`, _v$3 = `${majorLineLen()}px`, _v$4 = `rotate(${majorLineAngle()}deg)`;
            _v$ !== _p$.e && (0, import_web135.setStyleProperty)(_el$3, "left", _p$.e = _v$);
            _v$2 !== _p$.t && (0, import_web135.setStyleProperty)(_el$3, "top", _p$.t = _v$2);
            _v$3 !== _p$.a && (0, import_web135.setStyleProperty)(_el$3, "width", _p$.a = _v$3);
            _v$4 !== _p$.o && (0, import_web135.setStyleProperty)(_el$3, "transform", _p$.o = _v$4);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$3;
        })(), (() => {
          var _el$4 = _tmpl$215();
          _el$4.addEventListener("lostpointercapture", onHandleUp);
          _el$4.addEventListener("pointercancel", onHandleUp);
          _el$4.$$pointerup = onHandleUp;
          _el$4.$$pointermove = onHandleMove;
          (0, import_web134.addEventListener)(_el$4, "pointerdown", onHandleDown("major"), true);
          (0, import_web136.effect)((_p$) => {
            var _v$5 = `${major().x}px`, _v$6 = `${major().y}px`;
            _v$5 !== _p$.e && (0, import_web135.setStyleProperty)(_el$4, "left", _p$.e = _v$5);
            _v$6 !== _p$.t && (0, import_web135.setStyleProperty)(_el$4, "top", _p$.t = _v$6);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$4;
        })(), (() => {
          var _el$5 = _tmpl$311();
          _el$5.addEventListener("lostpointercapture", onHandleUp);
          _el$5.addEventListener("pointercancel", onHandleUp);
          _el$5.$$pointerup = onHandleUp;
          _el$5.$$pointermove = onHandleMove;
          (0, import_web134.addEventListener)(_el$5, "pointerdown", onHandleDown("minor"), true);
          (0, import_web136.effect)((_p$) => {
            var _v$7 = `${minor().x}px`, _v$8 = `${minor().y}px`;
            _v$7 !== _p$.e && (0, import_web135.setStyleProperty)(_el$5, "left", _p$.e = _v$7);
            _v$8 !== _p$.t && (0, import_web135.setStyleProperty)(_el$5, "top", _p$.t = _v$8);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$5;
        })()];
      }
    }), null);
    (0, import_web131.insert)(_el$, (0, import_web133.createComponent)(import_solid_js19.Show, {
      get when() {
        return !radial();
      },
      get children() {
        return [(() => {
          var _el$6 = _tmpl$41();
          (0, import_web136.effect)((_p$) => {
            var _v$9 = `${angleOx()}px`, _v$0 = `${angleOy()}px`, _v$1 = `${angleLineLen()}px`, _v$10 = `rotate(${angleLineAngle()}deg)`;
            _v$9 !== _p$.e && (0, import_web135.setStyleProperty)(_el$6, "left", _p$.e = _v$9);
            _v$0 !== _p$.t && (0, import_web135.setStyleProperty)(_el$6, "top", _p$.t = _v$0);
            _v$1 !== _p$.a && (0, import_web135.setStyleProperty)(_el$6, "width", _p$.a = _v$1);
            _v$10 !== _p$.o && (0, import_web135.setStyleProperty)(_el$6, "transform", _p$.o = _v$10);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$6;
        })(), (() => {
          var _el$7 = _tmpl$47();
          _el$7.addEventListener("lostpointercapture", onHandleUp);
          _el$7.addEventListener("pointercancel", onHandleUp);
          _el$7.$$pointerup = onHandleUp;
          _el$7.$$pointermove = onHandleMove;
          (0, import_web134.addEventListener)(_el$7, "pointerdown", onHandleDown("angle"), true);
          (0, import_web136.effect)((_p$) => {
            var _v$11 = `${angleHandle().x}px`, _v$12 = `${angleHandle().y}px`;
            _v$11 !== _p$.e && (0, import_web135.setStyleProperty)(_el$7, "left", _p$.e = _v$11);
            _v$12 !== _p$.t && (0, import_web135.setStyleProperty)(_el$7, "top", _p$.t = _v$12);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$7;
        })()];
      }
    }), null);
    (0, import_web131.insert)(_el$, (0, import_web133.createComponent)(import_solid_js19.Show, {
      get when() {
        return radial() || conic();
      },
      get children() {
        var _el$8 = _tmpl$55();
        _el$8.addEventListener("lostpointercapture", onHandleUp);
        _el$8.addEventListener("pointercancel", onHandleUp);
        _el$8.$$pointerup = onHandleUp;
        _el$8.$$pointermove = onHandleMove;
        (0, import_web134.addEventListener)(_el$8, "pointerdown", onHandleDown("center"), true);
        (0, import_web136.effect)((_p$) => {
          var _v$13 = `${clamp(cxPx(), 5, size().w - 5)}px`, _v$14 = `${clamp(cyPx(), 5, size().h - 5)}px`;
          _v$13 !== _p$.e && (0, import_web135.setStyleProperty)(_el$8, "left", _p$.e = _v$13);
          _v$14 !== _p$.t && (0, import_web135.setStyleProperty)(_el$8, "top", _p$.t = _v$14);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$8;
      }
    }), null);
    (0, import_web136.effect)((_p$) => {
      var _v$15 = fill().background, _v$16 = fill().transform, _v$17 = fill().transformOrigin, _v$18 = `${fill().left}px`, _v$19 = `${fill().top}px`, _v$20 = `${fill().width}px`, _v$21 = `${fill().height}px`;
      _v$15 !== _p$.e && (0, import_web135.setStyleProperty)(_el$2, "background", _p$.e = _v$15);
      _v$16 !== _p$.t && (0, import_web135.setStyleProperty)(_el$2, "transform", _p$.t = _v$16);
      _v$17 !== _p$.a && (0, import_web135.setStyleProperty)(_el$2, "transform-origin", _p$.a = _v$17);
      _v$18 !== _p$.o && (0, import_web135.setStyleProperty)(_el$2, "left", _p$.o = _v$18);
      _v$19 !== _p$.i && (0, import_web135.setStyleProperty)(_el$2, "top", _p$.i = _v$19);
      _v$20 !== _p$.n && (0, import_web135.setStyleProperty)(_el$2, "width", _p$.n = _v$20);
      _v$21 !== _p$.s && (0, import_web135.setStyleProperty)(_el$2, "height", _p$.s = _v$21);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    });
    return _el$;
  })();
}
(0, import_web130.delegateEvents)(["pointerdown", "pointermove", "pointerup"]);

// src/solid/components/GradientPanel.tsx
var import_icons3 = require("tweakers/icons");
var import_gradient_core3 = require("tweakers/gradient-core");
var _tmpl$48 = /* @__PURE__ */ (0, import_web138.template)(`<div class=tweakers-gradient-panel><div class=tweakers-gradient-toolbar><button type=button class=tweakers-gradient-grip aria-label="Drag to move"title="Drag to move"><svg viewBox="0 0 24 24"fill=currentColor aria-hidden=true></svg></button></div><div class=tweakers-gradient-strip></div><span class=tweakers-gradient-divider aria-hidden=true>`);
var _tmpl$216 = /* @__PURE__ */ (0, import_web138.template)(`<svg><circle r=1.5></svg>`, false, true, false);
var _tmpl$312 = /* @__PURE__ */ (0, import_web138.template)(`<button type=button class=tweakers-gradient-stop>`);
var TYPE_OPTIONS = [{
  value: "linear",
  label: "Linear"
}, {
  value: "radial",
  label: "Radial"
}, {
  value: "conic",
  label: "Conic"
}];
function rampCss(stops) {
  return (0, import_gradient_core3.gradientToCss)({
    type: "linear",
    angle: 90,
    stops
  });
}
function GradientPanel(props) {
  const [selectedIndex, setSelectedIndex] = (0, import_solid_js20.createSignal)(0);
  const [holdingIndex, setHoldingIndex] = (0, import_solid_js20.createSignal)(-1);
  const [detach, setDetach] = (0, import_solid_js20.createSignal)(null);
  let stripRef;
  let gripRef;
  let gripOrigin = null;
  const onGripDown = (e) => {
    e.preventDefault();
    try {
      gripRef.setPointerCapture(e.pointerId);
    } catch {
    }
    gripOrigin = {
      x: e.clientX,
      y: e.clientY
    };
  };
  const onGripMove = (e) => {
    if (!gripOrigin || e.buttons === 0) return;
    props.onDrag?.(e.clientX - gripOrigin.x, e.clientY - gripOrigin.y);
    gripOrigin = {
      x: e.clientX,
      y: e.clientY
    };
  };
  const onGripUp = () => {
    gripOrigin = null;
  };
  const drag = {
    mode: "idle",
    activeIndex: -1,
    originX: 0,
    originY: 0,
    timer: null,
    working: props.value
  };
  const safeIndex = () => Math.min(selectedIndex(), props.value.stops.length - 1);
  const stripPos = (clientX) => {
    const rect = stripRef.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = () => {
    const rect = stripRef.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };
  const clearTimer = () => {
    if (drag.timer) clearTimeout(drag.timer);
    drag.timer = null;
  };
  (0, import_solid_js20.onCleanup)(clearTimer);
  const resetDrag = () => {
    clearTimer();
    drag.mode = "idle";
    setHoldingIndex(-1);
  };
  const commitMove = (clientX) => {
    const r = (0, import_gradient_core3.moveStop)(drag.working, drag.activeIndex, stripPos(clientX));
    drag.working = r.value;
    drag.activeIndex = r.index;
    setSelectedIndex(r.index);
    props.onChange(r.value);
  };
  const onPointerDown = (e) => {
    e.preventDefault();
    try {
      stripRef.setPointerCapture(e.pointerId);
    } catch {
    }
    drag.originX = e.clientX;
    drag.originY = e.clientY;
    drag.working = props.value;
    const handle = e.target.closest(".tweakers-gradient-stop");
    if (handle) {
      const index2 = Number(handle.dataset.index);
      setSelectedIndex(index2);
      drag.activeIndex = index2;
      drag.mode = "pending";
      if (props.value.stops.length > import_gradient_core3.MIN_STOPS) {
        setHoldingIndex(index2);
        drag.timer = setTimeout(() => {
          drag.timer = null;
          drag.mode = "idle";
          setHoldingIndex(-1);
          const next2 = (0, import_gradient_core3.removeStop)(props.value, index2);
          props.onChange(next2);
          setSelectedIndex(Math.min(index2, next2.stops.length - 1));
        }, import_gradient_core3.LONG_PRESS_MS);
      }
      return;
    }
    const {
      value: next,
      index
    } = (0, import_gradient_core3.addStop)(props.value, stripPos(e.clientX));
    drag.working = next;
    drag.activeIndex = index;
    drag.mode = "dragging";
    setSelectedIndex(index);
    props.onChange(next);
  };
  const onPointerMove = (e) => {
    if (drag.mode === "idle") return;
    if (e.buttons === 0) {
      setDetach(null);
      resetDrag();
      return;
    }
    if (drag.mode === "pending") {
      if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= import_gradient_core3.PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      drag.mode = "dragging";
    }
    if (drag.mode === "dragging") {
      const offV = e.clientY - stripCenterY();
      if (drag.working.stops.length > import_gradient_core3.MIN_STOPS && Math.abs(offV) > import_gradient_core3.STOP_DETACH_PX) {
        drag.mode = "detached";
        setDetach({
          index: drag.activeIndex,
          y: offV
        });
        return;
      }
      commitMove(e.clientX);
      return;
    }
    if (drag.mode === "detached") {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= import_gradient_core3.STOP_DETACH_PX) {
        drag.mode = "dragging";
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({
          index: drag.activeIndex,
          y: offV
        });
      }
    }
  };
  const onPointerUp = () => {
    if (drag.mode === "detached") {
      const next = (0, import_gradient_core3.removeStop)(drag.working, drag.activeIndex);
      props.onChange(next);
      setSelectedIndex(Math.min(drag.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };
  const previewStops = () => {
    const d = detach();
    return d ? props.value.stops.filter((_, i) => i !== d.index) : props.value.stops;
  };
  return (() => {
    var _el$ = _tmpl$48(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$2.nextSibling, _el$6 = _el$5.nextSibling;
    _el$3.addEventListener("lostpointercapture", onGripUp);
    _el$3.addEventListener("pointercancel", onGripUp);
    _el$3.$$pointerup = onGripUp;
    _el$3.$$pointermove = onGripMove;
    _el$3.$$pointerdown = onGripDown;
    var _ref$ = gripRef;
    typeof _ref$ === "function" ? (0, import_web145.use)(_ref$, _el$3) : gripRef = _el$3;
    (0, import_web143.insert)(_el$4, (0, import_web144.createComponent)(import_solid_js20.For, {
      each: import_icons3.ICON_GRIP,
      children: (c) => (() => {
        var _el$7 = _tmpl$216();
        (0, import_web142.effect)((_p$) => {
          var _v$ = c.cx, _v$2 = c.cy;
          _v$ !== _p$.e && (0, import_web140.setAttribute)(_el$7, "cx", _p$.e = _v$);
          _v$2 !== _p$.t && (0, import_web140.setAttribute)(_el$7, "cy", _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$7;
      })()
    }));
    (0, import_web143.insert)(_el$2, (0, import_web144.createComponent)(SegmentedControl, {
      options: TYPE_OPTIONS,
      get value() {
        return props.value.type;
      },
      onChange: (t) => props.onChange((0, import_gradient_core3.setGradientType)(props.value, t))
    }), null);
    (0, import_web143.insert)(_el$, (0, import_web144.createComponent)(GradientTransformPad, {
      get value() {
        return props.value;
      },
      get onChange() {
        return props.onChange;
      }
    }), _el$5);
    _el$5.addEventListener("pointercancel", onPointerUp);
    _el$5.$$pointerup = onPointerUp;
    _el$5.$$pointermove = onPointerMove;
    _el$5.$$pointerdown = onPointerDown;
    var _ref$2 = stripRef;
    typeof _ref$2 === "function" ? (0, import_web145.use)(_ref$2, _el$5) : stripRef = _el$5;
    (0, import_web143.insert)(_el$5, (0, import_web144.createComponent)(import_solid_js20.For, {
      get each() {
        return props.value.stops;
      },
      children: (stop, i) => {
        const detaching = () => detach()?.index === i();
        return (() => {
          var _el$8 = _tmpl$312();
          (0, import_web142.effect)((_p$) => {
            var _v$3 = i(), _v$4 = String(i() === safeIndex()), _v$5 = String(i() === holdingIndex()), _v$6 = String(detaching()), _v$7 = `${stop.position * 100}%`, _v$8 = i() === safeIndex() ? 99 : i() + 1, _v$9 = stop.color, _v$0 = detaching() ? `${detach().y}px` : "0px", _v$1 = `Gradient stop ${i() + 1}`;
            _v$3 !== _p$.e && (0, import_web140.setAttribute)(_el$8, "data-index", _p$.e = _v$3);
            _v$4 !== _p$.t && (0, import_web140.setAttribute)(_el$8, "data-selected", _p$.t = _v$4);
            _v$5 !== _p$.a && (0, import_web140.setAttribute)(_el$8, "data-holding", _p$.a = _v$5);
            _v$6 !== _p$.o && (0, import_web140.setAttribute)(_el$8, "data-detaching", _p$.o = _v$6);
            _v$7 !== _p$.i && (0, import_web141.setStyleProperty)(_el$8, "left", _p$.i = _v$7);
            _v$8 !== _p$.n && (0, import_web141.setStyleProperty)(_el$8, "z-index", _p$.n = _v$8);
            _v$9 !== _p$.s && (0, import_web141.setStyleProperty)(_el$8, "--swatch-color", _p$.s = _v$9);
            _v$0 !== _p$.h && (0, import_web141.setStyleProperty)(_el$8, "--detach-y", _p$.h = _v$0);
            _v$1 !== _p$.r && (0, import_web140.setAttribute)(_el$8, "aria-label", _p$.r = _v$1);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0,
            r: void 0
          });
          return _el$8;
        })();
      }
    }));
    (0, import_web143.insert)(_el$, (0, import_web144.createComponent)(import_solid_js20.Show, {
      get when() {
        return safeIndex() + 1;
      },
      keyed: true,
      children: (keyed) => {
        const index = keyed - 1;
        return (0, import_web144.createComponent)(ColorPickerPanel, {
          get value() {
            return props.value.stops[index].color;
          },
          alpha: true,
          palette: false,
          onChange: (hex) => props.onChange((0, import_gradient_core3.setStopColor)(props.value, index, hex))
        });
      }
    }), null);
    (0, import_web142.effect)((_$p) => (0, import_web141.setStyleProperty)(_el$5, "--gradient-ramp", rampCss(previewStops())));
    return _el$;
  })();
}
(0, import_web139.delegateEvents)(["pointerdown", "pointermove", "pointerup"]);

// src/solid/components/GradientControl.tsx
var import_gradient_core4 = require("tweakers/gradient-core");
var _tmpl$49 = /* @__PURE__ */ (0, import_web146.template)(`<div class=tweakers-gradient-popover>`);
var _tmpl$217 = /* @__PURE__ */ (0, import_web146.template)(`<div class=tweakers-gradient-control><span class=tweakers-gradient-label></span><button class="tweakers-gradient-preview tweakers-checker"title="Edit gradient">`);
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RADIAL = 430;
function GradientControl(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js21.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js21.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js21.createSignal)(null);
  const [dragPos, setDragPos] = (0, import_solid_js21.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js21.createSignal)(null);
  let triggerRef;
  let panelRef;
  let closeAnim = null;
  (0, import_solid_js21.onMount)(() => {
    const root = triggerRef?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
    (0, import_solid_js21.onCleanup)(() => {
      closeAnim?.stop();
    });
  });
  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const panelHeight = props.value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left,
      above
    });
  };
  const onPanelDrag = (dx, dy) => {
    setDragPos((prev) => {
      let base = prev;
      if (!base) {
        const p = pos();
        if (!p || !panelRef) return prev;
        base = {
          left: p.left,
          top: p.above ? p.top - panelRef.offsetHeight : p.top
        };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      return {
        left,
        top
      };
    });
  };
  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    setDragPos(null);
    updatePos();
    if (panelRef) {
      (0, import_motion6.animate)(panelRef, {
        opacity: 1,
        y: 0,
        scale: 1
      }, {
        type: "spring",
        visualDuration: 0.15,
        bounce: 0
      });
    }
    setMounted(true);
    setIsOpen(true);
  };
  const closePopover = () => {
    setIsOpen(false);
    if (!panelRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = (0, import_motion6.animate)(panelRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
        panelRef = void 0;
      }
    });
  };
  (0, import_solid_js21.createEffect)(() => {
    if (!isOpen()) return;
    void props.value.type;
    const handleViewportChange = () => updatePos();
    const handleMouseDown = (e) => {
      const target = e.target;
      if (triggerRef?.contains(target) || panelRef?.contains(target)) return;
      closePopover();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePopover();
        triggerRef?.focus();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    (0, import_solid_js21.onCleanup)(() => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    const dp = dragPos();
    return {
      position: "fixed",
      width: `${PANEL_WIDTH}px`,
      ...dp ? {
        left: `${dp.left}px`,
        top: `${dp.top}px`,
        "transform-origin": "top left"
      } : p.above ? {
        left: `${p.left}px`,
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom right"
      } : {
        left: `${p.left}px`,
        top: `${p.top}px`,
        "transform-origin": "top right"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$217(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    (0, import_web155.insert)(_el$2, () => props.label);
    _el$3.$$click = () => isOpen() ? closePopover() : openPopover();
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? (0, import_web154.use)(_ref$, _el$3) : triggerRef = _el$3;
    (0, import_web155.insert)(_el$, (0, import_web152.createComponent)(import_solid_js21.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web152.createComponent)(import_web156.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web152.createComponent)(import_solid_js21.Show, {
              get when() {
                return (0, import_web153.memo)(() => !!mounted())() && pos();
              },
              get children() {
                var _el$4 = _tmpl$49();
                (0, import_web154.use)((el) => {
                  panelRef = el;
                  const above = pos()?.above ?? false;
                  (0, import_motion6.animate)(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$4);
                (0, import_web155.insert)(_el$4, (0, import_web152.createComponent)(GradientPanel, {
                  get value() {
                    return props.value;
                  },
                  onChange: (v) => props.onChange(v),
                  onDrag: onPanelDrag
                }));
                (0, import_web151.effect)((_$p) => (0, import_web150.style)(_el$4, popoverStyle(), _$p));
                return _el$4;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web151.effect)((_p$) => {
      var _v$ = (0, import_gradient_core4.gradientToCss)(props.value), _v$2 = String(isOpen()), _v$3 = `Edit gradient for ${props.label}`, _v$4 = isOpen();
      _v$ !== _p$.e && (0, import_web149.setStyleProperty)(_el$3, "--gradient-preview", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web148.setAttribute)(_el$3, "data-open", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web148.setAttribute)(_el$3, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web148.setAttribute)(_el$3, "aria-expanded", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
(0, import_web147.delegateEvents)(["click"]);

// src/solid/components/XYControl.tsx
var import_web167 = require("solid-js/web");

// src/solid/components/XYPad.tsx
var import_web157 = require("solid-js/web");
var import_web158 = require("solid-js/web");
var import_web159 = require("solid-js/web");
var import_web160 = require("solid-js/web");
var import_web161 = require("solid-js/web");
var import_web162 = require("solid-js/web");
var import_web163 = require("solid-js/web");
var import_web164 = require("solid-js/web");
var import_web165 = require("solid-js/web");
var import_web166 = require("solid-js/web");
var import_solid_js22 = require("solid-js");
var import_shortcut_utils6 = require("tweakers/shortcut-utils");
var import_xy_pad_core = require("tweakers/xy-pad-core");
var _tmpl$50 = /* @__PURE__ */ (0, import_web157.template)(`<span>`);
var _tmpl$218 = /* @__PURE__ */ (0, import_web157.template)(`<div class=tweakers-xy-grid aria-hidden=true>`);
var _tmpl$313 = /* @__PURE__ */ (0, import_web157.template)(`<div class=tweakers-xy><div class=tweakers-xy-header><span class=tweakers-xy-label></span></div><div class=tweakers-xy-area role=application aria-roledescription="2D pad"><div class="tweakers-xy-axis tweakers-xy-axis-x"aria-hidden=true></div><div class="tweakers-xy-axis tweakers-xy-axis-y"aria-hidden=true></div><div class="tweakers-xy-guide tweakers-xy-guide-v"aria-hidden=true></div><div class="tweakers-xy-guide tweakers-xy-guide-h"aria-hidden=true></div><div class=tweakers-xy-thumb aria-hidden=true>`);
var DEFAULT_GRID_X = 5;
var DEFAULT_GRID_Y = 5;
var FINE_DRAG = 0.15;
function decimalsForStep4(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function formatComponent(v, axis) {
  return (v + 0).toFixed(decimalsForStep4(axis.step));
}
function XYPad(props) {
  const size = () => props.size ?? 160;
  const snap = () => props.snap ?? false;
  const disabled = () => props.disabled ?? false;
  const returnToCenter = () => props.returnToCenter ?? false;
  const showValues = () => props.showValues ?? false;
  const density = () => props.density ?? 1;
  const xAxis = () => (0, import_xy_pad_core.resolveAxis)(props.x);
  const yAxis = () => (0, import_xy_pad_core.resolveAxis)(props.y);
  let areaRef;
  let dragging = false;
  const [active, setActive] = (0, import_solid_js22.createSignal)(false);
  const [draggingState, setDraggingState] = (0, import_solid_js22.createSignal)(false);
  const pointToValue = (clientX, clientY, fine) => {
    const el = areaRef;
    if (!el) return props.value;
    const rect = el.getBoundingClientRect();
    const xs = xAxis();
    const ys = yAxis();
    let px = (clientX - rect.left) / rect.width;
    let py = (clientY - rect.top) / rect.height;
    if (fine) {
      const cur = (0, import_xy_pad_core.pointFromValue)(props.value, xs, ys);
      px = cur.x + (px - cur.x) * FINE_DRAG;
      py = cur.y + (py - cur.y) * FINE_DRAG;
    }
    px = Math.min(1, Math.max(0, px));
    py = Math.min(1, Math.max(0, py));
    const next = (0, import_xy_pad_core.valueFromPoint)({
      x: px,
      y: py
    }, xs, ys, snap());
    const originPoint = (0, import_xy_pad_core.pointFromValue)({
      x: xs.origin,
      y: ys.origin
    }, xs, ys);
    const dxPx = Math.abs(px - originPoint.x) * rect.width;
    const dyPx = Math.abs(py - originPoint.y) * rect.height;
    return {
      x: (0, import_xy_pad_core.applyDetentAxis)(next.x, xs, dxPx),
      y: (0, import_xy_pad_core.applyDetentAxis)(next.y, ys, dyPx)
    };
  };
  const emit = (next) => {
    props.onChange(next);
  };
  const handlePointerDown = (e) => {
    if (disabled()) return;
    if (e.button !== 0 || !e.isPrimary) return;
    if (e.altKey) return;
    e.preventDefault();
    try {
      areaRef?.setPointerCapture(e.pointerId);
    } catch {
    }
    areaRef?.focus();
    dragging = true;
    setActive(true);
    setDraggingState(true);
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const finishDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    setDraggingState(false);
    try {
      areaRef?.releasePointerCapture(e.pointerId);
    } catch {
    }
    const el = areaRef;
    const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
    if (!stillActive) setActive(false);
    if (returnToCenter()) emit((0, import_xy_pad_core.normalizeValue)((0, import_xy_pad_core.centerValue)(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };
  const handleKeyDown = (e) => {
    if (disabled()) return;
    const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
    const cur = props.value;
    const xs = xAxis();
    const ys = yAxis();
    const ctrl = e.ctrlKey || e.metaKey;
    let next = null;
    switch (e.key) {
      case "ArrowUp":
        next = (0, import_xy_pad_core.nudge)(cur, "y", 1, xs, ys, mode);
        break;
      case "ArrowDown":
        next = (0, import_xy_pad_core.nudge)(cur, "y", -1, xs, ys, mode);
        break;
      case "ArrowRight":
        next = (0, import_xy_pad_core.nudge)(cur, "x", 1, xs, ys, mode);
        break;
      case "ArrowLeft":
        next = (0, import_xy_pad_core.nudge)(cur, "x", -1, xs, ys, mode);
        break;
      case "PageUp":
        next = (0, import_xy_pad_core.nudge)(cur, "y", 1, xs, ys, "coarse");
        break;
      case "PageDown":
        next = (0, import_xy_pad_core.nudge)(cur, "y", -1, xs, ys, "coarse");
        break;
      case "Home":
        next = ctrl ? {
          x: xs.min,
          y: ys.min
        } : {
          x: xs.min,
          y: cur.y
        };
        break;
      case "End":
        next = ctrl ? {
          x: xs.max,
          y: ys.max
        } : {
          x: xs.max,
          y: cur.y
        };
        break;
      default:
        return;
    }
    e.preventDefault();
    emit(next);
  };
  const reset = () => {
    if (disabled()) return;
    emit((0, import_xy_pad_core.normalizeValue)((0, import_xy_pad_core.centerValue)(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };
  const xLabel = () => props.x?.label ?? "X";
  const yLabel = () => props.y?.label ?? "Y";
  const xText = () => `${xLabel()} ${formatComponent(props.value.x, xAxis())}`;
  const yText = () => `${yLabel()} ${formatComponent(props.value.y, yAxis())}`;
  const xVisual = () => showValues() ? xText() : xLabel();
  const yVisual = () => showValues() ? yText() : yLabel();
  const readout = () => props.formatValue ? props.formatValue(props.value) : `${xText()}  ${yText()}`;
  const dens = () => typeof density() === "number" && density() > 0 ? density() : 1;
  const baseX = () => props.grid === false ? 0 : typeof props.grid === "number" ? props.grid : DEFAULT_GRID_X;
  const baseY = () => props.grid === false ? 0 : typeof props.grid === "number" ? props.grid : DEFAULT_GRID_Y;
  const gridX = () => baseX() > 0 ? Math.round(baseX() * dens()) : 0;
  const gridY = () => baseY() > 0 ? Math.round(baseY() * dens()) : 0;
  const showGrid = () => gridX() > 0 && gridY() > 0;
  const point = () => (0, import_xy_pad_core.pointFromValue)(props.value, xAxis(), yAxis());
  const leftPct = () => `${point().x * 100}%`;
  const topPct = () => `${point().y * 100}%`;
  return (() => {
    var _el$ = _tmpl$313(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$2.nextSibling, _el$7 = _el$5.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
    (0, import_web166.insert)(_el$3, () => props.label, null);
    (0, import_web166.insert)(_el$3, (0, import_web163.createComponent)(import_solid_js22.Show, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$4 = _tmpl$50();
        (0, import_web166.insert)(_el$4, () => (0, import_shortcut_utils6.formatSliderShortcut)(props.shortcut));
        (0, import_web165.effect)(() => (0, import_web164.className)(_el$4, `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`));
        return _el$4;
      }
    }), null);
    _el$5.addEventListener("pointerleave", () => {
      if (!dragging) setActive(false);
    });
    _el$5.addEventListener("pointerenter", () => setActive(true));
    _el$5.addEventListener("blur", () => setActive(false));
    _el$5.addEventListener("focus", () => setActive(true));
    _el$5.$$keydown = handleKeyDown;
    _el$5.$$click = (e) => {
      if (e.altKey) reset();
    };
    _el$5.$$dblclick = reset;
    _el$5.addEventListener("pointercancel", finishDrag);
    _el$5.$$pointerup = finishDrag;
    _el$5.$$pointermove = handlePointerMove;
    _el$5.$$pointerdown = handlePointerDown;
    var _ref$ = areaRef;
    typeof _ref$ === "function" ? (0, import_web162.use)(_ref$, _el$5) : areaRef = _el$5;
    (0, import_web166.insert)(_el$5, (0, import_web163.createComponent)(import_solid_js22.Show, {
      get when() {
        return showGrid();
      },
      get children() {
        var _el$6 = _tmpl$218();
        (0, import_web165.effect)((_$p) => (0, import_web161.style)(_el$6, {
          "--tweak-xy-grid-step-x": `${100 / gridX()}%`,
          "--tweak-xy-grid-step-y": `${100 / gridY()}%`
        }, _$p));
        return _el$6;
      }
    }), _el$7);
    (0, import_web166.insert)(_el$7, xVisual);
    (0, import_web166.insert)(_el$8, yVisual);
    (0, import_web165.effect)((_p$) => {
      var _v$ = String(active()), _v$2 = String(disabled()), _v$3 = `${size()}px`, _v$4 = props.label, _v$5 = readout(), _v$6 = xAxis().min, _v$7 = xAxis().max, _v$8 = props.value.x, _v$9 = disabled() || void 0, _v$0 = disabled() ? -1 : 0, _v$1 = String(active()), _v$10 = String(draggingState()), _v$11 = String(disabled()), _v$12 = leftPct(), _v$13 = topPct(), _v$14 = leftPct(), _v$15 = topPct();
      _v$ !== _p$.e && (0, import_web160.setAttribute)(_el$, "data-active", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web160.setAttribute)(_el$, "data-disabled", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web159.setStyleProperty)(_el$5, "height", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web160.setAttribute)(_el$5, "aria-label", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web160.setAttribute)(_el$5, "aria-valuetext", _p$.i = _v$5);
      _v$6 !== _p$.n && (0, import_web160.setAttribute)(_el$5, "aria-valuemin", _p$.n = _v$6);
      _v$7 !== _p$.s && (0, import_web160.setAttribute)(_el$5, "aria-valuemax", _p$.s = _v$7);
      _v$8 !== _p$.h && (0, import_web160.setAttribute)(_el$5, "aria-valuenow", _p$.h = _v$8);
      _v$9 !== _p$.r && (0, import_web160.setAttribute)(_el$5, "aria-disabled", _p$.r = _v$9);
      _v$0 !== _p$.d && (0, import_web160.setAttribute)(_el$5, "tabindex", _p$.d = _v$0);
      _v$1 !== _p$.l && (0, import_web160.setAttribute)(_el$5, "data-active", _p$.l = _v$1);
      _v$10 !== _p$.u && (0, import_web160.setAttribute)(_el$5, "data-dragging", _p$.u = _v$10);
      _v$11 !== _p$.c && (0, import_web160.setAttribute)(_el$5, "data-disabled", _p$.c = _v$11);
      _v$12 !== _p$.w && (0, import_web159.setStyleProperty)(_el$9, "left", _p$.w = _v$12);
      _v$13 !== _p$.m && (0, import_web159.setStyleProperty)(_el$0, "top", _p$.m = _v$13);
      _v$14 !== _p$.f && (0, import_web159.setStyleProperty)(_el$1, "left", _p$.f = _v$14);
      _v$15 !== _p$.y && (0, import_web159.setStyleProperty)(_el$1, "top", _p$.y = _v$15);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$;
  })();
}
(0, import_web158.delegateEvents)(["pointerdown", "pointermove", "pointerup", "dblclick", "click", "keydown"]);

// src/solid/components/XYControl.tsx
function XYControl(props) {
  return (0, import_web167.createComponent)(XYPad, {
    get label() {
      return props.label;
    },
    get value() {
      return props.value;
    },
    get onChange() {
      return props.onChange;
    },
    get x() {
      return props.x;
    },
    get y() {
      return props.y;
    },
    get grid() {
      return props.grid;
    },
    get density() {
      return props.density;
    },
    get snap() {
      return props.snap;
    },
    get returnToCenter() {
      return props.returnToCenter;
    },
    get showValues() {
      return props.showValues;
    },
    get shortcut() {
      return props.shortcut;
    },
    get shortcutActive() {
      return props.shortcutActive;
    }
  });
}

// src/solid/components/ControlRenderer.tsx
var _tmpl$51 = /* @__PURE__ */ (0, import_web168.template)(`<button class=tweakers-button>`);
function ControlRenderer(props) {
  const shortcut = useShortcutContext();
  const hintId = (control) => (0, import_store7.hintDomId)(props.panelId, control.path);
  const renderControlNode = (control) => {
    const value = () => props.values[control.path];
    const active = () => shortcut().activePanelId === props.panelId && shortcut().activePath === control.path;
    switch (control.type) {
      case "slider":
        return (0, import_web173.createComponent)(Slider, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get min() {
            return control.min;
          },
          get max() {
            return control.max;
          },
          get step() {
            return control.step;
          },
          get unit() {
            return control.unit;
          },
          get formatValue() {
            return control.formatValue;
          },
          get origin() {
            return control.origin;
          },
          get bipolar() {
            return control.bipolar;
          },
          get orientation() {
            return control.orientation;
          },
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "number":
        return (0, import_web173.createComponent)(NumberControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get min() {
            return control.min;
          },
          get max() {
            return control.max;
          },
          get step() {
            return control.step;
          },
          get unit() {
            return control.unit;
          },
          get formatValue() {
            return control.formatValue;
          },
          get orientation() {
            return control.orientation;
          }
        });
      case "range":
        return (0, import_web173.createComponent)(RangeSlider, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          get min() {
            return control.min ?? 0;
          },
          get max() {
            return control.max ?? 1;
          },
          get step() {
            return control.step;
          },
          get defaultValue() {
            return control.rangeDefault;
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next)
        });
      case "toggle":
        return (0, import_web173.createComponent)(Toggle, {
          get label() {
            return control.label;
          },
          get checked() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "spring":
        return (0, import_web173.createComponent)(SpringControl, {
          get panelId() {
            return props.panelId;
          },
          get path() {
            return control.path;
          },
          get label() {
            return control.label;
          },
          get spring() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next)
        });
      case "transition":
        return (0, import_web173.createComponent)(TransitionControl, {
          get panelId() {
            return props.panelId;
          },
          get path() {
            return control.path;
          },
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get durationControl() {
            return props.transitionDuration;
          }
        });
      case "folder":
        if (control.module) {
          const enabledPath = `${control.path}._enabled`;
          return (0, import_web173.createComponent)(ModuleFolder, {
            get title() {
              return control.label;
            },
            get enabled() {
              return props.values[enabledPath];
            },
            onEnabledChange: (next) => import_store7.TweakStore.updateValue(props.panelId, enabledPath, next),
            get defaultOpen() {
              return control.defaultOpen ?? true;
            },
            get hint() {
              return control.hint;
            },
            get hintId() {
              return hintId(control);
            },
            get children() {
              return (0, import_web173.createComponent)(import_solid_js23.For, {
                get each() {
                  return control.children ?? [];
                },
                children: renderControl
              });
            }
          });
        }
        return (0, import_web173.createComponent)(Folder, {
          get title() {
            return control.label;
          },
          get defaultOpen() {
            return control.defaultOpen ?? true;
          },
          get collapsible() {
            return control.collapsible ?? true;
          },
          get hint() {
            return control.hint;
          },
          get hintId() {
            return hintId(control);
          },
          get children() {
            return (0, import_web173.createComponent)(import_solid_js23.For, {
              get each() {
                return control.children ?? [];
              },
              children: renderControl
            });
          }
        });
      case "text":
        return (0, import_web173.createComponent)(TextControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get placeholder() {
            return control.placeholder;
          }
        });
      case "select":
        return (0, import_web173.createComponent)(SelectControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          get options() {
            return control.options ?? [];
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next)
        });
      case "color":
        return (0, import_web173.createComponent)(ColorControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get alpha() {
            return control.alpha;
          },
          get palette() {
            return control.palette;
          }
        });
      case "gradient":
        return (0, import_web173.createComponent)(GradientControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next)
        });
      case "xy":
        return (0, import_web173.createComponent)(XYControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => import_store7.TweakStore.updateValue(props.panelId, control.path, next),
          get x() {
            return control.xAxis;
          },
          get y() {
            return control.yAxis;
          },
          get grid() {
            return control.grid;
          },
          get density() {
            return control.density;
          },
          get snap() {
            return control.snap;
          },
          get returnToCenter() {
            return control.returnToCenter;
          },
          get showValues() {
            return control.showValues;
          },
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "action":
        return (() => {
          var _el$ = _tmpl$51();
          _el$.$$click = () => import_store7.TweakStore.triggerAction(props.panelId, control.path);
          (0, import_web171.insert)(_el$, () => control.label);
          (0, import_web170.effect)(() => _el$.disabled = import_store7.TweakStore.isDisabled(props.panelId, control.path));
          return _el$;
        })();
      default:
        return null;
    }
  };
  const renderControl = (control) => {
    const node = renderControlNode(control);
    if (control.type === "folder") return node;
    return (0, import_web173.createComponent)(ControlShell, {
      get hint() {
        return control.hint;
      },
      get title() {
        return control.path;
      },
      get id() {
        return hintId(control);
      },
      get affordance() {
        return control.affordance;
      },
      get panelId() {
        return props.panelId;
      },
      get path() {
        return control.path;
      },
      children: node
    });
  };
  return (0, import_web173.createComponent)(import_solid_js23.For, {
    get each() {
      return props.controls;
    },
    children: renderControl
  });
}
(0, import_web169.delegateEvents)(["click"]);

// src/solid/components/PresetManager.tsx
var import_web174 = require("solid-js/web");
var import_web175 = require("solid-js/web");
var import_web176 = require("solid-js/web");
var import_web177 = require("solid-js/web");
var import_web178 = require("solid-js/web");
var import_web179 = require("solid-js/web");
var import_web180 = require("solid-js/web");
var import_web181 = require("solid-js/web");
var import_web182 = require("solid-js/web");
var import_solid_js24 = require("solid-js");
var import_web183 = require("solid-js/web");
var import_motion7 = require("motion");
var import_icons4 = require("tweakers/icons");
var import_store8 = require("tweakers/store");
var _tmpl$56 = /* @__PURE__ */ (0, import_web174.template)(`<div class=tweakers-preset-item><span class=tweakers-preset-name>Version 1`);
var _tmpl$219 = /* @__PURE__ */ (0, import_web174.template)(`<div class="tweakers-root tweakers-preset-dropdown"style=position:fixed>`);
var _tmpl$314 = /* @__PURE__ */ (0, import_web174.template)(`<div class=tweakers-preset-manager><button class=tweakers-preset-trigger><span class=tweakers-preset-label></span><svg class=tweakers-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$410 = /* @__PURE__ */ (0, import_web174.template)(`<button class=tweakers-preset-delete title="Delete preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
var _tmpl$57 = /* @__PURE__ */ (0, import_web174.template)(`<div class=tweakers-preset-item><span class=tweakers-preset-name>`);
function PresetManager(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js24.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js24.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js24.createSignal)({
    top: 0,
    left: 0,
    width: 0
  });
  const [portalTarget, setPortalTarget] = (0, import_solid_js24.createSignal)(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const hasPresets = () => props.presets.length > 0;
  const activePreset = () => props.presets.find((p) => p.id === props.activePresetId);
  (0, import_solid_js24.onMount)(() => {
    const root = triggerRef?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
      chevronRef.style.opacity = String(hasPresets() ? 0.6 : 0.25);
    }
    (0, import_solid_js24.onCleanup)(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  (0, import_solid_js24.createEffect)(() => {
    if (!chevronRef) return;
    const open = isOpen();
    const has = hasPresets();
    chevronAnim?.stop();
    chevronAnim = (0, import_motion7.animate)(chevronRef, {
      rotate: open ? 180 : 0,
      opacity: has ? 0.6 : 0.25
    }, {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.15
    });
  });
  const updatePos = () => {
    const rect = triggerRef?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    });
  };
  const openDropdown = () => {
    if (!hasPresets()) return;
    updatePos();
    closeAnim?.stop();
    closeAnim = null;
    setMounted(true);
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    if (!dropdownRef) {
      setMounted(false);
      return;
    }
    closeAnim?.stop();
    closeAnim = (0, import_motion7.animate)(dropdownRef, {
      opacity: 0,
      y: 4,
      scale: 0.97
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
      }
    });
  };
  const toggle = () => {
    if (isOpen()) closeDropdown();
    else openDropdown();
  };
  (0, import_solid_js24.createEffect)(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handler = (e) => {
      const target = e.target;
      if (triggerRef?.contains(target) || dropdownRef?.contains(target)) return;
      closeDropdown();
    };
    updatePos();
    document.addEventListener("mousedown", handler);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    (0, import_solid_js24.onCleanup)(() => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const handleSelect = (presetId) => {
    import_store8.TweakStore.selectPreset(props.panelId, presetId);
    closeDropdown();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    import_store8.TweakStore.removePreset(props.panelId, presetId);
  };
  return (() => {
    var _el$ = _tmpl$314(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild;
    _el$2.$$click = toggle;
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? (0, import_web182.use)(_ref$, _el$2) : triggerRef = _el$2;
    (0, import_web180.insert)(_el$3, (() => {
      var _c$ = (0, import_web181.memo)(() => !!activePreset());
      return () => _c$() ? activePreset().name : props.providerMode ? "Presets" : "Version 1";
    })());
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? (0, import_web182.use)(_ref$2, _el$4) : chevronRef = _el$4;
    (0, import_web179.setAttribute)(_el$5, "d", import_icons4.ICON_CHEVRON);
    (0, import_web180.insert)(_el$, (0, import_web177.createComponent)(import_solid_js24.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web177.createComponent)(import_web183.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web177.createComponent)(import_solid_js24.Show, {
              get when() {
                return mounted();
              },
              get children() {
                var _el$6 = _tmpl$219();
                (0, import_web182.use)((el) => {
                  dropdownRef = el;
                  (0, import_motion7.animate)(el, {
                    opacity: [0, 1],
                    y: [4, 0],
                    scale: [0.97, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$6);
                (0, import_web180.insert)(_el$6, (0, import_web177.createComponent)(import_solid_js24.Show, {
                  get when() {
                    return !props.providerMode;
                  },
                  get children() {
                    var _el$7 = _tmpl$56();
                    _el$7.$$click = () => handleSelect(null);
                    (0, import_web178.effect)(() => (0, import_web179.setAttribute)(_el$7, "data-active", String(!props.activePresetId)));
                    return _el$7;
                  }
                }), null);
                (0, import_web180.insert)(_el$6, (0, import_web177.createComponent)(import_solid_js24.For, {
                  get each() {
                    return props.presets;
                  },
                  children: (preset) => (() => {
                    var _el$8 = _tmpl$57(), _el$9 = _el$8.firstChild;
                    _el$8.$$click = () => handleSelect(preset.id);
                    (0, import_web180.insert)(_el$9, () => preset.name);
                    (0, import_web180.insert)(_el$8, (0, import_web177.createComponent)(import_solid_js24.Show, {
                      get when() {
                        return preset.deletable ?? true;
                      },
                      get children() {
                        var _el$0 = _tmpl$410(), _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
                        _el$0.$$click = (e) => handleDelete(e, preset.id);
                        (0, import_web178.effect)((_p$) => {
                          var _v$7 = import_icons4.ICON_TRASH[0], _v$8 = import_icons4.ICON_TRASH[1], _v$9 = import_icons4.ICON_TRASH[2], _v$0 = import_icons4.ICON_TRASH[3], _v$1 = import_icons4.ICON_TRASH[4];
                          _v$7 !== _p$.e && (0, import_web179.setAttribute)(_el$10, "d", _p$.e = _v$7);
                          _v$8 !== _p$.t && (0, import_web179.setAttribute)(_el$11, "d", _p$.t = _v$8);
                          _v$9 !== _p$.a && (0, import_web179.setAttribute)(_el$12, "d", _p$.a = _v$9);
                          _v$0 !== _p$.o && (0, import_web179.setAttribute)(_el$13, "d", _p$.o = _v$0);
                          _v$1 !== _p$.i && (0, import_web179.setAttribute)(_el$14, "d", _p$.i = _v$1);
                          return _p$;
                        }, {
                          e: void 0,
                          t: void 0,
                          a: void 0,
                          o: void 0,
                          i: void 0
                        });
                        return _el$0;
                      }
                    }), null);
                    (0, import_web178.effect)(() => (0, import_web179.setAttribute)(_el$8, "data-active", String(preset.id === props.activePresetId)));
                    return _el$8;
                  })()
                }), null);
                (0, import_web178.effect)((_p$) => {
                  var _v$ = `${pos().top}px`, _v$2 = `${pos().left}px`, _v$3 = `${pos().width}px`;
                  _v$ !== _p$.e && (0, import_web176.setStyleProperty)(_el$6, "top", _p$.e = _v$);
                  _v$2 !== _p$.t && (0, import_web176.setStyleProperty)(_el$6, "left", _p$.t = _v$2);
                  _v$3 !== _p$.a && (0, import_web176.setStyleProperty)(_el$6, "min-width", _p$.a = _v$3);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                });
                return _el$6;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web178.effect)((_p$) => {
      var _v$4 = String(isOpen()), _v$5 = String(!!activePreset()), _v$6 = String(!hasPresets());
      _v$4 !== _p$.e && (0, import_web179.setAttribute)(_el$2, "data-open", _p$.e = _v$4);
      _v$5 !== _p$.t && (0, import_web179.setAttribute)(_el$2, "data-has-preset", _p$.t = _v$5);
      _v$6 !== _p$.a && (0, import_web179.setAttribute)(_el$2, "data-disabled", _p$.a = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
(0, import_web175.delegateEvents)(["click"]);

// src/solid/components/Panel.tsx
var _tmpl$58 = /* @__PURE__ */ (0, import_web184.template)(`<button class=tweakers-toolbar-add title="Add preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
var _tmpl$220 = /* @__PURE__ */ (0, import_web184.template)(`<button class=tweakers-toolbar-copy title="Copy parameters"><span class=tweakers-toolbar-copy-icon-wrap><span class=tweakers-toolbar-copy-icon style=opacity:1;transform:scale(1);filter:blur(0px)><svg viewBox="0 0 24 24"fill=none width=16 height=16><path stroke=currentColor stroke-width=2 stroke-linejoin=round></path><path fill=currentColor></path><path stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=tweakers-toolbar-copy-icon style=opacity:0;transform:scale(0.5);filter:blur(4px)><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round width=16 height=16><path>`);
var _tmpl$315 = /* @__PURE__ */ (0, import_web184.template)(`<div class=tweakers-panel-wrapper>`);
function Panel(props) {
  const [copied, setCopied] = (0, import_solid_js25.createSignal)(false);
  const [, setIsPanelOpen] = (0, import_solid_js25.createSignal)(props.defaultOpen ?? true);
  const [values, setValues] = (0, import_solid_js25.createSignal)(import_store9.TweakStore.getValues(props.panel.id));
  const [presets, setPresets] = (0, import_solid_js25.createSignal)(import_store9.TweakStore.getPresetItems(props.panel.id));
  const [activePresetId, setActivePresetId] = (0, import_solid_js25.createSignal)(import_store9.TweakStore.getActivePresetId(props.panel.id));
  const [providerMode, setProviderMode] = (0, import_solid_js25.createSignal)(import_store9.TweakStore.hasPresetProvider(props.panel.id));
  let addButtonRef;
  let copyButtonRef;
  let copyClipboardIconRef;
  let copyCheckIconRef;
  let addTapAnim = null;
  let copyTapAnim = null;
  let copyClipboardAnim = null;
  let copyCheckAnim = null;
  let didInitCopyIcons = false;
  const tapTransition = {
    type: "spring",
    visualDuration: 0.15,
    bounce: 0.3
  };
  (0, import_solid_js25.onMount)(() => {
    const unsub = import_store9.TweakStore.subscribe(props.panel.id, () => {
      setValues(import_store9.TweakStore.getValues(props.panel.id));
      setPresets(import_store9.TweakStore.getPresetItems(props.panel.id));
      setActivePresetId(import_store9.TweakStore.getActivePresetId(props.panel.id));
      setProviderMode(import_store9.TweakStore.hasPresetProvider(props.panel.id));
    });
    if (copyClipboardIconRef && copyCheckIconRef) {
      copyClipboardIconRef.style.transformOrigin = "50% 50%";
      copyClipboardIconRef.style.opacity = "1";
      copyClipboardIconRef.style.transform = "scale(1)";
      copyClipboardIconRef.style.filter = "blur(0px)";
      copyCheckIconRef.style.transformOrigin = "50% 50%";
      copyCheckIconRef.style.opacity = "0";
      copyCheckIconRef.style.transform = "scale(0.5)";
      copyCheckIconRef.style.filter = "blur(4px)";
      didInitCopyIcons = true;
    }
    (0, import_solid_js25.onCleanup)(unsub);
  });
  const handleAddPreset = () => import_store9.TweakStore.createPreset(props.panel.id);
  const handleCopy = () => {
    const jsonStr = JSON.stringify(values(), null, 2);
    const instruction = `Update the createTweakers configuration for "${props.panel.name}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the createTweakers call.`;
    navigator.clipboard.writeText(instruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  (0, import_solid_js25.createEffect)(() => {
    const isCopied = copied();
    if (!copyClipboardIconRef || !copyCheckIconRef) return;
    copyClipboardAnim?.stop();
    copyCheckAnim?.stop();
    if (!didInitCopyIcons) return;
    const transition = {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    };
    copyClipboardAnim = (0, import_motion8.animate)(copyClipboardIconRef, {
      opacity: isCopied ? 0 : 1,
      scale: isCopied ? 0.5 : 1,
      filter: isCopied ? "blur(4px)" : "blur(0px)"
    }, transition);
    copyCheckAnim = (0, import_motion8.animate)(copyCheckIconRef, {
      opacity: isCopied ? 1 : 0,
      scale: isCopied ? 1 : 0.5,
      filter: isCopied ? "blur(0px)" : "blur(4px)"
    }, transition);
  });
  (0, import_solid_js25.onCleanup)(() => {
    addTapAnim?.stop();
    copyTapAnim?.stop();
    copyClipboardAnim?.stop();
    copyCheckAnim?.stop();
  });
  const handleAddTapStart = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = (0, import_motion8.animate)(addButtonRef, {
      scale: 0.9
    }, tapTransition);
  };
  const handleAddTapEnd = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = (0, import_motion8.animate)(addButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const handleCopyTapStart = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = (0, import_motion8.animate)(copyButtonRef, {
      scale: 0.95
    }, tapTransition);
  };
  const handleCopyTapEnd = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = (0, import_motion8.animate)(copyButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const renderControls = () => (0, import_web191.createComponent)(ControlRenderer, {
    get panelId() {
      return props.panel.id;
    },
    get controls() {
      return props.panel.controls;
    },
    get values() {
      return values();
    }
  });
  const presetsHidden = () => import_store9.TweakStore.arePresetsHidden(props.panel.id);
  const toolbar = presetsHidden() ? props.toolbarExtra : [(() => {
    var _el$ = _tmpl$58(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling;
    _el$.addEventListener("pointerleave", handleAddTapEnd);
    _el$.addEventListener("pointercancel", handleAddTapEnd);
    _el$.$$pointerup = handleAddTapEnd;
    _el$.$$pointerdown = handleAddTapStart;
    _el$.$$click = handleAddPreset;
    var _ref$ = addButtonRef;
    typeof _ref$ === "function" ? (0, import_web190.use)(_ref$, _el$) : addButtonRef = _el$;
    (0, import_web189.effect)((_p$) => {
      var _v$ = import_icons5.ICON_ADD_PRESET[0], _v$2 = import_icons5.ICON_ADD_PRESET[1], _v$3 = import_icons5.ICON_ADD_PRESET[2], _v$4 = import_icons5.ICON_ADD_PRESET[3], _v$5 = import_icons5.ICON_ADD_PRESET[4];
      _v$ !== _p$.e && (0, import_web188.setAttribute)(_el$3, "d", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web188.setAttribute)(_el$4, "d", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web188.setAttribute)(_el$5, "d", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web188.setAttribute)(_el$6, "d", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web188.setAttribute)(_el$7, "d", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })(), (0, import_web191.createComponent)(PresetManager, {
    get panelId() {
      return props.panel.id;
    },
    get presets() {
      return presets();
    },
    get activePresetId() {
      return activePresetId();
    },
    onAdd: handleAddPreset,
    get providerMode() {
      return providerMode();
    }
  }), (() => {
    var _el$8 = _tmpl$220(), _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$0.nextSibling, _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild;
    _el$8.addEventListener("pointerleave", handleCopyTapEnd);
    _el$8.addEventListener("pointercancel", handleCopyTapEnd);
    _el$8.$$pointerup = handleCopyTapEnd;
    _el$8.$$pointerdown = handleCopyTapStart;
    _el$8.$$click = handleCopy;
    var _ref$2 = copyButtonRef;
    typeof _ref$2 === "function" ? (0, import_web190.use)(_ref$2, _el$8) : copyButtonRef = _el$8;
    var _ref$3 = copyClipboardIconRef;
    typeof _ref$3 === "function" ? (0, import_web190.use)(_ref$3, _el$0) : copyClipboardIconRef = _el$0;
    var _ref$4 = copyCheckIconRef;
    typeof _ref$4 === "function" ? (0, import_web190.use)(_ref$4, _el$13) : copyCheckIconRef = _el$13;
    (0, import_web188.setAttribute)(_el$15, "d", import_icons5.ICON_CHECK);
    (0, import_web189.effect)((_p$) => {
      var _v$6 = import_icons5.ICON_CLIPBOARD.board, _v$7 = import_icons5.ICON_CLIPBOARD.sparkle, _v$8 = import_icons5.ICON_CLIPBOARD.body;
      _v$6 !== _p$.e && (0, import_web188.setAttribute)(_el$10, "d", _p$.e = _v$6);
      _v$7 !== _p$.t && (0, import_web188.setAttribute)(_el$11, "d", _p$.t = _v$7);
      _v$8 !== _p$.a && (0, import_web188.setAttribute)(_el$12, "d", _p$.a = _v$8);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$8;
  })(), (0, import_web187.memo)(() => props.toolbarExtra)];
  return (() => {
    var _el$16 = _tmpl$315();
    (0, import_web186.insert)(_el$16, (0, import_web191.createComponent)(Folder, {
      get title() {
        return props.panel.name;
      },
      get defaultOpen() {
        return props.defaultOpen ?? true;
      },
      isRoot: true,
      get inline() {
        return props.inline ?? false;
      },
      onOpenChange: setIsPanelOpen,
      toolbar,
      get enabled() {
        return (0, import_web187.memo)(() => !!props.panel.module)() ? values()["_enabled"] : void 0;
      },
      get onEnabledChange() {
        return props.panel.module ? (v) => import_store9.TweakStore.updateValue(props.panel.id, "_enabled", v) : void 0;
      },
      get children() {
        return renderControls();
      }
    }));
    return _el$16;
  })();
}
(0, import_web185.delegateEvents)(["click", "pointerdown", "pointerup"]);

// src/solid/components/Timeline/TimelineToggleButton.tsx
var import_web192 = require("solid-js/web");
var import_web193 = require("solid-js/web");
var import_web194 = require("solid-js/web");
var import_web195 = require("solid-js/web");
var import_web196 = require("solid-js/web");
var import_web197 = require("solid-js/web");
var import_solid_js26 = require("solid-js");
var import_icons6 = require("tweakers/icons");
var import_timeline3 = require("tweakers/timeline");
var _tmpl$59 = /* @__PURE__ */ (0, import_web192.template)(`<button class="tweakers-toolbar-add tweakers-timeline-toolbar-toggle"><svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$221 = /* @__PURE__ */ (0, import_web192.template)(`<svg><path fill=currentColor></svg>`, false, true, false);
function TimelineToggleButton() {
  const visible = fromStore(() => import_timeline3.TimelineUiStore.getVisible(), (notify) => import_timeline3.TimelineUiStore.subscribe(notify));
  const label = () => visible() ? "Hide timeline" : "Show timeline";
  return (() => {
    var _el$ = _tmpl$59(), _el$2 = _el$.firstChild;
    _el$.$$click = () => import_timeline3.TimelineUiStore.toggle();
    (0, import_web196.insert)(_el$2, (0, import_web197.createComponent)(import_solid_js26.For, {
      each: import_icons6.ICON_TIMELINE,
      children: (path) => (() => {
        var _el$3 = _tmpl$221();
        (0, import_web194.setAttribute)(_el$3, "d", path);
        return _el$3;
      })()
    }));
    (0, import_web195.effect)((_p$) => {
      var _v$ = visible() || void 0, _v$2 = visible(), _v$3 = label(), _v$4 = label();
      _v$ !== _p$.e && (0, import_web194.setAttribute)(_el$, "data-active", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web194.setAttribute)(_el$, "aria-pressed", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web194.setAttribute)(_el$, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web194.setAttribute)(_el$, "title", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
(0, import_web193.delegateEvents)(["click"]);

// src/solid/components/TweakRoot.tsx
var import_meta = {};
var _tmpl$60 = /* @__PURE__ */ (0, import_web198.template)(`<div class=tweakers-root><div class=tweakers-panel>`);
var _tmpl$222 = /* @__PURE__ */ (0, import_web198.template)(`<div class=tweakers-timeline-toolkit-only>Timeline`);
var _tmpl$316 = /* @__PURE__ */ (0, import_web198.template)(`<div class=tweakers-panel-wrapper>`);
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import_meta !== "undefined" && import_meta.env?.MODE ? import_meta.env.MODE !== "production" : true;
function TweakRoot(props) {
  if ((props.productionEnabled ?? isDevDefault) === false) return null;
  const [panels, setPanels] = (0, import_solid_js27.createSignal)([]);
  const [timelineCount, setTimelineCount] = (0, import_solid_js27.createSignal)(0);
  const [mounted, setMounted] = (0, import_solid_js27.createSignal)(false);
  const inline = () => (props.mode ?? "popover") === "inline";
  const read = () => import_store10.TweakStore.selectPanels(props.panels);
  (0, import_solid_js27.onMount)(() => {
    setMounted(true);
    setPanels(read());
    setTimelineCount(import_timeline4.TimelineStore.getTimelines().length);
    const unsubPanels = import_store10.TweakStore.subscribeGlobal(() => {
      setPanels(read());
    });
    const unsubTimelines = import_timeline4.TimelineStore.subscribeGlobal(() => {
      setTimelineCount(import_timeline4.TimelineStore.getTimelines().length);
    });
    (0, import_solid_js27.onCleanup)(() => {
      unsubPanels();
      unsubTimelines();
    });
  });
  const timelineToggle = () => timelineCount() > 0 && props.panels === void 0 ? (0, import_web203.createComponent)(TimelineToggleButton, {}) : null;
  const content = () => (0, import_web203.createComponent)(ShortcutListener, {
    get children() {
      var _el$ = _tmpl$60(), _el$2 = _el$.firstChild;
      (0, import_web202.insert)(_el$2, (0, import_web203.createComponent)(import_solid_js27.Show, {
        get when() {
          return panels().length > 0;
        },
        get fallback() {
          return (() => {
            var _el$3 = _tmpl$316();
            (0, import_web202.insert)(_el$3, (0, import_web203.createComponent)(Folder, {
              title: "Tweakers",
              get defaultOpen() {
                return inline() || (props.defaultOpen ?? true);
              },
              isRoot: true,
              get inline() {
                return inline();
              },
              get toolbar() {
                return timelineToggle();
              },
              get children() {
                return _tmpl$222();
              }
            }));
            return _el$3;
          })();
        },
        get children() {
          return (0, import_web203.createComponent)(import_solid_js27.For, {
            get each() {
              return panels();
            },
            children: (panel) => (0, import_web203.createComponent)(Panel, {
              panel,
              get defaultOpen() {
                return inline() || (props.defaultOpen ?? true);
              },
              get inline() {
                return inline();
              },
              get toolbarExtra() {
                return timelineToggle();
              }
            })
          });
        }
      }));
      (0, import_web201.effect)((_p$) => {
        var _v$ = props.mode ?? "popover", _v$2 = props.theme ?? "system", _v$3 = props.chrome ?? "card", _v$4 = inline() ? void 0 : props.position ?? "top-right", _v$5 = props.mode ?? "popover";
        _v$ !== _p$.e && (0, import_web200.setAttribute)(_el$, "data-mode", _p$.e = _v$);
        _v$2 !== _p$.t && (0, import_web200.setAttribute)(_el$, "data-theme", _p$.t = _v$2);
        _v$3 !== _p$.a && (0, import_web200.setAttribute)(_el$, "data-chrome", _p$.a = _v$3);
        _v$4 !== _p$.o && (0, import_web200.setAttribute)(_el$2, "data-position", _p$.o = _v$4);
        _v$5 !== _p$.i && (0, import_web200.setAttribute)(_el$2, "data-mode", _p$.i = _v$5);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      });
      return _el$;
    }
  });
  return (0, import_web203.createComponent)(import_solid_js27.Show, {
    get when() {
      return (0, import_web199.memo)(() => !!(mounted() && typeof window !== "undefined"))() && (panels().length > 0 || props.panels === void 0 && timelineCount() > 0);
    },
    get children() {
      return (0, import_web203.createComponent)(import_solid_js27.Show, {
        get when() {
          return !inline();
        },
        get fallback() {
          return content();
        },
        get children() {
          return (0, import_web203.createComponent)(import_web204.Portal, {
            get mount() {
              return document.body;
            },
            get children() {
              return content();
            }
          });
        }
      });
    }
  });
}

// src/solid/components/Timeline/TweakTimeline.tsx
var import_web205 = require("solid-js/web");
var import_web206 = require("solid-js/web");
var import_web207 = require("solid-js/web");
var import_web208 = require("solid-js/web");
var import_web209 = require("solid-js/web");
var import_web210 = require("solid-js/web");
var import_web211 = require("solid-js/web");
var import_web212 = require("solid-js/web");
var import_web213 = require("solid-js/web");
var import_web214 = require("solid-js/web");
var import_web215 = require("solid-js/web");
var import_solid_js28 = require("solid-js");
var import_web216 = require("solid-js/web");
var import_store11 = require("tweakers/store");
var import_timeline5 = require("tweakers/timeline");
var import_timeline6 = require("tweakers/timeline");
var import_timeline7 = require("tweakers/timeline");
var import_transition_math = require("tweakers/transition-math");
var import_copy_instruction = require("tweakers/copy-instruction");
var import_env = require("tweakers/env");
var import_icons7 = require("tweakers/icons");
var import_shortcut_utils7 = require("tweakers/shortcut-utils");
var _tmpl$61 = /* @__PURE__ */ (0, import_web205.template)(`<div class="tweakers-root tweakers-timeline"><div class=tweakers-timeline-resize-handle role=separator aria-label="Resize timeline height"aria-orientation=horizontal title="Drag to resize timeline"></div><div class=tweakers-timeline-dock>`);
var _tmpl$223 = /* @__PURE__ */ (0, import_web205.template)(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$317 = /* @__PURE__ */ (0, import_web205.template)(`<button class=tweakers-toolbar-add><span style=position:relative;width:16px;height:16px>`);
var _tmpl$411 = /* @__PURE__ */ (0, import_web205.template)(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true><path fill=currentColor>`);
var _tmpl$510 = /* @__PURE__ */ (0, import_web205.template)(`<svg><path fill=currentColor></svg>`, false, true, false);
var _tmpl$66 = /* @__PURE__ */ (0, import_web205.template)(`<button class=tweakers-toolbar-add title=Replay aria-label=Replay><svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$73 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-overview title="Drag to scrub the full timeline"><div class=tweakers-timeline-overview-viewport></div><div class=tweakers-timeline-overview-progress></div><div class=tweakers-timeline-overview-playhead>`);
var _tmpl$83 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-playhead-control role=slider aria-label="Timeline current time"aria-valuemin=0 title="Drag to scrub the timeline"><div class=tweakers-timeline-playhead-stem></div><div class=tweakers-timeline-playhead-anchor><div class=tweakers-timeline-playhead-flag>`);
var _tmpl$93 = /* @__PURE__ */ (0, import_web205.template)(`<div class="tweakers-timeline-row tweakers-timeline-group-row"><div class=tweakers-timeline-label><button class=tweakers-timeline-group-toggle></button><span></span></div><div class=tweakers-timeline-lane>`);
var _tmpl$03 = /* @__PURE__ */ (0, import_web205.template)(`<button class=tweakers-timeline-group-toggle>`);
var _tmpl$110 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-row><div class=tweakers-timeline-label></div><div class=tweakers-timeline-lane>`);
var _tmpl$103 = /* @__PURE__ */ (0, import_web205.template)(`<div class="tweakers-timeline-row tweakers-timeline-track-row"><div class=tweakers-timeline-label></div><div class=tweakers-timeline-lane>`);
var _tmpl$112 = /* @__PURE__ */ (0, import_web205.template)(`<svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path>`);
var _tmpl$122 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-scroll-row><div class=tweakers-timeline-label></div><div class=tweakers-timeline-horizontal-scroll aria-label="Timeline horizontal scroll"><div>`);
var _tmpl$132 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-body><div class=tweakers-timeline-grid><div class="tweakers-timeline-row tweakers-timeline-ruler-row"><div class=tweakers-timeline-label></div><div class=tweakers-timeline-ruler title="Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom">`);
var _tmpl$142 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-section><div class=tweakers-timeline-header><div class=tweakers-timeline-identity><span class=tweakers-timeline-title></span></div><div class=tweakers-timeline-actions><button class=tweakers-timeline-loop-toggle><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true></svg></button><button class=tweakers-toolbar-add title="Add timeline version"aria-label="Add timeline version"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round aria-hidden=true></svg></button><button class=tweakers-toolbar-add title="Copy parameters"><span style=position:relative;width:16px;height:16px></span></button><button class=tweakers-timeline-chevron>`);
var _tmpl$152 = /* @__PURE__ */ (0, import_web205.template)(`<svg><path></svg>`, false, true, false);
var _tmpl$162 = /* @__PURE__ */ (0, import_web205.template)(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true><path stroke=currentColor stroke-width=2 stroke-linejoin=round></path><path fill=currentColor></path><path stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`);
var _tmpl$172 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-loop-dim style=left:0px>`);
var _tmpl$182 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-loop-dim style=right:0px>`);
var _tmpl$192 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-loop-band>`);
var _tmpl$202 = /* @__PURE__ */ (0, import_web205.template)(`<div class="tweakers-timeline-tick tweakers-timeline-tick-fine">`);
var _tmpl$2110 = /* @__PURE__ */ (0, import_web205.template)(`<div class="tweakers-timeline-tick tweakers-timeline-tick-medium">`);
var _tmpl$224 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-tick><span class=tweakers-timeline-tick-label>`);
var _tmpl$232 = /* @__PURE__ */ (0, import_web205.template)(`<svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$242 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-root><div class=tweakers-timeline-popover role=dialog><div class=tweakers-timeline-popover-header><span class=tweakers-timeline-popover-title></span><button class=tweakers-timeline-popover-close title="Close editor"aria-label="Close editor"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round><path d="M6 6L18 18M18 6L6 18"></path></svg></button></div><div class=tweakers-timeline-popover-body>`);
var _tmpl$252 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip-handle data-edge=start>`);
var _tmpl$262 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip>`);
var _tmpl$272 = /* @__PURE__ */ (0, import_web205.template)(`<span class=tweakers-timeline-loop-infinity aria-hidden=true title="Repeats indefinitely">\u221E`);
var _tmpl$282 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip-ghost aria-hidden=true>`);
var _tmpl$292 = /* @__PURE__ */ (0, import_web205.template)(`<span class=tweakers-timeline-clip-ghost-segment>`);
var _tmpl$302 = /* @__PURE__ */ (0, import_web205.template)(`<span class=tweakers-timeline-clip-duration>`);
var _tmpl$318 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip-handle data-edge=end>`);
var _tmpl$322 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip-segment>`);
var _tmpl$332 = /* @__PURE__ */ (0, import_web205.template)(`<div class=tweakers-timeline-clip-handle>`);
var DRAG_THRESHOLD_PX = 3;
var LOOP_DRAG_THRESHOLD_PX = 4;
var MAJOR_TICK_TARGET_PX = 140;
var MILLISECOND_STEP = 1e-3;
var SECOND_TICK_STEPS = [1e-3, 2e-3, 5e-3, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600];
var MIN_TIMELINE_MAX_ZOOM = 8;
var PLAYHEAD_FLAG_WIDTH = 52;
var PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
var POPOVER_WIDTH = 280;
var ZOOM_DRAG_DISTANCE = 180;
var DEFAULT_DOCK_MAX_HEIGHT = 400;
var MIN_DOCK_MAX_HEIGHT = 120;
function TweakTimeline(props) {
  const enabled = () => (props.productionEnabled ?? import_env.isDevDefault) !== false;
  return (0, import_web215.createComponent)(import_solid_js28.Show, {
    get when() {
      return enabled();
    },
    get children() {
      return (0, import_web215.createComponent)(TweakTimelineDock, props);
    }
  });
}
function TweakTimelineDock(props) {
  const timelines = fromStore(() => import_timeline5.TimelineStore.getTimelines(), (notify) => import_timeline5.TimelineStore.subscribeGlobal(notify));
  const visible = fromStore(() => import_timeline6.TimelineUiStore.getVisible(), (notify) => import_timeline6.TimelineUiStore.subscribe(notify));
  const [mounted, setMounted] = (0, import_solid_js28.createSignal)(false);
  const [dockMaxHeight, setDockMaxHeight] = (0, import_solid_js28.createSignal)(DEFAULT_DOCK_MAX_HEIGHT);
  const controllerId = /* @__PURE__ */ Symbol("tweakers-timeline-visibility");
  let dockRef;
  let resizeCleanup = null;
  (0, import_solid_js28.onMount)(() => {
    setMounted(true);
    const unregister = import_timeline6.TimelineUiStore.registerController(controllerId, {
      visible: props.visible,
      defaultVisible: props.defaultVisible ?? true,
      onVisibilityChange: props.onVisibilityChange
    });
    (0, import_solid_js28.onCleanup)(unregister);
  });
  (0, import_solid_js28.createEffect)(() => {
    import_timeline6.TimelineUiStore.updateController(controllerId, {
      visible: props.visible,
      defaultVisible: props.defaultVisible ?? true,
      onVisibilityChange: props.onVisibilityChange
    });
  });
  (0, import_solid_js28.onCleanup)(() => resizeCleanup?.());
  const handleResizePointerDown = (event) => {
    if (!dockRef) return;
    event.preventDefault();
    event.stopPropagation();
    resizeCleanup?.();
    const pointerY = event.clientY;
    const startHeight = dockRef.getBoundingClientRect().height;
    const move = (next) => {
      next.preventDefault();
      const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
      setDockMaxHeight((0, import_transition_math.clamp)(startHeight + pointerY - next.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax));
    };
    const finish = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      resizeCleanup = null;
    };
    window.addEventListener("pointermove", move, {
      passive: false
    });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    resizeCleanup = finish;
  };
  return (0, import_web215.createComponent)(import_solid_js28.Show, {
    get when() {
      return (0, import_web214.memo)(() => !!mounted())() && timelines().length > 0;
    },
    get children() {
      return (0, import_web215.createComponent)(import_web216.Portal, {
        get mount() {
          return document.body;
        },
        get children() {
          var _el$ = _tmpl$61(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
          _el$2.$$pointerdown = handleResizePointerDown;
          var _ref$ = dockRef;
          typeof _ref$ === "function" ? (0, import_web213.use)(_ref$, _el$3) : dockRef = _el$3;
          (0, import_web212.insert)(_el$3, (0, import_web215.createComponent)(import_solid_js28.For, {
            get each() {
              return timelines();
            },
            children: (timeline) => (0, import_web215.createComponent)(TimelineSection, {
              meta: timeline,
              get defaultOpen() {
                return props.defaultOpen ?? true;
              },
              get theme() {
                return props.theme ?? "system";
              },
              get dockVisible() {
                return visible();
              }
            })
          }));
          (0, import_web211.effect)((_p$) => {
            var _v$ = props.theme ?? "system", _v$2 = !visible(), _v$3 = `min(${dockMaxHeight()}px, calc(100vh - 24px))`;
            _v$ !== _p$.e && (0, import_web210.setAttribute)(_el$, "data-theme", _p$.e = _v$);
            _v$2 !== _p$.t && (_el$.hidden = _p$.t = _v$2);
            _v$3 !== _p$.a && (0, import_web209.setStyleProperty)(_el$3, "max-height", _p$.a = _v$3);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$;
        }
      });
    }
  });
}
function PlayPauseButton(props) {
  const playing = fromStore(() => import_timeline5.TimelineStore.getTransport(props.id).playing, (notify) => import_timeline5.TimelineStore.subscribe(props.id, notify));
  const label = () => playing() ? "Pause" : "Play";
  return (() => {
    var _el$4 = _tmpl$317(), _el$5 = _el$4.firstChild;
    _el$4.$$click = () => playing() ? import_timeline5.TimelineStore.pause(props.id) : import_timeline5.TimelineStore.play(props.id);
    (0, import_web212.insert)(_el$5, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return playing();
      },
      get fallback() {
        return (() => {
          var _el$7 = _tmpl$411(), _el$8 = _el$7.firstChild;
          (0, import_web210.setAttribute)(_el$8, "d", import_icons7.ICON_PLAY);
          (0, import_web211.effect)((_$p) => (0, import_web208.style)(_el$7, iconStyle, _$p));
          return _el$7;
        })();
      },
      get children() {
        var _el$6 = _tmpl$223();
        (0, import_web212.insert)(_el$6, (0, import_web215.createComponent)(import_solid_js28.For, {
          each: import_icons7.ICON_PAUSE,
          children: (path) => (() => {
            var _el$9 = _tmpl$510();
            (0, import_web210.setAttribute)(_el$9, "d", path);
            return _el$9;
          })()
        }));
        (0, import_web211.effect)((_$p) => (0, import_web208.style)(_el$6, iconStyle, _$p));
        return _el$6;
      }
    }));
    (0, import_web211.effect)((_p$) => {
      var _v$4 = label(), _v$5 = label();
      _v$4 !== _p$.e && (0, import_web210.setAttribute)(_el$4, "title", _p$.e = _v$4);
      _v$5 !== _p$.t && (0, import_web210.setAttribute)(_el$4, "aria-label", _p$.t = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$4;
  })();
}
function ReplayButton(props) {
  return (() => {
    var _el$0 = _tmpl$66(), _el$1 = _el$0.firstChild;
    (0, import_web207.addEventListener)(_el$0, "click", props.onReplay, true);
    (0, import_web212.insert)(_el$1, (0, import_web215.createComponent)(import_solid_js28.For, {
      each: import_icons7.ICON_REPLAY,
      children: (path) => (() => {
        var _el$10 = _tmpl$510();
        (0, import_web210.setAttribute)(_el$10, "d", path);
        return _el$10;
      })()
    }));
    return _el$0;
  })();
}
var iconStyle = {
  position: "absolute",
  inset: "0",
  width: "16px",
  height: "16px",
  color: "var(--tweak-text-label)"
};
function TimelineOverview(props) {
  const time = fromStore(() => import_timeline5.TimelineStore.getTransport(props.id).time, (notify) => import_timeline5.TimelineStore.subscribe(props.id, notify));
  let scrub = null;
  const seekFromClientX = (clientX) => {
    if (!scrub || scrub.rect.width <= 0 || props.duration <= 0) return;
    const next = (0, import_transition_math.clamp)((clientX - scrub.rect.left) / scrub.rect.width * props.duration, 0, props.duration);
    import_timeline5.TimelineStore.seek(props.id, next);
    props.onNavigate(next);
  };
  const finish = () => {
    if (scrub?.wasPlaying) import_timeline5.TimelineStore.play(props.id);
    scrub = null;
  };
  return (() => {
    var _el$11 = _tmpl$73(), _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
    _el$11.addEventListener("lostpointercapture", finish);
    _el$11.addEventListener("pointercancel", finish);
    _el$11.$$pointerup = finish;
    _el$11.$$pointermove = (event) => scrub && seekFromClientX(event.clientX);
    _el$11.$$pointerdown = (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      scrub = {
        wasPlaying: import_timeline5.TimelineStore.getTransport(props.id).playing,
        rect: event.currentTarget.getBoundingClientRect()
      };
      import_timeline5.TimelineStore.pause(props.id);
      seekFromClientX(event.clientX);
    };
    (0, import_web211.effect)((_p$) => {
      var _v$6 = (props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100) < 99.999 || void 0, _v$7 = `${props.duration > 0 ? props.viewStart / props.duration * 100 : 0}%`, _v$8 = `${props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100}%`, _v$9 = `${props.duration > 0 ? time() / props.duration * 100 : 0}%`, _v$0 = `${props.duration > 0 ? time() / props.duration * 100 : 0}%`;
      _v$6 !== _p$.e && (0, import_web210.setAttribute)(_el$12, "data-zoomed", _p$.e = _v$6);
      _v$7 !== _p$.t && (0, import_web209.setStyleProperty)(_el$12, "left", _p$.t = _v$7);
      _v$8 !== _p$.a && (0, import_web209.setStyleProperty)(_el$12, "width", _p$.a = _v$8);
      _v$9 !== _p$.o && (0, import_web209.setStyleProperty)(_el$13, "width", _p$.o = _v$9);
      _v$0 !== _p$.i && (0, import_web209.setStyleProperty)(_el$14, "left", _p$.i = _v$0);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$11;
  })();
}
function TimelinePlayheadFlag(props) {
  const time = fromStore(() => import_timeline5.TimelineStore.getTransport(props.id).time, (notify) => import_timeline5.TimelineStore.subscribe(props.id, notify));
  let scrub = null;
  let cleanup = null;
  const seek = (clientX) => {
    if (!scrub || scrub.rect.width <= 0) return;
    import_timeline5.TimelineStore.seek(props.id, (0, import_transition_math.clamp)(scrub.viewStart + (clientX - scrub.rect.left) / scrub.rect.width * (scrub.viewEnd - scrub.viewStart), scrub.viewStart, scrub.viewEnd));
  };
  (0, import_solid_js28.onCleanup)(() => cleanup?.());
  const x = () => (0, import_transition_math.clamp)((time() - props.viewStart) * props.pxPerSecond, 0, props.laneWidth);
  const flagCenter = () => (0, import_transition_math.clamp)(x(), PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG, props.laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG);
  const flagOffset = () => flagCenter() - x();
  const edge = () => flagOffset() > 0.5 ? "start" : flagOffset() < -0.5 ? "end" : "center";
  return (0, import_web215.createComponent)(import_solid_js28.Show, {
    get when() {
      return (0, import_web214.memo)(() => !!(time() >= props.viewStart && time() <= props.viewEnd))() && props.laneWidth > 0;
    },
    get children() {
      var _el$15 = _tmpl$83(), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling, _el$18 = _el$17.firstChild;
      _el$15.$$pointerdown = (event) => {
        const rect = props.ruler?.getBoundingClientRect();
        if (!rect) return;
        event.preventDefault();
        event.stopPropagation();
        cleanup?.();
        const reset = event.shiftKey;
        scrub = {
          wasPlaying: import_timeline5.TimelineStore.getTransport(props.id).playing,
          rect,
          viewStart: reset ? 0 : props.viewStart,
          viewEnd: reset ? props.duration : props.viewEnd
        };
        if (reset) props.onResetView();
        import_timeline5.TimelineStore.pause(props.id);
        seek(event.clientX);
        const move = (next) => {
          next.preventDefault();
          seek(next.clientX);
        };
        const finish = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", finish);
          window.removeEventListener("pointercancel", finish);
          if (scrub?.wasPlaying) import_timeline5.TimelineStore.play(props.id);
          scrub = null;
          cleanup = null;
        };
        window.addEventListener("pointermove", move, {
          passive: false
        });
        window.addEventListener("pointerup", finish);
        window.addEventListener("pointercancel", finish);
        cleanup = finish;
      };
      (0, import_web212.insert)(_el$18, () => time().toFixed(2));
      (0, import_web211.effect)((_p$) => {
        var _v$1 = edge(), _v$10 = `calc(var(--tweak-timeline-label-w) + ${x()}px)`, _v$11 = `${flagOffset()}px`, _v$12 = props.duration, _v$13 = time();
        _v$1 !== _p$.e && (0, import_web210.setAttribute)(_el$15, "data-edge", _p$.e = _v$1);
        _v$10 !== _p$.t && (0, import_web209.setStyleProperty)(_el$15, "left", _p$.t = _v$10);
        _v$11 !== _p$.a && (0, import_web209.setStyleProperty)(_el$15, "--tweak-timeline-playhead-flag-offset", _p$.a = _v$11);
        _v$12 !== _p$.o && (0, import_web210.setAttribute)(_el$15, "aria-valuemax", _p$.o = _v$12);
        _v$13 !== _p$.i && (0, import_web210.setAttribute)(_el$15, "aria-valuenow", _p$.i = _v$13);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      });
      return _el$15;
    }
  });
}
function clampViewStart(start, duration, visibleDuration) {
  return (0, import_transition_math.clamp)(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return (0, import_timeline7.formatClock)(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
function TimelineSection(props) {
  const [open, setOpen] = (0, import_solid_js28.createSignal)(props.defaultOpen);
  const [copied, setCopied] = (0, import_solid_js28.createSignal)(false);
  const [popover, setPopover] = (0, import_solid_js28.createSignal)(null);
  const [collapsedGroups, setCollapsedGroups] = (0, import_solid_js28.createSignal)(/* @__PURE__ */ new Set());
  const [expandedTracks, setExpandedTracks] = (0, import_solid_js28.createSignal)(/* @__PURE__ */ new Set());
  const [zoom, setZoom] = (0, import_solid_js28.createSignal)(1);
  const [viewStart, setViewStart] = (0, import_solid_js28.createSignal)(0);
  const values = fromStore(() => import_store11.TweakStore.getValues(props.meta.id), (notify) => import_store11.TweakStore.subscribe(props.meta.id, notify));
  const presets = () => {
    values();
    return import_store11.TweakStore.getPresets(props.meta.id);
  };
  const activePresetId = () => {
    values();
    return import_store11.TweakStore.getActivePresetId(props.meta.id);
  };
  const loopRegion = fromStore(() => import_timeline5.TimelineStore.getLoopRegion(props.meta.id), (notify) => import_timeline5.TimelineStore.subscribe(props.meta.id, notify));
  const [loopDrag, setLoopDrag] = (0, import_solid_js28.createSignal)(null);
  let laneAreaRef;
  let horizontalScrollRef;
  const [laneWidth, setLaneWidth] = (0, import_solid_js28.createSignal)(0);
  (0, import_solid_js28.createEffect)(() => {
    if (!open() || !laneAreaRef) return;
    const measure = () => {
      if (laneAreaRef) setLaneWidth(laneAreaRef.getBoundingClientRect().width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(laneAreaRef);
    (0, import_solid_js28.onCleanup)(() => observer.disconnect());
  });
  const visibleDuration = () => props.meta.duration > 0 ? props.meta.duration / zoom() : props.meta.duration;
  const safeViewStart = () => clampViewStart(viewStart(), props.meta.duration, visibleDuration());
  const viewEnd = () => safeViewStart() + visibleDuration();
  const pxPerSecond = () => visibleDuration() > 0 && laneWidth() > 0 ? laneWidth() / visibleDuration() : 0;
  const maxZoom = () => Math.max(MIN_TIMELINE_MAX_ZOOM, laneWidth() > 0 && props.meta.duration > 0 ? MAJOR_TICK_TARGET_PX * props.meta.duration / (MILLISECOND_STEP * 10 * laneWidth()) : MIN_TIMELINE_MAX_ZOOM);
  (0, import_solid_js28.createEffect)(() => setZoom((current) => (0, import_transition_math.clamp)(current, 1, maxZoom())));
  (0, import_solid_js28.createEffect)(() => setViewStart((current) => clampViewStart(current, props.meta.duration, props.meta.duration / zoom())));
  (0, import_solid_js28.createEffect)(() => {
    const scroller = horizontalScrollRef;
    const next = safeViewStart() * pxPerSecond();
    if (!scroller || pxPerSecond() <= 0) return;
    if (Math.abs(scroller.scrollLeft - next) > 0.5) scroller.scrollLeft = next;
  });
  (0, import_solid_js28.createEffect)(() => {
    if (!props.dockVisible) setPopover(null);
  });
  const centerViewAt = (time) => {
    if (zoom() <= 1 || props.meta.duration <= 0) return;
    const duration = props.meta.duration / zoom();
    setViewStart(clampViewStart(time - duration / 2, props.meta.duration, duration));
  };
  const resetView = () => {
    setZoom(1);
    setViewStart(0);
  };
  const handleReplay = () => {
    setViewStart(0);
    import_timeline5.TimelineStore.replay(props.meta.id);
  };
  const handleClearLoopRegion = () => import_timeline5.TimelineStore.clearLoopRegion(props.meta.id);
  const handleHorizontalScroll = (event) => {
    if (pxPerSecond() <= 0) return;
    setViewStart(clampViewStart(event.currentTarget.scrollLeft / pxPerSecond(), props.meta.duration, visibleDuration()));
  };
  const handleTimelineWheel = (event) => {
    if (!horizontalScrollRef || zoom() <= 1) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
    if (delta === 0) return;
    event.preventDefault();
    horizontalScrollRef.scrollLeft += delta;
  };
  let zoomDrag = null;
  let rulerGesture = null;
  let trackScrub = null;
  const rulerTimeFromClientX = (clientX, rect, viewStartAt, visibleAt) => (0, import_transition_math.clamp)(viewStartAt + (clientX - rect.left) / rect.width * visibleAt, viewStartAt, viewStartAt + visibleAt);
  const seekTrack = (clientX) => {
    if (!trackScrub || trackScrub.rect.width <= 0) return;
    import_timeline5.TimelineStore.seek(props.meta.id, (0, import_transition_math.clamp)(trackScrub.viewStart + (clientX - trackScrub.rect.left) / trackScrub.rect.width * trackScrub.visibleDuration, trackScrub.viewStart, trackScrub.viewStart + trackScrub.visibleDuration));
  };
  const handleRulerPointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (!event.altKey) {
      const reset = event.shiftKey;
      const gestureViewStart = reset ? 0 : safeViewStart();
      const gestureVisible = reset ? props.meta.duration : visibleDuration();
      if (reset) resetView();
      rulerGesture = {
        downClientX: event.clientX,
        downTime: rulerTimeFromClientX(event.clientX, rect, gestureViewStart, gestureVisible),
        rect,
        viewStart: gestureViewStart,
        visibleDuration: gestureVisible,
        moved: false
      };
      return;
    }
    const ratio = (0, import_transition_math.clamp)((event.clientX - rect.left) / rect.width, 0, 1);
    zoomDrag = {
      pointerX: event.clientX,
      rect,
      zoom: zoom(),
      viewStart: safeViewStart(),
      anchorRatio: ratio,
      anchorTime: safeViewStart() + ratio * visibleDuration(),
      moved: false
    };
  };
  const handleRulerPointerMove = (event) => {
    if (rulerGesture) {
      const dx2 = event.clientX - rulerGesture.downClientX;
      if (!rulerGesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
      rulerGesture.moved = true;
      const current = rulerTimeFromClientX(event.clientX, rulerGesture.rect, rulerGesture.viewStart, rulerGesture.visibleDuration);
      setLoopDrag({
        start: Math.min(rulerGesture.downTime, current),
        end: Math.max(rulerGesture.downTime, current)
      });
      return;
    }
    if (!zoomDrag || props.meta.duration <= 0) return;
    const dx = event.clientX - zoomDrag.pointerX;
    if (!zoomDrag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
    zoomDrag.moved = true;
    const nextZoom = (0, import_transition_math.clamp)(zoomDrag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom());
    const nextDuration = props.meta.duration / nextZoom;
    setZoom(nextZoom);
    setViewStart(clampViewStart(zoomDrag.anchorTime - zoomDrag.anchorRatio * nextDuration, props.meta.duration, nextDuration));
  };
  const finishRuler = () => {
    const gesture = rulerGesture;
    rulerGesture = null;
    zoomDrag = null;
    if (!gesture) return;
    const drag = loopDrag();
    if (gesture.moved && drag) {
      import_timeline5.TimelineStore.setLoopRegion(props.meta.id, drag.start, drag.end);
    } else {
      import_timeline5.TimelineStore.seek(props.meta.id, gesture.downTime);
    }
    setLoopDrag(null);
  };
  const cancelRuler = () => {
    rulerGesture = null;
    zoomDrag = null;
    setLoopDrag(null);
  };
  const handleTrackPointerDown = (event) => {
    const target = event.target;
    if (target.closest(".tweakers-timeline-label, button")) return;
    if (!event.shiftKey && target.closest(".tweakers-timeline-clip")) return;
    const rect = laneAreaRef?.getBoundingClientRect();
    if (!rect) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const reset = event.shiftKey;
    trackScrub = {
      wasPlaying: import_timeline5.TimelineStore.getTransport(props.meta.id).playing,
      rect,
      viewStart: reset ? 0 : safeViewStart(),
      visibleDuration: reset ? props.meta.duration : visibleDuration()
    };
    if (reset) resetView();
    setPopover(null);
    import_timeline5.TimelineStore.pause(props.meta.id);
    seekTrack(event.clientX);
  };
  const finishTrack = () => {
    if (trackScrub?.wasPlaying) import_timeline5.TimelineStore.play(props.meta.id);
    trackScrub = null;
  };
  const handleCopy = () => {
    const normalized = (0, import_timeline7.normalizeTimelineValuesForCopy)(import_store11.TweakStore.getValues(props.meta.id), props.meta.clips);
    void navigator.clipboard.writeText((0, import_copy_instruction.buildCopyInstruction)("createTweakTimeline", props.meta.name, normalized));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const handleAddPreset = () => {
    import_store11.TweakStore.savePreset(props.meta.id, `Version ${presets().length + 2}`);
  };
  const closePopover = () => setPopover(null);
  const openClipPopover = (clip, rect, stepKey) => {
    const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
    if (getClipControls(props.meta.id, targetPath, stepKey ? void 0 : clipPopoverExclusions(clip)).length === 0) return;
    setPopover((previous) => previous?.clip.key === clip.key && previous.stepKey === stepKey ? null : {
      clip,
      stepKey,
      anchor: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      }
    });
  };
  const toggleSet = (setter, key) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleTracks = (key) => toggleSet(setExpandedTracks, key);
  const toggleGroup = (key) => toggleSet(setCollapsedGroups, key);
  const handleBarClick = (clip, rect, stepKey) => {
    if (!stepKey && clip.tracks?.length) toggleTracks(clip.key);
    else openClipPopover(clip, rect, stepKey);
  };
  const ticks = (0, import_solid_js28.createMemo)(() => {
    const rawStep = pxPerSecond() > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond() : 1;
    const adaptive = SECOND_TICK_STEPS.find((step) => step >= rawStep) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
    const majorStep = zoom() < 1.5 && props.meta.duration >= 1 ? Math.max(1, adaptive) : adaptive;
    const fineStep = majorStep / 10;
    const major = [];
    const medium = [];
    const fine = [];
    const firstMajor = Math.ceil((safeViewStart() - 1e-6) / majorStep) * majorStep;
    for (let time = firstMajor; time <= viewEnd() + 1e-6; time += majorStep) {
      major.push(Number(time.toFixed(4)));
    }
    const firstFine = Math.ceil((safeViewStart() - 1e-6) / fineStep);
    const lastFine = Math.floor((viewEnd() + 1e-6) / fineStep);
    for (let index = firstFine; index <= lastFine; index++) {
      if (index % 10 === 0) continue;
      const tick = Number((index * fineStep).toFixed(6));
      if (index % 5 === 0) medium.push(tick);
      else fine.push(tick);
    }
    return {
      major,
      medium,
      fine,
      majorStep
    };
  });
  const rows = (0, import_solid_js28.createMemo)(() => {
    const result = [];
    let lastGroup;
    const currentValues = values();
    for (const clip of props.meta.clips) {
      if (clip.group !== lastGroup) {
        lastGroup = clip.group;
        if (clip.group) {
          const group = clip.group;
          const collapsed = collapsedGroups().has(group);
          result.push((() => {
            var _el$19 = _tmpl$93(), _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling;
            _el$21.$$click = () => toggleGroup(group);
            (0, import_web210.setAttribute)(_el$21, "data-open", !collapsed);
            (0, import_web210.setAttribute)(_el$21, "title", collapsed ? "Expand layer" : "Collapse layer");
            (0, import_web212.insert)(_el$21, (0, import_web215.createComponent)(ChevronIcon, {}));
            (0, import_web212.insert)(_el$22, () => (0, import_store11.formatLabel)(group));
            return _el$19;
          })());
        }
      }
      if (clip.group && collapsedGroups().has(clip.group)) continue;
      const isProps = Boolean(clip.tracks?.length);
      const tracksOpen = isProps && expandedTracks().has(clip.key);
      const stat = (0, import_timeline7.computeClipStaticFromValues)(currentValues, clip, props.meta.duration);
      const selected = popover()?.clip.key === clip.key;
      result.push((() => {
        var _el$23 = _tmpl$110(), _el$24 = _el$23.firstChild, _el$26 = _el$24.nextSibling;
        (0, import_web212.insert)(_el$24, (0, import_web215.createComponent)(import_solid_js28.Show, {
          when: isProps,
          get children() {
            var _el$25 = _tmpl$03();
            _el$25.$$click = (event) => {
              event.stopPropagation();
              toggleTracks(clip.key);
            };
            (0, import_web210.setAttribute)(_el$25, "data-open", tracksOpen);
            (0, import_web210.setAttribute)(_el$25, "title", tracksOpen ? "Collapse properties" : "Expand properties");
            (0, import_web212.insert)(_el$25, (0, import_web215.createComponent)(ChevronIcon, {}));
            return _el$25;
          }
        }), null);
        (0, import_web212.insert)(_el$24, () => clip.label, null);
        (0, import_web212.insert)(_el$26, (0, import_web215.createComponent)(TimelineClip, {
          get timelineId() {
            return props.meta.id;
          },
          clip,
          get at() {
            return stat.at;
          },
          get duration() {
            return stat.duration;
          },
          get loop() {
            return stat.loop;
          },
          get steps() {
            return (0, import_web214.memo)(() => !!clip.stepKeys?.length)() ? stat.tracks[0]?.steps : void 0;
          },
          get fixedDuration() {
            return isProps ? true : stat.isPhysics;
          },
          composite: isProps,
          get pxPerSecond() {
            return pxPerSecond();
          },
          get viewStart() {
            return safeViewStart();
          },
          get timelineDuration() {
            return props.meta.duration;
          },
          selected,
          get selectedStepKey() {
            return selected ? popover()?.stepKey : void 0;
          },
          onClick: handleBarClick,
          onDrag: closePopover
        }));
        (0, import_web211.effect)(() => (0, import_web210.setAttribute)(_el$23, "data-grouped", clip.group ? "" : void 0));
        return _el$23;
      })());
      if (!tracksOpen) continue;
      for (const trackRef of clip.tracks ?? []) {
        const track = stat.tracks.find((candidate) => candidate.prop === trackRef.prop);
        if (!track) continue;
        const trackKey = `${clip.key}.${trackRef.prop}`;
        const trackMeta = {
          key: trackKey,
          label: `${clip.label} \xB7 ${(0, import_store11.formatLabel)(trackRef.prop)}`,
          color: clip.color,
          loop: clip.loop,
          group: clip.group,
          stepKeys: trackRef.stepKeys
        };
        const trackSelected = popover()?.clip.key === trackKey;
        result.push((() => {
          var _el$27 = _tmpl$103(), _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling;
          (0, import_web212.insert)(_el$28, () => (0, import_store11.formatLabel)(trackRef.prop));
          (0, import_web212.insert)(_el$29, (0, import_web215.createComponent)(TimelineClip, {
            get timelineId() {
              return props.meta.id;
            },
            clip: trackMeta,
            get at() {
              return stat.at + track.delay;
            },
            get duration() {
              return track.duration;
            },
            get loop() {
              return stat.loop;
            },
            get steps() {
              return (0, import_web214.memo)(() => !!trackRef.stepKeys?.length)() ? track.steps : void 0;
            },
            get fixedDuration() {
              return (0, import_web214.memo)(() => !!!trackRef.stepKeys?.length)() && track.steps[0]?.isPhysics === true;
            },
            get baseAt() {
              return stat.at;
            },
            delayMode: true,
            get pxPerSecond() {
              return pxPerSecond();
            },
            get viewStart() {
              return safeViewStart();
            },
            get timelineDuration() {
              return props.meta.duration;
            },
            selected: trackSelected,
            get selectedStepKey() {
              return trackSelected ? popover()?.stepKey : void 0;
            },
            onClick: openClipPopover,
            onDrag: closePopover
          }));
          (0, import_web211.effect)(() => (0, import_web210.setAttribute)(_el$27, "data-grouped", clip.group ? "" : void 0));
          return _el$27;
        })());
      }
    }
    return result;
  });
  return (() => {
    var _el$30 = _tmpl$142(), _el$31 = _el$30.firstChild, _el$32 = _el$31.firstChild, _el$33 = _el$32.firstChild, _el$34 = _el$32.nextSibling, _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild, _el$37 = _el$35.nextSibling, _el$38 = _el$37.firstChild, _el$39 = _el$37.nextSibling, _el$40 = _el$39.firstChild, _el$43 = _el$39.nextSibling;
    (0, import_web212.insert)(_el$33, () => props.meta.name);
    (0, import_web212.insert)(_el$31, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return !open();
      },
      get children() {
        return (0, import_web215.createComponent)(TimelineOverview, {
          get id() {
            return props.meta.id;
          },
          get duration() {
            return props.meta.duration;
          },
          get viewStart() {
            return safeViewStart();
          },
          get viewEnd() {
            return viewEnd();
          },
          onNavigate: centerViewAt
        });
      }
    }), _el$34);
    _el$35.$$click = handleClearLoopRegion;
    (0, import_web212.insert)(_el$36, (0, import_web215.createComponent)(import_solid_js28.For, {
      each: import_icons7.ICON_LOOP,
      children: (path) => (() => {
        var _el$53 = _tmpl$152();
        (0, import_web210.setAttribute)(_el$53, "d", path);
        return _el$53;
      })()
    }));
    (0, import_web212.insert)(_el$34, (0, import_web215.createComponent)(PlayPauseButton, {
      get id() {
        return props.meta.id;
      }
    }), _el$37);
    (0, import_web212.insert)(_el$34, (0, import_web215.createComponent)(ReplayButton, {
      onReplay: handleReplay
    }), _el$37);
    _el$37.$$click = handleAddPreset;
    (0, import_web212.insert)(_el$38, (0, import_web215.createComponent)(import_solid_js28.For, {
      each: import_icons7.ICON_ADD_PRESET,
      children: (path) => (() => {
        var _el$54 = _tmpl$152();
        (0, import_web210.setAttribute)(_el$54, "d", path);
        return _el$54;
      })()
    }));
    (0, import_web212.insert)(_el$34, (0, import_web215.createComponent)(PresetManager, {
      get panelId() {
        return props.meta.id;
      },
      get presets() {
        return presets();
      },
      get activePresetId() {
        return activePresetId();
      },
      onAdd: handleAddPreset
    }), _el$39);
    _el$39.$$click = handleCopy;
    (0, import_web212.insert)(_el$40, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return copied();
      },
      get fallback() {
        return (() => {
          var _el$55 = _tmpl$162(), _el$56 = _el$55.firstChild, _el$57 = _el$56.nextSibling, _el$58 = _el$57.nextSibling;
          (0, import_web211.effect)((_p$) => {
            var _v$24 = iconStyle, _v$25 = import_icons7.ICON_CLIPBOARD.board, _v$26 = import_icons7.ICON_CLIPBOARD.sparkle, _v$27 = import_icons7.ICON_CLIPBOARD.body;
            _p$.e = (0, import_web208.style)(_el$55, _v$24, _p$.e);
            _v$25 !== _p$.t && (0, import_web210.setAttribute)(_el$56, "d", _p$.t = _v$25);
            _v$26 !== _p$.a && (0, import_web210.setAttribute)(_el$57, "d", _p$.a = _v$26);
            _v$27 !== _p$.o && (0, import_web210.setAttribute)(_el$58, "d", _p$.o = _v$27);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$55;
        })();
      },
      get children() {
        var _el$41 = _tmpl$112(), _el$42 = _el$41.firstChild;
        (0, import_web210.setAttribute)(_el$42, "d", import_icons7.ICON_CHECK);
        (0, import_web211.effect)((_$p) => (0, import_web208.style)(_el$41, iconStyle, _$p));
        return _el$41;
      }
    }));
    _el$43.$$click = () => setOpen((current) => !current);
    (0, import_web212.insert)(_el$43, (0, import_web215.createComponent)(ChevronIcon, {}));
    (0, import_web212.insert)(_el$30, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return open();
      },
      get children() {
        var _el$44 = _tmpl$132(), _el$45 = _el$44.firstChild, _el$46 = _el$45.firstChild, _el$47 = _el$46.firstChild, _el$48 = _el$47.nextSibling;
        _el$44.addEventListener("lostpointercapture", finishTrack);
        _el$44.addEventListener("pointercancel", finishTrack);
        _el$44.$$pointerup = finishTrack;
        _el$44.$$pointermove = (event) => trackScrub && seekTrack(event.clientX);
        _el$44.$$pointerdown = handleTrackPointerDown;
        _el$44.addEventListener("wheel", handleTimelineWheel);
        _el$48.addEventListener("lostpointercapture", cancelRuler);
        _el$48.addEventListener("pointercancel", cancelRuler);
        _el$48.$$pointerup = finishRuler;
        _el$48.$$pointermove = handleRulerPointerMove;
        _el$48.$$pointerdown = handleRulerPointerDown;
        var _ref$2 = laneAreaRef;
        typeof _ref$2 === "function" ? (0, import_web213.use)(_ref$2, _el$48) : laneAreaRef = _el$48;
        (0, import_web212.insert)(_el$48, (0, import_web215.createComponent)(import_solid_js28.Show, {
          get when() {
            return (0, import_web214.memo)(() => pxPerSecond() > 0)() && (loopDrag() ?? loopRegion());
          },
          children: (region) => {
            const left = () => (region().start - safeViewStart()) * pxPerSecond();
            const width = () => Math.max(0, (region().end - region().start) * pxPerSecond());
            return [(() => {
              var _el$59 = _tmpl$172();
              (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$59, "width", `${Math.max(0, left())}px`));
              return _el$59;
            })(), (() => {
              var _el$60 = _tmpl$182();
              (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$60, "left", `${left() + width()}px`));
              return _el$60;
            })(), (() => {
              var _el$61 = _tmpl$192();
              (0, import_web211.effect)((_p$) => {
                var _v$28 = loopDrag() ? "true" : void 0, _v$29 = `${left()}px`, _v$30 = `${width()}px`;
                _v$28 !== _p$.e && (0, import_web210.setAttribute)(_el$61, "data-live", _p$.e = _v$28);
                _v$29 !== _p$.t && (0, import_web209.setStyleProperty)(_el$61, "left", _p$.t = _v$29);
                _v$30 !== _p$.a && (0, import_web209.setStyleProperty)(_el$61, "width", _p$.a = _v$30);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$61;
            })()];
          }
        }), null);
        (0, import_web212.insert)(_el$48, (0, import_web215.createComponent)(import_solid_js28.For, {
          get each() {
            return ticks().fine;
          },
          children: (time) => (() => {
            var _el$62 = _tmpl$202();
            (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$62, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$62;
          })()
        }), null);
        (0, import_web212.insert)(_el$48, (0, import_web215.createComponent)(import_solid_js28.For, {
          get each() {
            return ticks().medium;
          },
          children: (time) => (() => {
            var _el$63 = _tmpl$2110();
            (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$63, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$63;
          })()
        }), null);
        (0, import_web212.insert)(_el$48, (0, import_web215.createComponent)(import_solid_js28.For, {
          get each() {
            return ticks().major;
          },
          children: (time) => (() => {
            var _el$64 = _tmpl$224(), _el$65 = _el$64.firstChild;
            (0, import_web212.insert)(_el$65, () => formatRulerSeconds(time, ticks().majorStep));
            (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$64, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$64;
          })()
        }), null);
        (0, import_web212.insert)(_el$45, rows, null);
        (0, import_web212.insert)(_el$45, (0, import_web215.createComponent)(import_solid_js28.Show, {
          get when() {
            return pxPerSecond() > 0;
          },
          get children() {
            return (0, import_web215.createComponent)(TimelinePlayheadFlag, {
              get id() {
                return props.meta.id;
              },
              get duration() {
                return props.meta.duration;
              },
              get pxPerSecond() {
                return pxPerSecond();
              },
              get viewStart() {
                return safeViewStart();
              },
              get viewEnd() {
                return viewEnd();
              },
              get laneWidth() {
                return laneWidth();
              },
              ruler: laneAreaRef,
              onResetView: resetView
            });
          }
        }), null);
        (0, import_web212.insert)(_el$44, (0, import_web215.createComponent)(import_solid_js28.Show, {
          get when() {
            return zoom() > 1;
          },
          get children() {
            var _el$49 = _tmpl$122(), _el$50 = _el$49.firstChild, _el$51 = _el$50.nextSibling, _el$52 = _el$51.firstChild;
            _el$51.addEventListener("scroll", handleHorizontalScroll);
            var _ref$3 = horizontalScrollRef;
            typeof _ref$3 === "function" ? (0, import_web213.use)(_ref$3, _el$51) : horizontalScrollRef = _el$51;
            (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$52, "width", `${laneWidth() * zoom()}px`));
            return _el$49;
          }
        }), null);
        return _el$44;
      }
    }), null);
    (0, import_web212.insert)(_el$30, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return popover();
      },
      children: (current) => (0, import_web215.createComponent)(ClipPopover, {
        get panelId() {
          return props.meta.id;
        },
        get popover() {
          return current();
        },
        get values() {
          return values();
        },
        get theme() {
          return props.theme;
        },
        onClose: closePopover
      })
    }), null);
    (0, import_web211.effect)((_p$) => {
      var _v$14 = open() || void 0, _v$15 = loopRegion() ? "true" : void 0, _v$16 = !loopRegion(), _v$17 = loopRegion() ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region", _v$18 = loopRegion() ? "Clear loop region" : "Looping whole timeline", _v$19 = loopRegion() ? true : false, _v$20 = copied() ? "Copied parameters" : "Copy parameters", _v$21 = open(), _v$22 = open(), _v$23 = open() ? "Collapse timeline" : "Expand timeline";
      _v$14 !== _p$.e && (0, import_web210.setAttribute)(_el$31, "data-open", _p$.e = _v$14);
      _v$15 !== _p$.t && (0, import_web210.setAttribute)(_el$35, "data-active", _p$.t = _v$15);
      _v$16 !== _p$.a && (_el$35.disabled = _p$.a = _v$16);
      _v$17 !== _p$.o && (0, import_web210.setAttribute)(_el$35, "title", _p$.o = _v$17);
      _v$18 !== _p$.i && (0, import_web210.setAttribute)(_el$35, "aria-label", _p$.i = _v$18);
      _v$19 !== _p$.n && (0, import_web210.setAttribute)(_el$35, "aria-pressed", _p$.n = _v$19);
      _v$20 !== _p$.s && (0, import_web210.setAttribute)(_el$39, "aria-label", _p$.s = _v$20);
      _v$21 !== _p$.h && (0, import_web210.setAttribute)(_el$43, "data-open", _p$.h = _v$21);
      _v$22 !== _p$.r && (0, import_web210.setAttribute)(_el$43, "aria-expanded", _p$.r = _v$22);
      _v$23 !== _p$.d && (0, import_web210.setAttribute)(_el$43, "title", _p$.d = _v$23);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0
    });
    return _el$30;
  })();
}
function ChevronIcon() {
  return (() => {
    var _el$66 = _tmpl$232(), _el$67 = _el$66.firstChild;
    (0, import_web210.setAttribute)(_el$67, "d", import_icons7.ICON_CHEVRON);
    return _el$66;
  })();
}
function ClipPopover(props) {
  let ref;
  const [naturalHeight, setNaturalHeight] = (0, import_solid_js28.createSignal)(0);
  const [viewport, setViewport] = (0, import_solid_js28.createSignal)(readViewport());
  (0, import_solid_js28.onMount)(() => {
    const measure = () => ref && setNaturalHeight(ref.scrollHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    if (ref) observer.observe(ref.querySelector(".tweakers-timeline-popover-body") ?? ref);
    const updateViewport = () => setViewport(readViewport());
    const outside = (event) => {
      const target = event.target;
      if (ref?.contains(target) || target.closest?.(".tweakers-timeline-clip") || target.closest?.(".tweakers-timeline-label")) return;
      props.onClose();
    };
    const keydown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    (0, import_solid_js28.onCleanup)(() => {
      observer.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown);
    });
  });
  const presentation = (0, import_solid_js28.createMemo)(() => {
    const {
      clip,
      stepKey
    } = props.popover;
    let controls;
    let title;
    if (stepKey) {
      controls = getClipControls(props.panelId, `${clip.key}.${stepKey}`);
      if (stepKey === clip.stepKeys?.[0]) {
        const from2 = getControlAt(props.panelId, `${clip.key}.from`);
        if (from2) {
          const target = `${clip.key}.${stepKey}.to`;
          const index = controls.findIndex((control) => control.path === target);
          controls = index >= 0 ? [...controls.slice(0, index), from2, ...controls.slice(index)] : [...controls, from2];
        }
      }
      title = `${clip.label} \xB7 ${(0, import_timeline7.formatStepLabel)(stepKey)}`;
    } else {
      controls = getClipControls(props.panelId, clip.key, clipPopoverExclusions(clip));
      title = clip.label;
    }
    const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
    const durationMeta = getControlAt(props.panelId, `${targetPath}.duration`);
    const durationValue = durationMeta ? props.values[durationMeta.path] : void 0;
    const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
      value: durationValue,
      onChange: (next) => import_store11.TweakStore.updateValue(props.panelId, durationMeta.path, next),
      min: Math.max(import_timeline7.TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
      max: durationMeta.max,
      step: durationMeta.step
    } : void 0;
    return {
      controls,
      title,
      transitionDuration,
      displayValues: (0, import_timeline7.timelinePopoverDisplayValues)(props.values, clip.key, clip.stepKeys, stepKey)
    };
  });
  const position = (0, import_solid_js28.createMemo)(() => {
    const current = viewport();
    const right = current.offsetLeft + current.width;
    const bottom = current.offsetTop + current.height;
    const width = Math.min(POPOVER_WIDTH, Math.max(220, current.width - 24));
    const left = (0, import_transition_math.clamp)(props.popover.anchor.left + props.popover.anchor.width / 2 - width / 2, current.offsetLeft + 12, Math.max(current.offsetLeft + 12, right - width - 12));
    const above = Math.max(0, props.popover.anchor.top - current.offsetTop - 22);
    const below = Math.max(0, bottom - props.popover.anchor.bottom - 22);
    const placeAbove = naturalHeight() === 0 ? above >= below : naturalHeight() <= above || naturalHeight() > below && above >= below;
    const availableHeight = placeAbove ? above : below;
    const renderedHeight = Math.min(naturalHeight() || availableHeight, availableHeight);
    const rawTop = placeAbove ? props.popover.anchor.top - 10 - renderedHeight : props.popover.anchor.bottom + 10;
    return {
      width,
      left,
      top: (0, import_transition_math.clamp)(rawTop, current.offsetTop + 12, Math.max(current.offsetTop + 12, bottom - renderedHeight - 12)),
      availableHeight,
      placeAbove
    };
  });
  return (0, import_web215.createComponent)(import_solid_js28.Show, {
    get when() {
      return presentation().controls.length > 0;
    },
    get children() {
      return (0, import_web215.createComponent)(import_web216.Portal, {
        get mount() {
          return document.body;
        },
        get children() {
          var _el$68 = _tmpl$242(), _el$69 = _el$68.firstChild, _el$70 = _el$69.firstChild, _el$71 = _el$70.firstChild, _el$72 = _el$71.nextSibling, _el$73 = _el$70.nextSibling;
          var _ref$4 = ref;
          typeof _ref$4 === "function" ? (0, import_web213.use)(_ref$4, _el$69) : ref = _el$69;
          (0, import_web212.insert)(_el$71, () => presentation().title);
          (0, import_web207.addEventListener)(_el$72, "click", props.onClose, true);
          (0, import_web212.insert)(_el$73, (0, import_web215.createComponent)(ControlRenderer, {
            get panelId() {
              return props.panelId;
            },
            get controls() {
              return presentation().controls;
            },
            get values() {
              return presentation().displayValues;
            },
            get transitionDuration() {
              return presentation().transitionDuration;
            }
          }));
          (0, import_web211.effect)((_p$) => {
            var _v$31 = props.theme, _v$32 = position().placeAbove ? "above" : "below", _v$33 = `${position().left}px`, _v$34 = `${position().top}px`, _v$35 = `${position().width}px`, _v$36 = `${position().availableHeight}px`, _v$37 = naturalHeight() > 0 ? "visible" : "hidden", _v$38 = `Edit ${presentation().title}`;
            _v$31 !== _p$.e && (0, import_web210.setAttribute)(_el$68, "data-theme", _p$.e = _v$31);
            _v$32 !== _p$.t && (0, import_web210.setAttribute)(_el$69, "data-placement", _p$.t = _v$32);
            _v$33 !== _p$.a && (0, import_web209.setStyleProperty)(_el$69, "left", _p$.a = _v$33);
            _v$34 !== _p$.o && (0, import_web209.setStyleProperty)(_el$69, "top", _p$.o = _v$34);
            _v$35 !== _p$.i && (0, import_web209.setStyleProperty)(_el$69, "width", _p$.i = _v$35);
            _v$36 !== _p$.n && (0, import_web209.setStyleProperty)(_el$69, "max-height", _p$.n = _v$36);
            _v$37 !== _p$.s && (0, import_web209.setStyleProperty)(_el$69, "visibility", _p$.s = _v$37);
            _v$38 !== _p$.h && (0, import_web210.setAttribute)(_el$69, "aria-label", _p$.h = _v$38);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0
          });
          return _el$68;
        }
      });
    }
  });
}
function readViewport() {
  return {
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    offsetTop: window.visualViewport?.offsetTop ?? 0
  };
}
function clipPopoverExclusions(clip) {
  return /* @__PURE__ */ new Set([...clip.stepKeys ?? [], ...clip.tracks?.map((track) => track.prop) ?? []]);
}
function getClipControls(panelId, path, exclusions) {
  const panel = import_store11.TweakStore.getPanel(panelId);
  const folder = panel ? (0, import_shortcut_utils7.findControl)(panel.controls, path) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const key = control.path.slice(path.length + 1);
    return key !== "at" && key !== "duration" && !exclusions?.has(key);
  });
}
function getControlAt(panelId, path) {
  const panel = import_store11.TweakStore.getPanel(panelId);
  return panel ? (0, import_shortcut_utils7.findControl)(panel.controls, path) : null;
}
function TimelineClip(props) {
  let drag = null;
  const [dragging, setDragging] = (0, import_solid_js28.createSignal)(false);
  const isSteps = () => Boolean(props.steps?.length);
  const handlePointerDown = (event) => {
    if (event.shiftKey) return;
    event.stopPropagation();
    const target = event.target;
    let mode = "move";
    let boundaryIndex;
    if (target.dataset.boundary !== void 0) {
      mode = "boundary";
      boundaryIndex = Number(target.dataset.boundary);
    } else if (!props.fixedDuration) {
      const edge = target.dataset.edge;
      if (edge) mode = edge;
    }
    drag = {
      mode,
      boundaryIndex,
      pointerX: event.clientX,
      at: props.at,
      duration: props.duration,
      stepDurations: props.steps?.map((step) => step.duration),
      clickEl: target.closest?.("[data-step]"),
      moved: false
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event) => {
    if (!drag || props.pxPerSecond <= 0) return;
    const dx = event.clientX - drag.pointerX;
    if (!drag.moved) {
      if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
      drag.moved = true;
      setDragging(true);
      props.onDrag();
    }
    const dt = dx / props.pxPerSecond;
    const baseAt = props.baseAt ?? 0;
    if (drag.mode === "boundary" && props.steps && drag.stepDurations) {
      const index = drag.boundaryIndex ?? 0;
      const others = drag.stepDurations.reduce((sum, duration, stepIndex) => stepIndex === index ? sum : sum + duration, 0);
      import_store11.TweakStore.updateValue(props.timelineId, `${props.clip.key}.${props.steps[index].key ?? ""}.duration`, (0, import_timeline7.clampStepResize)(drag.stepDurations[index] + dt, drag.at, others, props.timelineDuration));
    } else if (drag.mode === "move") {
      if (props.delayMode) {
        import_store11.TweakStore.updateValue(props.timelineId, `${props.clip.key}.delay`, (0, import_timeline7.clampTrackDelay)(drag.at + dt - baseAt, baseAt, drag.duration, props.timelineDuration));
      } else {
        import_store11.TweakStore.updateValue(props.timelineId, `${props.clip.key}.at`, (0, import_timeline7.clampClipMove)(drag.at + dt, drag.duration, props.timelineDuration));
      }
    } else if (drag.mode === "end") {
      import_store11.TweakStore.updateValue(props.timelineId, `${props.clip.key}.duration`, (0, import_timeline7.clampClipResizeEnd)(drag.duration + dt, drag.at, props.timelineDuration));
    } else if (props.steps && drag.stepDurations) {
      const next = (0, import_timeline7.clampClipResizeStart)(Math.max(drag.at + dt, Math.max(baseAt, 0)), drag.at, drag.stepDurations[0]);
      import_store11.TweakStore.updateValues(props.timelineId, {
        [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - baseAt) : next.at,
        [`${props.clip.key}.${props.steps[0].key ?? ""}.duration`]: next.duration
      });
    } else {
      const next = (0, import_timeline7.clampClipResizeStart)(Math.max(drag.at + dt, Math.max(baseAt, 0)), drag.at, drag.duration);
      import_store11.TweakStore.updateValues(props.timelineId, {
        [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - baseAt) : next.at,
        [`${props.clip.key}.duration`]: next.duration
      });
    }
  };
  const finish = (event) => {
    const previous = drag;
    drag = null;
    setDragging(false);
    if (previous && !previous.moved && event) {
      const anchor = previous.clickEl ?? event.currentTarget;
      props.onClick(props.clip, anchor.getBoundingClientRect(), previous.clickEl?.dataset.step);
    }
  };
  const ghostCycles = (0, import_solid_js28.createMemo)(() => {
    const cycles = [];
    if (props.loop !== "repeat" || props.duration <= 0) return cycles;
    const first = Math.max(1, Math.floor((props.viewStart - props.at) / props.duration));
    for (let offset = 0; offset < 256; offset++) {
      const index = first + offset;
      const start = props.at + props.duration * index;
      if (start >= props.timelineDuration - 1e-6) break;
      cycles.push({
        start,
        duration: Math.min(props.duration, props.timelineDuration - start),
        index
      });
    }
    return cycles;
  });
  const boundaries2 = (0, import_solid_js28.createMemo)(() => {
    let total = 0;
    return props.steps?.map((step) => total += step.duration) ?? [];
  });
  const width = () => Math.max(props.duration * props.pxPerSecond, 14);
  const resizable = () => props.duration > 0 && !props.fixedDuration && !props.composite;
  const durationText = () => `${props.fixedDuration && !props.composite ? "~" : ""}${(0, import_timeline7.formatSeconds)(props.duration)}`;
  const looping = () => props.loop === "repeat" && props.duration > 0;
  const title = () => props.composite ? `${props.clip.label} \u2014 composite of its property tracks${looping() ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${props.clip.label} \u2014 ${(0, import_timeline7.formatSeconds)(props.at)} for ${durationText()}${props.fixedDuration ? " (duration set by spring physics)" : ""}${looping() ? " \xB7 repeats through timeline" : ""}${props.delayMode ? " \xB7 drag to phase-shift" : ""}`;
  return [(0, import_web215.createComponent)(import_solid_js28.For, {
    get each() {
      return ghostCycles();
    },
    children: (cycle) => (() => {
      var _el$77 = _tmpl$282();
      (0, import_web212.insert)(_el$77, (0, import_web215.createComponent)(import_solid_js28.For, {
        get each() {
          return props.steps;
        },
        children: (step) => (() => {
          var _el$78 = _tmpl$292();
          (0, import_web211.effect)((_$p) => (0, import_web209.setStyleProperty)(_el$78, "width", `${step.duration * props.pxPerSecond}px`));
          return _el$78;
        })()
      }));
      (0, import_web211.effect)((_p$) => {
        var _v$47 = isSteps() || void 0, _v$48 = `${(cycle.start - props.viewStart) * props.pxPerSecond + 1}px`, _v$49 = `${Math.max(1, cycle.duration * props.pxPerSecond - 2)}px`, _v$50 = props.clip.color;
        _v$47 !== _p$.e && (0, import_web210.setAttribute)(_el$77, "data-steps", _p$.e = _v$47);
        _v$48 !== _p$.t && (0, import_web209.setStyleProperty)(_el$77, "left", _p$.t = _v$48);
        _v$49 !== _p$.a && (0, import_web209.setStyleProperty)(_el$77, "width", _p$.a = _v$49);
        _v$50 !== _p$.o && (0, import_web209.setStyleProperty)(_el$77, "background", _p$.o = _v$50);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      });
      return _el$77;
    })()
  }), (() => {
    var _el$74 = _tmpl$262();
    _el$74.addEventListener("lostpointercapture", () => finish());
    _el$74.addEventListener("pointercancel", () => finish());
    _el$74.$$pointerup = (event) => finish(event);
    _el$74.$$pointermove = handlePointerMove;
    _el$74.$$pointerdown = handlePointerDown;
    (0, import_web212.insert)(_el$74, (0, import_web215.createComponent)(import_solid_js28.Show, {
      get when() {
        return !props.composite;
      },
      get fallback() {
        return (0, import_web215.createComponent)(import_solid_js28.Show, {
          get when() {
            return width() > 56;
          },
          get children() {
            var _el$79 = _tmpl$302();
            (0, import_web212.insert)(_el$79, durationText);
            return _el$79;
          }
        });
      },
      get children() {
        return (0, import_web215.createComponent)(import_solid_js28.Show, {
          get when() {
            return isSteps();
          },
          get fallback() {
            return [(0, import_web215.createComponent)(import_solid_js28.Show, {
              get when() {
                return resizable();
              },
              get children() {
                return _tmpl$252();
              }
            }), (0, import_web215.createComponent)(import_solid_js28.Show, {
              get when() {
                return width() > 56;
              },
              get children() {
                var _el$81 = _tmpl$302();
                (0, import_web212.insert)(_el$81, durationText);
                return _el$81;
              }
            }), (0, import_web215.createComponent)(import_solid_js28.Show, {
              get when() {
                return resizable();
              },
              get children() {
                return _tmpl$318();
              }
            })];
          },
          get children() {
            return [(0, import_web215.createComponent)(import_solid_js28.For, {
              get each() {
                return props.steps;
              },
              children: (step) => {
                const segmentWidth = () => step.duration * props.pxPerSecond;
                return (() => {
                  var _el$83 = _tmpl$322();
                  (0, import_web212.insert)(_el$83, (0, import_web215.createComponent)(import_solid_js28.Show, {
                    get when() {
                      return segmentWidth() > 52;
                    },
                    get children() {
                      var _el$84 = _tmpl$302();
                      (0, import_web212.insert)(_el$84, () => (0, import_timeline7.formatSeconds)(step.duration));
                      return _el$84;
                    }
                  }));
                  (0, import_web211.effect)((_p$) => {
                    var _v$51 = step.key ?? void 0, _v$52 = props.selectedStepKey === step.key || void 0, _v$53 = `${segmentWidth()}px`;
                    _v$51 !== _p$.e && (0, import_web210.setAttribute)(_el$83, "data-step", _p$.e = _v$51);
                    _v$52 !== _p$.t && (0, import_web210.setAttribute)(_el$83, "data-selected", _p$.t = _v$52);
                    _v$53 !== _p$.a && (0, import_web209.setStyleProperty)(_el$83, "width", _p$.a = _v$53);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0,
                    a: void 0
                  });
                  return _el$83;
                })();
              }
            }), (0, import_web215.createComponent)(import_solid_js28.For, {
              get each() {
                return props.steps;
              },
              children: (step, index) => (0, import_web215.createComponent)(import_solid_js28.Show, {
                get when() {
                  return !step.isPhysics;
                },
                get children() {
                  var _el$85 = _tmpl$332();
                  (0, import_web211.effect)((_p$) => {
                    var _v$54 = index(), _v$55 = `${boundaries2()[index()] * props.pxPerSecond - 4}px`;
                    _v$54 !== _p$.e && (0, import_web210.setAttribute)(_el$85, "data-boundary", _p$.e = _v$54);
                    _v$55 !== _p$.t && (0, import_web209.setStyleProperty)(_el$85, "left", _p$.t = _v$55);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$85;
                }
              })
            }), (0, import_web215.createComponent)(import_solid_js28.Show, {
              get when() {
                return !props.steps?.[0]?.isPhysics;
              },
              get children() {
                return _tmpl$252();
              }
            })];
          }
        });
      }
    }));
    (0, import_web211.effect)((_p$) => {
      var _v$39 = isSteps() || void 0, _v$40 = props.composite || void 0, _v$41 = props.selected || void 0, _v$42 = dragging() || void 0, _v$43 = `${(props.at - props.viewStart) * props.pxPerSecond}px`, _v$44 = `${width()}px`, _v$45 = props.composite ? `${props.clip.color}80` : props.clip.color, _v$46 = title();
      _v$39 !== _p$.e && (0, import_web210.setAttribute)(_el$74, "data-steps", _p$.e = _v$39);
      _v$40 !== _p$.t && (0, import_web210.setAttribute)(_el$74, "data-composite", _p$.t = _v$40);
      _v$41 !== _p$.a && (0, import_web210.setAttribute)(_el$74, "data-selected", _p$.a = _v$41);
      _v$42 !== _p$.o && (0, import_web210.setAttribute)(_el$74, "data-dragging", _p$.o = _v$42);
      _v$43 !== _p$.i && (0, import_web209.setStyleProperty)(_el$74, "left", _p$.i = _v$43);
      _v$44 !== _p$.n && (0, import_web209.setStyleProperty)(_el$74, "width", _p$.n = _v$44);
      _v$45 !== _p$.s && (0, import_web209.setStyleProperty)(_el$74, "background", _p$.s = _v$45);
      _v$46 !== _p$.h && (0, import_web210.setAttribute)(_el$74, "title", _p$.h = _v$46);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    });
    return _el$74;
  })(), (0, import_web215.createComponent)(import_solid_js28.Show, {
    get when() {
      return looping();
    },
    get children() {
      return _tmpl$272();
    }
  })];
}
(0, import_web206.delegateEvents)(["pointerdown", "click", "pointermove", "pointerup"]);

// src/solid/components/Module.tsx
var import_web217 = require("solid-js/web");
var import_web218 = require("solid-js/web");
var import_web219 = require("solid-js/web");
var import_web220 = require("solid-js/web");
var import_web221 = require("solid-js/web");
var _tmpl$67 = /* @__PURE__ */ (0, import_web217.template)(`<div class=tweakers-module><div class=tweakers-module-header><span class=tweakers-module-title></span></div><div class=tweakers-module-collapse><div class=tweakers-module-collapse-clip><div class=tweakers-module-inner>`);
function Module(props) {
  return (() => {
    var _el$ = _tmpl$67(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild;
    (0, import_web220.insert)(_el$2, (0, import_web221.createComponent)(Checkbox, {
      get checked() {
        return props.enabled;
      },
      get onChange() {
        return props.onEnabledChange;
      },
      get label() {
        return props.title;
      }
    }), _el$3);
    (0, import_web220.insert)(_el$3, () => props.title);
    (0, import_web220.insert)(_el$6, () => props.children);
    (0, import_web219.effect)(() => (0, import_web218.setAttribute)(_el$4, "data-open", props.enabled));
    return _el$;
  })();
}

// src/solid/components/ButtonGroup.tsx
var import_web222 = require("solid-js/web");
var import_web223 = require("solid-js/web");
var import_web224 = require("solid-js/web");
var import_web225 = require("solid-js/web");
var import_web226 = require("solid-js/web");
var import_solid_js29 = require("solid-js");
var _tmpl$68 = /* @__PURE__ */ (0, import_web222.template)(`<div class=tweakers-button-group>`);
var _tmpl$225 = /* @__PURE__ */ (0, import_web222.template)(`<button class=tweakers-button>`);
function ButtonGroup(props) {
  return (() => {
    var _el$ = _tmpl$68();
    (0, import_web225.insert)(_el$, (0, import_web226.createComponent)(import_solid_js29.For, {
      get each() {
        return props.buttons;
      },
      children: (button) => (() => {
        var _el$2 = _tmpl$225();
        (0, import_web224.addEventListener)(_el$2, "click", button.onClick, true);
        (0, import_web225.insert)(_el$2, () => button.label);
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
(0, import_web223.delegateEvents)(["click"]);

// src/solid/components/WaveformVisualization.tsx
var import_web227 = require("solid-js/web");
var import_web228 = require("solid-js/web");
var import_web229 = require("solid-js/web");
var import_web230 = require("solid-js/web");
var import_web231 = require("solid-js/web");
var import_web232 = require("solid-js/web");
var import_web233 = require("solid-js/web");
var import_solid_js30 = require("solid-js");
var import_waveform_engine = require("tweakers/waveform-engine");
var _tmpl$69 = /* @__PURE__ */ (0, import_web227.template)(`<button type=button aria-label="Zoom out"><svg viewBox="0 0 16 16"fill=none><path d="M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$226 = /* @__PURE__ */ (0, import_web227.template)(`<div class=tweakers-waveform-zoom><button type=button aria-label="Zoom in"><svg viewBox="0 0 16 16"fill=none><path d="M8 3.5v9M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$319 = /* @__PURE__ */ (0, import_web227.template)(`<div class=tweakers-waveform-viz-wrap><canvas class=tweakers-waveform-viz>`);
function WaveformVisualization(props) {
  const p = (0, import_solid_js30.mergeProps)({
    buffer: null,
    progress: 0,
    mode: "smooth",
    border: false,
    bands: false,
    pixelSize: 1,
    grid: false,
    gridSubdivisions: 8,
    loop: null,
    autoZoomOnLoop: false,
    width: 256,
    height: 140
  }, props);
  const [zoom, setZoom] = (0, import_solid_js30.createSignal)(1);
  let canvasEl;
  (0, import_solid_js30.onMount)(() => {
    if (!canvasEl) return;
    const engine = (0, import_waveform_engine.createWaveformEngine)(canvasEl, () => ({
      buffer: p.buffer,
      progress: p.progress,
      getProgress: p.getProgress,
      mode: p.mode,
      border: p.border,
      bands: p.bands,
      pixelSize: p.pixelSize,
      grid: p.grid,
      gridSubdivisions: p.gridSubdivisions,
      waveColor: p.waveColor,
      playheadColor: p.playheadColor,
      autoZoomOnLoop: p.autoZoomOnLoop,
      loop: p.loop,
      zoom: zoom(),
      width: p.width,
      height: p.height,
      onSeek: p.onSeek,
      onLoopChange: p.onLoopChange
    }));
    (0, import_solid_js30.onCleanup)(() => engine.destroy());
  });
  const framingLoop = () => p.autoZoomOnLoop && !!p.loop;
  return (() => {
    var _el$ = _tmpl$319(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? (0, import_web233.use)(_ref$, _el$2) : canvasEl = _el$2;
    (0, import_web231.insert)(_el$, (0, import_web232.createComponent)(import_solid_js30.Show, {
      get when() {
        return !framingLoop();
      },
      get children() {
        var _el$3 = _tmpl$226(), _el$5 = _el$3.firstChild;
        (0, import_web231.insert)(_el$3, (0, import_web232.createComponent)(import_solid_js30.Show, {
          get when() {
            return zoom() > 1;
          },
          get children() {
            var _el$4 = _tmpl$69();
            _el$4.$$click = () => setZoom((z) => Math.max(1, z / 2));
            return _el$4;
          }
        }), _el$5);
        _el$5.$$click = () => setZoom((z) => Math.min(import_waveform_engine.WAVEFORM_MAX_ZOOM, z * 2));
        (0, import_web230.effect)(() => _el$5.disabled = zoom() >= import_waveform_engine.WAVEFORM_MAX_ZOOM);
        return _el$3;
      }
    }), null);
    (0, import_web230.effect)((_p$) => {
      var _v$ = `${p.width}px`, _v$2 = `${p.width}px`, _v$3 = `${p.height}px`;
      _v$ !== _p$.e && (0, import_web229.setStyleProperty)(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web229.setStyleProperty)(_el$2, "width", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web229.setStyleProperty)(_el$2, "height", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
(0, import_web228.delegateEvents)(["click"]);

// src/solid/components/AnalyserVisualization.tsx
var import_web234 = require("solid-js/web");
var import_web235 = require("solid-js/web");
var import_web236 = require("solid-js/web");
var import_web237 = require("solid-js/web");
var import_web238 = require("solid-js/web");
var import_web239 = require("solid-js/web");
var import_web240 = require("solid-js/web");
var import_web241 = require("solid-js/web");
var import_web242 = require("solid-js/web");
var import_solid_js31 = require("solid-js");
var import_analyser_engine = require("tweakers/analyser-engine");
var _tmpl$70 = /* @__PURE__ */ (0, import_web234.template)(`<button type=button aria-label=Mute>M`);
var _tmpl$227 = /* @__PURE__ */ (0, import_web234.template)(`<button type=button aria-label=Solo>S`);
var _tmpl$320 = /* @__PURE__ */ (0, import_web234.template)(`<div class=tweakers-analyser-actions>`);
var _tmpl$412 = /* @__PURE__ */ (0, import_web234.template)(`<div class=tweakers-analyser-viz-wrap><canvas class=tweakers-analyser-viz>`);
function AnalyserVisualization(props) {
  const p = (0, import_solid_js31.mergeProps)({
    analyser: null,
    source: "frequency",
    variant: "area",
    mode: "smooth",
    pixelSize: 1,
    scale: "log",
    spring: false,
    grid: false,
    gridSubdivisions: 8,
    muted: false,
    soloed: false,
    width: 256,
    height: 140
  }, props);
  let canvasEl;
  (0, import_solid_js31.onMount)(() => {
    if (!canvasEl) return;
    const engine = (0, import_analyser_engine.createAnalyserEngine)(canvasEl, () => ({
      analyser: p.analyser,
      source: p.source,
      variant: p.variant,
      mode: p.mode,
      pixelSize: p.pixelSize,
      scale: p.scale,
      spring: p.spring,
      grid: p.grid,
      gridSubdivisions: p.gridSubdivisions,
      waveColor: p.waveColor,
      fillColor: p.fillColor,
      muted: p.muted,
      width: p.width,
      height: p.height
    }));
    (0, import_solid_js31.onCleanup)(() => engine.destroy());
  });
  return (() => {
    var _el$ = _tmpl$412(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? (0, import_web242.use)(_ref$, _el$2) : canvasEl = _el$2;
    (0, import_web237.insert)(_el$, (0, import_web238.createComponent)(import_solid_js31.Show, {
      get when() {
        return p.onMuteChange || p.onSoloChange;
      },
      get children() {
        var _el$3 = _tmpl$320();
        (0, import_web237.insert)(_el$3, (0, import_web238.createComponent)(import_solid_js31.Show, {
          get when() {
            return p.onMuteChange;
          },
          get children() {
            var _el$4 = _tmpl$70();
            _el$4.$$click = () => p.onMuteChange?.(!p.muted);
            (0, import_web240.effect)(() => (0, import_web239.setAttribute)(_el$4, "aria-pressed", p.muted));
            return _el$4;
          }
        }), null);
        (0, import_web237.insert)(_el$3, (0, import_web238.createComponent)(import_solid_js31.Show, {
          get when() {
            return p.onSoloChange;
          },
          get children() {
            var _el$5 = _tmpl$227();
            _el$5.$$click = () => p.onSoloChange?.(!p.soloed);
            (0, import_web240.effect)(() => (0, import_web239.setAttribute)(_el$5, "aria-pressed", p.soloed));
            return _el$5;
          }
        }), null);
        return _el$3;
      }
    }), null);
    (0, import_web240.effect)((_p$) => {
      var _v$ = `${p.width}px`, _v$2 = `${p.width}px`, _v$3 = `${p.height}px`;
      _v$ !== _p$.e && (0, import_web236.setStyleProperty)(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web236.setStyleProperty)(_el$2, "width", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web236.setStyleProperty)(_el$2, "height", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
(0, import_web235.delegateEvents)(["click"]);

// src/solid/components/CurveComposer.tsx
var import_web243 = require("solid-js/web");
var import_web244 = require("solid-js/web");
var import_web245 = require("solid-js/web");
var import_web246 = require("solid-js/web");
var import_web247 = require("solid-js/web");
var import_web248 = require("solid-js/web");
var import_web249 = require("solid-js/web");
var import_web250 = require("solid-js/web");
var import_web251 = require("solid-js/web");
var import_solid_js32 = require("solid-js");
var import_curve_composer_core = require("tweakers/curve-composer-core");
var _tmpl$71 = /* @__PURE__ */ (0, import_web243.template)(`<div class=tweakers-cc-wrap><svg class=tweakers-cc><rect class=tweakers-cc-lane rx=8></rect><line class=tweakers-cc-playhead x1=0 x2=0></line><circle class=tweakers-cc-dot cx=0 r=3>`);
var _tmpl$228 = /* @__PURE__ */ (0, import_web243.template)(`<svg><line class=tweakers-cc-grid></svg>`, false, true, false);
var _tmpl$321 = /* @__PURE__ */ (0, import_web243.template)(`<svg><rect class=tweakers-cc-seg-selected rx=8></svg>`, false, true, false);
var _tmpl$413 = /* @__PURE__ */ (0, import_web243.template)(`<svg><rect class=tweakers-cc-seg-hover rx=8></svg>`, false, true, false);
var _tmpl$511 = /* @__PURE__ */ (0, import_web243.template)(`<svg><g><line class=tweakers-cc-diagonal></line><path class=tweakers-cc-curve></path><text class=tweakers-cc-label></svg>`, false, true, false);
var _tmpl$610 = /* @__PURE__ */ (0, import_web243.template)(`<svg><path class=tweakers-cc-connector></svg>`, false, true, false);
var _tmpl$74 = /* @__PURE__ */ (0, import_web243.template)(`<svg><line class=tweakers-cc-boundary></svg>`, false, true, false);
var _tmpl$84 = /* @__PURE__ */ (0, import_web243.template)(`<svg><rect class=tweakers-cc-lane rx=8></svg>`, false, true, false);
var _tmpl$94 = /* @__PURE__ */ (0, import_web243.template)(`<svg><rect class=tweakers-cc-seg-hover x=0 rx=8></svg>`, false, true, false);
var _tmpl$04 = /* @__PURE__ */ (0, import_web243.template)(`<svg><path class="tweakers-cc-curve tweakers-cc-curve-driver"></svg>`, false, true, false);
var _tmpl$111 = /* @__PURE__ */ (0, import_web243.template)(`<svg><text class=tweakers-cc-label>driver \xB7 </svg>`, false, true, false);
var _tmpl$104 = /* @__PURE__ */ (0, import_web243.template)(`<svg><line class=tweakers-cc-playhead x1=0 x2=0></svg>`, false, true, false);
var _tmpl$113 = /* @__PURE__ */ (0, import_web243.template)(`<svg><line class=tweakers-cc-diagonal></svg>`, false, true, false);
function CurveComposer(props) {
  const p = (0, import_solid_js32.mergeProps)({
    driver: null,
    direction: "forward",
    phase: 0,
    mode: "continuous",
    triggerSteps: import_curve_composer_core.DEFAULT_TRIGGER_STEPS,
    selectedIndex: null,
    gap: 0,
    grid: false,
    gridSubdivisions: 8,
    width: 256,
    height: 140
  }, props);
  const layout = (0, import_solid_js32.createMemo)(() => (0, import_curve_composer_core.composerLayout)(p.width, p.height, p.driver != null));
  const W = () => layout().W;
  const totalH = () => layout().totalH;
  const mainRect = () => layout().mainRect;
  const driverRect = () => layout().driverRect;
  const composition = (0, import_solid_js32.createMemo)(() => ({
    segments: p.segments,
    driver: p.driver,
    direction: p.direction,
    gap: p.gap
  }));
  const samplers = (0, import_solid_js32.createMemo)(() => (0, import_curve_composer_core.buildSamplers)(composition()));
  let svgEl;
  let seriesPlayheadEl;
  let seriesDotEl;
  let driverPlayheadEl;
  let drag = null;
  const [hover, setHover] = (0, import_solid_js32.createSignal)(null);
  (0, import_solid_js32.onMount)(() => {
    let raf = 0;
    let prevTrigValue = Number.NaN;
    let armKey = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const lo = layout();
      const key = `${lo.W}|${lo.totalH}`;
      if (key !== armKey) {
        prevTrigValue = Number.NaN;
        armKey = key;
      }
      const u = p.getPhase ? p.getPhase() : p.phase;
      const read = (0, import_curve_composer_core.readComposition)(composition(), u, samplers());
      const geo = (0, import_curve_composer_core.playheadGeometry)(read, lo);
      if (seriesPlayheadEl) {
        seriesPlayheadEl.setAttribute("x1", String(geo.seriesX));
        seriesPlayheadEl.setAttribute("x2", String(geo.seriesX));
      }
      if (seriesDotEl) {
        seriesDotEl.setAttribute("cx", String(geo.dotX));
        seriesDotEl.setAttribute("cy", String(geo.dotY));
      }
      if (driverPlayheadEl) {
        driverPlayheadEl.setAttribute("x1", String(geo.driverX));
        driverPlayheadEl.setAttribute("x2", String(geo.driverX));
      }
      if (p.mode === "trigger") {
        if (!Number.isNaN(prevTrigValue)) {
          for (const idx of (0, import_curve_composer_core.triggersCrossed)(prevTrigValue, read.value, p.triggerSteps)) p.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    (0, import_solid_js32.onCleanup)(() => cancelAnimationFrame(raf));
  });
  const hitLayout = () => {
    const dr = driverRect();
    return {
      totalH: totalH(),
      driverY: dr ? dr.y : null,
      gap: p.gap
    };
  };
  const localCoords = (clientX, clientY) => {
    const rect = svgEl.getBoundingClientRect();
    return {
      ...(0, import_curve_composer_core.toLocalCoords)(clientX, clientY, rect, totalH()),
      rectW: rect.width
    };
  };
  const onPointerDown = (e) => {
    const {
      xN,
      py,
      rectW
    } = localCoords(e.clientX, e.clientY);
    try {
      svgEl?.setPointerCapture(e.pointerId);
    } catch {
    }
    const header = (0, import_curve_composer_core.headerHit)(xN, py, p.segments, hitLayout());
    if (typeof header === "number") {
      drag = {
        kind: "select",
        index: header,
        startX: e.clientX,
        startY: e.clientY,
        moved: false
      };
      return;
    }
    const target = (0, import_curve_composer_core.pointerTarget)(xN, py, p.segments, hitLayout(), import_curve_composer_core.EDGE_HIT / rectW);
    if (target.kind === "driver") {
      drag = {
        kind: "driver",
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: p.driver.curvature,
        baseSteepness: p.driver.steepness,
        moved: false
      };
    } else if (target.kind === "boundary") {
      drag = {
        kind: "boundary",
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        base: composition(),
        moved: false
      };
    } else {
      const seg = p.segments[target.index];
      drag = {
        kind: "segment",
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: seg?.curvature ?? 0,
        baseSteepness: seg?.steepness ?? 0,
        moved: false
      };
    }
  };
  const onPointerMove = (e) => {
    const d = drag;
    if (!d) {
      const {
        xN,
        py,
        rectW: rectW2
      } = localCoords(e.clientX, e.clientY);
      if (typeof (0, import_curve_composer_core.headerHit)(xN, py, p.segments, hitLayout()) === "number") {
        setHover({
          kind: "header",
          index: 0
        });
        return;
      }
      const t = (0, import_curve_composer_core.pointerTarget)(xN, py, p.segments, hitLayout(), import_curve_composer_core.EDGE_HIT / rectW2);
      setHover(t.kind === "driver" ? {
        kind: "driver",
        index: 0
      } : {
        kind: t.kind,
        index: t.index
      });
      return;
    }
    const svgRect = svgEl.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > import_curve_composer_core.DRAG_THRESHOLD;
    if (!moved) return;
    if (d.kind === "boundary") {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = (0, import_curve_composer_core.redistributeWeight)(d.base, d.index, deltaFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else if (d.kind === "segment") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = (0, import_curve_composer_core.applySegmentBodyDrag)(composition(), d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else if (d.kind === "driver") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = (0, import_curve_composer_core.applyDriverBodyDrag)(composition(), d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) p.onDriverChange?.(next.driver);
      d.moved = true;
    } else {
      d.moved = true;
    }
  };
  const onPointerUp = (e) => {
    const d = drag;
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
    }
    if (!d || d.moved) return;
    if (d.kind === "select") {
      p.onSelect?.(d.index);
    } else if (d.kind === "driver") {
      const next = (0, import_curve_composer_core.cycleDriverType)(composition());
      if (next.driver) p.onDriverChange?.(next.driver);
    } else if (d.kind === "segment") {
      p.onSegmentsChange?.((0, import_curve_composer_core.cycleSegmentType)(composition(), d.index).segments);
    }
  };
  const onPointerCancel = (e) => {
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
    }
  };
  const onDoubleClick = (e) => {
    const {
      xN,
      py
    } = localCoords(e.clientX, e.clientY);
    const dr = driverRect();
    if (dr && py >= dr.y) return;
    p.onSegmentsChange?.((0, import_curve_composer_core.splitSegment)(composition(), (0, import_curve_composer_core.segmentIndexAt)(xN, p.segments, p.gap)).segments);
  };
  const cursor = () => {
    const h = hover();
    const activeKind = drag?.kind ?? h?.kind;
    return activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : activeKind === "select" || activeKind === "header" ? "pointer" : "default";
  };
  const interior = () => (0, import_curve_composer_core.boundaries)(p.segments, p.gap);
  const laneGridLines = (rect) => {
    if (!p.grid) return [];
    const n = Math.max(1, Math.round(p.gridSubdivisions));
    const lines = [];
    for (let i = 1; i < n; i++) {
      lines.push({
        gx: i / n * W(),
        y1: rect.y,
        y2: rect.y + rect.h
      });
    }
    return lines;
  };
  return (() => {
    var _el$ = _tmpl$71(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling;
    _el$2.$$dblclick = onDoubleClick;
    _el$2.addEventListener("pointerleave", () => !drag && setHover(null));
    _el$2.addEventListener("pointercancel", onPointerCancel);
    _el$2.$$pointerup = onPointerUp;
    _el$2.$$pointermove = onPointerMove;
    _el$2.$$pointerdown = onPointerDown;
    var _ref$ = svgEl;
    typeof _ref$ === "function" ? (0, import_web251.use)(_ref$, _el$2) : svgEl = _el$2;
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.For, {
      get each() {
        return laneGridLines(mainRect());
      },
      children: (g) => (() => {
        var _el$6 = _tmpl$228();
        (0, import_web247.effect)((_p$) => {
          var _v$16 = g.gx, _v$17 = g.y1, _v$18 = g.gx, _v$19 = g.y2;
          _v$16 !== _p$.e && (0, import_web245.setAttribute)(_el$6, "x1", _p$.e = _v$16);
          _v$17 !== _p$.t && (0, import_web245.setAttribute)(_el$6, "y1", _p$.t = _v$17);
          _v$18 !== _p$.a && (0, import_web245.setAttribute)(_el$6, "x2", _p$.a = _v$18);
          _v$19 !== _p$.o && (0, import_web245.setAttribute)(_el$6, "y2", _p$.o = _v$19);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$6;
      })()
    }), _el$4);
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.Show, {
      get when() {
        return (0, import_web249.memo)(() => !!(p.selectedIndex != null && p.selectedIndex >= 0))() && p.selectedIndex < p.segments.length;
      },
      get children() {
        return (() => {
          const span = (0, import_curve_composer_core.segmentSpan)(p.segments, p.selectedIndex, p.gap);
          const mr = mainRect();
          return (() => {
            var _el$7 = _tmpl$321();
            (0, import_web247.effect)((_p$) => {
              var _v$20 = span[0] * W(), _v$21 = mr.y, _v$22 = (span[1] - span[0]) * W(), _v$23 = mr.h;
              _v$20 !== _p$.e && (0, import_web245.setAttribute)(_el$7, "x", _p$.e = _v$20);
              _v$21 !== _p$.t && (0, import_web245.setAttribute)(_el$7, "y", _p$.t = _v$21);
              _v$22 !== _p$.a && (0, import_web245.setAttribute)(_el$7, "width", _p$.a = _v$22);
              _v$23 !== _p$.o && (0, import_web245.setAttribute)(_el$7, "height", _p$.o = _v$23);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            return _el$7;
          })();
        })();
      }
    }), _el$4);
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.Show, {
      get when() {
        return hover()?.kind === "segment" && !drag;
      },
      get children() {
        return (() => {
          const span = (0, import_curve_composer_core.segmentSpan)(p.segments, hover().index, p.gap);
          const mr = mainRect();
          return (() => {
            var _el$8 = _tmpl$413();
            (0, import_web247.effect)((_p$) => {
              var _v$24 = span[0] * W(), _v$25 = mr.y, _v$26 = (span[1] - span[0]) * W(), _v$27 = mr.h;
              _v$24 !== _p$.e && (0, import_web245.setAttribute)(_el$8, "x", _p$.e = _v$24);
              _v$25 !== _p$.t && (0, import_web245.setAttribute)(_el$8, "y", _p$.t = _v$25);
              _v$26 !== _p$.a && (0, import_web245.setAttribute)(_el$8, "width", _p$.a = _v$26);
              _v$27 !== _p$.o && (0, import_web245.setAttribute)(_el$8, "height", _p$.o = _v$27);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            return _el$8;
          })();
        })();
      }
    }), _el$4);
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.For, {
      get each() {
        return p.segments;
      },
      children: (seg, i) => {
        const span = () => (0, import_curve_composer_core.segmentSpan)(p.segments, i(), p.gap);
        const mr = () => mainRect();
        const diag = () => (0, import_curve_composer_core.diagonalLine)(mr(), span(), W());
        return (() => {
          var _el$9 = _tmpl$511(), _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling;
          (0, import_web248.insert)(_el$10, () => seg.type);
          (0, import_web247.effect)((_p$) => {
            var _v$28 = diag().x1, _v$29 = diag().y1, _v$30 = diag().x2, _v$31 = diag().y2, _v$32 = (0, import_curve_composer_core.curvePath)(seg, mr(), span(), W()), _v$33 = (span()[0] + span()[1]) * 0.5 * W(), _v$34 = mr().y + 13;
            _v$28 !== _p$.e && (0, import_web245.setAttribute)(_el$0, "x1", _p$.e = _v$28);
            _v$29 !== _p$.t && (0, import_web245.setAttribute)(_el$0, "y1", _p$.t = _v$29);
            _v$30 !== _p$.a && (0, import_web245.setAttribute)(_el$0, "x2", _p$.a = _v$30);
            _v$31 !== _p$.o && (0, import_web245.setAttribute)(_el$0, "y2", _p$.o = _v$31);
            _v$32 !== _p$.i && (0, import_web245.setAttribute)(_el$1, "d", _p$.i = _v$32);
            _v$33 !== _p$.n && (0, import_web245.setAttribute)(_el$10, "x", _p$.n = _v$33);
            _v$34 !== _p$.s && (0, import_web245.setAttribute)(_el$10, "y", _p$.s = _v$34);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          });
          return _el$9;
        })();
      }
    }), _el$4);
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.Show, {
      get when() {
        return p.gap > 0;
      },
      get children() {
        return (0, import_web250.createComponent)(import_solid_js32.For, {
          get each() {
            return (0, import_curve_composer_core.timelineSlots)(p.segments, p.gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a);
          },
          children: (slot) => (() => {
            var _el$11 = _tmpl$610();
            (0, import_web247.effect)(() => (0, import_web245.setAttribute)(_el$11, "d", (0, import_curve_composer_core.connectorPath)(slot, samplers(), p.segments.length, mainRect(), W())));
            return _el$11;
          })()
        });
      }
    }), _el$4);
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.For, {
      get each() {
        return interior();
      },
      children: (bx, i) => {
        const mr = mainRect();
        const active = () => {
          const h = hover();
          return h?.kind === "boundary" && h.index === i() || drag?.kind === "boundary" && drag.index === i();
        };
        return (() => {
          var _el$12 = _tmpl$74();
          (0, import_web247.effect)((_p$) => {
            var _v$35 = String(active()), _v$36 = bx * W(), _v$37 = mr.y, _v$38 = bx * W(), _v$39 = mr.y + mr.h;
            _v$35 !== _p$.e && (0, import_web245.setAttribute)(_el$12, "data-active", _p$.e = _v$35);
            _v$36 !== _p$.t && (0, import_web245.setAttribute)(_el$12, "x1", _p$.t = _v$36);
            _v$37 !== _p$.a && (0, import_web245.setAttribute)(_el$12, "y1", _p$.a = _v$37);
            _v$38 !== _p$.o && (0, import_web245.setAttribute)(_el$12, "x2", _p$.o = _v$38);
            _v$39 !== _p$.i && (0, import_web245.setAttribute)(_el$12, "y2", _p$.i = _v$39);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          });
          return _el$12;
        })();
      }
    }), _el$4);
    var _ref$2 = seriesPlayheadEl;
    typeof _ref$2 === "function" ? (0, import_web251.use)(_ref$2, _el$4) : seriesPlayheadEl = _el$4;
    var _ref$3 = seriesDotEl;
    typeof _ref$3 === "function" ? (0, import_web251.use)(_ref$3, _el$5) : seriesDotEl = _el$5;
    (0, import_web248.insert)(_el$2, (0, import_web250.createComponent)(import_solid_js32.Show, {
      get when() {
        return driverRect();
      },
      children: (dr) => [(() => {
        var _el$13 = _tmpl$84();
        (0, import_web247.effect)((_p$) => {
          var _v$40 = dr().x, _v$41 = dr().y, _v$42 = dr().w, _v$43 = dr().h;
          _v$40 !== _p$.e && (0, import_web245.setAttribute)(_el$13, "x", _p$.e = _v$40);
          _v$41 !== _p$.t && (0, import_web245.setAttribute)(_el$13, "y", _p$.t = _v$41);
          _v$42 !== _p$.a && (0, import_web245.setAttribute)(_el$13, "width", _p$.a = _v$42);
          _v$43 !== _p$.o && (0, import_web245.setAttribute)(_el$13, "height", _p$.o = _v$43);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$13;
      })(), (0, import_web250.createComponent)(import_solid_js32.For, {
        get each() {
          return laneGridLines(dr());
        },
        children: (g) => (() => {
          var _el$19 = _tmpl$228();
          (0, import_web247.effect)((_p$) => {
            var _v$52 = g.gx, _v$53 = g.y1, _v$54 = g.gx, _v$55 = g.y2;
            _v$52 !== _p$.e && (0, import_web245.setAttribute)(_el$19, "x1", _p$.e = _v$52);
            _v$53 !== _p$.t && (0, import_web245.setAttribute)(_el$19, "y1", _p$.t = _v$53);
            _v$54 !== _p$.a && (0, import_web245.setAttribute)(_el$19, "x2", _p$.a = _v$54);
            _v$55 !== _p$.o && (0, import_web245.setAttribute)(_el$19, "y2", _p$.o = _v$55);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$19;
        })()
      }), (0, import_web250.createComponent)(import_solid_js32.Show, {
        get when() {
          return hover()?.kind === "driver" && !drag;
        },
        get children() {
          var _el$14 = _tmpl$94();
          (0, import_web247.effect)((_p$) => {
            var _v$44 = dr().y, _v$45 = W(), _v$46 = dr().h;
            _v$44 !== _p$.e && (0, import_web245.setAttribute)(_el$14, "y", _p$.e = _v$44);
            _v$45 !== _p$.t && (0, import_web245.setAttribute)(_el$14, "width", _p$.t = _v$45);
            _v$46 !== _p$.a && (0, import_web245.setAttribute)(_el$14, "height", _p$.a = _v$46);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$14;
        }
      }), (0, import_web249.memo)(() => {
        const diag = (0, import_curve_composer_core.diagonalLine)(dr(), [0, 1], W());
        return (() => {
          var _el$20 = _tmpl$113();
          (0, import_web247.effect)((_p$) => {
            var _v$56 = diag.x1, _v$57 = diag.y1, _v$58 = diag.x2, _v$59 = diag.y2;
            _v$56 !== _p$.e && (0, import_web245.setAttribute)(_el$20, "x1", _p$.e = _v$56);
            _v$57 !== _p$.t && (0, import_web245.setAttribute)(_el$20, "y1", _p$.t = _v$57);
            _v$58 !== _p$.a && (0, import_web245.setAttribute)(_el$20, "x2", _p$.a = _v$58);
            _v$59 !== _p$.o && (0, import_web245.setAttribute)(_el$20, "y2", _p$.o = _v$59);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$20;
        })();
      }), (() => {
        var _el$15 = _tmpl$04();
        (0, import_web247.effect)(() => (0, import_web245.setAttribute)(_el$15, "d", (0, import_curve_composer_core.curvePath)(p.driver, dr(), [0, 1], W())));
        return _el$15;
      })(), (() => {
        var _el$16 = _tmpl$111(), _el$17 = _el$16.firstChild;
        (0, import_web248.insert)(_el$16, () => p.driver.type, null);
        (0, import_web247.effect)((_p$) => {
          var _v$47 = W() * 0.5, _v$48 = dr().y + 13;
          _v$47 !== _p$.e && (0, import_web245.setAttribute)(_el$16, "x", _p$.e = _v$47);
          _v$48 !== _p$.t && (0, import_web245.setAttribute)(_el$16, "y", _p$.t = _v$48);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$16;
      })(), (() => {
        var _el$18 = _tmpl$104();
        var _ref$4 = driverPlayheadEl;
        typeof _ref$4 === "function" ? (0, import_web251.use)(_ref$4, _el$18) : driverPlayheadEl = _el$18;
        (0, import_web247.effect)((_p$) => {
          var _v$49 = dr().y, _v$50 = dr().y + dr().h, _v$51 = p.playheadColor;
          _v$49 !== _p$.e && (0, import_web245.setAttribute)(_el$18, "y1", _p$.e = _v$49);
          _v$50 !== _p$.t && (0, import_web245.setAttribute)(_el$18, "y2", _p$.t = _v$50);
          _v$51 !== _p$.a && (0, import_web246.setStyleProperty)(_el$18, "stroke", _p$.a = _v$51);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$18;
      })()]
    }), null);
    (0, import_web247.effect)((_p$) => {
      var _v$ = `${W()}px`, _v$2 = `0 0 ${W()} ${totalH()}`, _v$3 = W(), _v$4 = totalH(), _v$5 = `${W()}px`, _v$6 = `${totalH()}px`, _v$7 = cursor(), _v$8 = p.curveColor, _v$9 = mainRect().x, _v$0 = mainRect().y, _v$1 = mainRect().w, _v$10 = mainRect().h, _v$11 = mainRect().y, _v$12 = mainRect().y + mainRect().h, _v$13 = p.playheadColor, _v$14 = (0, import_curve_composer_core.mapY)(mainRect(), 0), _v$15 = p.playheadColor;
      _v$ !== _p$.e && (0, import_web246.setStyleProperty)(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web245.setAttribute)(_el$2, "viewBox", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web245.setAttribute)(_el$2, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web245.setAttribute)(_el$2, "height", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web246.setStyleProperty)(_el$2, "width", _p$.i = _v$5);
      _v$6 !== _p$.n && (0, import_web246.setStyleProperty)(_el$2, "height", _p$.n = _v$6);
      _v$7 !== _p$.s && (0, import_web246.setStyleProperty)(_el$2, "cursor", _p$.s = _v$7);
      _v$8 !== _p$.h && (0, import_web246.setStyleProperty)(_el$2, "color", _p$.h = _v$8);
      _v$9 !== _p$.r && (0, import_web245.setAttribute)(_el$3, "x", _p$.r = _v$9);
      _v$0 !== _p$.d && (0, import_web245.setAttribute)(_el$3, "y", _p$.d = _v$0);
      _v$1 !== _p$.l && (0, import_web245.setAttribute)(_el$3, "width", _p$.l = _v$1);
      _v$10 !== _p$.u && (0, import_web245.setAttribute)(_el$3, "height", _p$.u = _v$10);
      _v$11 !== _p$.c && (0, import_web245.setAttribute)(_el$4, "y1", _p$.c = _v$11);
      _v$12 !== _p$.w && (0, import_web245.setAttribute)(_el$4, "y2", _p$.w = _v$12);
      _v$13 !== _p$.m && (0, import_web246.setStyleProperty)(_el$4, "stroke", _p$.m = _v$13);
      _v$14 !== _p$.f && (0, import_web245.setAttribute)(_el$5, "cy", _p$.f = _v$14);
      _v$15 !== _p$.y && (0, import_web246.setStyleProperty)(_el$5, "fill", _p$.y = _v$15);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$;
  })();
}
(0, import_web244.delegateEvents)(["pointerdown", "pointermove", "pointerup", "dblclick"]);

// src/solid/index.ts
var import_curve_composer_core2 = require("tweakers/curve-composer-core");
var import_gradient_core5 = require("tweakers/gradient-core");
var import_xy_pad_core2 = require("tweakers/xy-pad-core");
var import_store12 = require("tweakers/store");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnalyserVisualization,
  ButtonGroup,
  Checkbox,
  ColorControl,
  ColorPickerPanel,
  ControlRenderer,
  ControlShell,
  CurveComposer,
  DEFAULT_GRADIENT,
  EasingVisualization,
  Folder,
  GradientControl,
  GradientPanel,
  Module,
  NumberControl,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  Slider,
  SpringControl,
  SpringVisualization,
  TextControl,
  TimelineToggleButton,
  Toggle,
  TransitionControl,
  TweakRoot,
  TweakStore,
  TweakTimeline,
  WaveformVisualization,
  XYControl,
  XYPad,
  XY_DEFAULT_STEP,
  XY_DETENT_PX,
  applyDetentAxis,
  centerValue,
  clamp,
  createTweakTimeline,
  createTweakers,
  gradientToCss,
  invertY,
  normToValue,
  normalizeValue,
  nudge,
  pointFromValue,
  resolveAxis,
  snapToStep,
  springify,
  valueFromPoint,
  valueToNorm
});
//# sourceMappingURL=index.cjs.map