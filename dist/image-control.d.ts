import { I as ImageOption } from './DialStore-BfYEfV2g.js';
import './dial-pad.js';
import './anchor.js';
import './background.js';

type ImageControlProps = {
    label: string;
    value: string;
    options?: ImageOption[];
    onChange: (value: string) => void;
    hint?: string;
    /** `false` drops the upload button, for a fixed set of images (a gallery). Default `true`. */
    upload?: boolean;
    /** `false` drops the Remove button, so an image is always chosen. Default `true`. */
    clearable?: boolean;
};
type NamedImage = {
    value: string;
    label: string;
};
declare function imageLabel(value: string): string;
declare function imageOptions(options?: ImageOption[], uploaded?: NamedImage[], value?: string): NamedImage[];
/** Shared picker so selection, uploads, focus, and positioning match in every framework. */
declare function mountImageControl(host: HTMLElement, initial: ImageControlProps, presentation?: 'popover' | 'inline'): {
    update(next: ImageControlProps): void;
    destroy(): void;
};

export { type ImageControlProps, imageLabel, imageOptions, mountImageControl };
