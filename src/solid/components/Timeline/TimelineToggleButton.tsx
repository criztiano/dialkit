import { For } from 'solid-js';
import { ICON_TIMELINE } from 'tweakers/icons';
import { TimelineUiStore } from 'tweakers/timeline';
import { fromStore } from '../../primitives';

export function TimelineToggleButton() {
  const visible = fromStore(
    () => TimelineUiStore.getVisible(),
    (notify) => TimelineUiStore.subscribe(notify)
  );
  const label = () => visible() ? 'Hide timeline' : 'Show timeline';
  return (
    <button
      class="tweakers-toolbar-add tweakers-timeline-toolbar-toggle"
      data-active={visible() || undefined}
      aria-pressed={visible()}
      aria-label={label()}
      title={label()}
      onClick={() => TimelineUiStore.toggle()}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <For each={ICON_TIMELINE}>{(path) => <path d={path} fill="currentColor" />}</For>
      </svg>
    </button>
  );
}
