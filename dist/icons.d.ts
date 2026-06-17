declare const ICON_CHEVRON = "M6 9.5L12 15.5L18 9.5";
declare const ICON_CHECK = "M5 12.75L10 19L19 5";
declare const ICON_CLOSE = "M6 6L18 18M6 18L18 6";
declare const ICON_PLUS = "M12 5V19M5 12H19";
declare const ICON_GRIP: {
    cx: string;
    cy: string;
}[];
declare const ICON_FILE = "M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19";
declare const ICON_CLIPBOARD: {
    board: string;
    sparkle: string;
    body: string;
};
declare const ICON_ADD_PRESET: string[];
declare const ICON_TRASH: string[];
declare const ICON_PANEL: {
    path: string;
    circles: {
        cx: string;
        cy: string;
        r: string;
    }[];
};

export { ICON_ADD_PRESET, ICON_CHECK, ICON_CHEVRON, ICON_CLIPBOARD, ICON_CLOSE, ICON_FILE, ICON_GRIP, ICON_PANEL, ICON_PLUS, ICON_TRASH };
