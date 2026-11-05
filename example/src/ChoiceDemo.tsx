import { useState } from 'react';
import { DialRoot, useDialKit, type ChipOption, type DialEvent } from 'dialkit';

// The choice controls: chips, multiselect, swatch, file, gallery and list.
export function ChoiceDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [looks, setLooks] = useState<ChipOption[]>([
    { value: 'warm', label: 'Warm' },
    { value: 'cool', label: 'Cool' },
    { value: 'faded', label: 'Faded film' },
    { value: 'mine', label: 'My look', removable: true },
  ]);
  const [log, setLog] = useState<string[]>([]);
  const onEvent = (path: string, event: DialEvent) => {
    if (event.kind === 'remove') setLooks((current) => current.filter((look) => look.value !== event.value));
    const detail = event.kind === 'file' ? `${event.files.length} file(s)` : event.kind === 'remove' ? event.value : event.op;
    setLog((current) => [`${path}: ${event.kind} ${detail}`, ...current].slice(0, 6));
  };

  const values = useDialKit('Choices', {
    look: { type: 'chips', options: looks, default: 'warm' },
    layers: { type: 'multiselect', options: [{ value: 'grain', label: 'Grain', hint: 'Fine noise over the photo', tag: 'local' }, { value: 'blur', label: 'Blur' }, { value: 'glow', label: 'Glow', tag: 'cloud' }], default: ['grain'] },
    palette: { type: 'swatch', options: [{ value: 'dusk', label: 'Dusk', colors: ['#2b2d42', '#8d99ae', '#ef233c'] }, { value: 'sea', label: 'Sea', colors: ['#0096c7'] }, { value: 'sand', label: 'Sand', colors: ['#e9c46a', '#f4a261'] }], default: 'dusk' },
    source: { type: 'file', accept: 'image/*' },
    cover: { type: 'gallery', items: [{ id: 'one', src: '/photos/one.avif', alt: 'One' }, { id: 'two', src: '/photos/two.avif', alt: 'Two' }, { id: 'three', src: '/photos/three.avif', alt: 'Three' }] },
    effects: {
      type: 'list',
      addLabel: 'Add effect',
      max: 4,
      itemTypes: {
        blur: { label: 'Blur', schema: { radius: [4, 0, 20], soft: true } },
        tint: {
          label: 'Tint',
          schema: { color: '#ff6b6b', mode: { type: 'select', options: ['multiply', 'screen'] }, amount: 0.5, note: { type: 'text', placeholder: 'Why' } },
          hints: { amount: 'How strong the tint is.' },
          groups: { note: 'More' },
        },
      },
      default: [{ type: 'blur', params: { radius: 6 } }],
    },
    _hints: { look: 'The photo\'s look.', effects: 'Effects run from the top down.' },
  }, { onEvent });

  return (
    <main style={{ minHeight: '100vh', padding: 32, fontFamily: 'system-ui', background: theme === 'dark' ? '#111' : '#f4f4f4', color: theme === 'dark' ? '#eee' : '#111' }}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Switch theme</button>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(values, null, 2)}</pre>
      <pre style={{ fontSize: 12, opacity: 0.7 }}>{log.join('\n')}</pre>
      <DialRoot position="top-right" theme={theme} />
    </main>
  );
}
