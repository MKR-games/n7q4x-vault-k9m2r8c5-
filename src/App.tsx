"use client";

import { useEffect, useMemo, useState } from "react";

const assetPath = (name: string) =>
  `${import.meta.env.BASE_URL}assets/${name}`;

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
  | "calendar"
  | "contacts"
  | "settings";

type UnlockKey = "gallery" | "messages" | "voice" | "file" | "device";

type UnlockState = Record<UnlockKey, boolean>;

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
    hint: "그날을 잊지 않기 위해 저장한 네 자리 숫자",
    answer: "1012",
  },
  messages: {
    title: "삭제된 대화",
    hint: "교실 시계가 멈춘 시각",
    answer: "2357",
  },
  voice: {
    title: "잠긴 음성메모",
    hint: "서아의 생일",
    answer: "0416",
  },
  file: {
    title: "암호화된 동영상",
    hint: "파일을 복구한 사람이 붙인 영문 암호",
    answer: "NARI",
  },
  device: {
    title: "주변기기 연결기록",
    hint: "사건이 발생한 교실",
    answer: "0004",
  },
};

const apps = [
  { id: "messages", label: "메시지", icon: "💬", color: "#40c96a", badge: 3 },
  { id: "phone", label: "전화", icon: "☎", color: "#32c45d" },
  { id: "gallery", label: "갤러리", icon: "✿", color: "#f3f4f7" },
  { id: "files", label: "파일", icon: "📁", color: "#6ba9ff" },
  { id: "recorder", label: "음성 녹음", icon: "〽", color: "#ee5262" },
  { id: "notes", label: "메모", icon: "▤", color: "#ffd34e" },
  { id: "calendar", label: "캘린더", icon: "12", color: "#ffffff" },
  { id: "contacts", label: "연락처", icon: "♟", color: "#efb15e" },
  { id: "settings", label: "설정", icon: "⚙", color: "#a8adb5" },
] as const;

const threads = [
  {
    name: "윤서아",
    preview: "오늘 밤 2학년 4반에서 끝내자.",
    time: "23:42",
    unread: 2,
    avatar: "윤",
  },
  {
    name: "엄마",
    preview: "도윤아, 오늘도 학교에 늦게까지 있니?",
    time: "21:08",
    unread: 1,
    avatar: "엄",
  },
  {
    name: "학생회",
    preview: "내일 아침 회의는 취소됐습니다.",
    time: "18:31",
    unread: 0,
    avatar: "학",
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

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [selectedThread, setSelectedThread] = useState("윤서아");
  const [unlocks, setUnlocks] = useState<UnlockState>(initialUnlocks);
  const [unlockTarget, setUnlockTarget] = useState<UnlockKey | null>(null);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const [toast, setToast] = useState("");
  const [dial, setDial] = useState("");
  const [call, setCall] = useState<{
    phase: "calling" | "connected";
    title: string;
    number: string;
    transcript: string;
  } | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("doyoon-unlocks");
      if (saved) setUnlocks({ ...initialUnlocks, ...JSON.parse(saved) });
    } catch {
      // Local persistence is optional.
    }
  }, []);

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
  }, [call?.phase]);

  const statusTime = useMemo(() => (screen === "lock" ? "23:47" : "23:48"), [screen]);

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
    setScreen(id as Screen);
    vibrate();
  };

  const startCall = () => {
    const normalized = dial.replace(/\D/g, "");
    const seoANumber = "01048210416";
    const schoolNumber = "0522042357";
    if (normalized === seoANumber) {
      setCall({
        phase: "calling",
        title: "윤서아",
        number: "010-4821-0416",
        transcript:
          "원본 영상 봤지? 열한 시 사십 분까지 교실로 와. 오늘 네 입으로 전부 말하게 할 거야.",
      });
    } else if (normalized === schoolNumber) {
      setCall({
        phase: "calling",
        title: "해원고 음성보관함",
        number: "052-204-2357",
        transcript:
          "보관된 메시지입니다. 도윤아, 네가 약속만 지키면 영상은 공개하지 않을게. 오늘이 마지막이야.",
      });
    } else {
      setCall({
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
        onClick={() => setScreen("home")}
        aria-label="홈으로 돌아가기"
      >
        ‹
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
      {renderHeader("메시지", "읽지 않은 메시지 3개")}
      <div className="search-pill">대화 검색</div>
      <div className="thread-list">
        {threads.map((thread) => (
          <button
            className="thread-row"
            key={thread.name}
            type="button"
            onClick={() => {
              setSelectedThread(thread.name);
              setScreen("thread");
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
            {thread.unread ? <b className="unread-dot">{thread.unread}</b> : null}
          </button>
        ))}
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
            onClick={() => setScreen("messages")}
            aria-label="메시지 목록으로 돌아가기"
          >
            ‹
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
                  🔒 삭제된 메시지 2개
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
          <span>메시지</span>
          <button type="button" aria-label="전송">
            ↑
          </button>
        </div>
      </section>
    );
  };

  const renderPhone = () => (
    <section className="app-surface phone-app">
      {renderHeader("전화")}
      <div className="phone-tabs">
        <button type="button" className="active">
          키패드
        </button>
        <button type="button">최근기록</button>
        <button type="button">연락처</button>
      </div>
      <div className="dial-display">
        <strong>{dial || "번호 입력"}</strong>
        {dial ? <small>게임 속 전화번호만 입력하세요</small> : null}
      </div>
      <div className="keypad">
        {[
          ["1", ""],
          ["2", "ABC"],
          ["3", "DEF"],
          ["4", "GHI"],
          ["5", "JKL"],
          ["6", "MNO"],
          ["7", "PQRS"],
          ["8", "TUV"],
          ["9", "WXYZ"],
          ["*", ""],
          ["0", "+"],
          ["#", ""],
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
        <button
          type="button"
          className="call-button"
          onClick={startCall}
          aria-label="전화 걸기"
        >
          ☎
        </button>
        <button
          type="button"
          className="erase-button"
          onClick={() => setDial((current) => current.slice(0, -1))}
          aria-label="한 글자 지우기"
        >
          ⌫
        </button>
      </div>
      <div className="prototype-hint">
        프로토타입 번호: 010-4821-0416
      </div>
    </section>
  );

  const renderGallery = () => (
    <section className="app-surface gallery-app">
      {renderHeader("갤러리", "최근 항목")}
      <div className="gallery-feature">
        <img src={assetPath("student-council.png")} alt="학생회 단체사진" />
        <div>
          <strong>학생회</strong>
          <span>9월 27일 · 사진 12장</span>
        </div>
      </div>
      <div className="gallery-grid">
        <figure>
          <img src={assetPath("student-council.png")} alt="학생회 단체사진" />
          <figcaption>9월 27일 17:31</figcaption>
        </figure>
        <figure>
          <img
            src={assetPath("doyoon-seoa.png")}
            alt="교실에서 함께 찍은 두 학생"
          />
          <figcaption>8월 19일 18:42</figcaption>
        </figure>
        {unlocks.gallery ? (
          <figure className="evidence-photo">
            <img
              src={assetPath("rooftop-evidence.png")}
              alt="옥상에서 학생의 손목을 붙잡고 있는 강도윤"
            />
            <figcaption>10월 12일 · 숨김</figcaption>
          </figure>
        ) : (
          <button
            type="button"
            className="locked-gallery"
            onClick={() => openUnlock("gallery")}
          >
            <span>🔒</span>
            <strong>숨김 앨범</strong>
            <small>사진 4장</small>
          </button>
        )}
        <figure className="placeholder-shot">
          <div className="hallway-photo" />
          <figcaption>10월 12일 22:19</figcaption>
        </figure>
      </div>
      {unlocks.gallery ? (
        <article className="evidence-caption">
          <span>숨김 앨범 · 사진 정보</span>
          <strong>IMG_1012_1746.jpg</strong>
          <p>위치: 해원고등학교 옥상 · 원본 촬영기기 미확인</p>
        </article>
      ) : null}
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
          <span className="file-icon video">▶</span>
          <span>
            <strong>NARI_FINAL.mp4</strong>
            <small>{unlocks.file ? "복원된 동영상 · 84.2 MB" : "암호화됨"}</small>
          </span>
          <b>{unlocks.file ? "열기" : "🔒"}</b>
        </button>
        {unlocks.file ? (
          <article className="file-preview">
            <img
              src={assetPath("rooftop-evidence.png")}
              alt="복구 영상 미리보기"
            />
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
          <span className="file-icon link">⌁</span>
          <span>
            <strong>주변기기 연결기록</strong>
            <small>{unlocks.device ? "10월 12일 · 23:59" : "접근 제한됨"}</small>
          </span>
          <b>{unlocks.device ? "열기" : "🔒"}</b>
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
            ▶
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
              {voicePlaying ? "Ⅱ" : "▶"}
            </button>
          ) : (
            <button
              type="button"
              className="play-mini"
              onClick={() => openUnlock("voice")}
            >
              🔒
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
      <button type="button" className="record-button" aria-label="새 녹음">
        <span />
      </button>
    </section>
  );

  const renderNotes = () => (
    <section className="app-surface notes-app">
      {renderHeader("메모", "최근 수정 순")}
      <div className="note-grid">
        <article className="note-card important">
          <small>10월 12일</small>
          <strong>오늘</strong>
          <p>불이 꺼졌을 때 복도로 나갔다고 말할 것.</p>
        </article>
        <article className="note-card">
          <small>10월 9일</small>
          <strong>학생회</strong>
          <p>회의록 정리, 축제 예산 확인, 방송부 장비 반납.</p>
        </article>
        <article className="note-card dark">
          <small>9월 28일</small>
          <strong>서아</strong>
          <p>영상이 정말 남아 있는지 확인해야 한다.</p>
        </article>
      </div>
      <button type="button" className="floating-add" aria-label="새 메모">
        ＋
      </button>
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
            <strong>차단기 확인</strong>
            <span>본관 3층 복도</span>
          </div>
        </article>
      </div>
    </section>
  );

  const renderContacts = () => (
    <section className="app-surface contacts-app">
      {renderHeader("연락처", "87명")}
      <div className="contact-owner">
        <span>?</span>
        <div>
          <strong>내 프로필</strong>
          <small>이름 정보가 손상되었습니다</small>
        </div>
      </div>
      <div className="contact-list">
        {[
          ["박재민", "010-9031-1024"],
          ["서유리", "010-7174-0907"],
          ["윤서아", "010-4821-0416"],
          ["학생회실", "052-204-0312"],
        ].map(([name, number]) => (
          <button
            type="button"
            key={name}
            onClick={() => {
              setDial(number);
              setScreen("phone");
            }}
          >
            <span>{name.slice(0, 1)}</span>
            <div>
              <strong>{name}</strong>
              <small>{number}</small>
            </div>
            <b>☎</b>
          </button>
        ))}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="app-surface settings-app">
      {renderHeader("설정")}
      <div className="settings-owner">
        <span>?</span>
        <div>
          <strong>사용자 정보 손상됨</strong>
          <p>기기 이름: KD-01</p>
        </div>
      </div>
      <div className="settings-list">
        <div>
          <span className="setting-icon wifi">⌁</span>
          <strong>Wi-Fi</strong>
          <small>HWA_2-4</small>
        </div>
        <div>
          <span className="setting-icon bluetooth">ᛒ</span>
          <strong>블루투스</strong>
          <small>켜짐</small>
        </div>
        <div>
          <span className="setting-icon battery">▰</span>
          <strong>배터리</strong>
          <small>47%</small>
        </div>
        <button
          type="button"
          className="reset-prototype"
          onClick={() => {
            persistUnlocks(initialUnlocks);
            setToast("프로토타입 잠금 상태를 초기화했습니다");
          }}
        >
          모든 잠금 다시 설정
        </button>
      </div>
    </section>
  );

  const renderScreen = () => {
    if (screen === "lock") {
      return (
        <section className="lock-screen">
          <div className="lock-shade" />
          <div className="lock-top">
            <span className="lock-icon">⌾</span>
            <h1>23:47</h1>
            <p>10월 12일 토요일</p>
          </div>
          <div className="notification-stack">
            <article>
              <span className="notif-icon message">💬</span>
              <div>
                <b>윤서아</b>
                <p>오늘 밤 2학년 4반에서 끝내자.</p>
              </div>
              <time>방금</time>
            </article>
            <article>
              <span className="notif-icon calendar">12</span>
              <div>
                <b>캘린더</b>
                <p>23:40 · 서아 만나기</p>
              </div>
              <time>예정</time>
            </article>
          </div>
          <button
            type="button"
            className="unlock-phone"
            onClick={() => {
              setScreen("home");
              vibrate([15, 25, 15]);
            }}
          >
            위로 밀어 휴대전화 열기
          </button>
          <div className="lock-shortcuts">
            <span>◉</span>
            <span>⌁</span>
          </div>
        </section>
      );
    }

    if (screen === "home") {
      return (
        <section className="home-screen">
          <div className="home-shade" />
          <div className="home-date">
            <strong>23:48</strong>
            <span>10월 12일 토요일 · 흐림 16°</span>
          </div>
          <div className="app-grid">
            {apps.map((app) => (
              <button
                type="button"
                key={app.id}
                className="app-button"
                onClick={() => openApp(app.id)}
              >
                <span
                  className={`app-icon app-${app.id}`}
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                  {"badge" in app && app.badge ? <b>{app.badge}</b> : null}
                </span>
                <small>{app.label}</small>
              </button>
            ))}
          </div>
          <div className="home-dock">
            {apps.slice(0, 4).map((app) => (
              <button
                type="button"
                key={`dock-${app.id}`}
                className="app-button"
                onClick={() => openApp(app.id)}
                aria-label={app.label}
              >
                <span
                  className={`app-icon app-${app.id}`}
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </span>
              </button>
            ))}
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
    if (screen === "calendar") return renderCalendar();
    if (screen === "contacts") return renderContacts();
    return renderSettings();
  };

  return (
    <main className="prototype-stage">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="prototype-copy">
        <span>CHARACTER PHONE · PROTOTYPE 01</span>
        <h1>강도윤의 휴대전화</h1>
        <p>
          화면 속 기록을 직접 열어 보세요. 잠긴 자료는 실물 단서카드의
          암호로 해제됩니다.
        </p>
        <div className="prototype-keys">
          <span>숨김 앨범 1012</span>
          <span>삭제된 대화 2357</span>
          <span>음성메모 0416</span>
          <span>동영상 NARI</span>
          <span>기기기록 0004</span>
        </div>
      </section>

      <div className="phone-shell">
        <div className="phone-bezel">
          <div className="camera-island">
            <i />
            <span />
          </div>
          <div className="phone-screen">
            <div className="status-bar">
              <b>{statusTime}</b>
              <div>
                <span>▥</span>
                <span>⌁</span>
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
            <span className="modal-lock">🔒</span>
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
            <span>{call.phase === "calling" ? "전화 거는 중…" : "통화 연결됨"}</span>
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
                <span>🔇</span>
                음소거
              </button>
              <button type="button">
                <span>▦</span>
                키패드
              </button>
              <button type="button">
                <span>🔊</span>
                스피커
              </button>
            </div>
            <button
              type="button"
              className="hangup-button"
              onClick={endCall}
              aria-label="통화 종료"
            >
              ☎
            </button>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
