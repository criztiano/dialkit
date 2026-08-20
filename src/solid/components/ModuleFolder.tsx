import { createSignal, JSX, Show } from 'solid-js';
import { Checkbox } from './Checkbox';

interface ModuleFolderProps {
  title: string;
  /** Whether the module is on — the value at the folder's `_enabled` path. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** Initial open state while enabled (`_collapsed: true` starts closed). */
  defaultOpen?: boolean;
  /** One line of help for the section, revealed on hover over the header. */
  hint?: string;
  hintId?: string;
  children?: JSX.Element;
}

/**
 * A config-level module: a folder that declared `_enabled`. Same idiom as the
 * standalone Module — the header switch doubles as the expand control and the
 * body collapses away with the grid-rows height transition when off (see
 * theme.css). On top of that, clicking the header toggles the open state while
 * enabled, so `_collapsed` still controls how the section starts.
 */
export function ModuleFolder(props: ModuleFolderProps) {
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? true);

  const handleEnabledChange = (next: boolean) => {
    props.onEnabledChange(next);
    // Turning on always reveals the body — a switch that lands on a still-
    // collapsed section would read as broken.
    if (next) setIsOpen(true);
  };

  return (
    <div class="dialkit-module dialkit-module-folder" data-open={props.enabled && isOpen() ? 'true' : 'false'}>
      <div
        class="dialkit-module-header dialkit-module-header-toggle"
        onClick={() => { if (props.enabled) setIsOpen(open => !open); }}
        data-hint={props.hint ? 'true' : undefined}
        aria-describedby={props.hint ? props.hintId : undefined}
      >
        <Checkbox checked={props.enabled} onChange={handleEnabledChange} label={props.title} />
        <span class="dialkit-module-title">{props.title}</span>
        <Show when={props.hint}>
          <span class="dialkit-hint" id={props.hintId} role="tooltip">
            {props.hint}
          </span>
        </Show>
      </div>

      <div class="dialkit-module-collapse" data-open={props.enabled && isOpen()}>
        <div class="dialkit-module-collapse-clip">
          <div class="dialkit-module-inner">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
