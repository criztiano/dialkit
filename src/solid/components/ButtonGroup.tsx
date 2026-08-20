import { For } from 'solid-js';

interface ButtonGroupProps {
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div class="tweakers-button-group">
      <For each={props.buttons}>
        {(button) => (
          <button class="tweakers-button" onClick={button.onClick}>
            {button.label}
          </button>
        )}
      </For>
    </div>
  );
}
