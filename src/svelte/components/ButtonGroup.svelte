<script lang="ts">
  export type ButtonAction = {
    label: string;
    onClick: () => void;
  };

  let { buttons } = $props<{ buttons: ButtonAction[] }>();
</script>

<div class="tweakers-button-group">
  {#each buttons as button (button.label)}
    <button class="tweakers-button" onclick={button.onClick}>
      {button.label}
    </button>
  {/each}
</div>
