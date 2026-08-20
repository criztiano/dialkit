import {
  createApp,
  defineComponent,
  h,
  shallowRef,
  type App,
  type ObjectDirective,
  type ShallowRef,
} from 'vue';
import { TweakRoot, type TweakMode, type TweakPosition } from '../components/TweakRoot';

export interface TweakersDirectiveOptions {
  position?: TweakPosition;
  defaultOpen?: boolean;
  mode?: TweakMode;
}

export type TweakersDirectiveValue = TweakMode | TweakersDirectiveOptions | undefined;

type DirectiveState = {
  app: App;
  host: HTMLDivElement;
  props: ShallowRef<TweakersDirectiveOptions>;
};

const states = new WeakMap<HTMLElement, DirectiveState>();

function normalizeDirectiveValue(value: TweakersDirectiveValue): TweakersDirectiveOptions {
  if (!value) return {};
  if (value === 'inline' || value === 'popover') {
    return { mode: value };
  }
  return value;
}

function mountTweakRoot(el: HTMLElement, value: TweakersDirectiveValue) {
  if (typeof window === 'undefined') return;

  const host = document.createElement('div');
  el.appendChild(host);

  const props = shallowRef<TweakersDirectiveOptions>(normalizeDirectiveValue(value));
  const RootHost = defineComponent({
    name: 'TweakersDirectiveHost',
    setup() {
      return () => h(TweakRoot, props.value);
    },
  });

  const app = createApp(RootHost);
  app.mount(host);

  states.set(el, { app, host, props });
}

function unmountTweakRoot(el: HTMLElement) {
  const state = states.get(el);
  if (!state) return;

  state.app.unmount();
  state.host.remove();
  states.delete(el);
}

export const vTweakers: ObjectDirective<HTMLElement, TweakersDirectiveValue> = {
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
  },
};
