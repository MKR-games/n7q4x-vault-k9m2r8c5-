"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type TouchEvent,
  type WheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppGlyph,
  type AppGlyphName,
  UiIcon,
} from "./phone-icons";

type Screen =
  | "lock"
  | "home"
  | "messages"
  | "thread"
  | "phone"
  | "gallery"
  | "files"
  | "recorder"
  | "notes"
  | "note"
  | "calendar"
  | "contacts"
  | "guide"
  | "settings";

type UnlockKey = "gallery" | "messages" | "voice" | "file" | "device";
type GuideFontSize = "small" | "medium" | "large";

type UnlockState = Record<UnlockKey, boolean>;

type PhoneActivity = {
  missedCalls: number;
  unreadMessages: Record<string, number>;
  unseenFiles: number;
  unseenRecordings: number;
};

const initialUnlocks: UnlockState = {
  gallery: false,
  messages: false,
  voice: false,
  file: false,
  device: false,
};

const unlockConfig: Record<
  UnlockKey,
  { title: string; hint: string; answer: string }
> = {
  gallery: {
    title: "숨김 앨범",
    hint: "실물 단서카드에서 확인한 네 자리 암호",
    answer: "1012",
  },
  messages: {
    title: "삭제된 대화",
    hint: "실물 단서카드에서 확인한 네 자리 암호",
    answer: "2357",
  },
  voice: {
    title: "잠긴 음성메모",
    hint: "실물 단서카드에서 확인한 네 자리 암호",
    answer: "0416",
  },
  file: {
    title: "암호화된 동영상",
    hint: "실물 단서카드에서 확인한 대문자 영문 암호",
    answer: "NARI",
  },
  device: {
    title: "주변기기 연결기록",
    hint: "실물 단서카드에서 확인한 네 자리 암호",
    answer: "0004",
  },
};

const phoneNumbers = {
  archive: "010-0000-2357",
  council: "010-0000-2040",
  doyoon: "010-0000-6431",
  hyunwoo: "010-0000-9346",
  jaemin: "010-0000-8725",
  mother: "010-0000-1108",
  seoa: "010-0000-7182",
  yuri: "010-0000-6158",
} as const;

const apps = [
  { id: "messages", label: "메시지", icon: "messages" },
  { id: "phone", label: "전화", icon: "phone" },
  { id: "gallery", label: "갤러리", icon: "gallery" },
  { id: "files", label: "내 파일", icon: "files" },
  { id: "recorder", label: "음성 녹음", icon: "recorder" },
  { id: "notes", label: "메모", icon: "notes" },
  { id: "calendar", label: "캘린더", icon: "calendar" },
  { id: "contacts", label: "연락처", icon: "contacts" },
  { id: "guide", label: "게임 안내", icon: "guide" },
  { id: "settings", label: "설정", icon: "settings" },
] as const;

type GalleryImage = {
  alt: string;
  date: string;
  file: string;
  hidden?: boolean;
  id: string;
  location: string;
  meta: string;
  src: string;
  title: string;
};

const galleryImages: GalleryImage[] = [
  {
    id: "student-council",
    src: "assets/student-council.png",
    alt: "학생회 단체사진",
    title: "학생회 단체사진",
    date: "9월 30일 오후 5:31",
    location: "월백고등학교 학생회실",
    file: "IMG_0930_1731.jpg",
    meta: "3024 × 4032 · 3.8 MB",
  },
  {
    id: "doyoon-seoa",
    src: "assets/doyoon-seoa.png",
    alt: "교실에서 함께 찍은 강도윤과 윤서아",
    title: "윤서아와 함께",
    date: "8월 19일 오후 6:42",
    location: "월백고등학교 2학년 4반",
    file: "IMG_0819_1842.jpg",
    meta: "3024 × 4032 · 3.2 MB",
  },
  {
    id: "rooftop-evidence",
    src: "assets/rooftop-evidence.png",
    alt: "옥상에서 학생의 손목을 붙잡고 있는 강도윤",
    title: "숨김 앨범",
    date: "8월 · 날짜 정보 손상 · 오후 5:46",
    location: "월백고등학교 옥상 · 촬영기기 미확인",
    file: "IMG_08XX_1746.jpg",
    meta: "1920 × 1080 · 2.1 MB",
    hidden: true,
  },
];

const threads = [
  {
    name: "윤서아",
    preview: "11시 40분. 늦지 마.",
    time: "21:51",
    unread: 2,
    avatar: "윤",
  },
  {
    name: "엄마",
    preview: "너무 늦지 마. 비 많이 온대.",
    time: "21:16",
    unread: 1,
    avatar: "엄",
  },
  {
    name: "학생회",
    preview: "확인했습니다.",
    time: "18:33",
    unread: 0,
    avatar: "학",
  },
];

const initialActivity: PhoneActivity = {
  missedCalls: 1,
  unreadMessages: Object.fromEntries(
    threads.map((thread) => [thread.name, thread.unread]),
  ),
  unseenFiles: 1,
  unseenRecordings: 1,
};

type NoteItem = {
  body: string[];
  date: string;
  id: string;
  preview: string;
  title: string;
  tone?: "important" | "dark";
  updated: string;
};

const notes: NoteItem[] = [
  {
    id: "today",
    date: "10월 12일",
    updated: "10월 12일 오후 11:34",
    title: "오늘",
    preview: "불이 꺼졌을 때 복도로 나갔다고 말할 것.",
    body: [
      "불이 꺼졌을 때 복도로 나갔다고 말할 것.",
      "차단기를 확인하러 갔다고 설명할 것.",
      "먼저 다른 이야기를 꺼내지 않는다.",
    ],
    tone: "important",
  },
  {
    id: "student-council",
    date: "10월 9일",
    updated: "10월 9일 오후 6:12",
    title: "학생회",
    preview: "회의록 정리, 축제 예산 확인, 방송부 장비 반납.",
    body: [
      "회의록 정리",
      "축제 예산 확인",
      "방송부 장비 반납",
    ],
  },
  {
    id: "seoa",
    date: "9월 28일",
    updated: "9월 28일 오후 10:41",
    title: "서아",
    preview: "영상이 정말 남아 있는지 확인해야 한다.",
    body: ["영상이 정말 남아 있는지 확인해야 한다."],
    tone: "dark",
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.9;
  utterance.pitch = 0.95;
  window.speechSynthesis.speak(utterance);
}

function vibrate(pattern: number | number[] = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function touchDistance(touches: TouchEvent<HTMLDivElement>["touches"]) {
  const first = touches[0];
  const second = touches[1];
  if (!first || !second) return 0;
  return Math.hypot(
    second.clientX - first.clientX,
    second.clientY - first.clientY,
  );
}

function loadUnlocks(): UnlockState {
  if (typeof window === "undefined") return initialUnlocks;
  try {
    const saved = window.localStorage.getItem("doyoon-unlocks");
    return saved
      ? { ...initialUnlocks, ...JSON.parse(saved) }
      : initialUnlocks;
  } catch {
    return initialUnlocks;
  }
}

function loadActivity(): PhoneActivity {
  if (typeof window === "undefined") return initialActivity;
  try {
    const saved = window.localStorage.getItem("doyoon-phone-activity");
    if (!saved) return initialActivity;
    const parsed = JSON.parse(saved) as Partial<PhoneActivity>;
    return {
      ...initialActivity,
      ...parsed,
      unreadMessages: {
        ...initialActivity.unreadMessages,
        ...(parsed.unreadMessages ?? {}),
      },
    };
  } catch {
    return initialActivity;
  }
}

function loadGuideFontSize(): GuideFontSize {
  if (typeof window === "undefined") return "medium";
  try {
    const saved = window.localStorage.getItem("doyoon-guide-font-size");
    return saved === "small" || saved === "large" ? saved : "medium";
  } catch {
    return "medium";
  }
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [screen, setScreen] = useState<Screen>("lock");
  const screenStack = useRef<Screen[]>(["lock"]);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);
  const [selectedThread, setSelectedThread] = useState("윤서아");
  const [unlocks, setUnlocks] = useState<UnlockState>(loadUnlocks);
  const [unlockTarget, setUnlockTarget] = useState<UnlockKey | null>(null);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const [toast, setToast] = useState("");
  const [dial, setDial] = useState("");
  const [call, setCall] = useState<{
    mode: "recording" | "voicemail" | "unavailable";
    phase: "calling" | "connected";
    title: string;
    number: string;
    transcript: string;
  } | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [phoneTab, setPhoneTab] = useState<"keypad" | "recent" | "contacts">(
    "keypad",
  );
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [viewerScale, setViewerScale] = useState(1);
  const [viewerPan, setViewerPan] = useState({ x: 0, y: 0 });
  const [viewerDetails, setViewerDetails] = useState(false);
  const [activity, setActivity] = useState<PhoneActivity>(initialActivity);
  const [messageQuery, setMessageQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0].id);
  const [guideFontSize, setGuideFontSize] =
    useState<GuideFontSize>("medium");
  const unlockTargetRef = useRef<UnlockKey | null>(null);
  const callOpenRef = useRef(false);
  const imageOpenRef = useRef(false);
  const viewerDetailsRef = useRef(false);
  const swipeStartY = useRef<number | null>(null);
  const viewerGesture = useRef<{
    lastDistance: number;
    lastX: number;
    lastY: number;
    startScale: number;
    startX: number;
    startY: number;
  } | null>(null);
  const lastViewerTap = useRef(0);

  useEffect(() => {
    unlockTargetRef.current = unlockTarget;
    callOpenRef.current = Boolean(call);
    imageOpenRef.current = Boolean(selectedImageId);
    viewerDetailsRef.current = viewerDetails;
  }, [unlockTarget, call, selectedImageId, viewerDetails]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setActivity(loadActivity());
      setGuideFontSize(loadGuideFontSize());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const guardState = { characterPhone: true };
    window.history.replaceState(guardState, "", window.location.href);
    window.history.pushState(guardState, "", window.location.href);

    const handleSystemBack = () => {
      if (callOpenRef.current) {
        window.speechSynthesis?.cancel();
        setCall(null);
      } else if (unlockTargetRef.current) {
        setUnlockTarget(null);
      } else if (viewerDetailsRef.current) {
        setViewerDetails(false);
      } else if (imageOpenRef.current) {
        setSelectedImageId(null);
      } else if (screenStack.current.length > 1) {
        screenStack.current.pop();
        setScreen(screenStack.current.at(-1) ?? "home");
      }
      window.history.pushState(guardState, "", window.location.href);
      vibrate(8);
    };

    window.addEventListener("popstate", handleSystemBack);
    return () => window.removeEventListener("popstate", handleSystemBack);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(new URL("sw.js", document.baseURI).toString())
        .catch(() => {
        // The phone remains playable online if offline registration is blocked.
        });
    }
  }, []);

  useEffect(() => {
    if (!entered) return;

    const reacquireWakeLock = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const wakeLockApi = navigator as Navigator & {
          wakeLock?: {
            request: (
              type: "screen",
            ) => Promise<{ release: () => Promise<void> }>;
          };
        };
        wakeLock.current =
          (await wakeLockApi.wakeLock?.request("screen")) ?? null;
      } catch {
        // Battery-saving settings may block wake lock restoration.
      }
    };

    document.addEventListener("visibilitychange", reacquireWakeLock);
    return () =>
      document.removeEventListener("visibilitychange", reacquireWakeLock);
  }, [entered]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!call || call.phase !== "calling") return;
    const timer = window.setTimeout(() => {
      setCall((current) =>
        current ? { ...current, phase: "connected" } : current,
      );
      vibrate([18, 40, 18]);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [call]);

  useEffect(() => {
    if (!call || call.phase !== "connected") return;
    speak(call.transcript);
  }, [call]);

  const persistActivity = (
    update: (current: PhoneActivity) => PhoneActivity,
  ) => {
    setActivity((current) => {
      const next = update(current);
      try {
        window.localStorage.setItem(
          "doyoon-phone-activity",
          JSON.stringify(next),
        );
      } catch {
        // The phone remains usable when private browsing blocks storage.
      }
      return next;
    });
  };

  const markThreadRead = (threadName: string) => {
    persistActivity((current) => ({
      ...current,
      unreadMessages: {
        ...current.unreadMessages,
        [threadName]: 0,
      },
    }));
  };

  const changePhoneTab = (nextTab: "keypad" | "recent" | "contacts") => {
    setPhoneTab(nextTab);
    if (nextTab === "recent" && activity.missedCalls > 0) {
      persistActivity((current) => ({ ...current, missedCalls: 0 }));
    }
  };

  const changeGuideFontSize = (nextSize: GuideFontSize) => {
    setGuideFontSize(nextSize);
    try {
      window.localStorage.setItem("doyoon-guide-font-size", nextSize);
    } catch {
      // The selected size still applies for the current play session.
    }
    vibrate(6);
  };

  const navigateTo = (next: Screen) => {
    if (screenStack.current.at(-1) !== next) {
      screenStack.current.push(next);
    }
    setScreen(next);
    window.history.pushState({ characterPhone: true }, "", window.location.href);
  };

  const goBack = () => {
    window.history.back();
  };

  const unlockPhone = () => {
    screenStack.current = ["home"];
    setScreen("home");
    window.history.pushState({ characterPhone: true }, "", window.location.href);
    vibrate([15, 25, 15]);
  };

  const enterPhone = async () => {
    try {
      const root = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (!document.fullscreenElement) {
        if (root.requestFullscreen) {
          await root.requestFullscreen({ navigationUI: "hide" });
        } else if (root.webkitRequestFullscreen) {
          await root.webkitRequestFullscreen();
        }
      }
    } catch {
      // Some mobile browsers only hide their chrome after the first gesture.
    }

    try {
      const orientation = window.screen.orientation as ScreenOrientation & {
        lock?: (mode: "portrait") => Promise<void>;
      };
      await orientation.lock?.("portrait");
    } catch {
      // Orientation lock is optional on browsers that do not expose it.
    }

    try {
      const wakeLockApi = navigator as Navigator & {
        wakeLock?: {
          request: (
            type: "screen",
          ) => Promise<{ release: () => Promise<void> }>;
        };
      };
      wakeLock.current = (await wakeLockApi.wakeLock?.request("screen")) ?? null;
    } catch {
      // Continue even when battery settings block the wake lock.
    }

    setEntered(true);
    screenStack.current = ["lock"];
    setScreen("lock");
    vibrate([16, 32, 16]);
  };

  const restoreFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      }
      setToast("전체 화면을 유지합니다");
    } catch {
      setToast("브라우저 메뉴에서 전체 화면을 허용해 주세요");
    }
  };

  const statusTime = useMemo(() => (screen === "lock" ? "00:04" : "00:05"), [screen]);
  const unreadMessageCount = useMemo(
    () =>
      Object.values(activity.unreadMessages).reduce(
        (total, count) => total + count,
        0,
      ),
    [activity.unreadMessages],
  );
  const filteredThreads = useMemo(() => {
    const query = messageQuery.trim().toLocaleLowerCase("ko-KR");
    if (!query) return threads;
    return threads.filter((thread) =>
      `${thread.name} ${thread.preview}`
        .toLocaleLowerCase("ko-KR")
        .includes(query),
    );
  }, [messageQuery]);
  const latestUnreadThread =
    threads.find((thread) => (activity.unreadMessages[thread.name] ?? 0) > 0) ??
    null;
  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? notes[0]!;

  const getAppBadge = (appId: string) => {
    if (appId === "messages") return unreadMessageCount;
    if (appId === "phone") return activity.missedCalls;
    if (appId === "files") return activity.unseenFiles;
    if (appId === "recorder") return activity.unseenRecordings;
    return 0;
  };

  const visibleGalleryImages = useMemo(
    () => galleryImages.filter((image) => !image.hidden || unlocks.gallery),
    [unlocks.gallery],
  );
  const selectedImage =
    visibleGalleryImages.find((image) => image.id === selectedImageId) ?? null;
  const selectedImagePosition = selectedImage
    ? visibleGalleryImages.findIndex((image) => image.id === selectedImage.id)
    : -1;

  const resetViewerTransform = () => {
    setViewerScale(1);
    setViewerPan({ x: 0, y: 0 });
  };

  const openGalleryImage = (id: string) => {
    setSelectedImageId(id);
    setViewerDetails(false);
    resetViewerTransform();
    vibrate(8);
  };

  const closeGalleryImage = () => {
    setSelectedImageId(null);
    setViewerDetails(false);
    resetViewerTransform();
  };

  const setViewerZoom = (nextScale: number) => {
    const scale = clamp(nextScale, 1, 4);
    setViewerScale(scale);
    if (scale === 1) {
      setViewerPan({ x: 0, y: 0 });
    }
  };

  const stepGalleryImage = (direction: -1 | 1) => {
    if (!selectedImage) return;
    const currentIndex = visibleGalleryImages.findIndex(
      (image) => image.id === selectedImage.id,
    );
    const nextIndex = clamp(
      currentIndex + direction,
      0,
      visibleGalleryImages.length - 1,
    );
    if (nextIndex === currentIndex) {
      vibrate(6);
      return;
    }
    setSelectedImageId(visibleGalleryImages[nextIndex]?.id ?? null);
    setViewerDetails(false);
    resetViewerTransform();
    vibrate(8);
  };

  const handleViewerTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length >= 2) {
      viewerGesture.current = {
        lastDistance: touchDistance(event.touches),
        lastX: 0,
        lastY: 0,
        startScale: viewerScale,
        startX: 0,
        startY: 0,
      };
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;
    viewerGesture.current = {
      lastDistance: 0,
      lastX: touch.clientX,
      lastY: touch.clientY,
      startScale: viewerScale,
      startX: touch.clientX,
      startY: touch.clientY,
    };
  };

  const handleViewerTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const gesture = viewerGesture.current;
    if (!gesture) return;

    if (event.touches.length >= 2 && gesture.lastDistance > 0) {
      event.preventDefault();
      const distance = touchDistance(event.touches);
      setViewerZoom(gesture.startScale * (distance / gesture.lastDistance));
      return;
    }

    const touch = event.touches[0];
    if (!touch || viewerScale <= 1) return;
    event.preventDefault();
    const deltaX = touch.clientX - gesture.lastX;
    const deltaY = touch.clientY - gesture.lastY;
    gesture.lastX = touch.clientX;
    gesture.lastY = touch.clientY;
    setViewerPan((current) => ({
      x: current.x + deltaX,
      y: current.y + deltaY,
    }));
  };

  const handleViewerTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const gesture = viewerGesture.current;
    const touch = event.changedTouches[0];
    viewerGesture.current = null;
    if (!gesture || !touch) return;

    const movementX = touch.clientX - gesture.startX;
    const movementY = touch.clientY - gesture.startY;
    if (
      viewerScale <= 1.05 &&
      Math.abs(movementX) > 58 &&
      Math.abs(movementX) > Math.abs(movementY)
    ) {
      stepGalleryImage(movementX < 0 ? 1 : -1);
      return;
    }

    if (Math.abs(movementX) < 14 && Math.abs(movementY) < 14) {
      const now = Date.now();
      if (now - lastViewerTap.current < 280) {
        setViewerZoom(viewerScale > 1 ? 1 : 2.5);
        lastViewerTap.current = 0;
      } else {
        lastViewerTap.current = now;
      }
    }
  };

  const handleViewerWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setViewerZoom(viewerScale + (event.deltaY < 0 ? 0.35 : -0.35));
  };

  const persistUnlocks = (next: UnlockState) => {
    setUnlocks(next);
    try {
      window.localStorage.setItem("doyoon-unlocks", JSON.stringify(next));
    } catch {
      // Continue without persistence.
    }
  };

  const openUnlock = (target: UnlockKey) => {
    setUnlockTarget(target);
    setUnlockInput("");
    setUnlockError(false);
    vibrate();
  };

  const submitUnlock = () => {
    if (!unlockTarget) return;
    const config = unlockConfig[unlockTarget];
    if (unlockInput.trim().toUpperCase() !== config.answer) {
      setUnlockError(true);
      vibrate([40, 40, 40]);
      return;
    }
    const next = { ...unlocks, [unlockTarget]: true };
    persistUnlocks(next);
    setUnlockTarget(null);
    setUnlockInput("");
    setUnlockError(false);
    setToast(`${config.title} 잠금이 해제되었습니다`);
    vibrate([20, 50, 30]);
  };

  const openApp = (id: string) => {
    if (id === "files" && activity.unseenFiles > 0) {
      persistActivity((current) => ({ ...current, unseenFiles: 0 }));
    }
    if (id === "recorder" && activity.unseenRecordings > 0) {
      persistActivity((current) => ({ ...current, unseenRecordings: 0 }));
    }
    navigateTo(id as Screen);
    vibrate();
  };

  const startCall = () => {
    const normalized = dial.replace(/\D/g, "");
    const seoANumber = phoneNumbers.seoa.replace(/\D/g, "");
    const archiveNumber = phoneNumbers.archive.replace(/\D/g, "");
    if (normalized === seoANumber) {
      setCall({
        mode: "recording",
        phase: "calling",
        title: "윤서아",
        number: phoneNumbers.seoa,
        transcript:
          "어디야? 지금 2학년 4반으로 와. 오늘 네 입으로 전부 말하게 할 거야.",
      });
    } else if (normalized === archiveNumber) {
      setCall({
        mode: "voicemail",
        phase: "calling",
        title: "사건 음성보관함",
        number: phoneNumbers.archive,
        transcript:
          "보관된 메시지입니다. 도윤아, 네가 약속만 지키면 영상은 공개하지 않을게. 오늘이 마지막이야.",
      });
    } else {
      setCall({
        mode: "unavailable",
        phase: "calling",
        title: "알 수 없음",
        number: dial || "번호 없음",
        transcript: "연결할 수 없는 번호입니다. 번호를 확인한 뒤 다시 걸어 주세요.",
      });
    }
    vibrate([10, 30, 10]);
  };

  const endCall = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCall(null);
  };

  const playLockedVoice = () => {
    const text =
      "암전되면 차단기를 확인하러 갔다고 하면 돼. 복도에 있었다고 해. 침착하게.";
    setVoicePlaying(true);
    speak(text);
    window.setTimeout(() => setVoicePlaying(false), 8500);
  };

  const renderHeader = (title: string, subtitle?: string) => (
    <header className="app-header">
      <button
        className="back-button"
        type="button"
        onClick={goBack}
        aria-label="이전 화면으로 돌아가기"
      >
        <UiIcon name="back" size={24} />
      </button>
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <span className="header-spacer" />
    </header>
  );

  const renderMessages = () => (
    <section className="app-surface messages-app">
      {renderHeader(
        "메시지",
        unreadMessageCount > 0
          ? `읽지 않은 메시지 ${unreadMessageCount}개`
          : "모든 메시지를 읽었습니다",
      )}
      <label className="message-search">
        <UiIcon name="search" size={17} />
        <input
          type="search"
          value={messageQuery}
          onChange={(event) => setMessageQuery(event.target.value)}
          placeholder="대화 검색"
          aria-label="대화 검색"
        />
        {messageQuery ? (
          <button
            type="button"
            onClick={() => setMessageQuery("")}
            aria-label="검색어 지우기"
          >
            <UiIcon name="close" size={15} />
          </button>
        ) : null}
      </label>
      <div className="thread-list">
        {filteredThreads.map((thread) => {
          const unread = activity.unreadMessages[thread.name] ?? 0;
          return (
          <button
            className="thread-row"
            key={thread.name}
            type="button"
            onClick={() => {
              setSelectedThread(thread.name);
              markThreadRead(thread.name);
              navigateTo("thread");
            }}
          >
            <span className="thread-avatar">{thread.avatar}</span>
            <span className="thread-copy">
              <span className="thread-top">
                <strong>{thread.name}</strong>
                <small>{thread.time}</small>
              </span>
              <span>{thread.preview}</span>
            </span>
            {unread ? <b className="unread-dot">{unread}</b> : null}
          </button>
          );
        })}
        {filteredThreads.length === 0 ? (
          <p className="message-empty">일치하는 대화가 없습니다.</p>
        ) : null}
      </div>
    </section>
  );

  const renderThread = () => {
    const isSeoA = selectedThread === "윤서아";
    const isMom = selectedThread === "엄마";
    return (
      <section className="app-surface thread-app">
        <header className="thread-header">
          <button
            className="back-button"
            type="button"
            onClick={goBack}
            aria-label="메시지 목록으로 돌아가기"
          >
            <UiIcon name="back" size={24} />
          </button>
          <span className="thread-avatar small">
            {selectedThread.slice(0, 1)}
          </span>
          <strong>{selectedThread}</strong>
          <span className="header-spacer" />
        </header>
        <div className="message-date">10월 12일 토요일</div>
        <div className="bubble-stack">
          {isSeoA ? (
            <>
              <div className="bubble incoming">
                오늘 밤 2학년 4반에서 끝내자.
                <time>21:46</time>
              </div>
              <div className="bubble outgoing">
                다른 애들까지 부를 필요는 없잖아.
                <time>21:49</time>
              </div>
              <div className="bubble incoming">
                네가 약속만 지키면 영상은 공개하지 않을게.
                <time>21:50</time>
              </div>
              <div className="bubble incoming">
                11시 40분. 늦지 마.
                <time>21:51</time>
              </div>
              {unlocks.messages ? (
                <div className="recovered-block">
                  <span>삭제된 메시지 복원됨</span>
                  <div className="bubble incoming danger">
                    재민이가 원본을 복구했어. 네가 나리를 떨어뜨린 장면까지
                    찍혀 있어.
                    <time>23:46</time>
                  </div>
                  <div className="bubble outgoing">
                    지금 어디야?
                    <time>23:47</time>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="locked-inline"
                  onClick={() => openUnlock("messages")}
                >
                  <UiIcon name="lock" size={15} /> 삭제된 메시지 2개
                </button>
              )}
            </>
          ) : isMom ? (
            <>
              <div className="bubble incoming">
                도윤아, 오늘도 학교에 늦게까지 있니?
                <time>21:08</time>
              </div>
              <div className="bubble outgoing">
                학생회 일만 끝내고 바로 갈게.
                <time>21:15</time>
              </div>
              <div className="bubble incoming">
                너무 늦지 마. 비 많이 온대.
                <time>21:16</time>
              </div>
            </>
          ) : (
            <>
              <div className="bubble incoming">
                내일 아침 회의는 취소됐습니다.
                <time>18:31</time>
              </div>
              <div className="bubble outgoing">
                확인했습니다.
                <time>18:33</time>
              </div>
            </>
          )}
        </div>
        <div className="message-composer">
          <span>오프라인 · 메시지를 보낼 수 없음</span>
          <button
            type="button"
            aria-label="전송"
            onClick={() => setToast("통신 서비스에 연결할 수 없습니다")}
          >
            <UiIcon name="send" size={18} />
          </button>
        </div>
      </section>
    );
  };

  const renderPhone = () => (
    <section className="app-surface phone-app">
      {renderHeader("전화")}
      <div className="phone-tabs">
        <button
          type="button"
          className={phoneTab === "keypad" ? "active" : ""}
          onClick={() => changePhoneTab("keypad")}
        >
          키패드
        </button>
        <button
          type="button"
          className={phoneTab === "recent" ? "active" : ""}
          onClick={() => changePhoneTab("recent")}
        >
          최근기록
          {activity.missedCalls > 0 ? (
            <b className="tab-badge">{activity.missedCalls}</b>
          ) : null}
        </button>
        <button
          type="button"
          className={phoneTab === "contacts" ? "active" : ""}
          onClick={() => changePhoneTab("contacts")}
        >
          연락처
        </button>
      </div>
      {phoneTab === "keypad" ? (
        <>
          <div className="dial-display">
            <strong>{dial || "번호 입력"}</strong>
            {dial ? <small>번호를 확인한 뒤 통화 버튼을 누르세요</small> : null}
          </div>
          <div className="keypad">
            {[
              ["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"],
              ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"],
              ["9", "WXYZ"], ["*", ""], ["0", "+"], ["#", ""],
            ].map(([number, letters]) => (
              <button
                type="button"
                key={number}
                onClick={() => setDial((current) => `${current}${number}`)}
              >
                <b>{number}</b>
                <small>{letters}</small>
              </button>
            ))}
          </div>
          <div className="dial-actions">
            <span />
            <button type="button" className="call-button" onClick={startCall} aria-label="전화 걸기">
              <AppGlyph name="phone" />
            </button>
            <button
              type="button"
              className="erase-button"
              onClick={() => setDial((current) => current.slice(0, -1))}
              aria-label="한 글자 지우기"
            >
              <UiIcon name="backspace" size={22} />
            </button>
          </div>
        </>
      ) : phoneTab === "recent" ? (
        <div className="phone-list">
          {[
            ["윤서아", "수신 전화", "23:41", phoneNumbers.seoa],
            ["박재민", "발신 전화", "22:58", phoneNumbers.jaemin],
            ["엄마", "부재중 전화", "21:07", phoneNumbers.mother],
          ].map(([name, type, time, number]) => (
            <button
              type="button"
              key={`${name}-${time}`}
              onClick={() => {
                setDial(number);
                setPhoneTab("keypad");
              }}
            >
              <span className={type === "부재중 전화" ? "missed" : ""}>
                <strong>{name}</strong>
                <small>{type}</small>
              </span>
              <time>{time}</time>
            </button>
          ))}
        </div>
      ) : (
        <div className="phone-list">
          {[
            ["박재민", phoneNumbers.jaemin],
            ["서유리", phoneNumbers.yuri],
            ["윤서아", phoneNumbers.seoa],
            ["최현우", phoneNumbers.hyunwoo],
            ["학생회실", phoneNumbers.council],
          ].map(([name, number]) => (
            <button
              type="button"
              key={name}
              onClick={() => {
                setDial(number);
                setPhoneTab("keypad");
              }}
            >
              <span><strong>{name}</strong><small>{number}</small></span>
              <b><UiIcon name="phone" size={19} /></b>
            </button>
          ))}
        </div>
      )}
    </section>
  );

  const renderGallery = () => (
    <section className="app-surface gallery-app oneui-gallery">
      <header className="gallery-header">
        <button
          className="back-button"
          type="button"
          onClick={goBack}
          aria-label="이전 화면으로 돌아가기"
        >
          <UiIcon name="back" size={24} />
        </button>
        <h1>갤러리</h1>
        <div className="gallery-header-actions">
          <button
            type="button"
            aria-label="사진 검색"
            onClick={() => setToast("검색할 수 없는 오프라인 사진입니다")}
          >
            <UiIcon name="search" size={21} />
          </button>
          <button
            type="button"
            aria-label="갤러리 메뉴"
            onClick={() => setToast("표시할 추가 메뉴가 없습니다")}
          >
            <UiIcon name="more" size={21} />
          </button>
        </div>
      </header>

      <div className="gallery-tabs" role="tablist" aria-label="갤러리 보기">
        <button type="button" className="active" role="tab" aria-selected="true">
          사진
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          onClick={() => setToast("앨범 보기는 잠겨 있습니다")}
        >
          앨범
        </button>
      </div>

      <div className="gallery-day">
        <strong>최근 사진</strong>
        <span>{visibleGalleryImages.length}개</span>
      </div>

      <div className="gallery-grid">
        {visibleGalleryImages.map((image) => (
          <button
            type="button"
            className={image.hidden ? "gallery-tile evidence-photo" : "gallery-tile"}
            key={image.id}
            onClick={() => openGalleryImage(image.id)}
            aria-label={`${image.title} 크게 보기`}
          >
            <img src={image.src} alt={image.alt} />
            <span className="gallery-tile-shade" />
            <span className="gallery-tile-copy">
              <strong>{image.title}</strong>
              <small>{image.date}</small>
            </span>
            {image.hidden ? (
              <span className="gallery-hidden-mark">
                <UiIcon name="lock" size={13} />
              </span>
            ) : null}
          </button>
        ))}

        {!unlocks.gallery ? (
          <button
            type="button"
            className="locked-gallery"
            onClick={() => openUnlock("gallery")}
          >
            <span><UiIcon name="lock" size={24} /></span>
            <strong>숨김 앨범</strong>
            <small>암호 필요</small>
          </button>
        ) : null}
      </div>

      <p className="gallery-gesture-tip">
        사진을 누르면 크게 열립니다. 두 번 누르거나 두 손가락으로 확대하세요.
      </p>
    </section>
  );

  const renderFiles = () => (
    <section className="app-surface files-app">
      {renderHeader("내 파일", "최근 파일")}
      <div className="storage-card">
        <span>내장 저장공간</span>
        <strong>47.8 GB / 128 GB</strong>
        <i>
          <b />
        </i>
      </div>
      <div className="file-list">
        <button
          type="button"
          className="file-row"
          onClick={() => (unlocks.file ? setToast("파일 정보를 열었습니다") : openUnlock("file"))}
        >
          <span className="file-icon video"><UiIcon name="video" size={20} /></span>
          <span>
            <strong>{unlocks.file ? "NARI_FINAL.mp4" : "ENC_VIDEO_1013.bin"}</strong>
            <small>{unlocks.file ? "복원된 동영상 · 84.2 MB" : "암호화됨"}</small>
          </span>
          <b>{unlocks.file ? "열기" : <UiIcon name="lock" size={17} />}</b>
        </button>
        {unlocks.file ? (
          <article className="file-preview">
            <img src="assets/rooftop-evidence.png" alt="복구 영상 미리보기" />
            <div>
              <strong>23:55 수신 완료</strong>
              <p>보낸 사람: 박재민</p>
              <p>수신 기기: 이 휴대전화</p>
            </div>
          </article>
        ) : null}
        <button
          type="button"
          className="file-row"
          onClick={() =>
            unlocks.device
              ? setToast("기기 연결기록을 확인했습니다")
              : openUnlock("device")
          }
        >
          <span className="file-icon link"><UiIcon name="wifi" size={19} /></span>
          <span>
            <strong>주변기기 연결기록</strong>
            <small>{unlocks.device ? "10월 12일 · 23:59" : "접근 제한됨"}</small>
          </span>
          <b>{unlocks.device ? "열기" : <UiIcon name="lock" size={17} />}</b>
        </button>
        {unlocks.device ? (
          <article className="connection-record">
            <span>23:59:08</span>
            <strong>SEOA_PHONE 연결됨</strong>
            <p>블루투스 파일 공유 · 연결 시간 1분 16초</p>
          </article>
        ) : null}
        <div className="file-row passive">
          <span className="file-icon text">TXT</span>
          <span>
            <strong>학생회_인수인계.txt</strong>
            <small>9월 30일 · 18 KB</small>
          </span>
          <b>›</b>
        </div>
      </div>
    </section>
  );

  const renderRecorder = () => (
    <section className="app-surface recorder-app">
      {renderHeader("음성 녹음", "3개의 녹음")}
      <div className="record-list">
        <article>
          <button type="button" className="play-mini" onClick={() => speak("학생회 정기 회의는 다음 주 월요일로 변경합니다.")}>
            <UiIcon name="play" size={18} />
          </button>
          <div>
            <strong>학생회 회의</strong>
            <span>9월 30일 · 01:48</span>
          </div>
          <small>•••</small>
        </article>
        <article className="locked-record">
          {unlocks.voice ? (
            <button
              type="button"
              className={`play-mini ${voicePlaying ? "playing" : ""}`}
              onClick={playLockedVoice}
            >
              {voicePlaying ? "Ⅱ" : <UiIcon name="play" size={18} />}
            </button>
          ) : (
            <button
              type="button"
              className="play-mini"
              onClick={() => openUnlock("voice")}
            >
              <UiIcon name="lock" size={17} />
            </button>
          )}
          <div>
            <strong>새 녹음 004</strong>
            <span>
              {unlocks.voice ? "10월 12일 23:32 · 00:08" : "잠긴 녹음"}
            </span>
          </div>
          <small>•••</small>
        </article>
        {unlocks.voice ? (
          <div className={`waveform ${voicePlaying ? "active" : ""}`}>
            {Array.from({ length: 34 }).map((_, index) => (
              <i key={index} style={{ height: `${10 + ((index * 13) % 32)}px` }} />
            ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className="record-button"
        aria-label="새 녹음"
        onClick={() => setToast("새 녹음을 시작할 수 없습니다")}
      >
        <span />
      </button>
    </section>
  );

  const renderNotes = () => (
    <section className="app-surface notes-app">
      {renderHeader("메모", "최근 수정 순")}
      <div className="note-grid">
        {notes.map((note) => (
          <button
            type="button"
            key={note.id}
            className={`note-card ${note.tone ?? ""}`}
            onClick={() => {
              setSelectedNoteId(note.id);
              navigateTo("note");
              vibrate(7);
            }}
            aria-label={`${note.title} 메모 열기`}
          >
            <small>{note.date}</small>
            <strong>{note.title}</strong>
            <p>{note.preview}</p>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="floating-add"
        aria-label="새 메모"
        onClick={() => setToast("새 메모를 작성할 수 없습니다")}
      >
        ＋
      </button>
    </section>
  );

  const renderNote = () => (
    <section className={`app-surface note-detail-app ${selectedNote.tone ?? ""}`}>
      {renderHeader(selectedNote.title, selectedNote.updated)}
      <article className="note-document">
        <time>{selectedNote.updated}</time>
        <div>
          {selectedNote.body.map((paragraph, index) => (
            <p key={`${selectedNote.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
      <footer className="note-toolbar">
        <span>읽기 전용</span>
        <button
          type="button"
          onClick={() => setToast("사건 기록은 수정할 수 없습니다")}
        >
          편집
        </button>
      </footer>
    </section>
  );

  const renderCalendar = () => (
    <section className="app-surface calendar-app">
      {renderHeader("10월", "12일 토요일")}
      <div className="calendar-strip">
        {[
          ["월", "7"],
          ["화", "8"],
          ["수", "9"],
          ["목", "10"],
          ["금", "11"],
          ["토", "12"],
          ["일", "13"],
        ].map(([day, date]) => (
          <span key={date} className={date === "12" ? "selected" : ""}>
            <small>{day}</small>
            <b>{date}</b>
          </span>
        ))}
      </div>
      <div className="timeline">
        <article>
          <time>23:40</time>
          <div className="event red">
            <strong>서아 만나기</strong>
            <span>2학년 4반</span>
          </div>
        </article>
        <article>
          <time>23:57</time>
          <div className="event blue">
            <strong>차단기 확인이라고 말하기</strong>
            <span>개인 메모 · 알리바이용</span>
          </div>
        </article>
      </div>
    </section>
  );

  const renderContacts = () => (
    <section className="app-surface contacts-app">
      {renderHeader("연락처", "87명")}
      <div className="contact-owner">
        <span>강</span>
        <div>
          <strong>강도윤</strong>
          <small>내 프로필 · {phoneNumbers.doyoon} · 월백고등학교</small>
        </div>
      </div>
      <div className="contact-list">
        {[
          ["박재민", phoneNumbers.jaemin],
          ["서유리", phoneNumbers.yuri],
          ["윤서아", phoneNumbers.seoa],
          ["최현우", phoneNumbers.hyunwoo],
          ["학생회실", phoneNumbers.council],
        ].map(([name, number]) => (
          <button
            type="button"
            key={name}
            onClick={() => {
              setDial(number);
              setPhoneTab("keypad");
              navigateTo("phone");
            }}
          >
            <span>{name.slice(0, 1)}</span>
            <div>
              <strong>{name}</strong>
              <small>{number}</small>
            </div>
            <b><UiIcon name="phone" size={19} /></b>
          </button>
        ))}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="app-surface settings-app">
      {renderHeader("설정")}
      <div className="settings-owner">
        <span>강</span>
        <div>
          <strong>강도윤</strong>
          <p>{phoneNumbers.doyoon} · 기기 이름: 도윤의 Galaxy</p>
        </div>
      </div>
      <div className="settings-list">
        <div>
          <span className="setting-icon wifi"><UiIcon name="wifi" size={18} /></span>
          <strong>Wi-Fi</strong>
          <small>WOLBAEK_2-4</small>
        </div>
        <div>
          <span className="setting-icon bluetooth"><UiIcon name="bluetooth" size={19} /></span>
          <strong>블루투스</strong>
          <small>켜짐</small>
        </div>
        <div>
          <span className="setting-icon battery"><UiIcon name="battery" size={19} /></span>
          <strong>배터리</strong>
          <small>47%</small>
        </div>
        <button type="button" className="setting-action" onClick={restoreFullscreen}>
          <span className="setting-icon fullscreen"><UiIcon name="fullscreen" size={19} /></span>
          <strong>전체 화면 다시 켜기</strong>
          <small>게임 화면 유지</small>
        </button>
      </div>
    </section>
  );

  const renderGuide = () => (
    <section className={`app-surface guide-app guide-font-${guideFontSize}`}>
      {renderHeader("게임 안내", "언제든 다시 확인할 수 있습니다")}
      <div className="guide-reader-toolbar" aria-label="게임 설명서 글자 크기">
        <span>글자 크기</span>
        <div>
          {(
            [
              ["small", "작게", "가"],
              ["medium", "기본", "가"],
              ["large", "크게", "가"],
            ] as const
          ).map(([size, label, glyph]) => (
            <button
              type="button"
              key={size}
              className={guideFontSize === size ? "active" : ""}
              aria-pressed={guideFontSize === size}
              onClick={() => changeGuideFontSize(size)}
            >
              <b className={`font-glyph ${size}`}>{glyph}</b>
              <small>{label}</small>
            </button>
          ))}
        </div>
      </div>
      <article className="identity-card">
        <span>내 캐릭터</span>
        <div>
          <b>강</b>
          <p>
            <strong>강도윤</strong>
            <small>남성 · 월백고등학교 2학년 4반 · 학생회</small>
          </p>
        </div>
        <p>
          자신의 이름과 기본 신원은 기억합니다. 사건 당시의 행동과 감춰진
          관계는 휴대전화 기록과 단서카드를 통해 확인하세요.
        </p>
      </article>
      <div className="guide-section">
        <h2>휴대전화 사용법</h2>
        <ol>
          <li>홈 화면의 앱과 기록은 자유롭게 확인할 수 있습니다.</li>
          <li>잠긴 항목은 실물 단서카드에서 얻은 암호로만 해제합니다.</li>
          <li>다른 캐릭터의 휴대전화를 대신 조작하거나 엿보지 않습니다.</li>
          <li>하단 뒤로가기는 이전 앱 화면으로만 이동하며 게임에서 나가지 않습니다.</li>
        </ol>
      </div>
      <div className="guide-section">
        <h2>6라운드 조사</h2>
        <p>각 라운드에는 모든 사람이 단서 카드 한 장을 가져간 뒤 함께 논의합니다.</p>
        <div className="round-list">
          <span><b>1</b>강도윤 → 박재민 → 서유리 → 최현우</span>
          <span><b>2</b>박재민 → 서유리 → 최현우 → 강도윤</span>
          <span><b>3</b>서유리 → 최현우 → 강도윤 → 박재민</span>
          <span><b>4</b>최현우 → 강도윤 → 박재민 → 서유리</span>
          <span><b>5</b>강도윤 → 박재민 → 서유리 → 최현우</span>
          <span><b>6</b>박재민 → 서유리 → 최현우 → 강도윤</span>
        </div>
        <p className="guide-note">
          라운드는 말로 함께 확인합니다. 이 휴대전화가 다른 사람의 진행을
          통제하지 않습니다.
        </p>
      </div>
      <div className="guide-section">
        <h2>정보 공개와 거짓말</h2>
        <p>
          휴대전화에서 확인한 내용을 말로 공유할 수 있지만, 화면 자체를 다른
          사람에게 보여주지는 않습니다. 자신의 비밀을 숨기거나 거짓말할 수
          있으나 게임 규칙과 카드에 적힌 사실을 바꿀 수는 없습니다.
        </p>
      </div>
    </section>
  );

  const renderScreen = () => {
    if (screen === "lock") {
      return (
        <section
          className="lock-screen"
          onTouchStart={(event) => {
            swipeStartY.current = event.touches[0]?.clientY ?? null;
          }}
          onTouchEnd={(event) => {
            const startY = swipeStartY.current;
            const endY = event.changedTouches[0]?.clientY;
            swipeStartY.current = null;
            if (
              typeof startY === "number" &&
              typeof endY === "number" &&
              startY - endY > 48
            ) {
              unlockPhone();
            }
          }}
        >
          <div className="lock-shade" />
          <div className="lock-top">
            <span className="lock-icon"><UiIcon name="lock" size={19} /></span>
            <h1>00:04</h1>
            <p>10월 13일 일요일</p>
          </div>
          <div className="notification-stack">
            {latestUnreadThread ? (
              <article>
                <span className="notif-icon message"><AppGlyph name="messages" /></span>
                <div>
                  <b>{latestUnreadThread.name}</b>
                  <p>{latestUnreadThread.preview}</p>
                </div>
                <time>{activity.unreadMessages[latestUnreadThread.name]}개</time>
              </article>
            ) : null}
            {activity.missedCalls > 0 ? (
              <article>
                <span className="notif-icon phone"><AppGlyph name="phone" /></span>
                <div>
                  <b>부재중 전화</b>
                  <p>엄마 · 오후 9:07</p>
                </div>
                <time>1개</time>
              </article>
            ) : null}
            <article>
              <span className="notif-icon calendar"><AppGlyph name="calendar" /></span>
              <div>
                <b>지난 일정</b>
                <p>23:40 · 서아 만나기</p>
              </div>
              <time>지남</time>
            </article>
          </div>
          <button
            type="button"
            className="unlock-phone"
            onClick={unlockPhone}
          >
            위로 밀어 휴대전화 열기
          </button>
          <div className="lock-shortcuts">
            <button
              type="button"
              aria-label="카메라"
              onClick={() => setToast("잠금 상태에서는 카메라를 사용할 수 없습니다")}
            >
              <UiIcon name="camera" size={20} />
            </button>
            <button
              type="button"
              aria-label="손전등"
              onClick={() => setToast("손전등을 켤 수 없습니다")}
            >
              <UiIcon name="flash" size={19} />
            </button>
          </div>
        </section>
      );
    }

    if (screen === "home") {
      return (
        <section className="home-screen">
          <div className="home-shade" />
          <div className="home-date">
            <strong>00:05</strong>
            <span>10월 13일 일요일 · 흐림 16°</span>
          </div>
          <div className="app-grid">
            {apps.map((app) => {
              const badge = getAppBadge(app.id);
              return (
              <button
                type="button"
                key={app.id}
                className="app-button"
                onClick={() => openApp(app.id)}
              >
                <span className="app-icon-shell">
                  <span className={`app-icon app-${app.id}`}>
                    <AppGlyph name={app.icon as AppGlyphName} />
                  </span>
                  {badge > 0 ? (
                    <b
                      className="app-badge"
                      aria-label={`읽지 않음 ${badge}개`}
                    >
                      {badge}
                    </b>
                  ) : null}
                </span>
                <small>{app.label}</small>
              </button>
              );
            })}
          </div>
          <div className="home-page-dots" aria-hidden="true">
            <i />
            <i className="active" />
          </div>
          <div className="home-dock">
            {apps.slice(0, 4).map((app) => {
              const badge = getAppBadge(app.id);
              return (
              <button
                type="button"
                key={`dock-${app.id}`}
                className="app-button"
                onClick={() => openApp(app.id)}
                aria-label={app.label}
              >
                <span className="app-icon-shell">
                  <span className={`app-icon app-${app.id}`}>
                    <AppGlyph name={app.icon as AppGlyphName} />
                  </span>
                  {badge > 0 ? (
                    <b
                      className="app-badge"
                      aria-label={`읽지 않음 ${badge}개`}
                    >
                      {badge}
                    </b>
                  ) : null}
                </span>
              </button>
              );
            })}
          </div>
        </section>
      );
    }

    if (screen === "messages") return renderMessages();
    if (screen === "thread") return renderThread();
    if (screen === "phone") return renderPhone();
    if (screen === "gallery") return renderGallery();
    if (screen === "files") return renderFiles();
    if (screen === "recorder") return renderRecorder();
    if (screen === "notes") return renderNotes();
    if (screen === "note") return renderNote();
    if (screen === "calendar") return renderCalendar();
    if (screen === "contacts") return renderContacts();
    if (screen === "guide") return renderGuide();
    return renderSettings();
  };

  if (!entered) {
    return (
      <main className="immersive-entry">
        <div className="entry-noise" />
        <section>
          <span className="entry-device">GALAXY · 강도윤</span>
          <div className="entry-avatar">강</div>
          <h1>강도윤의 휴대전화</h1>
          <p>
            이 화면을 켜면 게임이 끝날 때까지 당신의 휴대전화는 강도윤의
            기기로 작동합니다.
          </p>
          <button type="button" onClick={enterPhone}>휴대전화 켜기</button>
          <small>
            전체 화면과 화면 꺼짐 방지를 사용합니다. 하단 뒤로가기는 앱
            내부에서만 작동합니다.
          </small>
        </section>
      </main>
    );
  }

  return (
    <main className="phone-stage">
      <div className="phone-shell">
        <div className="phone-bezel">
          <div className="camera-island">
            <i />
            <span />
          </div>
          <div className="phone-screen">
            {screen !== "lock" && screen !== "home" ? (
              <div
                className={`status-bar-scrim ${
                  screen === "note" && selectedNote.tone === "dark"
                    ? "dark-note"
                    : ""
                }`}
                aria-hidden="true"
              />
            ) : null}
            <div
              className={`status-bar ${
                screen === "lock" ||
                screen === "home" ||
                (screen === "note" && selectedNote.tone === "dark")
                  ? ""
                  : "dark"
              }`}
            >
              <b>{statusTime}</b>
              <div className="status-indicators" aria-label="LTE 신호, 와이파이, 배터리 47%">
                <span className="status-lte">LTE</span>
                <UiIcon name="signal" size={15} />
                <UiIcon name="wifi" size={15} />
                <span className="battery-meter">
                  <i />
                </span>
              </div>
            </div>
            {renderScreen()}
            <div className="home-indicator" />
          </div>
        </div>
      </div>

      {unlockTarget ? (
        <div className="modal-backdrop">
          <form
            className="unlock-modal"
            onSubmit={(event) => {
              event.preventDefault();
              submitUnlock();
            }}
          >
            <span className="modal-lock"><UiIcon name="lock" size={22} /></span>
            <h2>{unlockConfig[unlockTarget].title}</h2>
            <p>{unlockConfig[unlockTarget].hint}</p>
            <input
              autoFocus
              value={unlockInput}
              onChange={(event) => {
                setUnlockInput(event.target.value);
                setUnlockError(false);
              }}
              placeholder="암호 입력"
              aria-label="암호 입력"
            />
            {unlockError ? (
              <small className="unlock-error">암호가 일치하지 않습니다.</small>
            ) : null}
            <div>
              <button type="button" onClick={() => setUnlockTarget(null)}>
                취소
              </button>
              <button type="submit">잠금 해제</button>
            </div>
          </form>
        </div>
      ) : null}

      {call ? (
        <div className="call-screen">
          <div className="call-backdrop" />
          <div className="call-content">
            <span>
              {call.phase === "calling"
                ? call.mode === "unavailable"
                  ? "전화 거는 중…"
                  : "기록 확인 중…"
                : call.mode === "recording"
                  ? "저장된 통화 기록"
                  : call.mode === "voicemail"
                    ? "음성보관함 재생"
                    : "연결 실패"}
            </span>
            <h2>{call.title}</h2>
            <p>{call.number}</p>
            {call.phase === "connected" ? (
              <div className="live-transcript">{call.transcript}</div>
            ) : (
              <div className="ringing-wave">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
            <div className="call-options">
              <button type="button">
                <span><UiIcon name="mute" size={21} /></span>
                음소거
              </button>
              <button type="button">
                <span><UiIcon name="keypad" size={22} /></span>
                키패드
              </button>
              <button type="button">
                <span><UiIcon name="speaker" size={23} /></span>
                스피커
              </button>
            </div>
            <button
              type="button"
              className="hangup-button"
              onClick={endCall}
              aria-label="통화 종료"
            >
              <UiIcon name="hangup" size={30} />
            </button>
          </div>
        </div>
      ) : null}

      {selectedImage ? (
        <div
          className="image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedImage.title} 사진 보기`}
        >
          <header className="viewer-topbar">
            <button type="button" onClick={closeGalleryImage} aria-label="사진 닫기">
              <UiIcon name="back" size={24} />
            </button>
            <div>
              <strong>{selectedImage.date}</strong>
              <span>{selectedImage.location}</span>
            </div>
            <button
              type="button"
              aria-label="사진 메뉴"
              onClick={() => setToast("표시할 추가 메뉴가 없습니다")}
            >
              <UiIcon name="more" size={22} />
            </button>
          </header>

          <div
            className={`viewer-canvas ${viewerScale > 1 ? "zoomed" : ""}`}
            onTouchStart={handleViewerTouchStart}
            onTouchMove={handleViewerTouchMove}
            onTouchEnd={handleViewerTouchEnd}
            onWheel={handleViewerWheel}
            onDoubleClick={() => setViewerZoom(viewerScale > 1 ? 1 : 2.5)}
          >
            <button
              type="button"
              className="viewer-step previous"
              aria-label="이전 사진"
              disabled={selectedImagePosition <= 0}
              onClick={() => stepGalleryImage(-1)}
            >
              <UiIcon name="chevronLeft" size={28} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              draggable={false}
              style={{
                transform: `translate3d(${viewerPan.x}px, ${viewerPan.y}px, 0) scale(${viewerScale})`,
              }}
            />
            <button
              type="button"
              className="viewer-step next"
              aria-label="다음 사진"
              disabled={selectedImagePosition >= visibleGalleryImages.length - 1}
              onClick={() => stepGalleryImage(1)}
            >
              <UiIcon name="chevronRight" size={28} />
            </button>
          </div>

          <div className="viewer-zoom">
            <button
              type="button"
              aria-label="축소"
              disabled={viewerScale <= 1}
              onClick={() => setViewerZoom(viewerScale - 0.5)}
            >
              <UiIcon name="zoomOut" size={19} />
            </button>
            <span>{Math.round(viewerScale * 100)}%</span>
            <button
              type="button"
              aria-label="확대"
              disabled={viewerScale >= 4}
              onClick={() => setViewerZoom(viewerScale + 0.5)}
            >
              <UiIcon name="zoomIn" size={19} />
            </button>
          </div>

          <div className="viewer-thumbnails" aria-label="사진 목록">
            {visibleGalleryImages.map((image, index) => (
              <button
                type="button"
                key={`viewer-${image.id}`}
                className={image.id === selectedImage.id ? "active" : ""}
                onClick={() => openGalleryImage(image.id)}
                aria-label={`${image.title} 보기`}
              >
                <img src={image.src} alt="" />
                <span>{index + 1}</span>
              </button>
            ))}
          </div>

          <footer className="viewer-toolbar">
            <button
              type="button"
              onClick={() => setToast("게임 중에는 사진을 공유할 수 없습니다")}
            >
              <UiIcon name="share" size={21} />
              <span>공유</span>
            </button>
            <button
              type="button"
              onClick={() => setToast("즐겨찾기에 추가할 수 없습니다")}
            >
              <UiIcon name="heart" size={21} />
              <span>즐겨찾기</span>
            </button>
            <button
              type="button"
              className={viewerDetails ? "active" : ""}
              onClick={() => setViewerDetails((current) => !current)}
            >
              <UiIcon name="info" size={21} />
              <span>상세정보</span>
            </button>
            <button
              type="button"
              onClick={() => setToast("원본 기록은 편집할 수 없습니다")}
            >
              <UiIcon name="edit" size={21} />
              <span>편집</span>
            </button>
            <button
              type="button"
              onClick={() => setToast("사건 기록은 삭제할 수 없습니다")}
            >
              <UiIcon name="trash" size={21} />
              <span>삭제</span>
            </button>
          </footer>

          {viewerDetails ? (
            <aside className="viewer-details" aria-label="사진 상세정보">
              <div className="viewer-details-handle" />
              <header>
                <div>
                  <strong>상세정보</strong>
                  <span>{selectedImage.file}</span>
                </div>
                <button
                  type="button"
                  aria-label="상세정보 닫기"
                  onClick={() => setViewerDetails(false)}
                >
                  <UiIcon name="close" size={20} />
                </button>
              </header>
              <dl>
                <div><dt>촬영 시각</dt><dd>{selectedImage.date}</dd></div>
                <div><dt>위치</dt><dd>{selectedImage.location}</dd></div>
                <div><dt>파일 정보</dt><dd>{selectedImage.meta}</dd></div>
              </dl>
            </aside>
          ) : null}
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
