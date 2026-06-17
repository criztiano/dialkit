<script lang="ts">
  import { ICON_CLOSE, ICON_FILE } from '../../icons';

  let { label, value, accept, multiple = false, onChange, onPick } = $props<{
    label: string;
    value: string;
    accept?: string;
    multiple?: boolean;
    onChange: (filename: string) => void;
    onPick: (files: FileList) => void;
  }>();

  let inputRef: HTMLInputElement | undefined;

  function handleChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;
    onPick(files);
    onChange(files.length === 1 ? files[0].name : `${files.length} files`);
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    if (inputRef) inputRef.value = '';
    onChange('');
  }
</script>

<div class="dialkit-file-row">
  <button type="button" class="dialkit-file-trigger" onclick={() => inputRef?.click()}>
    <span class="dialkit-file-label">{label}</span>
    <span class="dialkit-file-right">
      <svg
        class="dialkit-file-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d={ICON_FILE} />
      </svg>
      <span class="dialkit-file-name" data-empty={String(!value)}>{value || 'Choose file…'}</span>
    </span>
  </button>

  {#if value}
    <button type="button" class="dialkit-file-clear" onclick={clear} aria-label="Clear file">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d={ICON_CLOSE} />
      </svg>
    </button>
  {/if}

  <input
    bind:this={inputRef}
    class="dialkit-file-input"
    type="file"
    {accept}
    {multiple}
    onchange={handleChange}
  />
</div>
