// src/vue/useTweakers.ts
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import { TweakStore } from "tweakers/store";
import { normalizeGradient, DEFAULT_GRADIENT } from "tweakers/gradient-core";
var tweakKitInstance = 0;
function useTweakers(name, config, options) {
  const panelId = `${name}-${++tweakKitInstance}`;
  const configRef = shallowRef(config);
  const onActionRef = ref(options?.onAction);
  const shortcutsRef = shallowRef(options?.shortcuts);
  const values = ref(TweakStore.getValues(panelId));
  const mounted = ref(false);
  const serializedConfig = computed(() => JSON.stringify(config));
  const serializedShortcuts = computed(() => JSON.stringify(options?.shortcuts));
  let unsubscribeValues;
  let unsubscribeActions;
  const register = () => {
    TweakStore.registerPanel(panelId, name, configRef.value, shortcutsRef.value, {
      hints: options?.hints,
      affordances: options?.affordances,
      labels: options?.labels
    });
    TweakStore.setPresetsHidden(panelId, options?.presets === false);
    TweakStore.setPresetProvider(panelId, options?.presets === false ? null : options?.presets ?? null);
    values.value = TweakStore.getValues(panelId);
    unsubscribeValues = TweakStore.subscribe(panelId, () => {
      values.value = TweakStore.getValues(panelId);
    });
    unsubscribeActions = TweakStore.subscribeActions(panelId, (action) => {
      onActionRef.value?.(action);
    });
  };
  watch(() => options?.onAction, (next) => {
    onActionRef.value = next;
  });
  watch(() => options?.shortcuts, (next) => {
    shortcutsRef.value = next;
  });
  watch(() => JSON.stringify(options?.presets ?? null), () => {
    if (mounted.value) {
      TweakStore.setPresetsHidden(panelId, options?.presets === false);
      TweakStore.setPresetProvider(panelId, options?.presets === false ? null : options?.presets ?? null);
    }
  });
  watch([serializedConfig, serializedShortcuts], () => {
    configRef.value = config;
    shortcutsRef.value = options?.shortcuts;
    if (mounted.value) {
      TweakStore.updatePanel(panelId, name, configRef.value, shortcutsRef.value, {
        hints: options?.hints,
        affordances: options?.affordances,
        labels: options?.labels
      });
      values.value = TweakStore.getValues(panelId);
    }
  });
  onMounted(register);
  onMounted(() => {
    mounted.value = true;
  });
  onUnmounted(() => {
    unsubscribeValues?.();
    unsubscribeActions?.();
    TweakStore.unregisterPanel(panelId);
  });
  return computed(() => buildResolvedValues(configRef.value, values.value, ""));
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
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "#000000";
    } else if (isGradientConfig(configValue)) {
      result[key] = flatValues[path] ?? normalizeGradient(configValue.default ?? DEFAULT_GRADIENT);
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
function isEasingConfig(value) {
  return hasType(value, "easing");
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

// src/vue/directives/tweakers.ts
import {
  createApp,
  defineComponent as defineComponent29,
  h as h28,
  shallowRef as shallowRef2
} from "vue";

// src/vue/components/TweakRoot.ts
import { defineComponent as defineComponent28, h as h27, onMounted as onMounted17, onUnmounted as onUnmounted11, ref as ref23, Teleport as Teleport6 } from "vue";
import { TweakStore as TweakStore9 } from "tweakers/store";
import { TimelineStore } from "tweakers/timeline";

// src/vue/components/Panel.ts
import { Fragment as Fragment2, defineComponent as defineComponent26, h as h25, onMounted as onMounted15, onUnmounted as onUnmounted9, ref as ref21 } from "vue";
import { AnimatePresence as AnimatePresence6, motion as motion6 } from "motion-v";
import { ICON_ADD_PRESET, ICON_CHECK, ICON_CLIPBOARD } from "tweakers/icons";
import { TweakStore as TweakStore8 } from "tweakers/store";

// src/vue/components/Folder.ts
import { defineComponent as defineComponent2, h as h2, onMounted as onMounted2, onUnmounted as onUnmounted2, ref as ref2 } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ICON_CHEVRON, ICON_PANEL } from "tweakers/icons";

// src/vue/components/Checkbox.ts
import { defineComponent, h } from "vue";
var Checkbox = defineComponent({
  name: "TweakersCheckbox",
  props: {
    checked: { type: Boolean, required: true },
    /** Accessible name — the visible label is rendered by the caller. */
    label: { type: String, default: void 0 },
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled: { type: Boolean, default: false },
    id: { type: String, default: void 0 }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h(
      "button",
      {
        type: "button",
        id: props.id,
        role: "checkbox",
        "aria-checked": props.disabled ? "mixed" : String(props.checked),
        "aria-label": props.label,
        "aria-disabled": props.disabled || void 0,
        class: "tweakers-checkbox",
        "data-checked": props.checked && !props.disabled ? "true" : void 0,
        "data-disabled": props.disabled ? "true" : void 0,
        onClick: (e) => {
          e.stopPropagation();
          if (!props.disabled) emit("change", !props.checked);
        }
      },
      [
        h("svg", { viewBox: "0 0 22 22", width: 22, height: 22, "aria-hidden": "true" }, [
          h("path", { class: "tweakers-checkbox-slash", d: "M6 16 16 6", fill: "none" }),
          h("rect", {
            class: "tweakers-checkbox-chip",
            x: 5,
            y: 5,
            width: 12,
            height: 12,
            rx: 2
          }),
          h("path", { class: "tweakers-checkbox-dash", d: "M6 11h10", fill: "none" })
        ])
      ]
    );
  }
});

// src/vue/components/Folder.ts
var Folder = defineComponent2({
  name: "TweakersFolder",
  props: {
    title: { type: String, required: true },
    defaultOpen: { type: Boolean, default: true },
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible: { type: Boolean, default: true },
    isRoot: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    toolbar: {
      type: null,
      required: false,
      default: null
    },
    /**
     * Root only — the panel declared `_enabled`, so the whole panel is a
     * module: the title carries the switch and the body goes away when it is
     * off. Same idiom as ModuleFolder, one level up.
     */
    enabled: { type: Boolean, default: void 0 },
    onEnabledChange: {
      type: Function,
      default: void 0
    },
    /** One line of help for the section, revealed on hover over the header. */
    hint: { type: String, default: void 0 },
    hintId: { type: String, default: void 0 }
  },
  emits: ["openChange"],
  setup(props, { emit, slots }) {
    const isOpen = ref2(props.collapsible ? props.defaultOpen : true);
    const isModule = () => props.isRoot && props.enabled !== void 0 && props.onEnabledChange !== void 0;
    const bodyOpen = () => isOpen.value && (!isModule() || !!props.enabled);
    const isCollapsed = ref2(props.collapsible ? !props.defaultOpen : false);
    const contentRef = ref2(null);
    const contentHeight = ref2(void 0);
    const windowHeight = ref2(typeof window !== "undefined" ? window.innerHeight : 800);
    let resizeHandler = null;
    if (props.isRoot) {
      resizeHandler = () => {
        windowHeight.value = window.innerHeight;
      };
      window.addEventListener("resize", resizeHandler);
    }
    onUnmounted2(() => {
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    });
    const handleToggle = () => {
      if (!props.collapsible) return;
      if (props.inline && props.isRoot) return;
      const next = !isOpen.value;
      isOpen.value = next;
      isCollapsed.value = !next;
      emit("openChange", next);
    };
    let ro = null;
    onMounted2(() => {
      if (!props.isRoot || typeof ResizeObserver === "undefined") return;
      const el = contentRef.value;
      if (!el) return;
      ro = new ResizeObserver(() => {
        if (isOpen.value) {
          const next = el.offsetHeight;
          if (contentHeight.value !== next) {
            contentHeight.value = next;
          }
        }
      });
      ro.observe(el);
      if (isOpen.value) {
        contentHeight.value = el.offsetHeight;
      }
    });
    onUnmounted2(() => {
      ro?.disconnect();
    });
    const renderHeader = () => h2("div", {
      class: `tweakers-folder-header ${props.isRoot ? "tweakers-panel-header" : ""} ${props.collapsible ? "" : "tweakers-folder-header-static"}`,
      onClick: props.collapsible ? handleToggle : void 0,
      "data-hint": props.hint ? "true" : void 0,
      "aria-describedby": props.hint ? props.hintId : void 0
    }, [
      h2("div", { class: "tweakers-folder-header-top" }, [
        props.isRoot ? isOpen.value ? h2("div", { class: "tweakers-folder-title-row" }, [
          isModule() ? h2(Checkbox, {
            checked: !!props.enabled,
            onChange: props.onEnabledChange,
            label: props.title
          }) : null,
          h2("span", { class: "tweakers-folder-title tweakers-folder-title-root" }, props.title)
        ]) : null : h2("div", { class: "tweakers-folder-title-row" }, [
          h2("span", { class: "tweakers-folder-title" }, props.title)
        ]),
        props.isRoot && !props.inline ? h2("svg", { class: "tweakers-panel-icon", viewBox: "0 0 16 16", fill: "none" }, [
          h2("path", {
            opacity: "0.5",
            d: ICON_PANEL.path,
            fill: "currentColor"
          }),
          ...ICON_PANEL.circles.map((c) => h2("circle", { cx: c.cx, cy: c.cy, r: c.r, fill: "currentColor", stroke: "currentColor", "stroke-width": "1.25" }))
        ]) : null,
        !props.isRoot && props.collapsible ? h2(motion.svg, {
          class: "tweakers-folder-icon",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          initial: false,
          animate: { rotate: isOpen.value ? 0 : 180 },
          transition: { type: "spring", visualDuration: 0.35, bounce: 0.15 }
        }, [h2("path", { d: ICON_CHEVRON })]) : null
      ]),
      props.isRoot && props.toolbar && isOpen.value ? h2("div", { class: "tweakers-panel-toolbar", onClick: (event) => event.stopPropagation() }, [props.toolbar()]) : null,
      props.hint ? h2("span", { class: "tweakers-hint", id: props.hintId, role: "tooltip" }, props.hint) : null
    ]);
    const renderChildren = () => h2("div", { class: "tweakers-folder-inner" }, slots.default ? slots.default() : []);
    const renderContent = () => {
      if (props.isRoot) {
        return bodyOpen() ? h2("div", { class: "tweakers-folder-content" }, [renderChildren()]) : null;
      }
      return h2(AnimatePresence, { initial: false }, {
        default: () => isOpen.value ? [h2(motion.div, {
          key: "tweakers-folder-content",
          class: "tweakers-folder-content",
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { type: "spring", visualDuration: 0.35, bounce: 0.1 },
          style: { clipPath: "inset(0 -20px)" }
        }, [renderChildren()])] : []
      });
    };
    const folderContent = () => h2("div", {
      ref: props.isRoot ? contentRef : void 0,
      class: `tweakers-folder ${props.isRoot ? "tweakers-folder-root" : ""}`
    }, [
      renderHeader(),
      renderContent()
    ]);
    return () => {
      if (props.isRoot) {
        if (props.inline) {
          return h2("div", { class: "tweakers-panel-inner tweakers-panel-inline" }, [folderContent()]);
        }
        const panelStyle = isOpen.value ? {
          width: 280,
          height: contentHeight.value !== void 0 ? Math.min(contentHeight.value + 10, windowHeight.value - 32) : "auto",
          borderRadius: 14,
          boxShadow: "var(--tweak-shadow)",
          cursor: void 0,
          overflowY: "auto"
        } : {
          width: 42,
          height: 42,
          borderRadius: 21,
          boxShadow: "var(--tweak-shadow-collapsed)",
          overflow: "hidden",
          cursor: "pointer"
        };
        return h2(motion.div, {
          class: "tweakers-panel-inner",
          style: panelStyle,
          onClick: !isOpen.value ? handleToggle : void 0,
          "data-collapsed": String(isCollapsed.value),
          whilePress: !isOpen.value ? { scale: 0.9 } : void 0,
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [folderContent()]);
      }
      return folderContent();
    };
  }
});

// src/vue/components/ControlRenderer.ts
import { Fragment, defineComponent as defineComponent24, h as h23, inject as inject2 } from "vue";
import { TweakStore as TweakStore6, hintDomId } from "tweakers/store";

// src/vue/components/ColorControl.ts
import { Teleport, defineComponent as defineComponent5, h as h5, nextTick as nextTick2, onMounted as onMounted5, ref as ref5, watch as watch4 } from "vue";
import { AnimatePresence as AnimatePresence2, motion as motion2 } from "motion-v";

// src/vue/components/ColorPickerPanel.ts
import { computed as computed2, defineComponent as defineComponent4, h as h4, onBeforeUnmount, onMounted as onMounted4, ref as ref4, watch as watch3 } from "vue";

// src/vue/components/SegmentedControl.ts
import { defineComponent as defineComponent3, h as h3, nextTick, onMounted as onMounted3, onUnmounted as onUnmounted3, ref as ref3, watch as watch2 } from "vue";
import { animate } from "motion";
var SegmentedControl = defineComponent3({
  name: "TweakersSegmentedControl",
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const containerRef = ref3(null);
    const pillRef = ref3(null);
    const buttonRefs = /* @__PURE__ */ new Map();
    const pillReady = ref3(false);
    let hasAnimated = false;
    let pillAnim = null;
    const measurePill = () => {
      const button = buttonRefs.get(props.value);
      const container = containerRef.value;
      if (!button || !container) return null;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      return {
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width
      };
    };
    const setPillImmediate = (left, width) => {
      if (!pillRef.value) return;
      pillRef.value.style.left = `${left}px`;
      pillRef.value.style.width = `${width}px`;
      pillRef.value.style.visibility = "visible";
    };
    const updatePill = (shouldAnimate) => {
      const next = measurePill();
      if (!next) return;
      if (!pillReady.value) {
        setPillImmediate(next.left, next.width);
        pillReady.value = true;
        return;
      }
      if (!shouldAnimate || !hasAnimated || !pillRef.value) {
        pillAnim?.stop();
        pillAnim = null;
        setPillImmediate(next.left, next.width);
        return;
      }
      pillAnim?.stop();
      pillAnim = animate(
        pillRef.value,
        {
          left: next.left,
          width: next.width
        },
        {
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.15,
          onComplete: () => {
            pillAnim = null;
          }
        }
      );
    };
    let ro;
    onMounted3(() => {
      nextTick(() => {
        updatePill(false);
        hasAnimated = true;
      });
      if (typeof ResizeObserver !== "undefined" && containerRef.value) {
        ro = new ResizeObserver(() => updatePill(false));
        ro.observe(containerRef.value);
      }
    });
    onUnmounted3(() => {
      pillAnim?.stop();
      ro?.disconnect();
    });
    watch2(
      () => props.value,
      () => {
        updatePill(true);
      },
      { flush: "post" }
    );
    return () => h3("div", { ref: containerRef, class: "tweakers-segmented" }, [
      h3("div", {
        ref: pillRef,
        class: "tweakers-segmented-pill",
        style: {
          left: "0px",
          width: "0px",
          visibility: pillReady.value ? "visible" : "hidden"
        }
      }),
      ...props.options.map((option) => h3("button", {
        ref: ((el) => {
          if (el instanceof HTMLElement) {
            buttonRefs.set(option.value, el);
            return;
          }
          buttonRefs.delete(option.value);
        }),
        class: "tweakers-segmented-button",
        "data-active": String(props.value === option.value),
        onClick: () => emit("change", option.value)
      }, option.label))
    ]);
  }
});

// src/vue/components/ColorPickerPanel.ts
import {
  parseHex,
  formatHex,
  normalizeHex,
  rgbToHsv,
  hsvToRgb,
  getChannels,
  rgbaToChannels,
  channelsToRgba,
  opacityPercent,
  emptyPalette,
  LONG_PRESS_MS,
  PALETTE_DRAG_CANCEL_PX,
  PALETTE_SIZE
} from "tweakers/color-core";
import { loadPalette, savePalette, subscribePalette } from "tweakers/color-palette-store";
var FORMAT_OPTIONS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" }
];
var stickyFormat = "hex";
var BLACK = { h: 0, s: 0, v: 0, a: 1 };
var HEX_ALPHA_SPEC = { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 };
function useAreaDrag(onPoint) {
  const elRef = ref4(null);
  let dragging = false;
  const readPoint = (e) => {
    const el = elRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };
  const endDrag = () => {
    dragging = false;
  };
  const handlers = {
    onPointerdown: (e) => {
      e.preventDefault();
      elRef.value?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointermove: (e) => {
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerup: endDrag,
    onPointercancel: endDrag
  };
  return { elRef, handlers };
}
var ChannelField = defineComponent4({
  name: "TweakersColorChannelField",
  props: {
    spec: { type: Object, required: true },
    value: { type: Number, required: true }
  },
  emits: ["commit"],
  setup(props, { emit }) {
    const draft = ref4(null);
    const commit = () => {
      if (draft.value !== null) emit("commit", Number(draft.value));
      draft.value = null;
    };
    return () => h4("label", { class: "tweakers-color-field" }, [
      h4("input", {
        type: "text",
        inputmode: "decimal",
        value: draft.value ?? String(props.value),
        onFocus: (e) => {
          draft.value = String(props.value);
          e.target.select();
        },
        onInput: (e) => {
          draft.value = e.target.value;
        },
        onBlur: commit,
        onKeydown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            draft.value = null;
            e.target.blur();
          }
        }
      }),
      h4("span", { class: "tweakers-color-field-label" }, props.spec.label)
    ]);
  }
});
var HexField = defineComponent4({
  name: "TweakersColorHexField",
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, required: true }
  },
  emits: ["commit"],
  setup(props, { emit }) {
    const draft = ref4(null);
    const commit = () => {
      if (draft.value !== null) {
        const normalized = normalizeHex(draft.value, props.alpha);
        if (normalized) emit("commit", normalized);
      }
      draft.value = null;
    };
    return () => h4("label", { class: "tweakers-color-field tweakers-color-field-hex" }, [
      h4("input", {
        type: "text",
        spellcheck: false,
        value: (draft.value ?? props.value).toUpperCase(),
        onFocus: (e) => {
          draft.value = props.value;
          e.target.select();
        },
        onInput: (e) => {
          draft.value = e.target.value;
        },
        onBlur: commit,
        onKeydown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            draft.value = null;
            e.target.blur();
          }
        }
      }),
      h4("span", { class: "tweakers-color-field-label" }, "HEX")
    ]);
  }
});
var PaletteSlot = defineComponent4({
  name: "TweakersColorPaletteSlot",
  props: {
    color: { type: String, default: null }
  },
  emits: ["save", "apply", "clear"],
  setup(props, { emit }) {
    const holding = ref4(false);
    let timer = null;
    let origin = null;
    let fired = false;
    const cancelHold = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      origin = null;
      holding.value = false;
    };
    onBeforeUnmount(cancelHold);
    return () => h4("button", {
      class: "tweakers-color-palette-slot",
      "data-filled": String(props.color !== null),
      "data-holding": String(holding.value),
      style: props.color ? { "--swatch-color": props.color } : void 0,
      title: props.color ? `${props.color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color",
      onContextmenu: (e) => e.preventDefault(),
      onPointerdown: (e) => {
        fired = false;
        if (!props.color) return;
        origin = { x: e.clientX, y: e.clientY };
        holding.value = true;
        timer = setTimeout(() => {
          fired = true;
          cancelHold();
          emit("clear");
        }, LONG_PRESS_MS);
      },
      onPointermove: (e) => {
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      },
      onPointerup: cancelHold,
      onPointerleave: cancelHold,
      onPointercancel: cancelHold,
      onClick: () => {
        if (fired) {
          fired = false;
          return;
        }
        if (props.color) emit("apply");
        else emit("save");
      }
    });
  }
});
var ColorPickerPanel = defineComponent4({
  name: "TweakersColorPickerPanel",
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const initialRgba = parseHex(props.value);
    const hsva = ref4(initialRgba ? rgbToHsv(initialRgba) : { ...BLACK });
    const format = ref4(stickyFormat);
    const slots = ref4(props.palette ? loadPalette() : emptyPalette());
    let lastEmitted = props.value;
    watch3(() => props.value, (value) => {
      if (value === lastEmitted) return;
      lastEmitted = value;
      const rgba2 = parseHex(value);
      if (rgba2) hsva.value = rgbToHsv(rgba2);
    });
    let unsubscribePalette;
    onMounted4(() => {
      if (props.palette) {
        unsubscribePalette = subscribePalette((next) => {
          slots.value = next;
        });
      }
    });
    onBeforeUnmount(() => unsubscribePalette?.());
    const emitColor = (next) => {
      hsva.value = next;
      const hex = formatHex(hsvToRgb(next), props.alpha);
      lastEmitted = hex;
      emit("change", hex);
    };
    const applyHex = (hex) => {
      const rgba2 = parseHex(hex);
      if (!rgba2) return;
      const normalized = formatHex(rgba2, props.alpha);
      hsva.value = rgbToHsv(rgba2);
      lastEmitted = normalized;
      emit("change", normalized);
    };
    const svDrag = useAreaDrag((x, y) => emitColor({ ...hsva.value, s: x, v: 1 - y }));
    const hueDrag = useAreaDrag((x) => emitColor({ ...hsva.value, h: Math.min(x * 360, 359.999) }));
    const alphaDrag = useAreaDrag((x) => emitColor({ ...hsva.value, a: x }));
    const rgba = computed2(() => hsvToRgb(hsva.value));
    const opaqueHex = computed2(() => formatHex(rgba.value, false));
    const currentHex = computed2(() => formatHex(rgba.value, props.alpha));
    const channelSpecs = computed2(() => format.value === "hex" ? [] : getChannels(format.value, props.alpha));
    const channelValues = computed2(() => format.value === "hex" ? [] : rgbaToChannels(rgba.value, format.value, props.alpha));
    const commitChannel = (index, n) => {
      const next = [...channelValues.value];
      next[index] = n;
      const committed = channelsToRgba(next, format.value, props.alpha);
      const nextHsva = rgbToHsv(committed);
      if (nextHsva.s === 0) nextHsva.h = hsva.value.h;
      if (nextHsva.v === 0) nextHsva.s = hsva.value.s;
      emitColor(nextHsva);
    };
    return () => h4("div", {
      class: "tweakers-color-picker",
      style: { "--picker-hue": String(hsva.value.h) }
    }, [
      h4("div", {
        class: "tweakers-color-sv",
        ref: svDrag.elRef,
        ...svDrag.handlers
      }, [
        h4("div", {
          class: "tweakers-color-sv-thumb",
          style: {
            left: `${hsva.value.s * 100}%`,
            top: `${(1 - hsva.value.v) * 100}%`,
            background: opaqueHex.value
          }
        })
      ]),
      h4("div", {
        class: "tweakers-color-slider tweakers-color-hue",
        ref: hueDrag.elRef,
        ...hueDrag.handlers
      }, [
        h4("div", {
          class: "tweakers-color-slider-thumb",
          style: {
            left: `${hsva.value.h / 360 * 100}%`,
            background: `hsl(${hsva.value.h} 100% 50%)`
          }
        })
      ]),
      props.alpha ? h4("div", {
        class: "tweakers-color-slider tweakers-color-alpha tweakers-checker",
        ref: alphaDrag.elRef,
        ...alphaDrag.handlers
      }, [
        h4("div", {
          class: "tweakers-color-alpha-gradient",
          style: { background: `linear-gradient(to right, transparent, ${opaqueHex.value})` }
        }),
        h4("div", {
          class: "tweakers-color-slider-thumb",
          style: {
            left: `${hsva.value.a * 100}%`,
            background: opaqueHex.value,
            opacity: String(Math.max(hsva.value.a, 0.15))
          }
        })
      ]) : null,
      h4(SegmentedControl, {
        options: FORMAT_OPTIONS,
        value: format.value,
        onChange: (f) => {
          stickyFormat = f;
          format.value = f;
        }
      }),
      h4("div", { class: "tweakers-color-fields", "data-format": format.value }, format.value === "hex" ? [
        h4(HexField, {
          value: currentHex.value,
          alpha: props.alpha,
          onCommit: (hex) => applyHex(hex)
        }),
        props.alpha ? h4(ChannelField, {
          spec: HEX_ALPHA_SPEC,
          value: opacityPercent(rgba.value),
          onCommit: (n) => emitColor({ ...hsva.value, a: Math.min(1, Math.max(0, n / 100)) })
        }) : null
      ] : channelSpecs.value.map((spec, i) => h4(ChannelField, {
        key: `${format.value}-${spec.key}`,
        spec,
        value: channelValues.value[i],
        onCommit: (n) => commitChannel(i, n)
      }))),
      props.palette ? h4("div", { class: "tweakers-color-palette" }, Array.from({ length: PALETTE_SIZE }, (_, i) => h4(PaletteSlot, {
        key: i,
        color: slots.value[i] ?? null,
        // Read the store at commit time — a 500ms hold is long enough for
        // another panel or tab to have rewritten the palette underneath.
        onSave: () => savePalette(loadPalette().map((s, j) => j === i ? currentHex.value : s)),
        onApply: () => {
          const saved = slots.value[i];
          if (saved) applyHex(saved);
        },
        onClear: () => savePalette(loadPalette().map((s, j) => j === i ? null : s))
      }))) : null
    ]);
  }
});

// src/vue/components/ColorControl.ts
import { parseHex as parseHex2, normalizeHexEdit, bareHex, opacityPercent as opacityPercent2 } from "tweakers/color-core";
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
var ColorControl = defineComponent5({
  name: "TweakersColorControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isEditing = ref5(false);
    const editValue = ref5(bareHex(props.value));
    const isOpen = ref5(false);
    const pos = ref5(null);
    const portalTarget = ref5(null);
    const swatchRef = ref5(null);
    const pickerRef = ref5(null);
    const hexInputRef = ref5(null);
    watch4(() => props.value, (value) => {
      if (!isEditing.value) editValue.value = bareHex(value);
    });
    watch4(isEditing, async (editing) => {
      if (!editing) return;
      await nextTick2();
      hexInputRef.value?.focus();
      hexInputRef.value?.select();
    });
    const updatePos = () => {
      const el = swatchRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pickerHeight = PICKER_BASE_HEIGHT + (props.alpha ? PICKER_ALPHA_HEIGHT : 0) + (props.palette ? PICKER_PALETTE_HEIGHT : 0);
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PICKER_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };
    const openPicker = () => {
      updatePos();
      isOpen.value = true;
    };
    const closePicker = () => {
      isOpen.value = false;
    };
    const togglePicker = () => {
      if (isOpen.value) closePicker();
      else openPicker();
    };
    const setPickerRef = (node) => {
      if (node instanceof HTMLElement) {
        pickerRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        pickerRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      pickerRef.value = null;
    };
    watch4(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (swatchRef.value?.contains(target) || pickerRef.value?.contains(target)) return;
        closePicker();
      };
      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          closePicker();
          swatchRef.value?.focus();
        }
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted5(() => {
      const root = swatchRef.value?.closest(".tweakers-root");
      portalTarget.value = root ?? document.body;
    });
    const submitText = () => {
      isEditing.value = false;
      const normalized = normalizeHexEdit(editValue.value, props.alpha, parseHex2(props.value)?.a ?? 1);
      if (normalized) {
        emit("change", normalized);
      } else {
        editValue.value = bareHex(props.value);
      }
    };
    return () => {
      const rgba = parseHex2(props.value);
      return h5("div", { class: "tweakers-color-control" }, [
        h5("span", { class: "tweakers-color-label" }, props.label),
        h5("div", { class: "tweakers-color-inputs" }, [
          // The whole token (hash included) is the click target for editing.
          h5("span", {
            class: "tweakers-color-hex-wrap",
            onClick: () => {
              isEditing.value = true;
            }
          }, [
            h5("span", { class: "tweakers-color-hash", "aria-hidden": "true" }, "#"),
            isEditing.value ? h5("input", {
              ref: hexInputRef,
              type: "text",
              class: "tweakers-color-hex-input",
              "aria-label": `Hex color for ${props.label}`,
              value: editValue.value,
              onInput: (event) => {
                editValue.value = event.target.value;
              },
              onBlur: submitText,
              onKeydown: (event) => {
                if (event.key === "Enter") {
                  submitText();
                } else if (event.key === "Escape") {
                  event.stopPropagation();
                  isEditing.value = false;
                  editValue.value = bareHex(props.value);
                }
              }
            }) : h5("span", {
              class: "tweakers-color-hex",
              "aria-label": `Hex color for ${props.label}`
            }, bareHex(props.value))
          ]),
          ...props.alpha && rgba ? [
            h5("span", { class: "tweakers-color-divider", "aria-hidden": "true" }),
            h5("span", { class: "tweakers-color-opacity" }, [
              `${opacityPercent2(rgba)} `,
              h5("span", { class: "tweakers-color-opacity-unit" }, "%")
            ])
          ] : [],
          h5("button", {
            ref: swatchRef,
            class: "tweakers-color-swatch",
            style: { "--swatch-color": props.value },
            "data-open": String(isOpen.value),
            title: "Pick color",
            "aria-label": `Pick color for ${props.label}`,
            "aria-expanded": isOpen.value,
            onClick: togglePicker
          })
        ]),
        portalTarget.value ? h5(Teleport, { to: portalTarget.value }, [
          h5(AnimatePresence2, null, {
            default: () => isOpen.value && pos.value ? [h5(motion2.div, {
              key: "tweakers-color-picker-popover",
              ref: setPickerRef,
              class: "tweakers-color-picker-popover",
              initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
              transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
              style: {
                position: "fixed",
                left: `${pos.value.left}px`,
                width: `${PICKER_WIDTH}px`,
                ...pos.value.above ? {
                  bottom: `${window.innerHeight - pos.value.top}px`,
                  transformOrigin: "bottom right"
                } : {
                  top: `${pos.value.top}px`,
                  transformOrigin: "top right"
                }
              }
            }, [
              h5(ColorPickerPanel, {
                value: props.value,
                alpha: props.alpha,
                palette: props.palette,
                onChange: (next) => emit("change", next)
              })
            ])] : []
          })
        ]) : null
      ]);
    };
  }
});

// src/vue/components/ModuleFolder.ts
import { defineComponent as defineComponent6, h as h6, ref as ref6 } from "vue";
var ModuleFolder = defineComponent6({
  name: "TweakersModuleFolder",
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function, default: void 0 },
    defaultOpen: { type: Boolean, default: true },
    hint: { type: String, default: void 0 },
    hintId: { type: String, default: void 0 }
  },
  setup(props, { slots }) {
    const isOpen = ref6(props.defaultOpen);
    const setEnabled = (enabled) => {
      props.onEnabledChange?.(enabled);
      if (enabled) isOpen.value = true;
    };
    return () => h6("div", { class: "tweakers-module tweakers-module-folder", "data-open": props.enabled && isOpen.value ? "true" : "false" }, [
      h6(
        "div",
        {
          class: "tweakers-module-header tweakers-module-header-toggle",
          onClick: () => {
            if (props.enabled) isOpen.value = !isOpen.value;
          },
          "data-hint": props.hint ? "true" : void 0,
          "aria-describedby": props.hint ? props.hintId : void 0
        },
        [
          h6(Checkbox, {
            checked: props.enabled,
            label: props.title,
            onChange: (next) => setEnabled(next)
          }),
          h6("span", { class: "tweakers-module-title" }, props.title),
          ...props.hint ? [h6("span", { class: "tweakers-hint", id: props.hintId, role: "tooltip" }, props.hint)] : []
        ]
      ),
      h6("div", { class: "tweakers-module-collapse", "data-open": props.enabled && isOpen.value }, [
        h6("div", { class: "tweakers-module-collapse-clip" }, [
          h6("div", { class: "tweakers-module-inner" }, slots.default ? slots.default() : [])
        ])
      ])
    ]);
  }
});

// src/vue/components/NumberControl.ts
import { defineComponent as defineComponent7, h as h7, computed as computed3, nextTick as nextTick3, ref as ref7, watch as watch5 } from "vue";
import { decimalsForStep, roundValue } from "tweakers/shortcut-utils";
var CLICK_THRESHOLD = 3;
var NumberControl = defineComponent7({
  name: "TweakersNumberControl",
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min: { type: Number, required: false, default: void 0 },
    max: { type: Number, required: false, default: void 0 },
    step: { type: Number, required: false },
    unit: { type: String, required: false },
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue: { type: Function, default: void 0 },
    /** `vertical` stacks the label above a centered value (column card). */
    orientation: { type: String, default: "horizontal" }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const step = computed3(() => props.step ?? 0.01);
    const isVertical = computed3(() => props.orientation === "vertical");
    const inputRef = ref7(null);
    const isScrubbing = ref7(false);
    const showInput = ref7(false);
    const inputValue = ref7("");
    let pointerDownPos = null;
    let isClickFlag = true;
    let scrubStartValue = 0;
    let isPointerHeld = false;
    const clamp3 = (v) => {
      let out = v;
      if (props.min != null) out = Math.max(props.min, out);
      if (props.max != null) out = Math.min(props.max, out);
      return out;
    };
    const handlePointerDown = (event) => {
      if (showInput.value) return;
      if (event.metaKey) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isPointerHeld = true;
      scrubStartValue = props.value;
    };
    const handlePointerMove = (event) => {
      if (!isPointerHeld || !pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickFlag && distance > CLICK_THRESHOLD) {
        isClickFlag = false;
        isScrubbing.value = true;
      }
      if (!isClickFlag) {
        const travel = isVertical.value ? -dy : dx;
        const perPixel = step.value * (event.shiftKey ? 10 : event.altKey ? 0.1 : 1);
        const next = clamp3(scrubStartValue + travel * perPixel);
        emit("change", roundValue(next, step.value));
      }
    };
    const handlePointerUp = () => {
      if (!isPointerHeld) return;
      if (isClickFlag) {
        showInput.value = true;
        inputValue.value = props.value.toFixed(decimalsForStep(step.value));
      }
      isPointerHeld = false;
      pointerDownPos = null;
      isScrubbing.value = false;
    };
    watch5(showInput, async (visible) => {
      if (!visible) return;
      await nextTick3();
      inputRef.value?.focus();
      inputRef.value?.select();
    });
    const handleInputSubmit = () => {
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        emit("change", roundValue(clamp3(parsed), step.value));
      }
      showInput.value = false;
    };
    const handleInputKeydown = (event) => {
      if (event.key === "Enter") {
        handleInputSubmit();
      } else if (event.key === "Escape") {
        showInput.value = false;
      }
    };
    const displayValue = computed3(
      () => props.formatValue ? props.formatValue(props.value) : props.value.toFixed(decimalsForStep(step.value))
    );
    const className = computed3(
      () => [
        "tweakers-number-control",
        isVertical.value ? "tweakers-number-control-vertical" : "",
        isScrubbing.value ? "tweakers-number-control-engaged" : ""
      ].filter(Boolean).join(" ")
    );
    return () => h7("div", {
      class: className.value,
      onPointerdown: handlePointerDown,
      onPointermove: handlePointerMove,
      onPointerup: handlePointerUp
    }, [
      h7("span", { class: "tweakers-number-label" }, props.label),
      showInput.value ? h7("input", {
        ref: inputRef,
        type: "text",
        class: "tweakers-number-input",
        value: inputValue.value,
        onInput: (event) => {
          inputValue.value = event.target.value;
        },
        onKeydown: handleInputKeydown,
        onBlur: handleInputSubmit,
        onClick: (event) => event.stopPropagation(),
        onPointerdown: (event) => event.stopPropagation()
      }) : h7("span", { class: "tweakers-number-value" }, [
        displayValue.value,
        props.unit ? h7("span", { class: "tweakers-number-unit" }, props.unit) : null
      ])
    ]);
  }
});

// src/vue/components/ControlShell.ts
import { computed as computed4, defineComponent as defineComponent8, h as h8, onBeforeUnmount as onBeforeUnmount2, onMounted as onMounted6, ref as ref8, Teleport as Teleport2, watch as watch6 } from "vue";
import { TweakStore as TweakStore2 } from "tweakers/store";
import { AFFORDANCE_POPOVER_WIDTH, placePopover } from "tweakers/affordance-core";
var ControlShell = defineComponent8({
  name: "TweakersControlShell",
  props: {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint: { type: String, default: void 0 },
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title: { type: String, default: void 0 },
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: { type: String, required: true },
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance: { type: Object, default: void 0 },
    /** Required alongside `affordance` — together they address the status slice. */
    panelId: { type: String, default: void 0 },
    path: { type: String, default: void 0 }
  },
  setup(props, { slots }) {
    const hasAffordance = computed4(() => Boolean(props.affordance && props.panelId && props.path));
    const label = computed4(() => props.affordance?.label ?? "Options");
    const open = ref8(false);
    const status = ref8("off");
    const disabled = ref8(false);
    const pos = ref8(null);
    const portalTarget = ref8(null);
    const dotEl = ref8(null);
    const popoverEl = ref8(null);
    let unsubscribe;
    const resubscribe = () => {
      unsubscribe?.();
      unsubscribe = void 0;
      const panelId = props.panelId;
      const path = props.path;
      if (!panelId || !path) return;
      const read = () => {
        status.value = TweakStore2.getAffordanceStatus(panelId, path);
        disabled.value = TweakStore2.isDisabled(panelId, path);
      };
      read();
      unsubscribe = TweakStore2.subscribeControlState(panelId, read);
    };
    const place = () => {
      const rect = dotEl.value?.getBoundingClientRect();
      if (!rect) return;
      const next = placePopover(rect, popoverEl.value?.offsetHeight ?? 0, window.innerHeight);
      if (pos.value?.top !== next.top || pos.value?.left !== next.left) pos.value = next;
    };
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotEl.value?.contains(target) || popoverEl.value?.contains(target)) return;
      open.value = false;
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      open.value = false;
      dotEl.value?.focus();
    };
    onMounted6(() => {
      resubscribe();
      portalTarget.value = dotEl.value?.closest(".tweakers-root") ?? document.body;
    });
    watch6(() => [props.panelId, props.path, hasAffordance.value], resubscribe);
    watch6(open, async (isOpen) => {
      if (!isOpen) {
        pos.value = null;
        window.removeEventListener("scroll", place, true);
        window.removeEventListener("resize", place);
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
        return;
      }
      window.addEventListener("scroll", place, true);
      window.addEventListener("resize", place);
      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      await Promise.resolve();
      place();
      await Promise.resolve();
      place();
      const first = popoverEl.value?.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (first ?? popoverEl.value)?.focus();
    });
    onBeforeUnmount2(() => {
      unsubscribe?.();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
    return () => {
      const children = slots.default ? slots.default() : [];
      const wrapper = h8("div", {
        class: "tweakers-control-tip",
        "data-hint": props.hint ? "true" : void 0,
        "data-affordance": hasAffordance.value ? "true" : void 0,
        "data-affordance-open": open.value ? "true" : void 0,
        "data-disabled": disabled.value ? "true" : void 0,
        "aria-disabled": disabled.value ? "true" : void 0,
        role: props.hint ? "group" : void 0,
        "aria-describedby": props.hint ? props.id : void 0,
        title: props.hint ? void 0 : props.title
      }, [
        ...children,
        props.hint ? h8("span", { class: "tweakers-hint", id: props.id, role: "tooltip" }, props.hint) : null,
        hasAffordance.value ? h8("button", {
          ref: dotEl,
          type: "button",
          class: "tweakers-affordance-dot",
          "data-status": status.value,
          "data-open": String(open.value),
          "aria-label": label.value,
          "aria-expanded": open.value,
          onClick: () => {
            open.value = !open.value;
          }
        }) : null
      ]);
      if (!open.value || !hasAffordance.value || !portalTarget.value) return wrapper;
      return [
        wrapper,
        h8(Teleport2, { to: portalTarget.value }, [
          h8("div", {
            ref: popoverEl,
            class: "tweakers-affordance-popover",
            role: "dialog",
            "aria-label": label.value,
            tabindex: -1,
            style: {
              left: `${pos.value?.left ?? 0}px`,
              top: `${pos.value?.top ?? 0}px`,
              width: `${AFFORDANCE_POPOVER_WIDTH}px`,
              // Hidden until measured, so it never flashes at the wrong spot.
              visibility: pos.value ? void 0 : "hidden"
            }
          }, [
            h8("span", { class: "tweakers-affordance-popover-title" }, label.value),
            // Rendered as a component, not called: a stateful popover needs its
            // own instance.
            h8(props.affordance.content, {
              panelId: props.panelId,
              path: props.path,
              status: status.value,
              setStatus: (next) => TweakStore2.setAffordanceStatus(props.panelId, props.path, next)
            })
          ])
        ])
      ];
    };
  }
});

// src/vue/components/GradientControl.ts
import { Teleport as Teleport3, defineComponent as defineComponent11, h as h11, onMounted as onMounted8, ref as ref11, watch as watch7 } from "vue";
import { AnimatePresence as AnimatePresence3, motion as motion3 } from "motion-v";

// src/vue/components/GradientPanel.ts
import { computed as computed5, defineComponent as defineComponent10, h as h10, ref as ref10, onBeforeUnmount as onBeforeUnmount4 } from "vue";

// src/vue/components/GradientTransformPad.ts
import { defineComponent as defineComponent9, h as h9, onBeforeUnmount as onBeforeUnmount3, onMounted as onMounted7, ref as ref9 } from "vue";
import {
  gradientFillBox,
  setGradientAngle,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation
} from "tweakers/gradient-core";
var clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
var GradientTransformPad = defineComponent9({
  name: "TweakersGradientTransformPad",
  props: {
    value: { type: Object, required: true }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const padRef = ref9(null);
    let drag = null;
    const size = ref9({ w: 0, h: 0 });
    let ro = null;
    onMounted7(() => {
      const el = padRef.value;
      if (!el) return;
      const measure = () => {
        size.value = { w: el.clientWidth, h: el.clientHeight };
      };
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    });
    onBeforeUnmount3(() => ro?.disconnect());
    const onHandleDown = (kind) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
      }
      drag = { kind, pointerId: e.pointerId };
    };
    const onHandleMove = (e) => {
      if (!drag || drag.pointerId !== e.pointerId || !padRef.value) return;
      const kind = drag.kind;
      if (e.buttons === 0) {
        drag = null;
        return;
      }
      const rect = padRef.value.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (kind === "center") {
        emit("change", setGradientCenter(props.value, px / rect.width * 100, py / rect.height * 100));
        return;
      }
      const cx = props.value.centerX ?? 50;
      const cy = props.value.centerY ?? 50;
      if (kind === "angle") {
        const isConic = props.value.type === "conic";
        const ox = isConic ? cx / 100 * rect.width : rect.width / 2;
        const oy = isConic ? cy / 100 * rect.height : rect.height / 2;
        emit("change", setGradientAngle(props.value, vectorToAngle(px - ox, py - oy)));
        return;
      }
      const dx = px - cx / 100 * rect.width;
      const dy = py - cy / 100 * rect.height;
      const dist = Math.hypot(dx, dy);
      const deg = Math.atan2(dy, dx) / RAD;
      if (kind === "major") {
        const nextScale = dist / rect.width * 100;
        emit("change", setGradientScale(setGradientRotation(props.value, deg), nextScale));
        return;
      }
      const nextSquash = dist / rect.height * 100;
      emit("change", setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
    };
    const onHandleUp = (e) => {
      if (drag?.pointerId === e.pointerId) drag = null;
    };
    const handleProps = (kind) => ({
      onPointerdown: onHandleDown(kind),
      onPointermove: onHandleMove,
      onPointerup: onHandleUp,
      onPointercancel: onHandleUp,
      onLostpointercapture: onHandleUp
    });
    return () => {
      const value = props.value;
      const radial = value.type === "radial";
      const conic = value.type === "conic";
      const cx = value.centerX ?? 50;
      const cy = value.centerY ?? 50;
      const scale = value.scale ?? 100;
      const rotation = value.rotation ?? 0;
      const { w, h: hh } = size.value;
      const cxPx = cx / 100 * w;
      const cyPx = cy / 100 * hh;
      const rxPx = scale / 100 * w;
      const ryPx = Math.max(10, (value.squash ?? scale) / 100 * hh);
      const theta = rotation * RAD;
      const majorX = cxPx + Math.cos(theta) * rxPx;
      const majorY = cyPx + Math.sin(theta) * rxPx;
      const minorX = cxPx - Math.sin(theta) * ryPx;
      const minorY = cyPx + Math.cos(theta) * ryPx;
      const pin = (x, y) => ({ x: clamp(x, 5, w - 5), y: clamp(y, 5, hh - 5) });
      const major = pin(majorX, majorY);
      const minor = pin(minorX, minorY);
      const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
      const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;
      const angleOx = conic ? cxPx : w / 2;
      const angleOy = conic ? cyPx : hh / 2;
      const spokeR = Math.max(10, Math.min(w, hh) / 2 - 8);
      const aTheta = value.angle * RAD;
      const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
      const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
      const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;
      const fill = gradientFillBox(value, w, hh);
      return h9("div", { ref: padRef, class: "tweakers-gradient-pad tweakers-checker" }, [
        h9("div", {
          class: "tweakers-gradient-pad-fill",
          style: {
            background: fill.background,
            transform: fill.transform,
            transformOrigin: fill.transformOrigin,
            left: `${fill.left}px`,
            top: `${fill.top}px`,
            width: `${fill.width}px`,
            height: `${fill.height}px`
          }
        }),
        ...radial ? [
          h9("div", {
            class: "tweakers-gradient-pad-line",
            style: {
              left: `${cxPx}px`,
              top: `${cyPx}px`,
              width: `${majorLineLen}px`,
              transform: `rotate(${majorLineAngle}deg)`
            }
          }),
          h9("button", {
            type: "button",
            class: "tweakers-gradient-pad-handle",
            "data-kind": "major",
            "aria-label": "Gradient size and rotation",
            style: { left: `${major.x}px`, top: `${major.y}px` },
            ...handleProps("major")
          }),
          h9("button", {
            type: "button",
            class: "tweakers-gradient-pad-handle",
            "data-kind": "minor",
            "aria-label": "Gradient squash",
            style: { left: `${minor.x}px`, top: `${minor.y}px` },
            ...handleProps("minor")
          })
        ] : [
          h9("div", {
            class: "tweakers-gradient-pad-line",
            style: {
              left: `${angleOx}px`,
              top: `${angleOy}px`,
              width: `${angleLineLen}px`,
              transform: `rotate(${angleLineAngle}deg)`
            }
          }),
          h9("button", {
            type: "button",
            class: "tweakers-gradient-pad-handle",
            "data-kind": "angle",
            "aria-label": "Gradient angle",
            style: { left: `${angleHandle.x}px`, top: `${angleHandle.y}px` },
            ...handleProps("angle")
          })
        ],
        ...radial || conic ? [
          h9("button", {
            type: "button",
            class: "tweakers-gradient-pad-handle",
            "data-kind": "center",
            "aria-label": "Gradient center",
            style: { left: `${clamp(cxPx, 5, w - 5)}px`, top: `${clamp(cyPx, 5, hh - 5)}px` },
            ...handleProps("center")
          })
        ] : []
      ]);
    };
  }
});

// src/vue/components/GradientPanel.ts
import { ICON_GRIP } from "tweakers/icons";
import {
  gradientToCss,
  addStop,
  moveStop,
  removeStop,
  setStopColor,
  setGradientType,
  MIN_STOPS,
  STOP_DETACH_PX,
  LONG_PRESS_MS as LONG_PRESS_MS2,
  PALETTE_DRAG_CANCEL_PX as PALETTE_DRAG_CANCEL_PX2
} from "tweakers/gradient-core";
var TYPE_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" }
];
function rampCss(stops) {
  return gradientToCss({ type: "linear", angle: 90, stops });
}
var GradientPanel = defineComponent10({
  name: "TweakersGradientPanel",
  props: {
    value: { type: Object, required: true }
  },
  emits: ["change", "drag"],
  setup(props, { emit }) {
    const selectedIndex = ref10(0);
    const holdingIndex = ref10(-1);
    const detach = ref10(null);
    const stripRef = ref10(null);
    const gripRef = ref10(null);
    const gripOrigin = ref10(null);
    const onGripDown = (e) => {
      e.preventDefault();
      try {
        gripRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripMove = (e) => {
      if (!gripOrigin.value || e.buttons === 0) return;
      emit("drag", e.clientX - gripOrigin.value.x, e.clientY - gripOrigin.value.y);
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripUp = () => {
      gripOrigin.value = null;
    };
    const drag = {
      mode: "idle",
      activeIndex: -1,
      originX: 0,
      originY: 0,
      timer: null,
      working: props.value
    };
    const safeIndex = computed5(() => Math.min(selectedIndex.value, props.value.stops.length - 1));
    const stripPos = (clientX) => {
      const rect = stripRef.value.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    };
    const stripCenterY = () => {
      const rect = stripRef.value.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    const clearTimer = () => {
      if (drag.timer) clearTimeout(drag.timer);
      drag.timer = null;
    };
    onBeforeUnmount4(clearTimer);
    const resetDrag = () => {
      clearTimer();
      drag.mode = "idle";
      holdingIndex.value = -1;
    };
    const commitMove = (clientX) => {
      const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
      drag.working = r.value;
      drag.activeIndex = r.index;
      selectedIndex.value = r.index;
      emit("change", r.value);
    };
    const onPointerDown = (e) => {
      e.preventDefault();
      try {
        stripRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      drag.originX = e.clientX;
      drag.originY = e.clientY;
      drag.working = props.value;
      const handle = e.target.closest(".tweakers-gradient-stop");
      if (handle) {
        const index2 = Number(handle.dataset.index);
        selectedIndex.value = index2;
        drag.activeIndex = index2;
        drag.mode = "pending";
        if (props.value.stops.length > MIN_STOPS) {
          holdingIndex.value = index2;
          drag.timer = setTimeout(() => {
            drag.timer = null;
            drag.mode = "idle";
            holdingIndex.value = -1;
            const next2 = removeStop(props.value, index2);
            emit("change", next2);
            selectedIndex.value = Math.min(index2, next2.stops.length - 1);
          }, LONG_PRESS_MS2);
        }
        return;
      }
      const { value: next, index } = addStop(props.value, stripPos(e.clientX));
      drag.working = next;
      drag.activeIndex = index;
      drag.mode = "dragging";
      selectedIndex.value = index;
      emit("change", next);
    };
    const onPointerMove = (e) => {
      if (drag.mode === "idle") return;
      if (e.buttons === 0) {
        detach.value = null;
        resetDrag();
        return;
      }
      if (drag.mode === "pending") {
        if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX2) return;
        clearTimer();
        holdingIndex.value = -1;
        drag.mode = "dragging";
      }
      if (drag.mode === "dragging") {
        const offV = e.clientY - stripCenterY();
        if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
          drag.mode = "detached";
          detach.value = { index: drag.activeIndex, y: offV };
          return;
        }
        commitMove(e.clientX);
        return;
      }
      if (drag.mode === "detached") {
        const offV = e.clientY - stripCenterY();
        if (Math.abs(offV) <= STOP_DETACH_PX) {
          drag.mode = "dragging";
          detach.value = null;
          commitMove(e.clientX);
        } else {
          detach.value = { index: drag.activeIndex, y: offV };
        }
      }
    };
    const onPointerUp = () => {
      if (drag.mode === "detached") {
        const next = removeStop(drag.working, drag.activeIndex);
        emit("change", next);
        selectedIndex.value = Math.min(drag.activeIndex, next.stops.length - 1);
      }
      detach.value = null;
      resetDrag();
    };
    return () => {
      const value = props.value;
      const previewStops = detach.value ? value.stops.filter((_, i) => i !== detach.value.index) : value.stops;
      return h10("div", { class: "tweakers-gradient-panel" }, [
        h10("div", { class: "tweakers-gradient-toolbar" }, [
          h10("button", {
            ref: gripRef,
            type: "button",
            class: "tweakers-gradient-grip",
            "aria-label": "Drag to move",
            title: "Drag to move",
            onPointerdown: onGripDown,
            onPointermove: onGripMove,
            onPointerup: onGripUp,
            onPointercancel: onGripUp,
            onLostpointercapture: onGripUp
          }, [
            h10(
              "svg",
              { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
              ICON_GRIP.map((c) => h10("circle", { cx: c.cx, cy: c.cy, r: "1.5" }))
            )
          ]),
          h10(SegmentedControl, {
            options: TYPE_OPTIONS,
            value: value.type,
            onChange: (t) => emit("change", setGradientType(value, t))
          })
        ]),
        h10(GradientTransformPad, {
          value,
          onChange: (v) => emit("change", v)
        }),
        h10("div", {
          ref: stripRef,
          class: "tweakers-gradient-strip",
          style: { "--gradient-ramp": rampCss(previewStops) },
          onPointerdown: onPointerDown,
          onPointermove: onPointerMove,
          onPointerup: onPointerUp,
          onPointercancel: onPointerUp
        }, value.stops.map((stop, i) => {
          const detaching = detach.value?.index === i;
          return h10("button", {
            key: i,
            type: "button",
            class: "tweakers-gradient-stop",
            "data-index": i,
            "data-selected": String(i === safeIndex.value),
            "data-holding": String(i === holdingIndex.value),
            "data-detaching": String(detaching),
            style: {
              left: `${stop.position * 100}%`,
              zIndex: i === safeIndex.value ? 99 : i + 1,
              "--swatch-color": stop.color,
              "--detach-y": detaching ? `${detach.value.y}px` : "0px"
            },
            "aria-label": `Gradient stop ${i + 1}`
          });
        })),
        h10("span", { class: "tweakers-gradient-divider", "aria-hidden": "true" }),
        h10(ColorPickerPanel, {
          key: safeIndex.value,
          value: value.stops[safeIndex.value].color,
          alpha: true,
          palette: false,
          onChange: (hex) => emit("change", setStopColor(value, safeIndex.value, hex))
        })
      ]);
    };
  }
});

// src/vue/components/GradientControl.ts
import { gradientToCss as gradientToCss2 } from "tweakers/gradient-core";
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RADIAL = 430;
var GradientControl = defineComponent11({
  name: "TweakersGradientControl",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isOpen = ref11(false);
    const pos = ref11(null);
    const dragPos = ref11(null);
    const portalTarget = ref11(null);
    const triggerRef = ref11(null);
    const panelRef = ref11(null);
    const onPanelDrag = (dx, dy) => {
      let base = dragPos.value;
      if (!base) {
        const p = pos.value;
        const el = panelRef.value;
        if (!p || !el) return;
        base = { left: p.left, top: p.above ? p.top - el.offsetHeight : p.top };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      dragPos.value = { left, top };
    };
    const updatePos = () => {
      const el = triggerRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const panelHeight = props.value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < panelHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PANEL_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };
    const openPanel = () => {
      dragPos.value = null;
      updatePos();
      isOpen.value = true;
    };
    const closePanel = () => {
      isOpen.value = false;
    };
    const togglePanel = () => {
      if (isOpen.value) closePanel();
      else openPanel();
    };
    const setPanelRef = (node) => {
      if (node instanceof HTMLElement) {
        panelRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        panelRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      panelRef.value = null;
    };
    watch7(() => props.value.type, () => {
      if (isOpen.value) updatePos();
    });
    watch7(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return;
        closePanel();
      };
      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          closePanel();
          triggerRef.value?.focus();
        }
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted8(() => {
      const root = triggerRef.value?.closest(".tweakers-root");
      portalTarget.value = root ?? document.body;
    });
    return () => h11("div", { class: "tweakers-gradient-control" }, [
      h11("span", { class: "tweakers-gradient-label" }, props.label),
      h11("button", {
        ref: triggerRef,
        class: "tweakers-gradient-preview tweakers-checker",
        style: { "--gradient-preview": gradientToCss2(props.value) },
        "data-open": String(isOpen.value),
        title: "Edit gradient",
        "aria-label": `Edit gradient for ${props.label}`,
        "aria-expanded": isOpen.value,
        onClick: togglePanel
      }),
      portalTarget.value ? h11(Teleport3, { to: portalTarget.value }, [
        h11(AnimatePresence3, null, {
          default: () => isOpen.value && pos.value ? [h11(motion3.div, {
            key: "tweakers-gradient-popover",
            ref: setPanelRef,
            class: "tweakers-gradient-popover",
            initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
            style: {
              position: "fixed",
              width: `${PANEL_WIDTH}px`,
              ...dragPos.value ? {
                left: `${dragPos.value.left}px`,
                top: `${dragPos.value.top}px`,
                transformOrigin: "top left"
              } : pos.value.above ? {
                left: `${pos.value.left}px`,
                bottom: `${window.innerHeight - pos.value.top}px`,
                transformOrigin: "bottom right"
              } : {
                left: `${pos.value.left}px`,
                top: `${pos.value.top}px`,
                transformOrigin: "top right"
              }
            }
          }, [
            h11(GradientPanel, {
              value: props.value,
              onChange: (next) => emit("change", next),
              onDrag: onPanelDrag
            })
          ])] : []
        })
      ]) : null
    ]);
  }
});

// src/vue/components/RangeSlider.ts
import { defineComponent as defineComponent12, h as h12, computed as computed6, nextTick as nextTick4, onMounted as onMounted9, onUnmounted as onUnmounted4, ref as ref12, watch as watch8 } from "vue";
import { animate as animate2, motionValue } from "motion-v";
import {
  clampRange,
  setLow,
  setHigh,
  shiftSpan,
  nearestHandle,
  pickDragTarget,
  isOutsideSpan,
  handleLeftStyles
} from "tweakers/range-slider-core";
import { decimalsForStep as decimalsForStep2, roundValue as roundValue2 } from "tweakers/shortcut-utils";
var CLICK_THRESHOLD2 = 3;
var HANDLE_HIT_PX = 12;
var RangeSlider = defineComponent12({
  name: "TweakersRangeSlider",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    /** Lower bound of the track. */
    min: { type: Number, required: false },
    /** Upper bound of the track. */
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue: { type: Object, required: false, default: void 0 }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const min = computed6(() => props.min ?? 0);
    const max = computed6(() => props.max ?? 1);
    const step = computed6(() => props.step ?? 0.01);
    const wrapperRef = ref12(null);
    const fillRef = ref12(null);
    const lowHandleRef = ref12(null);
    const highHandleRef = ref12(null);
    const inputRef = ref12(null);
    const isInteracting = ref12(false);
    const isDragging = ref12(false);
    const isHovered = ref12(false);
    const editing = ref12(null);
    const inputValue = ref12("");
    const value = computed6(
      () => isInteracting.value ? props.value : clampRange(props.value, min.value, max.value)
    );
    const span = computed6(() => max.value - min.value);
    const percentFromValue = (v) => span.value === 0 ? 0 : (v - min.value) / span.value * 100;
    const lowPercent = computed6(() => percentFromValue(value.value.min));
    const highPercent = computed6(() => percentFromValue(value.value.max));
    const isActive = computed6(() => isInteracting.value || isHovered.value);
    const lowMotion = motionValue(lowPercent.value);
    const highMotion = motionValue(highPercent.value);
    let pointerDownPos = null;
    let isClickFlag = true;
    let dragTarget = null;
    let clickMoves = false;
    let dragStartValue = props.value;
    let dragStartValueAt = 0;
    let wrapperRect = null;
    let scaleVal = 1;
    let lowAnim = null;
    let highAnim = null;
    const stopAnims = () => {
      lowAnim?.stop();
      highAnim?.stop();
      lowAnim = null;
      highAnim = null;
    };
    const applyFillStyles = () => {
      const lo = lowMotion.get();
      const hi = highMotion.get();
      if (fillRef.value) {
        fillRef.value.style.left = `${lo}%`;
        fillRef.value.style.width = `${Math.max(0, hi - lo)}%`;
      }
      const handles = handleLeftStyles(lo, hi);
      if (lowHandleRef.value) lowHandleRef.value.style.left = handles.low;
      if (highHandleRef.value) highHandleRef.value.style.left = handles.high;
    };
    const REST_OPACITY = 0.35;
    const handleOpacityFor = (which) => {
      if (!isActive.value) return REST_OPACITY;
      if (isDragging.value && dragTarget === which) return 0.95;
      return 0.7;
    };
    const applyHandleOpacity = () => {
      if (lowHandleRef.value) lowHandleRef.value.style.opacity = String(handleOpacityFor("min"));
      if (highHandleRef.value) highHandleRef.value.style.opacity = String(handleOpacityFor("max"));
    };
    const positionToValue = (clientX) => {
      if (!wrapperRect) return value.value.min;
      const screenX = clientX - wrapperRect.left;
      const sceneX = screenX / scaleVal;
      const nativeWidth = wrapperRef.value ? wrapperRef.value.offsetWidth : wrapperRect.width;
      const pct = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };
    const syncMotion = (next) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    };
    const handlePointerDown = (event) => {
      if (editing.value) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;
      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        scaleVal = wrapperRect.width / wrapperRef.value.offsetWidth;
      }
      const current = clampRange(props.value, min.value, max.value);
      const atValue = positionToValue(event.clientX);
      const trackW = wrapperRef.value?.offsetWidth ?? 1;
      const hitV = HANDLE_HIT_PX / trackW * (max.value - min.value);
      dragTarget = pickDragTarget(atValue, current, hitV);
      clickMoves = dragTarget !== "span" && isOutsideSpan(atValue, current);
      dragStartValue = current;
      dragStartValueAt = atValue;
    };
    const handlePointerMove = (event) => {
      if (!isInteracting.value || !pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickFlag && distance > CLICK_THRESHOLD2) {
        isClickFlag = false;
        isDragging.value = true;
      }
      if (isClickFlag) return;
      const raw = roundValue2(positionToValue(event.clientX), step.value);
      const current = value.value;
      let next;
      if (dragTarget === "span") {
        const delta = raw - roundValue2(dragStartValueAt, step.value);
        next = shiftSpan(delta, dragStartValue, min.value, max.value);
      } else if (dragTarget === "min") {
        next = setLow(raw, current, min.value);
      } else {
        next = setHigh(raw, current, max.value);
      }
      stopAnims();
      syncMotion(next);
      emit("change", next);
    };
    const handlePointerUp = (event) => {
      if (!isInteracting.value) return;
      if (isClickFlag && clickMoves) {
        const current = value.value;
        const raw = roundValue2(positionToValue(event.clientX), step.value);
        const which = dragTarget ?? nearestHandle(raw, current);
        const next = which === "min" ? setLow(raw, current, min.value) : setHigh(raw, current, max.value);
        const targetMotion = which === "min" ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === "min" ? next.min : next.max);
        stopAnims();
        const active = animate2(targetMotion, targetPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === "min") lowAnim = null;
            else highAnim = null;
          }
        });
        if (which === "min") lowAnim = active;
        else highAnim = active;
        emit("change", next);
      }
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };
    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };
    const handleDoubleClick = () => {
      if (editing.value !== null) return;
      const d = clampRange(props.defaultValue ?? { min: min.value, max: max.value }, min.value, max.value);
      stopAnims();
      lowAnim = animate2(lowMotion, percentFromValue(d.min), {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          lowAnim = null;
        }
      });
      highAnim = animate2(highMotion, percentFromValue(d.max), {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          highAnim = null;
        }
      });
      emit("change", d);
    };
    const decimals = computed6(() => decimalsForStep2(step.value));
    const openEditor = (which, event) => {
      event.stopPropagation();
      editing.value = which;
      inputValue.value = (which === "min" ? value.value.min : value.value.max).toFixed(decimals.value);
    };
    const commitEditor = () => {
      if (!editing.value) return;
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const rounded = roundValue2(parsed, step.value);
        const current = value.value;
        const next = editing.value === "min" ? setLow(rounded, current, min.value) : setHigh(rounded, current, max.value);
        emit("change", next);
      }
      editing.value = null;
    };
    const handleInputKeydown = (event) => {
      if (event.key === "Enter") {
        commitEditor();
      } else if (event.key === "Escape") {
        editing.value = null;
      }
    };
    watch8([lowPercent, highPercent], ([lo, hi]) => {
      if (!isInteracting.value && !lowAnim && !highAnim) {
        lowMotion.jump(lo);
        highMotion.jump(hi);
      }
    });
    watch8([isActive, isDragging], () => {
      applyHandleOpacity();
    });
    watch8(editing, async (which) => {
      if (which === null) return;
      await nextTick4();
      inputRef.value?.focus();
      inputRef.value?.select();
    });
    let unsubLow = null;
    let unsubHigh = null;
    onMounted9(() => {
      unsubLow = lowMotion.on("change", applyFillStyles);
      unsubHigh = highMotion.on("change", applyFillStyles);
      applyFillStyles();
      applyHandleOpacity();
    });
    onUnmounted4(() => {
      stopAnims();
      unsubLow?.();
      unsubHigh?.();
    });
    return () => {
      const current = value.value;
      const lowText = current.min.toFixed(decimals.value);
      const highText = current.max.toFixed(decimals.value);
      const handles = handleLeftStyles(lowPercent.value, highPercent.value);
      return h12("div", { ref: wrapperRef, class: "tweakers-range-slider-wrapper" }, [
        h12("div", {
          class: `tweakers-range-slider ${isActive.value ? "tweakers-range-slider-active" : ""}`,
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: handlePointerUp,
          onPointercancel: handlePointerCancel,
          onDblclick: handleDoubleClick,
          onMouseenter: () => {
            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
          }
        }, [
          h12("div", {
            ref: fillRef,
            class: "tweakers-range-slider-fill",
            style: {
              left: `${lowPercent.value}%`,
              width: `${Math.max(0, highPercent.value - lowPercent.value)}%`
            }
          }),
          h12("div", {
            ref: lowHandleRef,
            class: "tweakers-range-slider-handle",
            style: {
              left: handles.low,
              transform: "translateY(-50%)",
              opacity: handleOpacityFor("min")
            }
          }),
          h12("div", {
            ref: highHandleRef,
            class: "tweakers-range-slider-handle",
            style: {
              left: handles.high,
              transform: "translateY(-50%)",
              opacity: handleOpacityFor("max")
            }
          }),
          h12("span", { class: "tweakers-range-slider-label" }, props.label),
          editing.value !== null ? h12("input", {
            ref: inputRef,
            type: "text",
            class: "tweakers-range-slider-input",
            value: inputValue.value,
            onInput: (event) => {
              inputValue.value = event.target.value;
            },
            onKeydown: handleInputKeydown,
            onBlur: commitEditor,
            onClick: (event) => event.stopPropagation(),
            onPointerdown: (event) => event.stopPropagation()
          }) : h12("span", { class: "tweakers-range-slider-value" }, [
            h12("span", {
              class: "tweakers-range-slider-bound",
              onClick: (event) => openEditor("min", event),
              onPointerdown: (event) => event.stopPropagation()
            }, lowText),
            h12("span", { class: "tweakers-range-slider-dash" }, "\u2013"),
            h12("span", {
              class: "tweakers-range-slider-bound",
              onClick: (event) => openEditor("max", event),
              onPointerdown: (event) => event.stopPropagation()
            }, highText)
          ])
        ])
      ]);
    };
  }
});

// src/vue/components/SelectControl.ts
import { Teleport as Teleport4, defineComponent as defineComponent13, h as h13, onMounted as onMounted10, ref as ref13, watch as watch9 } from "vue";
import { AnimatePresence as AnimatePresence4, motion as motion4 } from "motion-v";
function toTitleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
function normalizeOptions(options) {
  return options.map(
    (option) => typeof option === "string" ? { value: option, label: toTitleCase(option) } : option
  );
}
var SelectControl = defineComponent13({
  name: "TweakersSelectControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    options: {
      type: Array,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isOpen = ref13(false);
    const pos = ref13(null);
    const portalTarget = ref13(null);
    const triggerRef = ref13(null);
    const dropdownRef = ref13(null);
    const normalizedOptions = () => normalizeOptions(props.options);
    const selectedLabel = () => normalizedOptions().find((option) => option.value === props.value)?.label ?? props.value;
    const updatePos = () => {
      if (!triggerRef.value) return;
      const rect = triggerRef.value.getBoundingClientRect();
      const dropdownHeight = 8 + normalizedOptions().length * 36;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
      pos.value = {
        top: above ? rect.top - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        above
      };
    };
    const openDropdown = () => {
      updatePos();
      isOpen.value = true;
    };
    const closeDropdown = () => {
      isOpen.value = false;
    };
    const setDropdownRef = (node) => {
      if (node instanceof HTMLElement) {
        dropdownRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        dropdownRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      dropdownRef.value = null;
    };
    const toggleDropdown = () => {
      if (isOpen.value) closeDropdown();
      else openDropdown();
    };
    watch9(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        closeDropdown();
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted10(() => {
      const root = triggerRef.value?.closest(".tweakers-root");
      portalTarget.value = root ?? document.body;
    });
    return () => h13("div", { class: "tweakers-select-row" }, [
      h13("button", {
        ref: triggerRef,
        class: "tweakers-select-trigger",
        "data-open": String(isOpen.value),
        onClick: toggleDropdown
      }, [
        h13("span", { class: "tweakers-select-label" }, props.label),
        h13("div", { class: "tweakers-select-right" }, [
          h13("span", { class: "tweakers-select-value" }, selectedLabel()),
          h13(motion4.svg, {
            class: "tweakers-select-chevron",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            animate: { rotate: isOpen.value ? 180 : 0 },
            transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 }
          }, [h13("path", { d: "M6 9.5L12 15.5L18 9.5" })])
        ])
      ]),
      portalTarget.value ? h13(Teleport4, { to: portalTarget.value }, [
        h13(AnimatePresence4, null, {
          default: () => isOpen.value && pos.value ? [h13(motion4.div, {
            key: "tweakers-select-dropdown",
            ref: setDropdownRef,
            class: "tweakers-select-dropdown",
            initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
            style: {
              position: "fixed",
              left: `${pos.value.left}px`,
              width: `${pos.value.width}px`,
              ...pos.value.above ? {
                bottom: `${window.innerHeight - pos.value.top}px`,
                transformOrigin: "bottom"
              } : {
                top: `${pos.value.top}px`,
                transformOrigin: "top"
              }
            }
          }, normalizedOptions().map((option) => h13("button", {
            key: option.value,
            class: "tweakers-select-option",
            "data-selected": String(option.value === props.value),
            onClick: () => {
              emit("change", option.value);
              closeDropdown();
            }
          }, option.label)))] : []
        })
      ]) : null
    ]);
  }
});

// src/vue/components/ShortcutListener.ts
import { defineComponent as defineComponent14, inject, onMounted as onMounted11, onUnmounted as onUnmounted5, provide, ref as ref14 } from "vue";
import { TweakStore as TweakStore3 } from "tweakers/store";
import { getEffectiveStep, applySliderDelta, findControl, isInputFocused, getActiveModifier, DRAG_SENSITIVITY } from "tweakers/shortcut-utils";
var ShortcutKey = /* @__PURE__ */ Symbol("TweakersShortcut");
function useShortcutContext() {
  return inject(ShortcutKey, {
    activePanelId: ref14(null),
    activePath: ref14(null)
  });
}
var ShortcutListener = defineComponent14({
  name: "TweakersShortcutListener",
  setup(_, { slots }) {
    const activePanelId = ref14(null);
    const activePath = ref14(null);
    const activeKeys = /* @__PURE__ */ new Set();
    let isDragging = false;
    let lastMouseX = null;
    let dragAccumulator = 0;
    provide(ShortcutKey, { activePanelId, activePath });
    const resolveActiveTarget = (interaction) => {
      for (const key of activeKeys) {
        const panels = TweakStore3.getPanels();
        for (const panel of panels) {
          for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
            if (!shortcut.key) continue;
            if (shortcut.key.toLowerCase() !== key) continue;
            if ((shortcut.interaction ?? "scroll") !== interaction) continue;
            const control = TweakStore3.getPanel(panel.id)?.controls ? findControl(panel.controls, path) : null;
            if (control && control.type === "slider") {
              return { panelId: panel.id, path, control, shortcut };
            }
          }
        }
      }
      return null;
    };
    const handleKeyDown = (e) => {
      if (isInputFocused()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeys.size > 0) {
          const target2 = resolveActiveTarget("scroll") || resolveActiveTarget("drag") || resolveActiveTarget("move");
          if (target2 && target2.control.type === "slider") {
            e.preventDefault();
            const direction = key === "arrowright" || key === "arrowup" ? 1 : -1;
            const effectiveStep = getEffectiveStep(target2.control, target2.shortcut);
            applySliderDelta(target2.panelId, target2.path, target2.control, effectiveStep, direction);
            return;
          }
        }
      }
      const wasAlreadyHeld = activeKeys.has(key);
      activeKeys.add(key);
      const modifier = getActiveModifier(e);
      const target = TweakStore3.resolveShortcutTarget(key, modifier);
      if (target) {
        activePanelId.value = target.panelId;
        activePath.value = target.path;
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = TweakStore3.getValue(target.panelId, target.path);
          TweakStore3.updateValue(target.panelId, target.path, !currentValue);
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
        activePanelId.value = null;
        activePath.value = null;
      } else {
        let found = false;
        for (const remainingKey of activeKeys) {
          const modifier = getActiveModifier(e);
          const target = TweakStore3.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            activePanelId.value = target.panelId;
            activePath.value = target.path;
            found = true;
            break;
          }
        }
        if (!found) {
          activePanelId.value = null;
          activePath.value = null;
        }
      }
    };
    const handleWheel = (e) => {
      if (isInputFocused()) return;
      const modifier = getActiveModifier(e);
      if (activeKeys.size > 0) {
        for (const key of activeKeys) {
          const target = TweakStore3.resolveShortcutTarget(key, modifier);
          if (!target) continue;
          const { panelId, path, control } = target;
          const interaction = control.shortcut?.interaction ?? "scroll";
          if (interaction !== "scroll" || control.type !== "slider") continue;
          e.preventDefault();
          const effectiveStep = getEffectiveStep(control, control.shortcut);
          const direction = e.deltaY > 0 ? 1 : -1;
          applySliderDelta(panelId, path, control, effectiveStep, direction);
          return;
        }
      }
      const scrollOnlyTargets = TweakStore3.resolveScrollOnlyTargets();
      for (const { panelId, path, control, shortcut } of scrollOnlyTargets) {
        if (control.type !== "slider") continue;
        e.preventDefault();
        const effectiveStep = getEffectiveStep(control, shortcut);
        const direction = e.deltaY > 0 ? 1 : -1;
        applySliderDelta(panelId, path, control, effectiveStep, direction);
        return;
      }
    };
    const handleMouseDown = (e) => {
      if (isInputFocused()) return;
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
      if (isInputFocused()) return;
      if (activeKeys.size === 0) return;
      if (isDragging) {
        const target = resolveActiveTarget("drag");
        if (target && lastMouseX !== null) {
          const deltaX = e.clientX - lastMouseX;
          lastMouseX = e.clientX;
          dragAccumulator += deltaX;
          const effectiveStep = getEffectiveStep(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulator -= steps * DRAG_SENSITIVITY;
            applySliderDelta(target.panelId, target.path, target.control, effectiveStep, steps);
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
        const effectiveStep = getEffectiveStep(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulator -= steps * DRAG_SENSITIVITY;
          applySliderDelta(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep, steps);
        }
      }
    };
    const handleWindowBlur = () => {
      activeKeys.clear();
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
      activePanelId.value = null;
      activePath.value = null;
    };
    onMounted11(() => {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("blur", handleWindowBlur);
    });
    onUnmounted5(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    });
    return () => slots.default?.();
  }
});

// src/vue/components/Slider.ts
import { defineComponent as defineComponent15, h as h14, computed as computed7, nextTick as nextTick5, onMounted as onMounted12, onUnmounted as onUnmounted6, ref as ref15, watch as watch10 } from "vue";
import { animate as animate3, motionValue as motionValue2 } from "motion-v";
import { decimalsForStep as decimalsForStep3, roundValue as roundValue3, snapToDecile, formatSliderShortcut } from "tweakers/shortcut-utils";
var CLICK_THRESHOLD3 = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var DETENT_PX = 6;
var Slider = defineComponent15({
  name: "TweakersSlider",
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    unit: { type: String, required: false },
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin: { type: Number, required: false, default: void 0 },
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar: { type: Boolean, default: false },
    /**
     * `vertical` renders the column card: fill grows bottom-up, label sits at
     * the base, and the value readout appears over the fill on hover/drag.
     */
    orientation: { type: String, default: "horizontal" },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const min = computed7(() => props.min ?? 0);
    const max = computed7(() => props.max ?? 1);
    const step = computed7(() => props.step ?? 0.01);
    const isVertical = computed7(() => props.orientation === "vertical");
    const resolvedOrigin = computed7(
      () => Math.min(max.value, Math.max(min.value, props.origin ?? (props.bipolar ? 0 : min.value)))
    );
    const hasOrigin = computed7(() => resolvedOrigin.value > min.value);
    const originPercent = computed7(
      () => (resolvedOrigin.value - min.value) / (max.value - min.value) * 100
    );
    const wrapperRef = ref15(null);
    const cardRef = ref15(null);
    const fillRef = ref15(null);
    const handleRef = ref15(null);
    const inputRef = ref15(null);
    const isInteracting = ref15(false);
    const isDragging = ref15(false);
    const isHovered = ref15(false);
    const isValueHovered = ref15(false);
    const isMetaHeld = ref15(false);
    const isValueEditable = ref15(false);
    const showInput = ref15(false);
    const inputValue = ref15("");
    const fillPercent = motionValue2((props.value - min.value) / (max.value - min.value) * 100);
    const rubberStretchPx = motionValue2(0);
    const handleOpacityMv = motionValue2(0);
    const percentage = computed7(() => (props.value - min.value) / (max.value - min.value) * 100);
    const isActive = computed7(() => isInteracting.value || isHovered.value);
    const displayValue = computed7(() => props.value.toFixed(decimalsForStep3(step.value)));
    let pointerDownPos = null;
    let isClickFlag = true;
    let wrapperRect = null;
    let scaleVal = 1;
    let hoverTimeout = null;
    let wheelValue = props.value;
    let snapAnim = null;
    let rubberAnim = null;
    let handleOpacityAnim = null;
    const fillStart = (pct) => hasOrigin.value ? `${Math.min(pct, originPercent.value)}%` : "0%";
    const fillExtent = (pct) => hasOrigin.value ? `${Math.abs(pct - originPercent.value)}%` : `${pct}%`;
    const handleLeft = (pct) => `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`;
    const applyFillStyles = (pct) => {
      if (fillRef.value) {
        if (isVertical.value) {
          fillRef.value.style.bottom = fillStart(pct);
          fillRef.value.style.height = fillExtent(pct);
        } else {
          fillRef.value.style.left = fillStart(pct);
          fillRef.value.style.width = fillExtent(pct);
        }
      }
      if (handleRef.value) handleRef.value.style.left = handleLeft(pct);
    };
    const trackExtent = () => {
      const el = wrapperRef.value;
      if (!el) return 0;
      return isVertical.value ? el.offsetHeight : el.offsetWidth;
    };
    const applyDetent = (v) => {
      if (!hasOrigin.value) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = DETENT_PX / extent * (max.value - min.value);
      return Math.abs(v - resolvedOrigin.value) <= detentValue ? resolvedOrigin.value : v;
    };
    const applyRubberStyles = (stretch) => {
      if (!cardRef.value) return;
      const size = `calc(100% + ${Math.abs(stretch)}px)`;
      const shift = `${stretch < 0 ? stretch : 0}px`;
      if (isVertical.value) {
        cardRef.value.style.height = size;
        cardRef.value.style.transform = `translateY(${shift})`;
      } else {
        cardRef.value.style.width = size;
        cardRef.value.style.transform = `translateX(${shift})`;
      }
    };
    const applyHandleOpacity = (opacity) => {
      if (handleRef.value) handleRef.value.style.opacity = String(opacity);
    };
    const positionToValue = (clientX, clientY) => {
      if (!wrapperRect) return props.value;
      const screenPos = isVertical.value ? clientY - wrapperRect.top : clientX - wrapperRect.left;
      const scenePos = screenPos / scaleVal;
      const nativeExtent = trackExtent() || (isVertical.value ? wrapperRect.height : wrapperRect.width);
      let pct = Math.max(0, Math.min(1, scenePos / nativeExtent));
      if (isVertical.value) pct = 1 - pct;
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };
    const percentFromValue = (value) => (value - min.value) / (max.value - min.value) * 100;
    const computeRubberStretch = (clientPos, sign) => {
      if (!wrapperRect) return 0;
      const nearEdge = isVertical.value ? wrapperRect.top : wrapperRect.left;
      const farEdge = isVertical.value ? wrapperRect.bottom : wrapperRect.right;
      const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
    };
    const handlePointerDown = (event) => {
      if (showInput.value) return;
      if (event.metaKey) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;
      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical.value ? wrapperRect.height : wrapperRect.width;
        scaleVal = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    };
    const handlePointerMove = (event) => {
      if (!isInteracting.value || !pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickFlag && distance > CLICK_THRESHOLD3) {
        isClickFlag = false;
        isDragging.value = true;
      }
      if (!isClickFlag) {
        if (wrapperRect) {
          const clientPos = isVertical.value ? event.clientY : event.clientX;
          const nearEdge = isVertical.value ? wrapperRect.top : wrapperRect.left;
          const farEdge = isVertical.value ? wrapperRect.bottom : wrapperRect.right;
          if (clientPos < nearEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
          } else if (clientPos > farEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }
        const nextValue = applyDetent(positionToValue(event.clientX, event.clientY));
        const nextPct = percentFromValue(nextValue);
        if (snapAnim) {
          snapAnim.stop();
          snapAnim = null;
        }
        fillPercent.jump(nextPct);
        emit("change", roundValue3(nextValue, step.value));
      }
    };
    const handlePointerUp = (event) => {
      if (!isInteracting.value) return;
      if (isClickFlag) {
        const rawValue = positionToValue(event.clientX, event.clientY);
        const discreteSteps2 = (max.value - min.value) / step.value;
        const snappedValue = discreteSteps2 <= 10 ? Math.max(min.value, Math.min(max.value, min.value + Math.round((rawValue - min.value) / step.value) * step.value)) : snapToDecile(rawValue, min.value, max.value);
        const nextPct = percentFromValue(snappedValue);
        snapAnim?.stop();
        snapAnim = animate3(fillPercent, nextPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            snapAnim = null;
          }
        });
        emit("change", roundValue3(snappedValue, step.value));
      }
      if (rubberStretchPx.get() !== 0) {
        rubberAnim?.stop();
        rubberAnim = animate3(rubberStretchPx, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15
        });
      }
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
    };
    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      rubberStretchPx.jump(0);
      pointerDownPos = null;
    };
    const handleWheel = (event) => {
      if (showInput.value) return;
      event.preventDefault();
      event.stopPropagation();
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (raw === 0) return;
      const stepMultiplier = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step.value * stepMultiplier;
      const next = roundValue3(
        Math.max(min.value, Math.min(max.value, wheelValue + delta)),
        step.value
      );
      wheelValue = next;
      if (snapAnim) {
        snapAnim.stop();
        snapAnim = null;
      }
      fillPercent.jump(percentFromValue(next));
      emit("change", next);
    };
    const syncMetaHeld = (event) => {
      isMetaHeld.value = event.metaKey;
    };
    const clearMetaHeld = () => {
      isMetaHeld.value = false;
    };
    const unbindMetaKeys = () => {
      window.removeEventListener("keydown", syncMetaHeld);
      window.removeEventListener("keyup", syncMetaHeld);
      window.removeEventListener("blur", clearMetaHeld);
    };
    const handleInputSubmit = () => {
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const clamped = Math.max(min.value, Math.min(max.value, parsed));
        emit("change", roundValue3(clamped, step.value));
      }
      showInput.value = false;
      isValueHovered.value = false;
      isValueEditable.value = false;
    };
    const handleValueClick = (event) => {
      if (!isValueEditable.value && !event.metaKey) return;
      event.stopPropagation();
      event.preventDefault();
      showInput.value = true;
      inputValue.value = props.value.toFixed(decimalsForStep3(step.value));
    };
    const handleInputKeydown = (event) => {
      if (event.key === "Enter") {
        handleInputSubmit();
      } else if (event.key === "Escape") {
        showInput.value = false;
        isValueHovered.value = false;
      }
    };
    watch10(() => props.value, (next) => {
      wheelValue = next;
      if (!isInteracting.value && !snapAnim) {
        fillPercent.jump(percentage.value);
      }
    });
    watch10(isHovered, (hovered) => {
      if (!hovered) {
        unbindMetaKeys();
        isMetaHeld.value = false;
        return;
      }
      window.addEventListener("keydown", syncMetaHeld);
      window.addEventListener("keyup", syncMetaHeld);
      window.addEventListener("blur", clearMetaHeld);
    });
    watch10(isDragging, (dragging) => {
      handleOpacityAnim?.stop();
      handleOpacityAnim = animate3(handleOpacityMv, dragging ? 0.9 : 0, { duration: 0.15 });
    });
    watch10([isValueHovered, showInput, isValueEditable], () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      if (isValueHovered.value && !showInput.value && !isValueEditable.value) {
        hoverTimeout = setTimeout(() => {
          isValueEditable.value = true;
        }, 800);
      } else if (!isValueHovered.value && !showInput.value) {
        isValueEditable.value = false;
      }
    });
    watch10(showInput, async (visible) => {
      if (!visible) return;
      await nextTick5();
      inputRef.value?.focus();
      inputRef.value?.select();
    });
    const discreteSteps = computed7(() => (max.value - min.value) / step.value);
    const hashMarks = computed7(() => {
      const marks = [];
      if (discreteSteps.value <= 10) {
        const count = Math.max(0, Math.floor(discreteSteps.value) - 1);
        for (let i = 0; i < count; i += 1) {
          const pct = (i + 1) * step.value / (max.value - min.value) * 100;
          marks.push(h14("div", { class: "tweakers-slider-hashmark", style: { left: `${pct}%` } }));
        }
        return marks;
      }
      for (let i = 0; i < 9; i += 1) {
        const pct = (i + 1) * 10;
        marks.push(h14("div", { class: "tweakers-slider-hashmark", style: { left: `${pct}%` } }));
      }
      return marks;
    });
    let unsubFill = null;
    let unsubRubber = null;
    let unsubHandleOpacity = null;
    onMounted12(() => {
      unsubFill = fillPercent.on("change", applyFillStyles);
      unsubRubber = rubberStretchPx.on("change", applyRubberStyles);
      unsubHandleOpacity = handleOpacityMv.on("change", applyHandleOpacity);
      applyFillStyles(fillPercent.get());
      applyRubberStyles(rubberStretchPx.get());
      applyHandleOpacity(handleOpacityMv.get());
      wrapperRef.value?.addEventListener("wheel", handleWheel, { passive: false });
    });
    onUnmounted6(() => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      snapAnim?.stop();
      rubberAnim?.stop();
      handleOpacityAnim?.stop();
      wrapperRef.value?.removeEventListener("wheel", handleWheel);
      unbindMetaKeys();
      unsubFill?.();
      unsubRubber?.();
      unsubHandleOpacity?.();
    });
    const cardClassName = computed7(
      () => [
        "tweakers-slider",
        isVertical.value ? "tweakers-slider-vertical" : "",
        isActive.value ? "tweakers-slider-active" : "",
        isInteracting.value ? "tweakers-slider-engaged" : "",
        isMetaHeld.value ? "tweakers-slider-text-mode" : ""
      ].filter(Boolean).join(" ")
    );
    const cardProps = () => ({
      ref: cardRef,
      class: cardClassName.value,
      "data-origin": hasOrigin.value ? "true" : void 0,
      onPointerdown: handlePointerDown,
      onPointermove: handlePointerMove,
      onPointerup: handlePointerUp,
      onPointercancel: handlePointerCancel,
      // Read ⌘ on entry too: the key listeners only exist while hovered, so a
      // key already held before the pointer arrived would go unseen.
      onMouseenter: (e) => {
        isHovered.value = true;
        isMetaHeld.value = e.metaKey;
      },
      onMouseleave: () => {
        isHovered.value = false;
      }
    });
    const renderInput = (className) => h14("input", {
      ref: inputRef,
      type: "text",
      class: className,
      value: inputValue.value,
      onInput: (event) => {
        inputValue.value = event.target.value;
      },
      onKeydown: handleInputKeydown,
      onBlur: handleInputSubmit,
      onClick: (event) => event.stopPropagation(),
      onPointerdown: (event) => event.stopPropagation()
    });
    const renderValueSpan = (className) => h14("span", {
      class: `${className} ${isValueEditable.value ? "tweakers-slider-value-editable" : ""}`,
      onMouseenter: () => {
        isValueHovered.value = true;
      },
      onMouseleave: () => {
        isValueHovered.value = false;
      },
      onClick: handleValueClick,
      onPointerdown: (event) => {
        if (isValueEditable.value) event.stopPropagation();
      },
      style: { cursor: isValueEditable.value || isMetaHeld.value ? "text" : "default" }
    }, [
      displayValue.value,
      props.unit ? h14("span", { class: "tweakers-slider-unit" }, props.unit) : null
    ]);
    const renderLabel = (className) => h14("span", { class: className }, [
      props.label,
      props.shortcut ? h14("span", {
        class: `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`
      }, formatSliderShortcut(props.shortcut)) : null
    ]);
    return () => {
      if (isVertical.value) {
        return h14("div", { ref: wrapperRef, class: "tweakers-slider-wrapper tweakers-slider-wrapper-vertical" }, [
          h14("div", cardProps(), [
            h14("div", { class: "tweakers-slider-fill-area" }, [
              h14("div", {
                ref: fillRef,
                class: "tweakers-slider-fill-vertical",
                style: {
                  bottom: fillStart(fillPercent.get()),
                  height: fillExtent(fillPercent.get())
                }
              })
            ]),
            showInput.value ? renderInput("tweakers-slider-input tweakers-slider-input-vertical") : renderValueSpan("tweakers-slider-value-vertical"),
            renderLabel("tweakers-slider-label-vertical")
          ])
        ]);
      }
      return h14("div", { ref: wrapperRef, class: "tweakers-slider-wrapper" }, [
        h14("div", cardProps(), [
          h14("div", { class: "tweakers-slider-track" }, [
            h14("div", {
              ref: fillRef,
              class: "tweakers-slider-fill",
              style: {
                left: fillStart(fillPercent.get()),
                width: fillExtent(fillPercent.get())
              }
            }),
            h14("div", {
              ref: handleRef,
              class: "tweakers-slider-handle",
              style: {
                left: handleLeft(fillPercent.get()),
                opacity: handleOpacityMv.get()
              }
            })
          ]),
          h14("div", { class: "tweakers-slider-hashmarks" }, hashMarks.value),
          renderLabel("tweakers-slider-label"),
          showInput.value ? renderInput("tweakers-slider-input") : renderValueSpan("tweakers-slider-value")
        ])
      ]);
    };
  }
});

// src/vue/components/SpringControl.ts
import { defineComponent as defineComponent17, h as h16, onMounted as onMounted13, onUnmounted as onUnmounted7, ref as ref16 } from "vue";
import { TweakStore as TweakStore4 } from "tweakers/store";

// src/vue/components/SpringVisualization.ts
import { defineComponent as defineComponent16, h as h15, computed as computed8 } from "vue";
function generateSpringCurve(stiffness, damping, mass, duration) {
  const points = [];
  const steps = 100;
  const dt = duration / steps;
  let position = 0;
  let velocity = 0;
  const target = 1;
  for (let i = 0; i <= steps; i += 1) {
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
var SpringVisualization = defineComponent16({
  name: "TweakersSpringVisualization",
  props: {
    spring: {
      type: Object,
      required: true
    },
    isSimpleMode: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const width = 256;
    const height = 140;
    const pathData = computed8(() => {
      let stiffness;
      let damping;
      let mass;
      if (props.isSimpleMode) {
        const visualDuration = props.spring.visualDuration ?? 0.3;
        const bounce = props.spring.bounce ?? 0.2;
        mass = 1;
        stiffness = (2 * Math.PI / visualDuration) ** 2;
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
      return points.map(([time, value], index) => {
        const x = time / duration * width;
        const normalizedValue = (value - minValue) / (valueRange || 1);
        const y = height - (normalizedValue * height * 0.6 + height * 0.2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" ");
    });
    return () => h15("svg", { viewBox: `0 0 ${width} ${height}`, class: "tweakers-spring-viz" }, [
      ...Array.from({ length: 3 }).flatMap((_, index) => {
        const lineIndex = index + 1;
        const x = width / 4 * lineIndex;
        const y = height / 4 * lineIndex;
        return [
          h15("line", { x1: x, y1: 0, x2: x, y2: height, stroke: "rgba(255, 255, 255, 0.08)", "stroke-width": 1 }),
          h15("line", { x1: 0, y1: y, x2: width, y2: y, stroke: "rgba(255, 255, 255, 0.08)", "stroke-width": 1 })
        ];
      }),
      h15("line", {
        x1: 0,
        y1: height / 2,
        x2: width,
        y2: height / 2,
        stroke: "rgba(255, 255, 255, 0.15)",
        "stroke-width": 1,
        "stroke-dasharray": "4,4"
      }),
      h15("path", {
        d: pathData.value,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      })
    ]);
  }
});

// src/vue/components/SpringControl.ts
var SpringControl = defineComponent17({
  name: "TweakersSpringControl",
  props: {
    panelId: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    spring: {
      type: Object,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const mode = ref16(TweakStore4.getSpringMode(props.panelId, props.path));
    let unsub;
    onMounted13(() => {
      unsub = TweakStore4.subscribe(props.panelId, () => {
        mode.value = TweakStore4.getSpringMode(props.panelId, props.path);
      });
    });
    onUnmounted7(() => {
      unsub?.();
    });
    const isSimpleMode = () => mode.value === "simple";
    const cache = {
      simple: props.spring.visualDuration !== void 0 ? { ...props.spring } : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
      advanced: props.spring.stiffness !== void 0 ? { ...props.spring } : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
    };
    const handleModeChange = (nextMode) => {
      if (isSimpleMode()) {
        cache.simple = { ...props.spring };
      } else {
        cache.advanced = { ...props.spring };
      }
      TweakStore4.updateSpringMode(props.panelId, props.path, nextMode);
      if (nextMode === "simple") {
        emit("change", cache.simple);
      } else {
        emit("change", cache.advanced);
      }
    };
    const handleUpdate = (key, value) => {
      if (isSimpleMode()) {
        const { stiffness, damping, mass, ...rest } = props.spring;
        emit("change", { ...rest, [key]: value });
      } else {
        const { visualDuration, bounce, ...rest } = props.spring;
        emit("change", { ...rest, [key]: value });
      }
    };
    return () => h16(Folder, { title: props.label, defaultOpen: true }, {
      default: () => [
        h16("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
          h16(SpringVisualization, { spring: props.spring, isSimpleMode: isSimpleMode() }),
          h16("div", { class: "tweakers-labeled-control" }, [
            h16("span", { class: "tweakers-labeled-control-label" }, "Type"),
            h16(SegmentedControl, {
              options: [
                { value: "simple", label: "Time" },
                { value: "advanced", label: "Physics" }
              ],
              value: mode.value,
              onChange: handleModeChange
            })
          ]),
          ...isSimpleMode() ? [
            h16(Slider, {
              label: "Duration",
              value: props.spring.visualDuration ?? 0.3,
              min: 0.1,
              max: 1,
              step: 0.05,
              unit: "s",
              onChange: (next) => handleUpdate("visualDuration", next)
            }),
            h16(Slider, {
              label: "Bounce",
              value: props.spring.bounce ?? 0.2,
              min: 0,
              max: 1,
              step: 0.05,
              onChange: (next) => handleUpdate("bounce", next)
            })
          ] : [
            h16(Slider, {
              label: "Stiffness",
              value: props.spring.stiffness ?? 400,
              min: 1,
              max: 1e3,
              step: 10,
              onChange: (next) => handleUpdate("stiffness", next)
            }),
            h16(Slider, {
              label: "Damping",
              value: props.spring.damping ?? 17,
              min: 1,
              max: 100,
              step: 1,
              onChange: (next) => handleUpdate("damping", next)
            }),
            h16(Slider, {
              label: "Mass",
              value: props.spring.mass ?? 1,
              min: 0.1,
              max: 10,
              step: 0.1,
              onChange: (next) => handleUpdate("mass", next)
            })
          ]
        ])
      ]
    });
  }
});

// src/vue/components/TextControl.ts
import { defineComponent as defineComponent18, h as h17, ref as ref17 } from "vue";
var textControlInstance = 0;
var TextControl = defineComponent18({
  name: "TweakersTextControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    placeholder: { type: String, required: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const inputId = ref17(`tweakers-text-${++textControlInstance}`);
    return () => h17("div", { class: "tweakers-text-control" }, [
      h17("label", { class: "tweakers-text-label", for: inputId.value }, props.label),
      h17("input", {
        id: inputId.value,
        type: "text",
        class: "tweakers-text-input",
        value: props.value,
        placeholder: props.placeholder,
        onInput: (event) => emit("change", event.target.value)
      })
    ]);
  }
});

// src/vue/components/Toggle.ts
import { defineComponent as defineComponent19, h as h18 } from "vue";
import { formatToggleShortcut } from "tweakers/shortcut-utils";
var Toggle = defineComponent19({
  name: "TweakersToggle",
  props: {
    label: { type: String, required: true },
    checked: { type: Boolean, required: true },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h18("div", { class: "tweakers-labeled-control tweakers-labeled-control-check" }, [
      h18(Checkbox, {
        checked: props.checked,
        label: props.label,
        onChange: (next) => emit("change", next)
      }),
      h18("span", { class: "tweakers-labeled-control-label" }, [
        props.label,
        props.shortcut ? h18("span", {
          class: `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`
        }, formatToggleShortcut(props.shortcut)) : null
      ])
    ]);
  }
});

// src/vue/components/TransitionControl.ts
import { defineComponent as defineComponent21, h as h20, onMounted as onMounted14, onUnmounted as onUnmounted8, ref as ref18 } from "vue";
import { TweakStore as TweakStore5 } from "tweakers/store";

// src/vue/components/EasingVisualization.ts
import { defineComponent as defineComponent20, h as h19, computed as computed9 } from "vue";
var EasingVisualization = defineComponent20({
  name: "TweakersEasingVisualization",
  props: {
    easing: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const size = 200;
    const pad = 10;
    const inner = size - pad * 2;
    const unit = inner / 2;
    const curve = computed9(() => {
      const [x1, y1, x2, y2] = props.easing.ease;
      const toSvg = (nx, ny) => ({
        x: pad + (nx + 0.5) * unit,
        y: pad + (1.5 - ny) * unit
      });
      const start = toSvg(0, 0);
      const end = toSvg(1, 1);
      const p1 = toSvg(x1, y1);
      const p2 = toSvg(x2, y2);
      return `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
    });
    return () => h19("svg", {
      viewBox: `0 0 ${size} ${size}`,
      preserveAspectRatio: "xMidYMid slice",
      class: "tweakers-spring-viz tweakers-easing-viz"
    }, [
      h19("line", {
        x1: pad + (0 + 0.5) * unit,
        y1: pad + (1.5 - 0) * unit,
        x2: pad + (1 + 0.5) * unit,
        y2: pad + (1.5 - 1) * unit,
        stroke: "rgba(255, 255, 255, 0.15)",
        "stroke-width": 1,
        "stroke-dasharray": "4,4"
      }),
      h19("path", {
        d: curve.value,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 2,
        "stroke-linecap": "round"
      })
    ]);
  }
});

// src/vue/components/TransitionControl.ts
function formatEase(ease) {
  return ease.map((value) => Number(value.toFixed(2))).join(", ");
}
function parseEase(value) {
  const parts = value.split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
    return parts;
  }
  return null;
}
var EaseTextInput = defineComponent21({
  name: "TweakersEaseTextInput",
  props: {
    ease: {
      type: Array,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const editing = ref18(false);
    const draft = ref18("");
    const handleFocus = () => {
      draft.value = formatEase(props.ease);
      editing.value = true;
    };
    const handleBlur = () => {
      const parsed = parseEase(draft.value);
      if (parsed) props.onChange(parsed);
      editing.value = false;
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    };
    return () => h20("div", { class: "tweakers-labeled-control" }, [
      h20("span", { class: "tweakers-labeled-control-label" }, "Ease"),
      h20("input", {
        type: "text",
        class: "tweakers-text-input",
        value: editing.value ? draft.value : formatEase(props.ease),
        spellcheck: false,
        onInput: (event) => {
          draft.value = event.target.value;
        },
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeydown
      })
    ]);
  }
});
var TransitionControl = defineComponent21({
  name: "TweakersTransitionControl",
  props: {
    panelId: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    value: {
      type: Object,
      required: true
    },
    hideDuration: { type: Boolean, default: false },
    durationControl: Object
  },
  emits: ["change"],
  setup(props, { emit }) {
    const mode = ref18(TweakStore5.getTransitionMode(props.panelId, props.path));
    let unsub;
    onMounted14(() => {
      unsub = TweakStore5.subscribe(props.panelId, () => {
        mode.value = TweakStore5.getTransitionMode(props.panelId, props.path);
      });
    });
    onUnmounted8(() => unsub?.());
    const cache = {
      easing: props.value.type === "easing" ? { ...props.value } : { type: "easing", duration: 0.3, ease: [1, -0.4, 0.5, 1] },
      simple: props.value.type === "spring" && props.value.visualDuration !== void 0 ? { ...props.value } : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
      advanced: props.value.type === "spring" && props.value.stiffness !== void 0 ? { ...props.value } : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
    };
    const spring = () => {
      if (props.value.type === "spring") {
        if (mode.value === "simple") cache.simple = props.value;
        else if (mode.value === "advanced") cache.advanced = props.value;
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
    const handleModeChange = (nextMode) => {
      TweakStore5.updateTransitionMode(props.panelId, props.path, nextMode);
      if (nextMode === "easing") {
        emit("change", cache.easing);
      } else if (nextMode === "simple") {
        emit("change", cache.simple);
      } else {
        emit("change", cache.advanced);
      }
    };
    const updateEase = (index, value) => {
      const current = easing();
      const next = [...current.ease];
      next[index] = value;
      emit("change", { ...current, ease: next });
    };
    const handleSpringUpdate = (key, value) => {
      const current = spring();
      if (mode.value === "simple") {
        const { stiffness, damping, mass, ...rest } = current;
        emit("change", { ...rest, [key]: value });
      } else {
        const { visualDuration, bounce, ...rest } = current;
        emit("change", { ...rest, [key]: value });
      }
    };
    return () => {
      const isEasing = mode.value === "easing";
      const isSimpleSpring = mode.value === "simple";
      const currentSpring = spring();
      const currentEasing = easing();
      const durationSlider = !props.hideDuration && (isEasing || isSimpleSpring) ? h20(Slider, {
        label: "Duration",
        value: props.durationControl?.value ?? (isEasing ? currentEasing.duration : currentSpring.visualDuration ?? 0.3),
        min: props.durationControl?.min ?? 0.1,
        max: props.durationControl?.max ?? (isEasing ? 2 : 1),
        step: props.durationControl?.step ?? 0.05,
        unit: "s",
        onChange: props.durationControl?.onChange ?? ((next) => {
          if (isEasing) emit("change", { ...currentEasing, duration: next });
          else handleSpringUpdate("visualDuration", next);
        })
      }) : null;
      return h20(Folder, { title: props.label, defaultOpen: true }, {
        default: () => [
          h20("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
            isEasing ? h20(EasingVisualization, { easing: currentEasing }) : h20(SpringVisualization, { spring: currentSpring, isSimpleMode: isSimpleSpring }),
            h20("div", { class: "tweakers-labeled-control" }, [
              h20("span", { class: "tweakers-labeled-control-label" }, "Type"),
              h20(SegmentedControl, {
                options: [
                  { value: "easing", label: "Easing" },
                  { value: "simple", label: "Time" },
                  { value: "advanced", label: "Physics" }
                ],
                value: mode.value,
                onChange: handleModeChange
              })
            ]),
            ...isEasing ? [
              h20(Slider, { label: "x1", value: currentEasing.ease[0], min: 0, max: 1, step: 0.01, onChange: (next) => updateEase(0, next) }),
              h20(Slider, { label: "y1", value: currentEasing.ease[1], min: -1, max: 2, step: 0.01, onChange: (next) => updateEase(1, next) }),
              h20(Slider, { label: "x2", value: currentEasing.ease[2], min: 0, max: 1, step: 0.01, onChange: (next) => updateEase(2, next) }),
              h20(Slider, { label: "y2", value: currentEasing.ease[3], min: -1, max: 2, step: 0.01, onChange: (next) => updateEase(3, next) }),
              h20(EaseTextInput, {
                ease: currentEasing.ease,
                onChange: (next) => emit("change", { ...currentEasing, ease: next })
              })
            ] : isSimpleSpring ? [
              h20(Slider, {
                label: "Bounce",
                value: currentSpring.bounce ?? 0.2,
                min: 0,
                max: 1,
                step: 0.05,
                onChange: (next) => handleSpringUpdate("bounce", next)
              })
            ] : [
              h20(Slider, {
                label: "Stiffness",
                value: currentSpring.stiffness ?? 400,
                min: 1,
                max: 1e3,
                step: 10,
                onChange: (next) => handleSpringUpdate("stiffness", next)
              }),
              h20(Slider, {
                label: "Damping",
                value: currentSpring.damping ?? 17,
                min: 1,
                max: 100,
                step: 1,
                onChange: (next) => handleSpringUpdate("damping", next)
              }),
              h20(Slider, {
                label: "Mass",
                value: currentSpring.mass ?? 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                onChange: (next) => handleSpringUpdate("mass", next)
              })
            ],
            durationSlider
          ])
        ]
      });
    };
  }
});

// src/vue/components/XYControl.ts
import { defineComponent as defineComponent23, h as h22 } from "vue";

// src/vue/components/XYPad.ts
import { computed as computed10, defineComponent as defineComponent22, h as h21, ref as ref19 } from "vue";
import { formatSliderShortcut as formatSliderShortcut2 } from "tweakers/shortcut-utils";
import {
  resolveAxis,
  valueFromPoint,
  pointFromValue,
  applyDetentAxis,
  nudge,
  centerValue,
  normalizeValue
} from "tweakers/xy-pad-core";
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
var XYPad = defineComponent22({
  name: "TweakersXYPad",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x: { type: Object, default: void 0 },
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y: { type: Object, default: void 0 },
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size: { type: Number, default: 160 },
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid: { type: [Boolean, Number], default: void 0 },
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density: { type: Number, default: 1 },
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap: { type: Boolean, default: false },
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter: { type: Boolean, default: false },
    /** Show the live value next to each axis label (default false = label only). */
    showValues: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue: { type: Function, default: void 0 },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const xAxis = computed10(() => resolveAxis(props.x));
    const yAxis = computed10(() => resolveAxis(props.y));
    const areaRef = ref19(null);
    let dragging = false;
    const active = ref19(false);
    const draggingState = ref19(false);
    const pointToValue = (clientX, clientY, fine) => {
      const el = areaRef.value;
      if (!el) return props.value;
      const rect = el.getBoundingClientRect();
      const xa = xAxis.value;
      const ya = yAxis.value;
      let px = (clientX - rect.left) / rect.width;
      let py = (clientY - rect.top) / rect.height;
      if (fine) {
        const cur = pointFromValue(props.value, xa, ya);
        px = cur.x + (px - cur.x) * FINE_DRAG;
        py = cur.y + (py - cur.y) * FINE_DRAG;
      }
      px = Math.min(1, Math.max(0, px));
      py = Math.min(1, Math.max(0, py));
      const next = valueFromPoint({ x: px, y: py }, xa, ya, props.snap);
      const originPoint = pointFromValue({ x: xa.origin, y: ya.origin }, xa, ya);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: applyDetentAxis(next.x, xa, dxPx),
        y: applyDetentAxis(next.y, ya, dyPx)
      };
    };
    const emitValue = (next) => {
      emit("change", next);
    };
    const handlePointerDown = (e) => {
      if (props.disabled) return;
      if (e.button !== 0 || !e.isPrimary) return;
      if (e.altKey) return;
      e.preventDefault();
      try {
        areaRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      areaRef.value?.focus();
      dragging = true;
      active.value = true;
      draggingState.value = true;
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };
    const handlePointerMove = (e) => {
      if (!dragging) return;
      if (e.buttons === 0) {
        finishDrag(e);
        return;
      }
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };
    const finishDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      draggingState.value = false;
      try {
        areaRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
      const el = areaRef.value;
      const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
      if (!stillActive) active.value = false;
      if (props.returnToCenter) {
        emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
      }
    };
    const handleKeyDown = (e) => {
      if (props.disabled) return;
      const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
      const cur = props.value;
      const xa = xAxis.value;
      const ya = yAxis.value;
      const ctrl = e.ctrlKey || e.metaKey;
      let next = null;
      switch (e.key) {
        case "ArrowUp":
          next = nudge(cur, "y", 1, xa, ya, mode);
          break;
        case "ArrowDown":
          next = nudge(cur, "y", -1, xa, ya, mode);
          break;
        case "ArrowRight":
          next = nudge(cur, "x", 1, xa, ya, mode);
          break;
        case "ArrowLeft":
          next = nudge(cur, "x", -1, xa, ya, mode);
          break;
        case "PageUp":
          next = nudge(cur, "y", 1, xa, ya, "coarse");
          break;
        case "PageDown":
          next = nudge(cur, "y", -1, xa, ya, "coarse");
          break;
        case "Home":
          next = ctrl ? { x: xa.min, y: ya.min } : { x: xa.min, y: cur.y };
          break;
        case "End":
          next = ctrl ? { x: xa.max, y: ya.max } : { x: xa.max, y: cur.y };
          break;
        default:
          return;
      }
      e.preventDefault();
      emitValue(next);
    };
    const reset = () => {
      if (props.disabled) return;
      emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
    };
    return () => {
      const xa = xAxis.value;
      const ya = yAxis.value;
      const value = props.value;
      const xLabel = props.x?.label ?? "X";
      const yLabel = props.y?.label ?? "Y";
      const xText = `${xLabel} ${formatComponent(value.x, xa)}`;
      const yText = `${yLabel} ${formatComponent(value.y, ya)}`;
      const xVisual = props.showValues ? xText : xLabel;
      const yVisual = props.showValues ? yText : yLabel;
      const readout = props.formatValue ? props.formatValue(value) : `${xText}  ${yText}`;
      const dens = typeof props.density === "number" && props.density > 0 ? props.density : 1;
      let baseX, baseY;
      if (props.grid === false) {
        baseX = 0;
        baseY = 0;
      } else if (typeof props.grid === "number") {
        baseX = props.grid;
        baseY = props.grid;
      } else {
        baseX = DEFAULT_GRID_X;
        baseY = DEFAULT_GRID_Y;
      }
      const gridX = baseX > 0 ? Math.round(baseX * dens) : 0;
      const gridY = baseY > 0 ? Math.round(baseY * dens) : 0;
      const showGrid = gridX > 0 && gridY > 0;
      const point = pointFromValue(value, xa, ya);
      const leftPct = `${point.x * 100}%`;
      const topPct = `${point.y * 100}%`;
      return h21("div", {
        class: "tweakers-xy",
        "data-active": String(active.value),
        "data-disabled": String(props.disabled)
      }, [
        h21("div", { class: "tweakers-xy-header" }, [
          h21("span", { class: "tweakers-xy-label" }, [
            props.label,
            props.shortcut ? h21("span", {
              class: `tweakers-shortcut-pill${props.shortcutActive ? " tweakers-shortcut-pill-active" : ""}`
            }, formatSliderShortcut2(props.shortcut)) : null
          ])
        ]),
        h21("div", {
          ref: areaRef,
          class: "tweakers-xy-area",
          // Only the height is fixed (from `size`); width is fluid (CSS width:100%),
          // so the pad grows to fill the container and is no longer forced square.
          style: { height: `${props.size}px` },
          role: "application",
          "aria-roledescription": "2D pad",
          "aria-label": props.label,
          "aria-valuetext": readout,
          "aria-valuemin": xa.min,
          "aria-valuemax": xa.max,
          "aria-valuenow": value.x,
          "aria-disabled": props.disabled || void 0,
          tabindex: props.disabled ? -1 : 0,
          "data-active": String(active.value),
          "data-dragging": String(draggingState.value),
          "data-disabled": String(props.disabled),
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onDblclick: reset,
          onClick: (e) => {
            if (e.altKey) reset();
          },
          onKeydown: handleKeyDown,
          onFocus: () => {
            active.value = true;
          },
          onBlur: () => {
            active.value = false;
          },
          onPointerenter: () => {
            active.value = true;
          },
          onPointerleave: () => {
            if (!dragging) active.value = false;
          }
        }, [
          showGrid ? h21("div", {
            class: "tweakers-xy-grid",
            "aria-hidden": "true",
            style: {
              "--tweak-xy-grid-step-x": `${100 / gridX}%`,
              "--tweak-xy-grid-step-y": `${100 / gridY}%`
            }
          }) : null,
          // Live axis labels, decorative (aria-valuetext owns the accessible string):
          // X along the bottom edge, Y up the left edge.
          h21("div", { class: "tweakers-xy-axis tweakers-xy-axis-x", "aria-hidden": "true" }, xVisual),
          h21("div", { class: "tweakers-xy-axis tweakers-xy-axis-y", "aria-hidden": "true" }, yVisual),
          // Crosshair guides tracking the thumb, revealed on data-active.
          h21("div", { class: "tweakers-xy-guide tweakers-xy-guide-v", "aria-hidden": "true", style: { left: leftPct } }),
          h21("div", { class: "tweakers-xy-guide tweakers-xy-guide-h", "aria-hidden": "true", style: { top: topPct } }),
          h21("div", { class: "tweakers-xy-thumb", "aria-hidden": "true", style: { left: leftPct, top: topPct } })
        ])
      ]);
    };
  }
});

// src/vue/components/XYControl.ts
var XYControl = defineComponent23({
  name: "TweakersXYControl",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    x: { type: Object, default: void 0 },
    y: { type: Object, default: void 0 },
    grid: { type: [Boolean, Number], default: void 0 },
    density: { type: Number, default: void 0 },
    snap: { type: Boolean, default: void 0 },
    returnToCenter: { type: Boolean, default: void 0 },
    showValues: { type: Boolean, default: void 0 },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h22(XYPad, {
      label: props.label,
      value: props.value,
      x: props.x,
      y: props.y,
      grid: props.grid,
      density: props.density,
      snap: props.snap,
      returnToCenter: props.returnToCenter,
      showValues: props.showValues,
      shortcut: props.shortcut,
      shortcutActive: props.shortcutActive,
      onChange: (next) => emit("change", next)
    });
  }
});

// src/vue/components/ControlRenderer.ts
var ControlRenderer = defineComponent24({
  name: "TweakersControlRenderer",
  props: {
    panelId: { type: String, required: true },
    controls: { type: Array, required: true },
    values: { type: Object, required: true },
    transitionDuration: Object
  },
  setup(props) {
    const shortcut = inject2(ShortcutKey, void 0);
    const isShortcutActive = (path) => shortcut?.activePanelId.value === props.panelId && shortcut.activePath.value === path;
    const hintId = (control) => hintDomId(props.panelId, control.path);
    const renderControlNode = (control) => {
      const value = props.values[control.path];
      switch (control.type) {
        case "slider":
          return h23(Slider, {
            key: control.path,
            label: control.label,
            value,
            min: control.min,
            max: control.max,
            step: control.step,
            orientation: control.orientation,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "number":
          return h23(NumberControl, {
            key: control.path,
            label: control.label,
            value,
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            orientation: control.orientation,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "range":
          return h23(RangeSlider, {
            key: control.path,
            label: control.label,
            value,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "toggle":
          return h23(Toggle, {
            key: control.path,
            label: control.label,
            checked: value,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "spring":
          return h23(SpringControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            spring: value,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "transition":
          return h23(TransitionControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            value,
            durationControl: props.transitionDuration,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "folder":
          if (control.module) {
            const enabledPath = `${control.path}._enabled`;
            return h23(ModuleFolder, {
              key: control.path,
              title: control.label,
              enabled: props.values[enabledPath],
              onEnabledChange: (next) => TweakStore6.updateValue(props.panelId, enabledPath, next),
              defaultOpen: control.defaultOpen ?? true,
              hint: control.hint,
              hintId: hintId(control)
            }, { default: () => (control.children ?? []).map(renderControl) });
          }
          return h23(Folder, {
            key: control.path,
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: hintId(control)
          }, { default: () => (control.children ?? []).map(renderControl) });
        case "text":
          return h23(TextControl, {
            key: control.path,
            label: control.label,
            value,
            placeholder: control.placeholder,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "select":
          return h23(SelectControl, {
            key: control.path,
            label: control.label,
            value,
            options: control.options ?? [],
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "color":
          return h23(ColorControl, {
            key: control.path,
            label: control.label,
            value,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "gradient":
          return h23(GradientControl, {
            key: control.path,
            label: control.label,
            value,
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "xy":
          return h23(XYControl, {
            key: control.path,
            label: control.label,
            value,
            x: control.xAxis,
            y: control.yAxis,
            grid: control.grid,
            density: control.density,
            snap: control.snap,
            returnToCenter: control.returnToCenter,
            showValues: control.showValues,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => TweakStore6.updateValue(props.panelId, control.path, next)
          });
        case "action":
          return h23("button", {
            key: control.path,
            class: "tweakers-button",
            // The wrapper greys every control out, but only a real `disabled`
            // takes a button out of the tab order too.
            disabled: TweakStore6.isDisabled(props.panelId, control.path),
            onClick: () => TweakStore6.triggerAction(props.panelId, control.path)
          }, control.label);
        default:
          return null;
      }
    };
    const renderControl = (control) => {
      const node = renderControlNode(control);
      if (control.type === "folder") return node;
      return h23(ControlShell, {
        key: control.path,
        hint: control.hint,
        title: control.path,
        id: hintId(control),
        affordance: control.affordance,
        panelId: props.panelId,
        path: control.path
      }, { default: () => node });
    };
    return () => h23(Fragment, null, props.controls.map(renderControl));
  }
});

// src/vue/components/PresetManager.ts
import { Teleport as Teleport5, defineComponent as defineComponent25, h as h24, ref as ref20, watch as watch11 } from "vue";
import { AnimatePresence as AnimatePresence5, motion as motion5 } from "motion-v";
import { ICON_CHEVRON as ICON_CHEVRON2, ICON_TRASH } from "tweakers/icons";
import { TweakStore as TweakStore7 } from "tweakers/store";
var PresetManager = defineComponent25({
  name: "TweakersPresetManager",
  props: {
    panelId: { type: String, required: true },
    presets: {
      type: Array,
      required: true
    },
    activePresetId: {
      type: String,
      required: false,
      default: null
    },
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode: { type: Boolean, default: false }
  },
  setup(props) {
    const isOpen = ref20(false);
    const pos = ref20({ top: 0, left: 0, width: 0 });
    const triggerRef = ref20(null);
    const dropdownRef = ref20(null);
    const hasPresets = () => props.presets.length > 0;
    const activePreset = () => props.presets.find((preset) => preset.id === props.activePresetId);
    const open = () => {
      if (!hasPresets()) return;
      const rect = triggerRef.value?.getBoundingClientRect();
      if (rect) {
        pos.value = { top: rect.bottom + 4, left: rect.left, width: rect.width };
      }
      isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };
    const setDropdownRef = (node) => {
      if (node instanceof HTMLElement) {
        dropdownRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        dropdownRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      dropdownRef.value = null;
    };
    const toggle = () => {
      if (isOpen.value) close();
      else open();
    };
    watch11(isOpen, (open2, _, onCleanup) => {
      if (!open2) return;
      const handler = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        close();
      };
      document.addEventListener("mousedown", handler);
      onCleanup(() => {
        document.removeEventListener("mousedown", handler);
      });
    });
    const handleSelect = (presetId) => {
      TweakStore7.selectPreset(props.panelId, presetId);
      close();
    };
    const handleDelete = (event, presetId) => {
      event.stopPropagation();
      TweakStore7.removePreset(props.panelId, presetId);
    };
    return () => h24("div", { class: "tweakers-preset-manager" }, [
      h24("button", {
        ref: triggerRef,
        class: "tweakers-preset-trigger",
        onClick: toggle,
        "data-open": String(isOpen.value),
        "data-has-preset": String(!!activePreset()),
        "data-disabled": String(!hasPresets())
      }, [
        h24("span", { class: "tweakers-preset-label" }, activePreset()?.name ?? (props.providerMode ? "Presets" : "Version 1")),
        h24(motion5.svg, {
          class: "tweakers-select-chevron",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          animate: { rotate: isOpen.value ? 180 : 0, opacity: hasPresets() ? 0.6 : 0.25 },
          transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 }
        }, [h24("path", { d: ICON_CHEVRON2 })])
      ]),
      h24(Teleport5, { to: "body" }, [
        h24(AnimatePresence5, null, {
          default: () => isOpen.value ? [h24(motion5.div, {
            key: "tweakers-preset-dropdown",
            ref: setDropdownRef,
            class: "tweakers-root tweakers-preset-dropdown",
            style: {
              position: "fixed",
              top: `${pos.value.top}px`,
              left: `${pos.value.left}px`,
              minWidth: `${pos.value.width}px`
            },
            initial: { opacity: 0, y: 4, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 }
          }, [
            ...props.providerMode ? [] : [h24("div", {
              class: "tweakers-preset-item",
              "data-active": String(!props.activePresetId),
              onClick: () => handleSelect(null)
            }, [h24("span", { class: "tweakers-preset-name" }, "Version 1")])],
            ...props.presets.map((preset) => h24("div", {
              key: preset.id,
              class: "tweakers-preset-item",
              "data-active": String(preset.id === props.activePresetId),
              onClick: () => handleSelect(preset.id)
            }, [
              h24("span", { class: "tweakers-preset-name" }, preset.name),
              ...preset.deletable ?? true ? [h24("button", {
                class: "tweakers-preset-delete",
                onClick: (event) => handleDelete(event, preset.id),
                title: "Delete preset"
              }, [
                h24("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, ICON_TRASH.map((d) => h24("path", { d })))
              ])] : []
            ]))
          ])] : []
        })
      ])
    ]);
  }
});

// src/vue/components/Panel.ts
var Panel = defineComponent26({
  name: "TweakersPanel",
  props: {
    panel: {
      type: Object,
      required: true
    },
    defaultOpen: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    },
    // Extra toolbar node injected after the built-in preset/copy controls —
    // used to surface the timeline visibility toggle in the panel header.
    toolbarExtra: Function
  },
  setup(props) {
    const values = ref21(TweakStore8.getValues(props.panel.id));
    const presets = ref21(TweakStore8.getPresetItems(props.panel.id));
    const activePresetId = ref21(TweakStore8.getActivePresetId(props.panel.id));
    const providerMode = ref21(TweakStore8.hasPresetProvider(props.panel.id));
    const copied = ref21(false);
    let unsubscribe;
    let copiedTimeout = null;
    onMounted15(() => {
      unsubscribe = TweakStore8.subscribe(props.panel.id, () => {
        values.value = TweakStore8.getValues(props.panel.id);
        presets.value = TweakStore8.getPresetItems(props.panel.id);
        activePresetId.value = TweakStore8.getActivePresetId(props.panel.id);
        providerMode.value = TweakStore8.hasPresetProvider(props.panel.id);
      });
    });
    onUnmounted9(() => {
      unsubscribe?.();
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
    });
    const handleAddPreset = () => TweakStore8.createPreset(props.panel.id);
    const handleCopy = () => {
      const json = JSON.stringify(values.value, null, 2);
      const instruction = `Update the useTweakers configuration for "${props.panel.name}" with these values:

\`\`\`json
${json}
\`\`\`

Apply these values as the new defaults in the useTweakers call.`;
      try {
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(instruction).catch(() => void 0);
        }
      } catch {
      }
      copied.value = true;
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
      copiedTimeout = window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };
    return () => {
      const toolbarNode = h25(Fragment2, null, [
        h25(motion6.button, {
          class: "tweakers-toolbar-add",
          onClick: handleAddPreset,
          title: "Add preset",
          whilePress: { scale: 0.9 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [
          h25("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, ICON_ADD_PRESET.map((d) => h25("path", { d })))
        ]),
        h25(PresetManager, {
          panelId: props.panel.id,
          presets: presets.value,
          activePresetId: activePresetId.value,
          providerMode: providerMode.value
        }),
        h25(motion6.button, {
          class: "tweakers-toolbar-copy",
          onClick: handleCopy,
          title: "Copy parameters",
          whilePress: { scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [
          h25("span", { class: "tweakers-toolbar-copy-icon-wrap" }, [
            h25("span", {
              class: "tweakers-toolbar-copy-icon",
              style: { opacity: copied.value ? 0 : 1, transition: "opacity 120ms ease" }
            }, [
              h25("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                width: 16,
                height: 16
              }, [
                h25("path", {
                  d: ICON_CLIPBOARD.board,
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linejoin": "round"
                }),
                h25("path", {
                  d: ICON_CLIPBOARD.sparkle,
                  fill: "currentColor"
                }),
                h25("path", {
                  d: ICON_CLIPBOARD.body,
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ])
            ]),
            h25(AnimatePresence6, { initial: false, mode: "popLayout" }, {
              default: () => copied.value ? [h25(motion6.span, {
                key: "check",
                class: "tweakers-toolbar-copy-icon",
                initial: { scale: 0.5, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.5, opacity: 0 },
                transition: { type: "spring", visualDuration: 0.3, bounce: 0.2 }
              }, [
                h25("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  width: 16,
                  height: 16
                }, [h25("path", { d: ICON_CHECK })])
              ])] : []
            })
          ])
        ]),
        props.toolbarExtra?.()
      ]);
      return h25("div", { class: "tweakers-panel-wrapper" }, [
        h25(Folder, {
          title: props.panel.name,
          defaultOpen: props.defaultOpen,
          isRoot: true,
          inline: props.inline,
          enabled: props.panel.module ? values.value["_enabled"] : void 0,
          onEnabledChange: props.panel.module ? (v) => TweakStore8.updateValue(props.panel.id, "_enabled", v) : void 0,
          toolbar: () => TweakStore8.arePresetsHidden(props.panel.id) ? h25(Fragment2, null, [props.toolbarExtra?.()]) : toolbarNode
        }, {
          default: () => [
            h25(ControlRenderer, {
              panelId: props.panel.id,
              controls: props.panel.controls,
              values: values.value
            })
          ]
        })
      ]);
    };
  }
});

// src/vue/components/Timeline/TimelineToggleButton.ts
import { defineComponent as defineComponent27, h as h26, onMounted as onMounted16, onUnmounted as onUnmounted10, ref as ref22 } from "vue";
import { ICON_TIMELINE } from "tweakers/icons";
import { TimelineUiStore } from "tweakers/timeline";
var TimelineToggleButton = defineComponent27({
  name: "TweakersTimelineToggleButton",
  setup() {
    const visible = ref22(TimelineUiStore.getVisible());
    let unsubscribe;
    onMounted16(() => {
      unsubscribe = TimelineUiStore.subscribe(() => {
        visible.value = TimelineUiStore.getVisible();
      });
    });
    onUnmounted10(() => unsubscribe?.());
    return () => {
      const label = visible.value ? "Hide timeline" : "Show timeline";
      return h26("button", {
        class: "tweakers-toolbar-add tweakers-timeline-toolbar-toggle",
        "data-active": visible.value || void 0,
        "aria-pressed": visible.value,
        "aria-label": label,
        title: label,
        onClick: () => TimelineUiStore.toggle()
      }, [
        h26(
          "svg",
          { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
          ICON_TIMELINE.map((path) => h26("path", { d: path, fill: "currentColor" }))
        )
      ]);
    };
  }
});

// src/vue/components/TweakRoot.ts
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import.meta !== "undefined" && import.meta.env?.MODE ? import.meta.env.MODE !== "production" : true;
var TweakRoot = defineComponent28({
  name: "TweakersRoot",
  props: {
    position: {
      type: String,
      default: "top-right"
    },
    defaultOpen: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: "popover"
    },
    theme: {
      type: String,
      default: "system"
    },
    productionEnabled: {
      type: Boolean,
      default: isDevDefault
    },
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels: {
      type: [String, Array],
      default: void 0
    },
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome: {
      type: String,
      default: "card"
    }
  },
  setup(props) {
    const panels = ref23([]);
    const timelines = ref23([]);
    const mounted = ref23(false);
    let unsubscribePanels;
    let unsubscribeTimelines;
    onMounted17(() => {
      mounted.value = true;
      panels.value = TweakStore9.selectPanels(props.panels);
      timelines.value = TimelineStore.getTimelines();
      unsubscribePanels = TweakStore9.subscribeGlobal(() => {
        panels.value = TweakStore9.selectPanels(props.panels);
      });
      unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
        timelines.value = TimelineStore.getTimelines();
      });
    });
    onUnmounted11(() => {
      unsubscribePanels?.();
      unsubscribeTimelines?.();
    });
    const timelineToggle = () => timelines.value.length > 0 && props.panels === void 0 ? h27(TimelineToggleButton) : null;
    const renderPanels = () => {
      if (panels.value.length === 0) {
        return [h27("div", { class: "tweakers-panel-wrapper" }, [
          h27(Folder, {
            title: "Tweakers",
            defaultOpen: props.mode === "inline" || props.defaultOpen,
            isRoot: true,
            inline: props.mode === "inline",
            toolbar: () => h27(TimelineToggleButton)
          }, { default: () => [h27("div", { class: "tweakers-timeline-toolkit-only" }, "Timeline")] })
        ])];
      }
      return panels.value.map((panel) => h27(Panel, {
        key: panel.id,
        panel,
        defaultOpen: props.mode === "inline" || props.defaultOpen,
        inline: props.mode === "inline",
        toolbarExtra: timelineToggle
      }));
    };
    const renderContent = () => h27(ShortcutListener, null, {
      default: () => h27("div", { class: "tweakers-root", "data-mode": props.mode, "data-theme": props.theme, "data-chrome": props.chrome }, [
        h27("div", {
          class: "tweakers-panel",
          "data-position": props.mode === "inline" ? void 0 : props.position,
          "data-mode": props.mode
        }, renderPanels())
      ])
    });
    return () => {
      const empty = panels.value.length === 0 && (props.panels !== void 0 || timelines.value.length === 0);
      if (!props.productionEnabled || !mounted.value || typeof window === "undefined" || empty) {
        return null;
      }
      if (props.mode === "inline") {
        return renderContent();
      }
      return h27(Teleport6, { to: "body" }, renderContent());
    };
  }
});

// src/vue/directives/tweakers.ts
var states = /* @__PURE__ */ new WeakMap();
function normalizeDirectiveValue(value) {
  if (!value) return {};
  if (value === "inline" || value === "popover") {
    return { mode: value };
  }
  return value;
}
function mountTweakRoot(el, value) {
  if (typeof window === "undefined") return;
  const host = document.createElement("div");
  el.appendChild(host);
  const props = shallowRef2(normalizeDirectiveValue(value));
  const RootHost = defineComponent29({
    name: "TweakersDirectiveHost",
    setup() {
      return () => h28(TweakRoot, props.value);
    }
  });
  const app = createApp(RootHost);
  app.mount(host);
  states.set(el, { app, host, props });
}
function unmountTweakRoot(el) {
  const state = states.get(el);
  if (!state) return;
  state.app.unmount();
  state.host.remove();
  states.delete(el);
}
var vTweakers = {
  mounted(el, binding) {
    mountTweakRoot(el, binding.value);
  },
  updated(el, binding) {
    const state = states.get(el);
    if (!state) {
      mountTweakRoot(el, binding.value);
      return;
    }
    state.props.value = normalizeDirectiveValue(binding.value);
  },
  beforeUnmount(el) {
    unmountTweakRoot(el);
  }
};

// src/vue/useTweakTimeline.ts
import { computed as computed11, onMounted as onMounted18, onUnmounted as onUnmounted12, shallowRef as shallowRef3, watch as watch12 } from "vue";
import { TweakStore as TweakStore10 } from "tweakers/store";
import { TimelineStore as TimelineStore2 } from "tweakers/timeline";
import {
  buildTimelineMeta,
  buildTimelineValues,
  computeStaticTimeline,
  parseTimelineConfig
} from "tweakers/timeline";
var timelineInstance = 0;
function useTweakTimeline(name, config, options) {
  const hasStableId = options?.id !== void 0;
  const panelId = options?.id ?? `${name}-${++timelineInstance}`;
  const serializedConfig = computed11(() => JSON.stringify(config));
  const serializedPersist = computed11(() => JSON.stringify(options?.persist));
  const serializedLoop = computed11(() => JSON.stringify(options?.loop));
  const parsed = computed11(() => {
    serializedConfig.value;
    return parseTimelineConfig(config);
  });
  const flatValues = shallowRef3(TweakStore10.getValues(panelId));
  const transport = shallowRef3(TimelineStore2.getTransport(panelId));
  const loopRegion = shallowRef3(TimelineStore2.getLoopRegion(panelId));
  const staticTimeline = computed11(() => computeStaticTimeline(parsed.value, flatValues.value));
  const meta = computed11(() => {
    serializedLoop.value;
    return buildTimelineMeta(
      panelId,
      name,
      staticTimeline.value.duration,
      parsed.value,
      options?.loop
    );
  });
  let mounted = false;
  let unsubscribeValues;
  let unsubscribeTransport;
  const play = () => TimelineStore2.play(panelId);
  const pause = () => TimelineStore2.pause(panelId);
  const replay = () => TimelineStore2.replay(panelId);
  const seek = (time) => TimelineStore2.seek(panelId, time);
  watch12([serializedConfig, serializedPersist], () => {
    if (!mounted) return;
    TweakStore10.updatePanel(panelId, name, parsed.value.tweakConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    flatValues.value = TweakStore10.getValues(panelId);
  });
  watch12(meta, (nextMeta) => {
    if (mounted) TimelineStore2.update(nextMeta);
  });
  onMounted18(() => {
    unsubscribeValues = TweakStore10.subscribe(panelId, () => {
      flatValues.value = TweakStore10.getValues(panelId);
    });
    unsubscribeTransport = TimelineStore2.subscribe(panelId, () => {
      transport.value = TimelineStore2.getTransport(panelId);
      loopRegion.value = TimelineStore2.getLoopRegion(panelId);
    });
    TweakStore10.registerPanel(panelId, name, parsed.value.tweakConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    flatValues.value = TweakStore10.getValues(panelId);
    TimelineStore2.register(meta.value, { autoplay: options?.autoplay ?? true, persist: options?.persist });
    transport.value = TimelineStore2.getTransport(panelId);
    loopRegion.value = TimelineStore2.getLoopRegion(panelId);
    mounted = true;
  });
  onUnmounted12(() => {
    mounted = false;
    unsubscribeValues?.();
    unsubscribeTransport?.();
    TimelineStore2.unregister(panelId);
    TweakStore10.unregisterPanel(panelId);
  });
  return computed11(() => {
    const currentStatic = staticTimeline.value;
    const region = loopRegion.value;
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return buildTimelineValues(
      currentStatic.clips,
      transport.value,
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}

// src/vue/components/Timeline/TweakTimeline.ts
import {
  Teleport as Teleport7,
  computed as computed12,
  defineComponent as defineComponent30,
  h as h29,
  nextTick as nextTick6,
  onMounted as onMounted19,
  onUnmounted as onUnmounted13,
  ref as ref24,
  watch as watch13
} from "vue";
import { TweakStore as TweakStore11, formatLabel } from "tweakers/store";
import { TimelineStore as TimelineStore3 } from "tweakers/timeline";
import { TimelineUiStore as TimelineUiStore2 } from "tweakers/timeline";
import {
  TIMELINE_MIN_CLIP_DURATION,
  clampClipMove,
  clampClipResizeEnd,
  clampClipResizeStart,
  clampStepResize,
  clampTrackDelay,
  computeClipStaticFromValues,
  formatClock,
  formatSeconds,
  formatStepLabel,
  normalizeTimelineValuesForCopy,
  timelinePopoverDisplayValues
} from "tweakers/timeline";
import { clamp as clamp2 } from "tweakers/transition-math";
import { buildCopyInstruction } from "tweakers/copy-instruction";
import { isDevDefault as isDevDefault2 } from "tweakers/env";
import {
  ICON_ADD_PRESET as ICON_ADD_PRESET2,
  ICON_CHEVRON as ICON_CHEVRON3,
  ICON_CHECK as ICON_CHECK2,
  ICON_CLIPBOARD as ICON_CLIPBOARD2,
  ICON_LOOP,
  ICON_PAUSE,
  ICON_PLAY,
  ICON_REPLAY
} from "tweakers/icons";
import { findControl as findControl2 } from "tweakers/shortcut-utils";
var DRAG_THRESHOLD_PX = 3;
var LOOP_DRAG_THRESHOLD_PX = 4;
var MAJOR_TICK_TARGET_PX = 140;
var MILLISECOND_STEP = 1e-3;
var SECOND_TICK_STEPS = [
  1e-3,
  2e-3,
  5e-3,
  0.01,
  0.02,
  0.05,
  0.1,
  0.2,
  0.5,
  1,
  2,
  5,
  10,
  15,
  30,
  60,
  120,
  300,
  600
];
var MIN_TIMELINE_MAX_ZOOM = 8;
var PLAYHEAD_FLAG_WIDTH = 52;
var PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
var POPOVER_WIDTH = 280;
var ZOOM_DRAG_DISTANCE = 180;
var DEFAULT_DOCK_MAX_HEIGHT = 400;
var MIN_DOCK_MAX_HEIGHT = 120;
var TweakTimeline = defineComponent30({
  name: "TweakersTimeline",
  props: {
    theme: { type: String, default: "system" },
    defaultVisible: { type: Boolean, default: true },
    visible: {
      type: Boolean,
      default: void 0
    },
    onVisibilityChange: Function,
    defaultOpen: { type: Boolean, default: true },
    productionEnabled: { type: Boolean, default: isDevDefault2 }
  },
  setup(props) {
    const timelines = ref24(TimelineStore3.getTimelines());
    const dockVisible = ref24(TimelineUiStore2.getVisible());
    const mounted = ref24(false);
    const dockMaxHeight = ref24(DEFAULT_DOCK_MAX_HEIGHT);
    const dockRef = ref24(null);
    const controllerId = /* @__PURE__ */ Symbol("tweakers-timeline-visibility");
    let unsubscribeTimelines;
    let unsubscribeVisibility;
    let unregisterController;
    let resizeCleanup = null;
    const handleResizePointerDown = (event) => {
      if (!dockRef.value) return;
      event.preventDefault();
      event.stopPropagation();
      resizeCleanup?.();
      const pointerY = event.clientY;
      const startHeight = dockRef.value.getBoundingClientRect().height;
      const move = (next) => {
        next.preventDefault();
        const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
        dockMaxHeight.value = clamp2(startHeight + pointerY - next.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax);
      };
      const finish = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", finish);
        window.removeEventListener("pointercancel", finish);
        resizeCleanup = null;
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", finish);
      window.addEventListener("pointercancel", finish);
      resizeCleanup = finish;
    };
    onMounted19(() => {
      mounted.value = true;
      unsubscribeVisibility = TimelineUiStore2.subscribe(() => {
        dockVisible.value = TimelineUiStore2.getVisible();
      });
      unregisterController = TimelineUiStore2.registerController(controllerId, {
        visible: props.visible,
        defaultVisible: props.defaultVisible,
        onVisibilityChange: props.onVisibilityChange
      });
      dockVisible.value = TimelineUiStore2.getVisible();
      unsubscribeTimelines = TimelineStore3.subscribeGlobal(() => {
        timelines.value = TimelineStore3.getTimelines();
      });
    });
    watch13(() => [props.visible, props.defaultVisible, props.onVisibilityChange], () => {
      TimelineUiStore2.updateController(controllerId, {
        visible: props.visible,
        defaultVisible: props.defaultVisible,
        onVisibilityChange: props.onVisibilityChange
      });
    });
    onUnmounted13(() => {
      unregisterController?.();
      unsubscribeTimelines?.();
      unsubscribeVisibility?.();
      resizeCleanup?.();
    });
    return () => {
      if (!props.productionEnabled || !mounted.value || timelines.value.length === 0) return null;
      return h29(Teleport7, { to: "body" }, [
        h29("div", {
          class: "tweakers-root tweakers-timeline",
          "data-theme": props.theme,
          hidden: !dockVisible.value
        }, [
          h29("div", {
            class: "tweakers-timeline-resize-handle",
            role: "separator",
            "aria-label": "Resize timeline height",
            "aria-orientation": "horizontal",
            title: "Drag to resize timeline",
            onPointerdown: handleResizePointerDown
          }),
          h29("div", {
            ref: dockRef,
            class: "tweakers-timeline-dock",
            style: { maxHeight: `min(${dockMaxHeight.value}px, calc(100vh - 24px))` }
          }, timelines.value.map((meta) => h29(TimelineSection, {
            key: meta.id,
            meta,
            defaultOpen: props.defaultOpen,
            theme: props.theme,
            dockVisible: dockVisible.value
          })))
        ])
      ]);
    };
  }
});
var PlayPauseButton = defineComponent30({
  props: { id: { type: String, required: true } },
  setup(props) {
    const playing = ref24(TimelineStore3.getTransport(props.id).playing);
    let unsubscribe;
    onMounted19(() => {
      unsubscribe = TimelineStore3.subscribe(props.id, () => {
        playing.value = TimelineStore3.getTransport(props.id).playing;
      });
    });
    onUnmounted13(() => unsubscribe?.());
    return () => {
      const label = playing.value ? "Pause" : "Play";
      const icon = playing.value ? h29(
        "svg",
        { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: iconStyle },
        ICON_PAUSE.map((path) => h29("path", { d: path, fill: "currentColor" }))
      ) : h29("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: iconStyle }, [
        h29("path", { d: ICON_PLAY, fill: "currentColor" })
      ]);
      return h29("button", {
        class: "tweakers-toolbar-add",
        title: label,
        "aria-label": label,
        onClick: () => playing.value ? TimelineStore3.pause(props.id) : TimelineStore3.play(props.id)
      }, [h29("span", { style: { position: "relative", width: "16px", height: "16px" } }, [icon])]);
    };
  }
});
var ReplayButton = defineComponent30({
  props: { onReplay: { type: Function, required: true } },
  setup(props) {
    return () => h29("button", {
      class: "tweakers-toolbar-add",
      title: "Replay",
      "aria-label": "Replay",
      onClick: props.onReplay
    }, [
      h29(
        "svg",
        { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
        ICON_REPLAY.map((path) => h29("path", { d: path, fill: "currentColor" }))
      )
    ]);
  }
});
var iconStyle = {
  position: "absolute",
  inset: 0,
  width: "16px",
  height: "16px",
  color: "var(--tweak-text-label)"
};
var TimelineOverview = defineComponent30({
  props: {
    id: { type: String, required: true },
    duration: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    viewEnd: { type: Number, required: true },
    onNavigate: { type: Function, required: true }
  },
  setup(props) {
    const time = ref24(TimelineStore3.getTransport(props.id).time);
    let scrub = null;
    let unsubscribe;
    onMounted19(() => {
      unsubscribe = TimelineStore3.subscribe(props.id, () => {
        time.value = TimelineStore3.getTransport(props.id).time;
      });
    });
    onUnmounted13(() => unsubscribe?.());
    const seek = (clientX) => {
      if (!scrub || scrub.rect.width <= 0 || props.duration <= 0) return;
      const next = clamp2((clientX - scrub.rect.left) / scrub.rect.width * props.duration, 0, props.duration);
      TimelineStore3.seek(props.id, next);
      props.onNavigate(next);
    };
    const finish = () => {
      if (scrub?.wasPlaying) TimelineStore3.play(props.id);
      scrub = null;
    };
    return () => {
      const viewportWidth = props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100;
      const playhead = props.duration > 0 ? time.value / props.duration * 100 : 0;
      return h29("div", {
        class: "tweakers-timeline-overview",
        title: "Drag to scrub the full timeline",
        onPointerdown: (event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          scrub = {
            wasPlaying: TimelineStore3.getTransport(props.id).playing,
            rect: event.currentTarget.getBoundingClientRect()
          };
          TimelineStore3.pause(props.id);
          seek(event.clientX);
        },
        onPointermove: (event) => scrub && seek(event.clientX),
        onPointerup: finish,
        onPointercancel: finish,
        onLostpointercapture: finish
      }, [
        h29("div", {
          class: "tweakers-timeline-overview-viewport",
          "data-zoomed": viewportWidth < 99.999 || void 0,
          style: { left: `${props.duration > 0 ? props.viewStart / props.duration * 100 : 0}%`, width: `${viewportWidth}%` }
        }),
        h29("div", { class: "tweakers-timeline-overview-progress", style: { width: `${playhead}%` } }),
        h29("div", { class: "tweakers-timeline-overview-playhead", style: { left: `${playhead}%` } })
      ]);
    };
  }
});
var TimelinePlayheadFlag = defineComponent30({
  props: {
    id: { type: String, required: true },
    duration: { type: Number, required: true },
    pxPerSecond: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    viewEnd: { type: Number, required: true },
    laneWidth: { type: Number, required: true },
    ruler: Object,
    onResetView: { type: Function, required: true }
  },
  setup(props) {
    const time = ref24(TimelineStore3.getTransport(props.id).time);
    let unsubscribe;
    let scrub = null;
    let cleanup = null;
    onMounted19(() => {
      unsubscribe = TimelineStore3.subscribe(props.id, () => {
        time.value = TimelineStore3.getTransport(props.id).time;
      });
    });
    onUnmounted13(() => {
      unsubscribe?.();
      cleanup?.();
    });
    const seek = (clientX) => {
      if (!scrub || scrub.rect.width <= 0) return;
      TimelineStore3.seek(props.id, clamp2(
        scrub.viewStart + (clientX - scrub.rect.left) / scrub.rect.width * (scrub.viewEnd - scrub.viewStart),
        scrub.viewStart,
        scrub.viewEnd
      ));
    };
    return () => {
      if (time.value < props.viewStart || time.value > props.viewEnd || props.laneWidth <= 0) return null;
      const x = clamp2((time.value - props.viewStart) * props.pxPerSecond, 0, props.laneWidth);
      const flagCenter = clamp2(
        x,
        PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
        props.laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
      );
      const flagOffset = flagCenter - x;
      const edge = flagOffset > 0.5 ? "start" : flagOffset < -0.5 ? "end" : "center";
      return h29("div", {
        class: "tweakers-timeline-playhead-control",
        "data-edge": edge,
        style: {
          left: `calc(var(--tweak-timeline-label-w) + ${x}px)`,
          "--tweak-timeline-playhead-flag-offset": `${flagOffset}px`
        },
        role: "slider",
        "aria-label": "Timeline current time",
        "aria-valuemin": 0,
        "aria-valuemax": props.duration,
        "aria-valuenow": time.value,
        title: "Drag to scrub the timeline",
        onPointerdown: (event) => {
          const rect = props.ruler?.getBoundingClientRect();
          if (!rect) return;
          event.preventDefault();
          event.stopPropagation();
          cleanup?.();
          const reset = event.shiftKey;
          scrub = {
            wasPlaying: TimelineStore3.getTransport(props.id).playing,
            rect,
            viewStart: reset ? 0 : props.viewStart,
            viewEnd: reset ? props.duration : props.viewEnd
          };
          if (reset) props.onResetView();
          TimelineStore3.pause(props.id);
          seek(event.clientX);
          const move = (next) => {
            next.preventDefault();
            seek(next.clientX);
          };
          const finish = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", finish);
            window.removeEventListener("pointercancel", finish);
            if (scrub?.wasPlaying) TimelineStore3.play(props.id);
            scrub = null;
            cleanup = null;
          };
          window.addEventListener("pointermove", move, { passive: false });
          window.addEventListener("pointerup", finish);
          window.addEventListener("pointercancel", finish);
          cleanup = finish;
        }
      }, [
        h29("div", { class: "tweakers-timeline-playhead-stem" }),
        h29("div", { class: "tweakers-timeline-playhead-anchor" }, [
          h29("div", { class: "tweakers-timeline-playhead-flag" }, time.value.toFixed(2))
        ])
      ]);
    };
  }
});
function clampViewStart(start, duration, visibleDuration) {
  return clamp2(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return formatClock(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
var TimelineSection = defineComponent30({
  props: {
    meta: { type: Object, required: true },
    defaultOpen: { type: Boolean, required: true },
    theme: { type: String, required: true },
    dockVisible: { type: Boolean, required: true }
  },
  setup(props) {
    const open = ref24(props.defaultOpen);
    const copied = ref24(false);
    const popover = ref24(null);
    const collapsedGroups = ref24(/* @__PURE__ */ new Set());
    const expandedTracks = ref24(/* @__PURE__ */ new Set());
    const zoom = ref24(1);
    const viewStart = ref24(0);
    const values = ref24(TweakStore11.getValues(props.meta.id));
    const presets = ref24(TweakStore11.getPresets(props.meta.id));
    const activePresetId = ref24(TweakStore11.getActivePresetId(props.meta.id));
    const loopRegion = ref24(TimelineStore3.getLoopRegion(props.meta.id));
    const loopDrag = ref24(null);
    const laneAreaRef = ref24(null);
    const horizontalScrollRef = ref24(null);
    const laneWidth = ref24(0);
    let unsubscribeValues;
    let unsubscribeLoop;
    let resizeObserver;
    const measure = () => {
      if (laneAreaRef.value) laneWidth.value = laneAreaRef.value.getBoundingClientRect().width;
    };
    const connectMeasure = async () => {
      resizeObserver?.disconnect();
      if (!open.value) return;
      await nextTick6();
      if (!laneAreaRef.value) return;
      measure();
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(laneAreaRef.value);
    };
    onMounted19(() => {
      unsubscribeValues = TweakStore11.subscribe(props.meta.id, () => {
        values.value = TweakStore11.getValues(props.meta.id);
        presets.value = TweakStore11.getPresets(props.meta.id);
        activePresetId.value = TweakStore11.getActivePresetId(props.meta.id);
      });
      unsubscribeLoop = TimelineStore3.subscribe(props.meta.id, () => {
        loopRegion.value = TimelineStore3.getLoopRegion(props.meta.id);
      });
      loopRegion.value = TimelineStore3.getLoopRegion(props.meta.id);
      void connectMeasure();
    });
    onUnmounted13(() => {
      unsubscribeValues?.();
      unsubscribeLoop?.();
      resizeObserver?.disconnect();
    });
    watch13(open, connectMeasure);
    watch13(() => props.dockVisible, (visible) => {
      if (!visible) popover.value = null;
    });
    const visibleDuration = computed12(() => props.meta.duration > 0 ? props.meta.duration / zoom.value : props.meta.duration);
    const safeViewStart = computed12(() => clampViewStart(viewStart.value, props.meta.duration, visibleDuration.value));
    const viewEnd = computed12(() => safeViewStart.value + visibleDuration.value);
    const pxPerSecond = computed12(() => visibleDuration.value > 0 && laneWidth.value > 0 ? laneWidth.value / visibleDuration.value : 0);
    const maxZoom = computed12(() => Math.max(
      MIN_TIMELINE_MAX_ZOOM,
      laneWidth.value > 0 && props.meta.duration > 0 ? MAJOR_TICK_TARGET_PX * props.meta.duration / (MILLISECOND_STEP * 10 * laneWidth.value) : MIN_TIMELINE_MAX_ZOOM
    ));
    watch13(maxZoom, (next) => {
      zoom.value = clamp2(zoom.value, 1, next);
    }, { immediate: true });
    watch13([() => props.meta.duration, zoom], () => {
      viewStart.value = clampViewStart(viewStart.value, props.meta.duration, props.meta.duration / zoom.value);
    });
    watch13([open, pxPerSecond, safeViewStart], async () => {
      await nextTick6();
      const scroller = horizontalScrollRef.value;
      if (!scroller || pxPerSecond.value <= 0) return;
      const next = safeViewStart.value * pxPerSecond.value;
      if (Math.abs(scroller.scrollLeft - next) > 0.5) scroller.scrollLeft = next;
    });
    const centerViewAt = (time) => {
      if (zoom.value <= 1 || props.meta.duration <= 0) return;
      const duration = props.meta.duration / zoom.value;
      viewStart.value = clampViewStart(time - duration / 2, props.meta.duration, duration);
    };
    const resetView = () => {
      zoom.value = 1;
      viewStart.value = 0;
    };
    const handleReplay = () => {
      viewStart.value = 0;
      TimelineStore3.replay(props.meta.id);
    };
    const handleHorizontalScroll = (event) => {
      if (pxPerSecond.value <= 0) return;
      viewStart.value = clampViewStart(
        event.currentTarget.scrollLeft / pxPerSecond.value,
        props.meta.duration,
        visibleDuration.value
      );
    };
    const handleTimelineWheel = (event) => {
      const scroller = horizontalScrollRef.value;
      if (!scroller || zoom.value <= 1) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (delta === 0) return;
      event.preventDefault();
      scroller.scrollLeft += delta;
    };
    let zoomDrag = null;
    let rulerGesture = null;
    let trackScrub = null;
    const rulerTimeFromClientX = (clientX, rect, viewStartAt, visibleAt) => clamp2(
      viewStartAt + (clientX - rect.left) / rect.width * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    );
    const seekTrack = (clientX) => {
      if (!trackScrub || trackScrub.rect.width <= 0) return;
      TimelineStore3.seek(props.meta.id, clamp2(
        trackScrub.viewStart + (clientX - trackScrub.rect.left) / trackScrub.rect.width * trackScrub.visibleDuration,
        trackScrub.viewStart,
        trackScrub.viewStart + trackScrub.visibleDuration
      ));
    };
    const finishRuler = () => {
      const gesture = rulerGesture;
      rulerGesture = null;
      zoomDrag = null;
      if (gesture) {
        if (gesture.moved && loopDrag.value) {
          TimelineStore3.setLoopRegion(props.meta.id, loopDrag.value.start, loopDrag.value.end);
        } else {
          TimelineStore3.seek(props.meta.id, gesture.downTime);
        }
        loopDrag.value = null;
      }
    };
    const cancelRuler = () => {
      rulerGesture = null;
      zoomDrag = null;
      loopDrag.value = null;
    };
    const handleClearLoopRegion = () => TimelineStore3.clearLoopRegion(props.meta.id);
    const finishTrack = () => {
      if (trackScrub?.wasPlaying) TimelineStore3.play(props.meta.id);
      trackScrub = null;
    };
    const handleCopy = () => {
      const normalized = normalizeTimelineValuesForCopy(TweakStore11.getValues(props.meta.id), props.meta.clips);
      void navigator.clipboard.writeText(buildCopyInstruction("useTweakTimeline", props.meta.name, normalized));
      copied.value = true;
      window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };
    const handleAddPreset = () => TweakStore11.savePreset(props.meta.id, `Version ${presets.value.length + 2}`);
    const closePopover = () => {
      popover.value = null;
    };
    const openClipPopover = (clip, rect, stepKey) => {
      const target = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      if (getClipControls(props.meta.id, target, stepKey ? void 0 : clipPopoverExclusions(clip)).length === 0) return;
      popover.value = popover.value?.clip.key === clip.key && popover.value.stepKey === stepKey ? null : {
        clip,
        stepKey,
        anchor: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
      };
    };
    const toggleSet = (state, key) => {
      const next = new Set(state.value);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      state.value = next;
    };
    const toggleTracks = (key) => toggleSet(expandedTracks, key);
    const toggleGroup = (key) => toggleSet(collapsedGroups, key);
    const handleBarClick = (clip, rect, stepKey) => {
      if (!stepKey && clip.tracks?.length) toggleTracks(clip.key);
      else openClipPopover(clip, rect, stepKey);
    };
    const ticks = computed12(() => {
      const raw = pxPerSecond.value > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond.value : 1;
      const adaptive = SECOND_TICK_STEPS.find((step) => step >= raw) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
      const majorStep = zoom.value < 1.5 && props.meta.duration >= 1 ? Math.max(1, adaptive) : adaptive;
      const fineStep = majorStep / 10;
      const major = [];
      const medium = [];
      const fine = [];
      for (let time = Math.ceil((safeViewStart.value - 1e-6) / majorStep) * majorStep; time <= viewEnd.value + 1e-6; time += majorStep) {
        major.push(Number(time.toFixed(4)));
      }
      const first = Math.ceil((safeViewStart.value - 1e-6) / fineStep);
      const last = Math.floor((viewEnd.value + 1e-6) / fineStep);
      for (let index = first; index <= last; index++) {
        if (index % 10 === 0) continue;
        const tick = Number((index * fineStep).toFixed(6));
        if (index % 5 === 0) medium.push(tick);
        else fine.push(tick);
      }
      return { major, medium, fine, majorStep };
    });
    const renderRows = () => {
      const rows = [];
      let lastGroup;
      for (const clip of props.meta.clips) {
        if (clip.group !== lastGroup) {
          lastGroup = clip.group;
          if (clip.group) {
            const group = clip.group;
            const collapsed = collapsedGroups.value.has(group);
            rows.push(h29("div", { key: `group:${group}`, class: "tweakers-timeline-row tweakers-timeline-group-row" }, [
              h29("div", { class: "tweakers-timeline-label" }, [
                h29("button", {
                  class: "tweakers-timeline-group-toggle",
                  "data-open": !collapsed,
                  title: collapsed ? "Expand layer" : "Collapse layer",
                  onClick: () => toggleGroup(group)
                }, [chevronIcon()]),
                h29("span", formatLabel(group))
              ]),
              h29("div", { class: "tweakers-timeline-lane" })
            ]));
          }
        }
        if (clip.group && collapsedGroups.value.has(clip.group)) continue;
        const isProps = Boolean(clip.tracks?.length);
        const tracksOpen = isProps && expandedTracks.value.has(clip.key);
        const stat = computeClipStaticFromValues(values.value, clip, props.meta.duration);
        const selected = popover.value?.clip.key === clip.key;
        rows.push(h29("div", { key: clip.key, class: "tweakers-timeline-row", "data-grouped": clip.group ? "" : void 0 }, [
          h29("div", { class: "tweakers-timeline-label" }, [
            isProps ? h29("button", {
              class: "tweakers-timeline-group-toggle",
              "data-open": tracksOpen,
              title: tracksOpen ? "Collapse properties" : "Expand properties",
              onClick: (event) => {
                event.stopPropagation();
                toggleTracks(clip.key);
              }
            }, [chevronIcon()]) : null,
            clip.label
          ]),
          h29("div", { class: "tweakers-timeline-lane" }, [h29(TimelineClip, {
            timelineId: props.meta.id,
            clip,
            at: stat.at,
            duration: stat.duration,
            loop: stat.loop,
            steps: clip.stepKeys?.length ? stat.tracks[0]?.steps : void 0,
            fixedDuration: isProps ? true : stat.isPhysics,
            composite: isProps,
            pxPerSecond: pxPerSecond.value,
            viewStart: safeViewStart.value,
            timelineDuration: props.meta.duration,
            selected,
            selectedStepKey: selected ? popover.value?.stepKey : void 0,
            onClick: handleBarClick,
            onDrag: closePopover
          })])
        ]));
        if (!tracksOpen) continue;
        for (const trackRef of clip.tracks ?? []) {
          const track = stat.tracks.find((candidate) => candidate.prop === trackRef.prop);
          if (!track) continue;
          const trackKey = `${clip.key}.${trackRef.prop}`;
          const trackMeta = {
            key: trackKey,
            label: `${clip.label} \xB7 ${formatLabel(trackRef.prop)}`,
            color: clip.color,
            loop: clip.loop,
            group: clip.group,
            stepKeys: trackRef.stepKeys
          };
          const trackSelected = popover.value?.clip.key === trackKey;
          rows.push(h29("div", { key: trackKey, class: "tweakers-timeline-row tweakers-timeline-track-row", "data-grouped": clip.group ? "" : void 0 }, [
            h29("div", { class: "tweakers-timeline-label" }, formatLabel(trackRef.prop)),
            h29("div", { class: "tweakers-timeline-lane" }, [h29(TimelineClip, {
              timelineId: props.meta.id,
              clip: trackMeta,
              at: stat.at + track.delay,
              duration: track.duration,
              loop: stat.loop,
              steps: trackRef.stepKeys?.length ? track.steps : void 0,
              fixedDuration: !trackRef.stepKeys?.length && track.steps[0]?.isPhysics === true,
              baseAt: stat.at,
              delayMode: true,
              pxPerSecond: pxPerSecond.value,
              viewStart: safeViewStart.value,
              timelineDuration: props.meta.duration,
              selected: trackSelected,
              selectedStepKey: trackSelected ? popover.value?.stepKey : void 0,
              onClick: openClipPopover,
              onDrag: closePopover
            })])
          ]));
        }
      }
      return rows;
    };
    return () => h29("div", { class: "tweakers-timeline-section" }, [
      h29("div", { class: "tweakers-timeline-header", "data-open": open.value || void 0 }, [
        h29("div", { class: "tweakers-timeline-identity" }, [
          h29("span", { class: "tweakers-timeline-title" }, props.meta.name)
        ]),
        !open.value ? h29(TimelineOverview, {
          id: props.meta.id,
          duration: props.meta.duration,
          viewStart: safeViewStart.value,
          viewEnd: viewEnd.value,
          onNavigate: centerViewAt
        }) : null,
        h29("div", { class: "tweakers-timeline-actions" }, [
          h29("button", {
            class: "tweakers-timeline-loop-toggle",
            "data-active": loopRegion.value ? "true" : void 0,
            disabled: !loopRegion.value,
            title: loopRegion.value ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region",
            "aria-label": loopRegion.value ? "Clear loop region" : "Looping whole timeline",
            "aria-pressed": loopRegion.value ? "true" : "false",
            onClick: handleClearLoopRegion
          }, [
            h29(
              "svg",
              { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" },
              ICON_LOOP.map((d) => h29("path", { d }))
            )
          ]),
          h29(PlayPauseButton, { id: props.meta.id }),
          h29(ReplayButton, { onReplay: handleReplay }),
          h29("button", { class: "tweakers-toolbar-add", title: "Add timeline version", "aria-label": "Add timeline version", onClick: handleAddPreset }, [
            h29(
              "svg",
              { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" },
              ICON_ADD_PRESET2.map((path) => h29("path", { d: path }))
            )
          ]),
          h29(PresetManager, { panelId: props.meta.id, presets: presets.value, activePresetId: activePresetId.value }),
          h29("button", {
            class: "tweakers-toolbar-add",
            title: "Copy parameters",
            "aria-label": copied.value ? "Copied parameters" : "Copy parameters",
            onClick: handleCopy
          }, [h29("span", { style: { position: "relative", width: "16px", height: "16px" } }, [
            copied.value ? h29("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", style: iconStyle }, [h29("path", { d: ICON_CHECK2 })]) : h29("svg", { viewBox: "0 0 24 24", fill: "none", style: iconStyle }, [
              h29("path", { d: ICON_CLIPBOARD2.board, stroke: "currentColor", "stroke-width": "2", "stroke-linejoin": "round" }),
              h29("path", { d: ICON_CLIPBOARD2.sparkle, fill: "currentColor" }),
              h29("path", { d: ICON_CLIPBOARD2.body, stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" })
            ])
          ])]),
          h29("button", {
            class: "tweakers-timeline-chevron",
            "data-open": open.value,
            "aria-expanded": open.value,
            title: open.value ? "Collapse timeline" : "Expand timeline",
            onClick: () => {
              open.value = !open.value;
            }
          }, [chevronIcon()])
        ])
      ]),
      open.value ? h29("div", {
        class: "tweakers-timeline-body",
        onWheel: handleTimelineWheel,
        onPointerdown: (event) => {
          const target = event.target;
          if (target.closest(".tweakers-timeline-label, button")) return;
          if (!event.shiftKey && target.closest(".tweakers-timeline-clip")) return;
          const rect = laneAreaRef.value?.getBoundingClientRect();
          if (!rect) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          const reset = event.shiftKey;
          trackScrub = {
            wasPlaying: TimelineStore3.getTransport(props.meta.id).playing,
            rect,
            viewStart: reset ? 0 : safeViewStart.value,
            visibleDuration: reset ? props.meta.duration : visibleDuration.value
          };
          if (reset) resetView();
          popover.value = null;
          TimelineStore3.pause(props.meta.id);
          seekTrack(event.clientX);
        },
        onPointermove: (event) => trackScrub && seekTrack(event.clientX),
        onPointerup: finishTrack,
        onPointercancel: finishTrack,
        onLostpointercapture: finishTrack
      }, [h29("div", { class: "tweakers-timeline-grid" }, [
        h29("div", { class: "tweakers-timeline-row tweakers-timeline-ruler-row" }, [
          h29("div", { class: "tweakers-timeline-label" }),
          h29("div", {
            ref: laneAreaRef,
            class: "tweakers-timeline-ruler",
            title: "Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom",
            onPointerdown: (event) => {
              event.preventDefault();
              event.stopPropagation();
              const rect = event.currentTarget.getBoundingClientRect();
              if (rect.width <= 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              if (!event.altKey) {
                const reset = event.shiftKey;
                const gestureViewStart = reset ? 0 : safeViewStart.value;
                const gestureVisible = reset ? props.meta.duration : visibleDuration.value;
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
              const ratio = clamp2((event.clientX - rect.left) / rect.width, 0, 1);
              zoomDrag = {
                pointerX: event.clientX,
                zoom: zoom.value,
                anchorRatio: ratio,
                anchorTime: safeViewStart.value + ratio * visibleDuration.value,
                moved: false
              };
            },
            onPointermove: (event) => {
              const gesture = rulerGesture;
              if (gesture) {
                const dx2 = event.clientX - gesture.downClientX;
                if (!gesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
                gesture.moved = true;
                const current = rulerTimeFromClientX(event.clientX, gesture.rect, gesture.viewStart, gesture.visibleDuration);
                loopDrag.value = {
                  start: Math.min(gesture.downTime, current),
                  end: Math.max(gesture.downTime, current)
                };
                return;
              }
              if (!zoomDrag || props.meta.duration <= 0) return;
              const dx = event.clientX - zoomDrag.pointerX;
              if (!zoomDrag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
              zoomDrag.moved = true;
              const nextZoom = clamp2(zoomDrag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom.value);
              const duration = props.meta.duration / nextZoom;
              zoom.value = nextZoom;
              viewStart.value = clampViewStart(zoomDrag.anchorTime - zoomDrag.anchorRatio * duration, props.meta.duration, duration);
            },
            onPointerup: finishRuler,
            onPointercancel: cancelRuler,
            onLostpointercapture: cancelRuler
          }, [
            ...(() => {
              const activeLoop = loopDrag.value ?? loopRegion.value;
              if (!activeLoop || pxPerSecond.value <= 0) return [];
              const left = (activeLoop.start - safeViewStart.value) * pxPerSecond.value;
              const width = Math.max(0, (activeLoop.end - activeLoop.start) * pxPerSecond.value);
              return [
                h29("div", { key: "loop-dim-before", class: "tweakers-timeline-loop-dim", style: { left: "0px", width: `${Math.max(0, left)}px` } }),
                h29("div", { key: "loop-dim-after", class: "tweakers-timeline-loop-dim", style: { left: `${left + width}px`, right: "0px" } }),
                h29("div", { key: "loop-band", class: "tweakers-timeline-loop-band", "data-live": loopDrag.value ? "true" : void 0, style: { left: `${left}px`, width: `${width}px` } })
              ];
            })(),
            ...ticks.value.fine.map((time) => h29("div", { key: `fine:${time}`, class: "tweakers-timeline-tick tweakers-timeline-tick-fine", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } })),
            ...ticks.value.medium.map((time) => h29("div", { key: `medium:${time}`, class: "tweakers-timeline-tick tweakers-timeline-tick-medium", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } })),
            ...ticks.value.major.map((time) => h29("div", { key: time, class: "tweakers-timeline-tick", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } }, [
              h29("span", { class: "tweakers-timeline-tick-label" }, formatRulerSeconds(time, ticks.value.majorStep))
            ]))
          ])
        ]),
        ...renderRows(),
        pxPerSecond.value > 0 ? h29(TimelinePlayheadFlag, {
          id: props.meta.id,
          duration: props.meta.duration,
          pxPerSecond: pxPerSecond.value,
          viewStart: safeViewStart.value,
          viewEnd: viewEnd.value,
          laneWidth: laneWidth.value,
          ruler: laneAreaRef.value ?? void 0,
          onResetView: resetView
        }) : null
      ]), zoom.value > 1 ? h29("div", { class: "tweakers-timeline-scroll-row" }, [
        h29("div", { class: "tweakers-timeline-label" }),
        h29("div", {
          ref: horizontalScrollRef,
          class: "tweakers-timeline-horizontal-scroll",
          "aria-label": "Timeline horizontal scroll",
          onScroll: handleHorizontalScroll
        }, [h29("div", { style: { width: `${laneWidth.value * zoom.value}px` } })])
      ]) : null]) : null,
      popover.value ? h29(ClipPopover, {
        panelId: props.meta.id,
        popover: popover.value,
        values: values.value,
        theme: props.theme,
        onClose: closePopover
      }) : null
    ]);
  }
});
function chevronIcon() {
  return h29("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h29("path", { d: ICON_CHEVRON3 })
  ]);
}
var ClipPopover = defineComponent30({
  props: {
    panelId: { type: String, required: true },
    popover: { type: Object, required: true },
    values: { type: Object, required: true },
    theme: { type: String, required: true },
    onClose: { type: Function, required: true }
  },
  setup(props) {
    const element = ref24(null);
    const naturalHeight = ref24(0);
    const viewport = ref24(readViewport());
    let observer;
    const measure = () => {
      if (element.value) naturalHeight.value = element.value.scrollHeight + 2;
    };
    const updateViewport = () => {
      viewport.value = readViewport();
    };
    const outside = (event) => {
      const target = event.target;
      if (element.value?.contains(target) || target.closest?.(".tweakers-timeline-clip") || target.closest?.(".tweakers-timeline-label")) return;
      props.onClose();
    };
    const keydown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    onMounted19(() => {
      measure();
      observer = new ResizeObserver(measure);
      if (element.value) observer.observe(element.value.querySelector(".tweakers-timeline-popover-body") ?? element.value);
      window.addEventListener("resize", updateViewport);
      window.visualViewport?.addEventListener("resize", updateViewport);
      window.visualViewport?.addEventListener("scroll", updateViewport);
      document.addEventListener("pointerdown", outside, true);
      document.addEventListener("keydown", keydown);
    });
    onUnmounted13(() => {
      observer?.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown);
    });
    return () => {
      const { clip, stepKey } = props.popover;
      let controls;
      let title;
      if (stepKey) {
        controls = getClipControls(props.panelId, `${clip.key}.${stepKey}`);
        if (stepKey === clip.stepKeys?.[0]) {
          const from = getControlAt(props.panelId, `${clip.key}.from`);
          if (from) {
            const index = controls.findIndex((control) => control.path === `${clip.key}.${stepKey}.to`);
            controls = index >= 0 ? [...controls.slice(0, index), from, ...controls.slice(index)] : [...controls, from];
          }
        }
        title = `${clip.label} \xB7 ${formatStepLabel(stepKey)}`;
      } else {
        controls = getClipControls(props.panelId, clip.key, clipPopoverExclusions(clip));
        title = clip.label;
      }
      if (controls.length === 0) return null;
      const target = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      const durationMeta = getControlAt(props.panelId, `${target}.duration`);
      const durationValue = durationMeta ? props.values[durationMeta.path] : void 0;
      const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
        value: durationValue,
        onChange: (next) => TweakStore11.updateValue(props.panelId, durationMeta.path, next),
        min: Math.max(TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
        max: durationMeta.max,
        step: durationMeta.step
      } : void 0;
      const current = viewport.value;
      const right = current.offsetLeft + current.width;
      const bottom = current.offsetTop + current.height;
      const width = Math.min(POPOVER_WIDTH, Math.max(220, current.width - 24));
      const left = clamp2(props.popover.anchor.left + props.popover.anchor.width / 2 - width / 2, current.offsetLeft + 12, Math.max(current.offsetLeft + 12, right - width - 12));
      const above = Math.max(0, props.popover.anchor.top - current.offsetTop - 22);
      const below = Math.max(0, bottom - props.popover.anchor.bottom - 22);
      const placeAbove = naturalHeight.value === 0 ? above >= below : naturalHeight.value <= above || naturalHeight.value > below && above >= below;
      const availableHeight = placeAbove ? above : below;
      const renderedHeight = Math.min(naturalHeight.value || availableHeight, availableHeight);
      const rawTop = placeAbove ? props.popover.anchor.top - 10 - renderedHeight : props.popover.anchor.bottom + 10;
      const top = clamp2(rawTop, current.offsetTop + 12, Math.max(current.offsetTop + 12, bottom - renderedHeight - 12));
      return h29(Teleport7, { to: "body" }, [h29("div", { class: "tweakers-root", "data-theme": props.theme }, [
        h29("div", {
          ref: element,
          class: "tweakers-timeline-popover",
          "data-placement": placeAbove ? "above" : "below",
          style: { left: `${left}px`, top: `${top}px`, width: `${width}px`, maxHeight: `${availableHeight}px`, visibility: naturalHeight.value > 0 ? "visible" : "hidden" },
          role: "dialog",
          "aria-label": `Edit ${title}`
        }, [
          h29("div", { class: "tweakers-timeline-popover-header" }, [
            h29("span", { class: "tweakers-timeline-popover-title" }, title),
            h29("button", { class: "tweakers-timeline-popover-close", title: "Close editor", "aria-label": "Close editor", onClick: props.onClose }, [
              h29("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" }, [h29("path", { d: "M6 6L18 18M18 6L6 18" })])
            ])
          ]),
          h29("div", { class: "tweakers-timeline-popover-body" }, [h29(ControlRenderer, {
            panelId: props.panelId,
            controls,
            values: timelinePopoverDisplayValues(props.values, clip.key, clip.stepKeys, stepKey),
            transitionDuration
          })])
        ])
      ])]);
    };
  }
});
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
  const panel = TweakStore11.getPanel(panelId);
  const folder = panel ? findControl2(panel.controls, path) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const key = control.path.slice(path.length + 1);
    return key !== "at" && key !== "duration" && !exclusions?.has(key);
  });
}
function getControlAt(panelId, path) {
  const panel = TweakStore11.getPanel(panelId);
  return panel ? findControl2(panel.controls, path) : null;
}
var TimelineClip = defineComponent30({
  props: {
    timelineId: { type: String, required: true },
    clip: { type: Object, required: true },
    at: { type: Number, required: true },
    duration: { type: Number, required: true },
    loop: { type: String, required: true },
    steps: Array,
    fixedDuration: { type: Boolean, required: true },
    composite: Boolean,
    baseAt: { type: Number, default: 0 },
    delayMode: Boolean,
    pxPerSecond: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    timelineDuration: { type: Number, required: true },
    selected: { type: Boolean, required: true },
    selectedStepKey: String,
    onClick: { type: Function, required: true },
    onDrag: { type: Function, required: true }
  },
  setup(props) {
    const dragging = ref24(false);
    let drag = null;
    const finish = (event) => {
      const previous = drag;
      drag = null;
      dragging.value = false;
      if (previous && !previous.moved && event) {
        const anchor = previous.clickEl ?? event.currentTarget;
        props.onClick(props.clip, anchor.getBoundingClientRect(), previous.clickEl?.dataset.step);
      }
    };
    return () => {
      const width = Math.max(props.duration * props.pxPerSecond, 14);
      const isSteps = Boolean(props.steps?.length);
      const looping = props.loop === "repeat" && props.duration > 0;
      const resizable = props.duration > 0 && !props.fixedDuration && !props.composite;
      const durationText = `${props.fixedDuration && !props.composite ? "~" : ""}${formatSeconds(props.duration)}`;
      const ghosts = [];
      if (looping) {
        const first = Math.max(1, Math.floor((props.viewStart - props.at) / props.duration));
        for (let offset = 0; offset < 256; offset++) {
          const index = first + offset;
          const start = props.at + props.duration * index;
          if (start >= props.timelineDuration - 1e-6) break;
          const duration = Math.min(props.duration, props.timelineDuration - start);
          ghosts.push(h29("div", {
            key: `ghost:${index}`,
            class: "tweakers-timeline-clip-ghost",
            "data-steps": isSteps || void 0,
            "aria-hidden": "true",
            style: { left: `${(start - props.viewStart) * props.pxPerSecond + 1}px`, width: `${Math.max(1, duration * props.pxPerSecond - 2)}px`, background: props.clip.color }
          }, props.steps?.map((step) => h29("span", { class: "tweakers-timeline-clip-ghost-segment", style: { width: `${step.duration * props.pxPerSecond}px` } }))));
        }
      }
      let cumulative = 0;
      const boundaries2 = props.steps?.map((step) => cumulative += step.duration) ?? [];
      const children = [];
      if (props.composite) {
        if (width > 56) children.push(h29("span", { class: "tweakers-timeline-clip-duration" }, durationText));
      } else if (isSteps) {
        for (const step of props.steps ?? []) {
          const segmentWidth = step.duration * props.pxPerSecond;
          children.push(h29("div", {
            key: step.key ?? "step",
            class: "tweakers-timeline-clip-segment",
            "data-step": step.key,
            "data-selected": props.selectedStepKey === step.key || void 0,
            style: { width: `${segmentWidth}px` }
          }, segmentWidth > 52 ? [h29("span", { class: "tweakers-timeline-clip-duration" }, formatSeconds(step.duration))] : []));
        }
        (props.steps ?? []).forEach((step, index) => {
          if (!step.isPhysics) children.push(h29("div", { key: `boundary:${step.key}`, class: "tweakers-timeline-clip-handle", "data-boundary": index, style: { left: `${boundaries2[index] * props.pxPerSecond - 4}px` } }));
        });
        if (!props.steps?.[0]?.isPhysics) children.push(h29("div", { class: "tweakers-timeline-clip-handle", "data-edge": "start" }));
      } else {
        if (resizable) children.push(h29("div", { class: "tweakers-timeline-clip-handle", "data-edge": "start" }));
        if (width > 56) children.push(h29("span", { class: "tweakers-timeline-clip-duration" }, durationText));
        if (resizable) children.push(h29("div", { class: "tweakers-timeline-clip-handle", "data-edge": "end" }));
      }
      const title = props.composite ? `${props.clip.label} \u2014 composite of its property tracks${looping ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${props.clip.label} \u2014 ${formatSeconds(props.at)} for ${durationText}${props.fixedDuration ? " (duration set by spring physics)" : ""}${looping ? " \xB7 repeats through timeline" : ""}${props.delayMode ? " \xB7 drag to phase-shift" : ""}`;
      return [...ghosts, h29("div", {
        class: "tweakers-timeline-clip",
        "data-steps": isSteps || void 0,
        "data-composite": props.composite || void 0,
        "data-selected": props.selected || void 0,
        "data-dragging": dragging.value || void 0,
        style: { left: `${(props.at - props.viewStart) * props.pxPerSecond}px`, width: `${width}px`, background: props.composite ? `${props.clip.color}80` : props.clip.color },
        title,
        onPointerdown: (event) => {
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
        },
        onPointermove: (event) => {
          if (!drag || props.pxPerSecond <= 0) return;
          const dx = event.clientX - drag.pointerX;
          if (!drag.moved) {
            if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
            drag.moved = true;
            dragging.value = true;
            props.onDrag();
          }
          const dt = dx / props.pxPerSecond;
          if (drag.mode === "boundary" && props.steps && drag.stepDurations) {
            const index = drag.boundaryIndex ?? 0;
            const others = drag.stepDurations.reduce((sum, duration, stepIndex) => stepIndex === index ? sum : sum + duration, 0);
            TweakStore11.updateValue(props.timelineId, `${props.clip.key}.${props.steps[index].key ?? ""}.duration`, clampStepResize(drag.stepDurations[index] + dt, drag.at, others, props.timelineDuration));
          } else if (drag.mode === "move") {
            if (props.delayMode) TweakStore11.updateValue(props.timelineId, `${props.clip.key}.delay`, clampTrackDelay(drag.at + dt - props.baseAt, props.baseAt, drag.duration, props.timelineDuration));
            else TweakStore11.updateValue(props.timelineId, `${props.clip.key}.at`, clampClipMove(drag.at + dt, drag.duration, props.timelineDuration));
          } else if (drag.mode === "end") {
            TweakStore11.updateValue(props.timelineId, `${props.clip.key}.duration`, clampClipResizeEnd(drag.duration + dt, drag.at, props.timelineDuration));
          } else if (props.steps && drag.stepDurations) {
            const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(props.baseAt, 0)), drag.at, drag.stepDurations[0]);
            TweakStore11.updateValues(props.timelineId, {
              [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - props.baseAt) : next.at,
              [`${props.clip.key}.${props.steps[0].key ?? ""}.duration`]: next.duration
            });
          } else {
            const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(props.baseAt, 0)), drag.at, drag.duration);
            TweakStore11.updateValues(props.timelineId, {
              [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - props.baseAt) : next.at,
              [`${props.clip.key}.duration`]: next.duration
            });
          }
        },
        onPointerup: finish,
        onPointercancel: () => finish(),
        onLostpointercapture: () => finish()
      }, children), looping ? h29("span", { class: "tweakers-timeline-loop-infinity", "aria-hidden": "true", title: "Repeats indefinitely" }, "\u221E") : null];
    };
  }
});

// src/vue/index.ts
import { TimelineStore as TimelineStore4 } from "tweakers/timeline";

// src/vue/components/ShortcutsMenu.ts
import { defineComponent as defineComponent31, h as h30, onUnmounted as onUnmounted14, ref as ref25, Teleport as Teleport8 } from "vue";
import { TweakStore as TweakStore12 } from "tweakers/store";
function formatShortcutKey(sc) {
  if (!sc.key) return "\u2014";
  const mod = sc.modifier === "alt" ? "\u2325" : sc.modifier === "shift" ? "\u21E7" : sc.modifier === "meta" ? "\u2318" : "";
  return `${mod}${sc.key.toUpperCase()}`;
}
function formatInteraction(sc) {
  const interaction = sc.interaction ?? "scroll";
  switch (interaction) {
    case "scroll":
      return sc.key ? "key+scroll" : "scroll";
    case "drag":
      return "key+drag";
    case "move":
      return "key+move";
    case "scroll-only":
      return "scroll";
  }
}
var ShortcutsMenu = defineComponent31({
  name: "TweakersShortcutsMenu",
  props: {
    panelId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isOpen = ref25(false);
    const triggerRef = ref25(null);
    const dropdownRef = ref25(null);
    const pos = ref25({ top: 0, right: 0 });
    const open = () => {
      const rect = triggerRef.value?.getBoundingClientRect();
      if (rect) {
        pos.value = { top: rect.bottom + 4, right: window.innerWidth - rect.right };
      }
      isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };
    const toggle = () => {
      if (isOpen.value) close();
      else open();
    };
    let mousedownHandler = null;
    const addOutsideClickListener = () => {
      mousedownHandler = (e) => {
        const target = e.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        close();
      };
      document.addEventListener("mousedown", mousedownHandler);
    };
    const removeOutsideClickListener = () => {
      if (mousedownHandler) {
        document.removeEventListener("mousedown", mousedownHandler);
        mousedownHandler = null;
      }
    };
    onUnmounted14(() => {
      removeOutsideClickListener();
    });
    return () => {
      const panel = TweakStore12.getPanel(props.panelId);
      if (!panel) return null;
      const shortcuts = Object.entries(panel.shortcuts);
      if (shortcuts.length === 0) return null;
      const findLabel = (controls, path) => {
        for (const c of controls) {
          if (c.path === path) return c.label;
          if (c.type === "folder" && c.children) {
            const found = findLabel(c.children, path);
            if (found) return found;
          }
        }
        return path;
      };
      const rows = shortcuts.map(([path, shortcut]) => ({
        path,
        shortcut,
        label: findLabel(panel.controls, path)
      }));
      if (isOpen.value) {
        if (!mousedownHandler) addOutsideClickListener();
      } else {
        removeOutsideClickListener();
      }
      return [
        h30("button", {
          ref: triggerRef,
          class: "tweakers-shortcuts-trigger",
          onClick: toggle,
          title: "Keyboard shortcuts"
        }, [
          h30("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            h30("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
            h30("path", { d: "M6 10H6.01" }),
            h30("path", { d: "M10 10H10.01" }),
            h30("path", { d: "M14 10H14.01" }),
            h30("path", { d: "M18 10H18.01" }),
            h30("path", { d: "M8 14H16" })
          ])
        ]),
        isOpen.value ? h30(Teleport8, { to: "body" }, [
          h30("div", {
            ref: dropdownRef,
            class: "tweakers-root tweakers-shortcuts-dropdown",
            style: {
              position: "fixed",
              top: `${pos.value.top}px`,
              right: `${pos.value.right}px`
            }
          }, [
            h30("div", { class: "tweakers-shortcuts-title" }, "Keyboard Shortcuts"),
            h30(
              "div",
              { class: "tweakers-shortcuts-list" },
              rows.map(
                (row) => h30("div", { key: row.path, class: "tweakers-shortcuts-row" }, [
                  h30("span", { class: "tweakers-shortcuts-row-key" }, formatShortcutKey(row.shortcut)),
                  h30("span", { class: "tweakers-shortcuts-row-label" }, row.label),
                  h30("span", { class: "tweakers-shortcuts-row-mode" }, formatInteraction(row.shortcut))
                ])
              )
            ),
            h30("div", { class: "tweakers-shortcuts-hint" }, "See pill badges on controls for keys")
          ])
        ]) : null
      ];
    };
  }
});

// src/vue/components/Module.ts
import { defineComponent as defineComponent32, h as h31 } from "vue";
var Module = defineComponent32({
  name: "TweakersModule",
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function, default: void 0 }
  },
  emits: ["enabledChange"],
  setup(props, { emit, slots }) {
    const setEnabled = (enabled) => {
      props.onEnabledChange?.(enabled);
      emit("enabledChange", enabled);
    };
    return () => h31("div", { class: "tweakers-module" }, [
      h31("div", { class: "tweakers-module-header" }, [
        h31(Checkbox, {
          checked: props.enabled,
          label: props.title,
          onChange: (next) => setEnabled(next)
        }),
        h31("span", { class: "tweakers-module-title" }, props.title)
      ]),
      h31("div", { class: "tweakers-module-collapse", "data-open": props.enabled }, [
        h31("div", { class: "tweakers-module-collapse-clip" }, [
          h31("div", { class: "tweakers-module-inner" }, slots.default ? slots.default() : [])
        ])
      ])
    ]);
  }
});

// src/vue/components/ButtonGroup.ts
import { defineComponent as defineComponent33, h as h32 } from "vue";
var ButtonGroup = defineComponent33({
  name: "TweakersButtonGroup",
  props: {
    buttons: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    return () => h32(
      "div",
      { class: "tweakers-button-group" },
      props.buttons.map(
        (button) => h32("button", { class: "tweakers-button", onClick: button.onClick }, button.label)
      )
    );
  }
});

// src/vue/components/WaveformVisualization.ts
import { defineComponent as defineComponent34, h as h33, ref as ref26, onMounted as onMounted20, onBeforeUnmount as onBeforeUnmount5 } from "vue";
import { createWaveformEngine, WAVEFORM_MAX_ZOOM } from "tweakers/waveform-engine";
var WaveformVisualization = defineComponent34({
  name: "TweakersWaveformVisualization",
  props: {
    buffer: { type: Object, default: null },
    progress: { type: Number, default: 0 },
    getProgress: { type: Function, default: void 0 },
    mode: { type: String, default: "smooth" },
    border: { type: Boolean, default: false },
    bands: { type: Boolean, default: false },
    pixelSize: { type: Number, default: 1 },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    onSeek: { type: Function, default: void 0 },
    loop: { type: Object, default: null },
    onLoopChange: { type: Function, default: void 0 },
    waveColor: { type: String, default: void 0 },
    playheadColor: { type: String, default: void 0 },
    autoZoomOnLoop: { type: Boolean, default: false },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const canvasRef = ref26(null);
    const zoom = ref26(1);
    let engine = null;
    onMounted20(() => {
      if (!canvasRef.value) return;
      engine = createWaveformEngine(
        canvasRef.value,
        () => ({
          buffer: props.buffer,
          progress: props.progress,
          getProgress: props.getProgress,
          mode: props.mode,
          border: props.border,
          bands: props.bands,
          pixelSize: props.pixelSize,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          playheadColor: props.playheadColor,
          autoZoomOnLoop: props.autoZoomOnLoop,
          loop: props.loop,
          zoom: zoom.value,
          width: props.width,
          height: props.height,
          onSeek: props.onSeek,
          onLoopChange: props.onLoopChange
        })
      );
    });
    onBeforeUnmount5(() => engine?.destroy());
    const minusIcon = () => h33("svg", { viewBox: "0 0 16 16", fill: "none" }, [
      h33("path", { d: "M3.5 8h9", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" })
    ]);
    const plusIcon = () => h33("svg", { viewBox: "0 0 16 16", fill: "none" }, [
      h33("path", { d: "M8 3.5v9M3.5 8h9", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" })
    ]);
    return () => {
      const framingLoop = props.autoZoomOnLoop && !!props.loop;
      const children = [
        h33("canvas", {
          ref: canvasRef,
          class: "tweakers-waveform-viz",
          style: { width: `${props.width}px`, height: `${props.height}px` }
        })
      ];
      if (!framingLoop) {
        const buttons = [];
        if (zoom.value > 1) {
          buttons.push(
            h33(
              "button",
              {
                type: "button",
                "aria-label": "Zoom out",
                onClick: () => {
                  zoom.value = Math.max(1, zoom.value / 2);
                }
              },
              [minusIcon()]
            )
          );
        }
        buttons.push(
          h33(
            "button",
            {
              type: "button",
              "aria-label": "Zoom in",
              disabled: zoom.value >= WAVEFORM_MAX_ZOOM,
              onClick: () => {
                zoom.value = Math.min(WAVEFORM_MAX_ZOOM, zoom.value * 2);
              }
            },
            [plusIcon()]
          )
        );
        children.push(h33("div", { class: "tweakers-waveform-zoom" }, buttons));
      }
      return h33("div", { class: "tweakers-waveform-viz-wrap", style: { width: `${props.width}px` } }, children);
    };
  }
});

// src/vue/components/AnalyserVisualization.ts
import { defineComponent as defineComponent35, h as h34, ref as ref27, onMounted as onMounted21, onBeforeUnmount as onBeforeUnmount6 } from "vue";
import { createAnalyserEngine } from "tweakers/analyser-engine";
var AnalyserVisualization = defineComponent35({
  name: "TweakersAnalyserVisualization",
  props: {
    analyser: { type: Object, default: null },
    source: { type: String, default: "frequency" },
    variant: { type: String, default: "area" },
    mode: { type: String, default: "smooth" },
    pixelSize: { type: Number, default: 1 },
    scale: { type: String, default: "log" },
    spring: { type: [Boolean, Object], default: false },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    waveColor: { type: String, default: void 0 },
    fillColor: { type: String, default: void 0 },
    muted: { type: Boolean, default: false },
    onMuteChange: { type: Function, default: void 0 },
    soloed: { type: Boolean, default: false },
    onSoloChange: { type: Function, default: void 0 },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const canvasRef = ref27(null);
    let engine = null;
    onMounted21(() => {
      if (!canvasRef.value) return;
      engine = createAnalyserEngine(
        canvasRef.value,
        () => ({
          analyser: props.analyser,
          source: props.source,
          variant: props.variant,
          mode: props.mode,
          pixelSize: props.pixelSize,
          scale: props.scale,
          spring: props.spring,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          fillColor: props.fillColor,
          muted: props.muted,
          width: props.width,
          height: props.height
        })
      );
    });
    onBeforeUnmount6(() => engine?.destroy());
    return () => {
      const children = [
        h34("canvas", {
          ref: canvasRef,
          class: "tweakers-analyser-viz",
          style: { width: `${props.width}px`, height: `${props.height}px` }
        })
      ];
      if (props.onMuteChange || props.onSoloChange) {
        const buttons = [];
        if (props.onMuteChange) {
          buttons.push(
            h34(
              "button",
              {
                type: "button",
                "aria-label": "Mute",
                "aria-pressed": props.muted,
                onClick: () => props.onMuteChange?.(!props.muted)
              },
              "M"
            )
          );
        }
        if (props.onSoloChange) {
          buttons.push(
            h34(
              "button",
              {
                type: "button",
                "aria-label": "Solo",
                "aria-pressed": props.soloed,
                onClick: () => props.onSoloChange?.(!props.soloed)
              },
              "S"
            )
          );
        }
        children.push(h34("div", { class: "tweakers-analyser-actions" }, buttons));
      }
      return h34("div", { class: "tweakers-analyser-viz-wrap", style: { width: `${props.width}px` } }, children);
    };
  }
});

// src/vue/components/CurveComposer.ts
import {
  defineComponent as defineComponent36,
  h as h35,
  ref as ref28,
  computed as computed13,
  onMounted as onMounted22,
  onBeforeUnmount as onBeforeUnmount7
} from "vue";
import {
  buildSamplers,
  segmentSpan,
  segmentIndexAt,
  boundaries,
  splitSegment,
  cycleSegmentType,
  redistributeWeight,
  cycleDriverType,
  readComposition,
  triggersCrossed,
  toLocalCoords,
  pointerTarget,
  headerHit,
  applySegmentBodyDrag,
  applyDriverBodyDrag,
  composerLayout,
  mapY,
  curvePath,
  diagonalLine,
  playheadGeometry,
  timelineSlots,
  connectorPath,
  DEFAULT_TRIGGER_STEPS,
  DRAG_THRESHOLD,
  EDGE_HIT
} from "tweakers/curve-composer-core";
var CurveComposer = defineComponent36({
  name: "TweakersCurveComposer",
  props: {
    /** The curve series (controlled). */
    segments: { type: Array, required: true },
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver: { type: Object, default: null },
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction: { type: String, default: "forward" },
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange: { type: Function, default: void 0 },
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange: { type: Function, default: void 0 },
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase: { type: Function, default: void 0 },
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase: { type: Number, default: 0 },
    /** Output mode. 'continuous' reads the composed value each frame; 'trigger' emits via onTrigger. */
    mode: { type: String, default: "continuous" },
    /** Number of trigger levels in trigger mode. */
    triggerSteps: { type: Number, default: DEFAULT_TRIGGER_STEPS },
    /** Fired in trigger mode when the value crosses a trigger level. */
    onTrigger: { type: Function, default: void 0 },
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex: { type: Number, default: null },
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect: { type: Function, default: void 0 },
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor: { type: String, default: void 0 },
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor: { type: String, default: void 0 },
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap: { type: Number, default: 0 },
    /** Faint vertical reference grid behind each lane. */
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    width: { type: Number, default: 256 },
    /** Height of the main lane; the driver lane adds height below it. */
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const svgRef = ref28(null);
    const seriesPlayheadRef = ref28(null);
    const seriesDotRef = ref28(null);
    const driverPlayheadRef = ref28(null);
    const drag = ref28(null);
    const hover = ref28(null);
    const layout = computed13(() => composerLayout(props.width, props.height, props.driver != null));
    const W = computed13(() => layout.value.W);
    const totalH = computed13(() => layout.value.totalH);
    const mainRect = computed13(() => layout.value.mainRect);
    const driverRect = computed13(() => layout.value.driverRect);
    const composition = computed13(() => ({
      segments: props.segments,
      driver: props.driver,
      direction: props.direction,
      gap: props.gap
    }));
    const samplers = computed13(() => buildSamplers(composition.value));
    let raf = 0;
    let prevTrigValue = Number.NaN;
    let armW = Number.NaN;
    let armTotalH = Number.NaN;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (W.value !== armW || totalH.value !== armTotalH) {
        prevTrigValue = Number.NaN;
        armW = W.value;
        armTotalH = totalH.value;
      }
      const c = composition.value;
      const s = samplers.value;
      const u = props.getPhase ? props.getPhase() : props.phase;
      const read = readComposition(c, u, s);
      const geo = playheadGeometry(read, layout.value);
      if (seriesPlayheadRef.value) {
        seriesPlayheadRef.value.setAttribute("x1", String(geo.seriesX));
        seriesPlayheadRef.value.setAttribute("x2", String(geo.seriesX));
      }
      if (seriesDotRef.value) {
        seriesDotRef.value.setAttribute("cx", String(geo.dotX));
        seriesDotRef.value.setAttribute("cy", String(geo.dotY));
      }
      if (driverPlayheadRef.value) {
        driverPlayheadRef.value.setAttribute("x1", String(geo.driverX));
        driverPlayheadRef.value.setAttribute("x2", String(geo.driverX));
      }
      if (props.mode === "trigger") {
        const prev = prevTrigValue;
        if (!Number.isNaN(prev)) {
          for (const idx of triggersCrossed(prev, read.value, props.triggerSteps)) props.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    onMounted22(() => {
      raf = requestAnimationFrame(tick);
    });
    onBeforeUnmount7(() => cancelAnimationFrame(raf));
    const hitLayout = () => ({ totalH: totalH.value, driverY: driverRect.value ? driverRect.value.y : null, gap: props.gap });
    const localCoords = (clientX, clientY) => {
      const rect = svgRef.value.getBoundingClientRect();
      return { ...toLocalCoords(clientX, clientY, rect, totalH.value), rectW: rect.width };
    };
    const onPointerDown = (e) => {
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      try {
        svgRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      const header = headerHit(xN, py, props.segments, hitLayout());
      if (typeof header === "number") {
        drag.value = { kind: "select", index: header, startX: e.clientX, startY: e.clientY, moved: false };
        return;
      }
      const target = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT / rectW);
      if (target.kind === "driver") {
        drag.value = {
          kind: "driver",
          startX: e.clientX,
          startY: e.clientY,
          baseCurvature: props.driver.curvature,
          baseSteepness: props.driver.steepness,
          moved: false
        };
      } else if (target.kind === "boundary") {
        drag.value = {
          kind: "boundary",
          index: target.index,
          startX: e.clientX,
          startY: e.clientY,
          base: composition.value,
          moved: false
        };
      } else {
        const seg = props.segments[target.index];
        drag.value = {
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
      const d = drag.value;
      if (!d) {
        const { xN, py, rectW: rectW2 } = localCoords(e.clientX, e.clientY);
        if (typeof headerHit(xN, py, props.segments, hitLayout()) === "number") {
          hover.value = { kind: "header", index: 0 };
          return;
        }
        const t = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT / rectW2);
        hover.value = t.kind === "driver" ? { kind: "driver", index: 0 } : { kind: t.kind, index: t.index };
        return;
      }
      const svgRect = svgRef.value.getBoundingClientRect();
      const rectW = svgRect.width;
      const rectH = svgRect.height;
      const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
      if (!moved) return;
      if (d.kind === "boundary") {
        const deltaFrac = (e.clientX - d.startX) / rectW;
        const next = redistributeWeight(d.base, d.index, deltaFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === "segment") {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applySegmentBodyDrag(composition.value, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === "driver") {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applyDriverBodyDrag(composition.value, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        if (next.driver) props.onDriverChange?.(next.driver);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else {
        if (!d.moved) drag.value = { ...d, moved: true };
      }
    };
    const onPointerUp = (e) => {
      const d = drag.value;
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
      if (!d || d.moved) return;
      if (d.kind === "select") {
        props.onSelect?.(d.index);
      } else if (d.kind === "driver") {
        const next = cycleDriverType(composition.value);
        if (next.driver) props.onDriverChange?.(next.driver);
      } else if (d.kind === "segment") {
        props.onSegmentsChange?.(cycleSegmentType(composition.value, d.index).segments);
      }
    };
    const onPointerCancel = (e) => {
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
    };
    const onPointerLeave = () => {
      if (!drag.value) hover.value = null;
    };
    const onDoubleClick = (e) => {
      const { xN, py } = localCoords(e.clientX, e.clientY);
      if (driverRect.value && py >= driverRect.value.y) return;
      props.onSegmentsChange?.(splitSegment(composition.value, segmentIndexAt(xN, props.segments, props.gap)).segments);
    };
    const renderLaneGrid = (rect) => {
      if (!props.grid) return [];
      const n = Math.max(1, Math.round(props.gridSubdivisions));
      const lines = [];
      for (let i = 1; i < n; i++) {
        const gx = i / n * W.value;
        lines.push(
          h35("line", { key: `g-${rect.y}-${i}`, class: "tweakers-cc-grid", x1: gx, y1: rect.y, x2: gx, y2: rect.y + rect.h })
        );
      }
      return lines;
    };
    const renderLaneBg = (rect, key) => h35("rect", { key, class: "tweakers-cc-lane", x: rect.x, y: rect.y, width: rect.w, height: rect.h, rx: 8 });
    const diagonal = (rect, span, key) => {
      const d = diagonalLine(rect, span, W.value);
      return h35("line", { key, class: "tweakers-cc-diagonal", x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 });
    };
    return () => {
      const main = mainRect.value;
      const dr = driverRect.value;
      const interior = boundaries(props.segments, props.gap);
      const activeKind = drag.value?.kind ?? hover.value?.kind;
      const cursor = activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : activeKind === "select" || activeKind === "header" ? "pointer" : "default";
      const children = [];
      children.push(renderLaneBg(main, "main-bg"));
      children.push(renderLaneGrid(main));
      if (props.selectedIndex != null && props.selectedIndex >= 0 && props.selectedIndex < props.segments.length) {
        const span = segmentSpan(props.segments, props.selectedIndex, props.gap);
        children.push(
          h35("rect", {
            class: "tweakers-cc-seg-selected",
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8
          })
        );
      }
      if (hover.value?.kind === "segment" && !drag.value) {
        const span = segmentSpan(props.segments, hover.value.index, props.gap);
        children.push(
          h35("rect", {
            class: "tweakers-cc-seg-hover",
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8
          })
        );
      }
      children.push(
        props.segments.map((seg, i) => {
          const span = segmentSpan(props.segments, i, props.gap);
          return h35("g", { key: `seg-${i}` }, [
            diagonal(main, span, `diag-${i}`),
            h35("path", { class: "tweakers-cc-curve", d: curvePath(seg, main, span, W.value) }),
            h35(
              "text",
              { class: "tweakers-cc-label", x: (span[0] + span[1]) * 0.5 * W.value, y: main.y + 13 },
              seg.type
            )
          ]);
        })
      );
      if (props.gap > 0) {
        children.push(
          timelineSlots(props.segments, props.gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a).map(
            (slot) => h35("path", {
              key: `conn-${slot.index}`,
              class: "tweakers-cc-connector",
              d: connectorPath(slot, samplers.value, props.segments.length, main, W.value)
            })
          )
        );
      }
      children.push(
        interior.map(
          (bx, i) => h35("line", {
            key: `b-${i}`,
            class: "tweakers-cc-boundary",
            "data-active": String(
              hover.value?.kind === "boundary" && hover.value.index === i || drag.value?.kind === "boundary" && drag.value.index === i
            ),
            x1: bx * W.value,
            y1: main.y,
            x2: bx * W.value,
            y2: main.y + main.h
          })
        )
      );
      children.push(
        h35("line", {
          ref: seriesPlayheadRef,
          class: "tweakers-cc-playhead",
          x1: 0,
          y1: main.y,
          x2: 0,
          y2: main.y + main.h,
          style: { stroke: props.playheadColor }
        })
      );
      children.push(
        h35("circle", {
          ref: seriesDotRef,
          class: "tweakers-cc-dot",
          cx: 0,
          cy: mapY(main, 0),
          r: 3,
          style: { fill: props.playheadColor }
        })
      );
      if (dr) {
        children.push(renderLaneBg(dr, "driver-bg"));
        children.push(renderLaneGrid(dr));
        if (hover.value?.kind === "driver" && !drag.value) {
          children.push(
            h35("rect", { class: "tweakers-cc-seg-hover", x: 0, y: dr.y, width: W.value, height: dr.h, rx: 8 })
          );
        }
        children.push(diagonal(dr, [0, 1], "driver-diag"));
        children.push(
          h35("path", { class: "tweakers-cc-curve tweakers-cc-curve-driver", d: curvePath(props.driver, dr, [0, 1], W.value) })
        );
        children.push(
          h35("text", { class: "tweakers-cc-label", x: W.value * 0.5, y: dr.y + 13 }, `driver \xB7 ${props.driver.type}`)
        );
        children.push(
          h35("line", {
            ref: driverPlayheadRef,
            class: "tweakers-cc-playhead",
            x1: 0,
            y1: dr.y,
            x2: 0,
            y2: dr.y + dr.h,
            style: { stroke: props.playheadColor }
          })
        );
      }
      return h35("div", { class: "tweakers-cc-wrap", style: { width: `${W.value}px` } }, [
        h35(
          "svg",
          {
            ref: svgRef,
            class: "tweakers-cc",
            viewBox: `0 0 ${W.value} ${totalH.value}`,
            width: W.value,
            height: totalH.value,
            style: { width: `${W.value}px`, height: `${totalH.value}px`, cursor, color: props.curveColor },
            onPointerdown: onPointerDown,
            onPointermove: onPointerMove,
            onPointerup: onPointerUp,
            onPointercancel: onPointerCancel,
            onPointerleave: onPointerLeave,
            onDblclick: onDoubleClick
          },
          children
        )
      ]);
    };
  }
});

// src/vue/index.ts
import { springify } from "tweakers/curve-composer-core";
import {
  gradientToCss as gradientToCss3,
  normalizeGradient as normalizeGradient2,
  colorAtPosition,
  addStop as addStop2,
  removeStop as removeStop2,
  moveStop as moveStop2,
  setStopColor as setStopColor2,
  setGradientType as setGradientType2,
  setGradientAngle as setGradientAngle2,
  DEFAULT_GRADIENT as DEFAULT_GRADIENT2,
  MIN_STOPS as MIN_STOPS2
} from "tweakers/gradient-core";
import { TweakStore as TweakStore13 } from "tweakers/store";
export {
  AnalyserVisualization,
  ButtonGroup,
  Checkbox,
  ColorControl,
  ColorPickerPanel,
  ControlRenderer,
  ControlShell,
  CurveComposer,
  DEFAULT_GRADIENT2 as DEFAULT_GRADIENT,
  EasingVisualization,
  Folder,
  GradientControl,
  GradientPanel,
  MIN_STOPS2 as MIN_STOPS,
  Module,
  NumberControl,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  ShortcutKey,
  ShortcutListener,
  ShortcutsMenu,
  Slider,
  SpringControl,
  SpringVisualization,
  TextControl,
  TimelineStore4 as TimelineStore,
  TimelineToggleButton,
  Toggle,
  TransitionControl,
  TweakRoot,
  TweakStore13 as TweakStore,
  TweakTimeline,
  WaveformVisualization,
  XYControl,
  XYPad,
  addStop2 as addStop,
  colorAtPosition,
  gradientToCss3 as gradientToCss,
  moveStop2 as moveStop,
  normalizeGradient2 as normalizeGradient,
  removeStop2 as removeStop,
  setGradientAngle2 as setGradientAngle,
  setGradientType2 as setGradientType,
  setStopColor2 as setStopColor,
  springify,
  useShortcutContext,
  useTweakTimeline,
  useTweakers,
  vTweakers
};
//# sourceMappingURL=index.js.map