import { DialStore, normalizeListItems } from 'dialkit/store';
let dialKitInstance = 0;
export function createDialKit(name, config, options) {
    const panelId = `${name}-${++dialKitInstance}`;
    const resolve = () => buildResolvedValues(config, DialStore.getValues(panelId), '');
    let values = $state(resolve());
    $effect(() => {
        DialStore.registerPanel(panelId, name, config, options?.shortcuts);
        values = resolve();
        const unsubValues = DialStore.subscribe(panelId, () => {
            values = resolve();
        });
        const unsubActions = options?.onAction
            ? DialStore.subscribeActions(panelId, options.onAction)
            : undefined;
        const unsubEvents = options?.onEvent
            ? DialStore.subscribeEvents(panelId, options.onEvent)
            : undefined;
        return () => {
            unsubValues();
            unsubActions?.();
            unsubEvents?.();
            DialStore.unregisterPanel(panelId);
        };
    });
    return values;
}
function buildResolvedValues(config, flatValues, prefix) {
    const result = {};
    for (const [key, configValue] of Object.entries(config)) {
        if (key === '_collapsed')
            continue;
        const path = prefix ? `${prefix}.${key}` : key;
        if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === 'number') {
            result[key] = flatValues[path] ?? configValue[0];
        }
        else if (typeof configValue === 'number' || typeof configValue === 'boolean' || typeof configValue === 'string') {
            result[key] = flatValues[path] ?? configValue;
        }
        else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue;
        }
        else if (isActionConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue;
        }
        else if (isSelectConfig(configValue)) {
            const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
            result[key] = flatValues[path] ?? defaultValue;
        }
        else if (isColorConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue.default ?? '#000000';
        }
        else if (isTextConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue.default ?? '';
        }
        else if (isFileConfig(configValue)) {
            result[key] = flatValues[path] ?? '';
        }
        else if (isSwatchConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
        }
        else if (isChipsConfig(configValue)) {
            result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
        }
        else if (isListConfig(configValue)) {
            result[key] = flatValues[path] ?? normalizeListItems(configValue);
        }
        else if (typeof configValue === 'object' && configValue !== null) {
            result[key] = buildResolvedValues(configValue, flatValues, path);
        }
    }
    return result;
}
function hasType(value, type) {
    return typeof value === 'object' && value !== null && 'type' in value && value.type === type;
}
function isSpringConfig(value) {
    return hasType(value, 'spring');
}
function isEasingConfig(value) {
    return hasType(value, 'easing');
}
function isActionConfig(value) {
    return hasType(value, 'action');
}
function isSelectConfig(value) {
    return hasType(value, 'select') && 'options' in value && Array.isArray(value.options);
}
function isColorConfig(value) {
    return hasType(value, 'color');
}
function isTextConfig(value) {
    return hasType(value, 'text');
}
function isFileConfig(value) {
    return hasType(value, 'file');
}
function isSwatchConfig(value) {
    return hasType(value, 'swatch') && 'options' in value && Array.isArray(value.options);
}
function isChipsConfig(value) {
    return hasType(value, 'chips') && 'options' in value && Array.isArray(value.options);
}
function isListConfig(value) {
    return hasType(value, 'list') && 'itemTypes' in value && typeof value.itemTypes === 'object';
}
function getFirstOptionValue(options) {
    const first = options[0];
    return typeof first === 'string' ? first : first.value;
}
