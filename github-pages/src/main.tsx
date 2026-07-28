import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Phone from "../../app/page";
import "../../app/globals.css";
import "../../app/one-ui.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("강도윤 휴대전화 화면을 시작할 수 없습니다.");
}

createRoot(root).render(
  <StrictMode>
    <Phone />
  </StrictMode>,
);
