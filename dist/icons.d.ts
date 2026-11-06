/** Icons are a single path or a list of paths. */
declare function iconPaths(icon: string | readonly string[]): readonly string[];
declare const ICON_CHEVRON = "M6 9.5L12 15.5L18 9.5";
declare const ICON_CLOSE = "M6 6L18 18M18 6L6 18";
declare const ICON_CHECK = "M5 12.75L10 19L19 5";
declare const ICON_PAUSE: string[];
declare const ICON_PLAY = "M9.24394 2.36758C7.41419 1.18362 5 2.49701 5 4.67639V19.3238C5 21.5032 7.41419 22.8166 9.24394 21.6326L20.5624 14.3089C22.2371 13.2253 22.2372 10.775 20.5624 9.69129L9.24394 2.36758Z";
declare const ICON_REPLAY: string[];
declare const ICON_LOOP: string[];
declare const ICON_TIMELINE: string[];
declare const ICON_CLIPBOARD: {
    board: string;
    sparkle: string;
    body: string;
};
declare const ICON_CLIPBOARD_PLAIN: {
    board: string;
    body: string;
};
declare const ICON_PLUS: string[];
/** An open eye: shown. */
declare const ICON_EYE: string[];
/** An eye crossed out: hidden. */
declare const ICON_EYE_OFF: string[];
declare const ICON_COPY: string[];
declare const ICON_PASTE: string[];
declare const ICON_ADD_PRESET: string[];
declare const ICON_TRASH: string[];
declare const ICON_MORE: string[];
declare const ICON_PENCIL: string[];
declare const ICON_LOCK: string[];
declare const ICON_LOCK_OPEN: string[];
declare const ICON_RESET: string[];
declare const ICON_PANEL: {
    path: string;
    circles: {
        cx: string;
        cy: string;
        r: string;
    }[];
};
declare const ICON_GRID: string[];
declare const ICON_LINK: string[];
/** A sheet with a folded corner: the file control. */
declare const ICON_FILE = "M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19";
/** Six dots, drawn as circles of radius 1.5: a list row's drag handle. */
declare const ICON_GRIP: {
    cx: number;
    cy: number;
}[];

export { ICON_ADD_PRESET, ICON_CHECK, ICON_CHEVRON, ICON_CLIPBOARD, ICON_CLIPBOARD_PLAIN, ICON_CLOSE, ICON_COPY, ICON_EYE, ICON_EYE_OFF, ICON_FILE, ICON_GRID, ICON_GRIP, ICON_LINK, ICON_LOCK, ICON_LOCK_OPEN, ICON_LOOP, ICON_MORE, ICON_PANEL, ICON_PASTE, ICON_PAUSE, ICON_PENCIL, ICON_PLAY, ICON_PLUS, ICON_REPLAY, ICON_RESET, ICON_TIMELINE, ICON_TRASH, iconPaths };
