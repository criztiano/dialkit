<script lang="ts">
  let { label, value, onChange, placeholder } = $props<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }>();
</script>

<div class="tweakers-text-control">
  <label class="tweakers-text-label">{label}</label>
  <input
    type="text"
    class="tweakers-text-input"
    value={value}
    placeholder={placeholder}
    oninput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
  />
</div>
