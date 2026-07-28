export type AppGlyphName =
  | "messages"
  | "phone"
  | "gallery"
  | "files"
  | "recorder"
  | "notes"
  | "calendar"
  | "contacts"
  | "guide"
  | "settings";

export type UiIconName =
  | "back"
  | "backspace"
  | "battery"
  | "bluetooth"
  | "camera"
  | "check"
  | "chevronLeft"
  | "chevronRight"
  | "close"
  | "edit"
  | "flash"
  | "fullscreen"
  | "hangup"
  | "heart"
  | "info"
  | "keypad"
  | "lock"
  | "more"
  | "mute"
  | "phone"
  | "play"
  | "search"
  | "send"
  | "share"
  | "signal"
  | "speaker"
  | "trash"
  | "video"
  | "wifi"
  | "zoomIn"
  | "zoomOut";

type IconProps = {
  className?: string;
  name: UiIconName;
  size?: number;
};

export function UiIcon({ className, name, size = 24 }: IconProps) {
  const shared = {
    "aria-hidden": true,
    className,
    height: size,
    viewBox: "0 0 24 24",
    width: size,
  } as const;

  switch (name) {
    case "back":
      return (
        <svg {...shared} fill="none">
          <path d="m14.75 5.5-6.5 6.5 6.5 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" />
        </svg>
      );
    case "backspace":
      return (
        <svg {...shared} fill="none">
          <path d="M9.2 6.2h9.1a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2H9.2L3.7 12l5.5-5.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="m12 9.2 5.2 5.6m0-5.6L12 14.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    case "battery":
      return (
        <svg {...shared} fill="none">
          <rect x="3.5" y="7.2" width="16" height="9.6" rx="2.3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M20.4 10.2v3.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <rect x="6.2" y="9.6" width="9.4" height="4.8" rx="1.2" fill="currentColor" />
        </svg>
      );
    case "bluetooth":
      return (
        <svg {...shared} fill="none">
          <path d="m12 3.5 5 4.3-5 4.2 5 4.2-5 4.3v-17Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="m7 7.2 10 9M7 16.8l10-9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      );
    case "camera":
      return (
        <svg {...shared} fill="none">
          <path d="M8.4 6.5 9.6 4.8h4.8l1.2 1.7h2.2a2.2 2.2 0 0 1 2.2 2.2v7.5a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 16.2V8.7a2.2 2.2 0 0 1 2.2-2.2h2.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "check":
      return (
        <svg {...shared} fill="none">
          <path d="m5.3 12.5 4.2 4.1 9.2-9.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "chevronLeft":
      return (
        <svg {...shared} fill="none">
          <path d="m14.2 6.2-5.8 5.8 5.8 5.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...shared} fill="none">
          <path d="m9.8 6.2 5.8 5.8-5.8 5.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
    case "close":
      return (
        <svg {...shared} fill="none">
          <path d="m6.5 6.5 11 11m0-11-11 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
    case "edit":
      return (
        <svg {...shared} fill="none">
          <path d="m14.8 5.2 4 4L9.1 19H5v-4.1l9.8-9.7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="m12.9 7.1 4 4" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "flash":
      return (
        <svg {...shared} fill="none">
          <path d="M13.4 2.8 6.8 13h5l-1.2 8.2L17.2 11h-5l1.2-8.2Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
      );
    case "fullscreen":
      return (
        <svg {...shared} fill="none">
          <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "hangup":
      return (
        <svg {...shared} fill="none">
          <path d="M5.2 14.8c4.6-3.8 9-3.8 13.6 0l-2.2 3.1-3-1.6v-2.1a8.3 8.3 0 0 0-3.2 0v2.1l-3 1.6-2.2-3.1Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
      );
    case "heart":
      return (
        <svg {...shared} fill="none">
          <path d="M12 19.4S4.4 15 4.4 9.3A4.1 4.1 0 0 1 12 7.1a4.1 4.1 0 0 1 7.6 2.2C19.6 15 12 19.4 12 19.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "info":
      return (
        <svg {...shared} fill="none">
          <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 10.8v5.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="7.8" r="1" fill="currentColor" />
        </svg>
      );
    case "keypad":
      return (
        <svg {...shared} fill="currentColor">
          {[7, 12, 17].flatMap((y) =>
            [7, 12, 17].map((x) => <circle cx={x} cy={y} key={`${x}-${y}`} r="1.35" />),
          )}
        </svg>
      );
    case "lock":
      return (
        <svg {...shared} fill="none">
          <rect x="5.3" y="10" width="13.4" height="10" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8.2 10V7.5a3.8 3.8 0 0 1 7.6 0V10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <circle cx="12" cy="14.6" r="1.2" fill="currentColor" />
        </svg>
      );
    case "more":
      return (
        <svg {...shared} fill="currentColor">
          <circle cx="5.5" cy="12" r="1.4" />
          <circle cx="12" cy="12" r="1.4" />
          <circle cx="18.5" cy="12" r="1.4" />
        </svg>
      );
    case "mute":
      return (
        <svg {...shared} fill="none">
          <path d="M5 9h3l4-3.2v12.4L8 15H5V9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="m16 9 4 6m0-6-4 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...shared} fill="none">
          <path
            d="m6.1 3.7 3.6 5.5-2.3 2c1.4 2.7 3.6 4.9 6.3 6.3l2-2.3 5.5 3.6-.9 2.1c-.5 1.2-1.8 1.8-3 1.5C9.6 20.7 3.3 14.4 1.6 6.7c-.3-1.2.3-2.5 1.5-3l2.1-.9.9.9Z"
            fill="currentColor"
          />
        </svg>
      );
    case "play":
      return (
        <svg {...shared} fill="currentColor">
          <path d="m8.2 5.8 10 6.2-10 6.2V5.8Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...shared} fill="none">
          <circle cx="10.7" cy="10.7" r="5.7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m15 15 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "send":
      return (
        <svg {...shared} fill="none">
          <path d="m4.1 11.2 15.6-6.7-5.8 15-2.6-6-7.2-2.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="m11.3 13.5 8.4-9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      );
    case "share":
      return (
        <svg {...shared} fill="none">
          <circle cx="18" cy="5.6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="18" cy="18.4" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="m8 11 7.9-4.2M8 13l7.9 4.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "signal":
      return (
        <svg {...shared} fill="currentColor">
          <rect x="3" y="15" width="2.4" height="4" rx="1" />
          <rect x="7.2" y="12" width="2.4" height="7" rx="1" />
          <rect x="11.4" y="9" width="2.4" height="10" rx="1" />
          <rect x="15.6" y="6" width="2.4" height="13" rx="1" />
        </svg>
      );
    case "speaker":
      return (
        <svg {...shared} fill="none">
          <path d="M4.5 9h3.2l4-3.2v12.4l-4-3.2H4.5V9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="M15 9a4.2 4.2 0 0 1 0 6m2.5-8.4a7.5 7.5 0 0 1 0 10.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    case "trash":
      return (
        <svg {...shared} fill="none">
          <path d="M6.5 7.5h11l-.7 11.2H7.2L6.5 7.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="M5 7.5h14M9.2 7.5V4.8h5.6v2.7M10 10.5v5.4m4-5.4v5.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    case "video":
      return (
        <svg {...shared} fill="none">
          <rect x="3.7" y="6.2" width="11.3" height="11.6" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="m15 10 5.3-2.6v9.2L15 14v-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...shared} fill="none">
          <path d="M4 9.2a12.2 12.2 0 0 1 16 0M7 12.4a7.7 7.7 0 0 1 10 0M9.8 15.4a3.4 3.4 0 0 1 4.4 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="18.2" r="1.2" fill="currentColor" />
        </svg>
      );
    case "zoomIn":
    case "zoomOut":
      return (
        <svg {...shared} fill="none">
          <circle cx="10.5" cy="10.5" r="5.6" stroke="currentColor" strokeWidth="1.7" />
          <path d="m14.8 14.8 4.5 4.5M7.7 10.5h5.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          {name === "zoomIn" ? <path d="M10.5 7.7v5.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /> : null}
        </svg>
      );
  }
}

export function AppGlyph({ name }: { name: AppGlyphName }) {
  const shared = {
    "aria-hidden": true,
    className: `app-glyph glyph-${name}`,
    viewBox: "0 0 64 64",
  } as const;

  switch (name) {
    case "messages":
      return (
        <svg {...shared}>
          <path d="M14 15h36a8 8 0 0 1 8 8v21a8 8 0 0 1-8 8H31L18 59v-7h-4a8 8 0 0 1-8-8V23a8 8 0 0 1 8-8Z" fill="white" />
          <circle cx="22" cy="34" r="3.2" fill="#32c766" />
          <circle cx="32" cy="34" r="3.2" fill="#32c766" />
          <circle cx="42" cy="34" r="3.2" fill="#32c766" />
        </svg>
      );
    case "phone":
      return (
        <svg {...shared}>
          <path d="M18.4 10.8c3.3-2 8.4 8.7 6.3 11.1l-4.2 4.7c3.9 7.8 8.9 12.8 16.7 16.7l4.7-4.2c2.4-2.1 13.1 3 11.1 6.3-2.4 4.1-6.7 7.7-12 6.3C25.1 47.5 12.5 34.9 8.3 19c-1.4-5.3 2.2-9.6 6.3-12l3.8 3.8Z" fill="white" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...shared}>
          <circle cx="32" cy="32" r="9" fill="white" />
          <ellipse cx="32" cy="17" rx="9" ry="13" fill="#ff5b6e" />
          <ellipse cx="47" cy="32" rx="13" ry="9" fill="#ffcf43" />
          <ellipse cx="32" cy="47" rx="9" ry="13" fill="#5ccc78" />
          <ellipse cx="17" cy="32" rx="13" ry="9" fill="#6e86ff" />
          <circle cx="32" cy="32" r="8" fill="white" />
        </svg>
      );
    case "files":
      return (
        <svg {...shared}>
          <path d="M9 16a7 7 0 0 1 7-7h11l6 7h15a7 7 0 0 1 7 7v25a7 7 0 0 1-7 7H16a7 7 0 0 1-7-7V16Z" fill="white" opacity=".96" />
          <path d="M9 24h46v24a7 7 0 0 1-7 7H16a7 7 0 0 1-7-7V24Z" fill="#d9e9ff" />
        </svg>
      );
    case "recorder":
      return (
        <svg {...shared} fill="none">
          <rect x="25" y="8" width="14" height="30" rx="7" fill="white" />
          <path d="M18 31a14 14 0 0 0 28 0M32 45v10M23 55h18" stroke="white" strokeLinecap="round" strokeWidth="5" />
        </svg>
      );
    case "notes":
      return (
        <svg {...shared}>
          <path d="M15 8h34a7 7 0 0 1 7 7v34a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7Z" fill="white" />
          <path d="M18 23h28M18 32h23M18 41h28" stroke="#f2b91c" strokeLinecap="round" strokeWidth="4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...shared}>
          <rect x="7" y="7" width="50" height="50" rx="12" fill="white" />
          <path d="M7 18a11 11 0 0 1 11-11h28a11 11 0 0 1 11 11v4H7v-4Z" fill="#ef4855" />
          <text x="32" y="46" fill="#20242c" fontFamily="Arial, sans-serif" fontSize="25" fontWeight="700" textAnchor="middle">12</text>
        </svg>
      );
    case "contacts":
      return (
        <svg {...shared}>
          <circle cx="32" cy="23" r="11" fill="white" />
          <path d="M12 53c1.8-11 9.4-17 20-17s18.2 6 20 17H12Z" fill="white" />
        </svg>
      );
    case "guide":
      return (
        <svg {...shared} fill="none">
          <path d="M12 13.5c8-3.5 14-2.4 20 1.8v37c-6-4.2-12-5.3-20-1.8v-37Zm40 0c-8-3.5-14-2.4-20 1.8v37c6-4.2 12-5.3 20-1.8v-37Z" fill="white" opacity=".96" />
          <path d="M32 15.3v37.2" stroke="#6d58d7" strokeWidth="2.4" />
          <path d="M41 22c0-4.2-6-4.3-6.7-.8-.4 2 1.4 3.2 3 4.1 1.5.9 2.6 1.8 2.6 3.9M39.8 34h.1" stroke="#6d58d7" strokeLinecap="round" strokeWidth="3" />
        </svg>
      );
    case "settings":
      return (
        <svg {...shared}>
          <path d="m35.8 8 2 6.2a20 20 0 0 1 4.8 2.8l6.4-1.3 4.7 8.2-4.4 4.8c.2 1.1.3 2.2.3 3.3s-.1 2.2-.3 3.3l4.4 4.8-4.7 8.2-6.4-1.3a20 20 0 0 1-4.8 2.8l-2 6.2h-9.5l-2-6.2a20 20 0 0 1-4.8-2.8L13 48.3l-4.7-8.2 4.4-4.8a18 18 0 0 1 0-6.6l-4.4-4.8 4.7-8.2 6.4 1.3a20 20 0 0 1 4.8-2.8l2-6.2h9.6Z" fill="white" />
          <circle cx="31" cy="32" r="8" fill="#89909d" />
        </svg>
      );
  }
}
