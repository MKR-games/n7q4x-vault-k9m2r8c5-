# 강도윤의 휴대전화

4인용 공포 머더 미스터리를 위한 강도윤 캐릭터 휴대전화 프로토타입입니다.
이 패키지는 GitHub Actions나 별도 서버 없이 GitHub Pages에서 실행됩니다.

## 가장 간단한 배포 방법

1. ZIP 압축을 풉니다.
2. 압축을 푼 폴더 안의 파일과 폴더를 GitHub 저장소 최상단에 모두 업로드합니다.
3. 저장소 첫 화면에 `docs`, `public`, `src`, `README.md`가 보이는지 확인합니다.
4. GitHub 저장소의 **Settings → Pages**로 이동합니다.
5. **Build and deployment → Source**를 `Deploy from a branch`로 선택합니다.
6. Branch는 `main`, 폴더는 `/docs`로 선택하고 **Save**를 누릅니다.
7. 배포가 끝나면 아래 주소로 접속합니다.

```text
https://내아이디.github.io/저장소이름/
```

현재 저장소를 그대로 사용할 경우 주소는 다음과 같습니다.

```text
https://mkr-games.github.io/n7q4x-vault-k9m2r8c5-/
```

중요: `GitHub Actions`가 아니라 `Deploy from a branch → main → /docs`를
선택해야 합니다. `docs` 폴더에는 이미 빌드가 끝난 실행 파일이 들어 있습니다.

## 컴퓨터에서 먼저 실행하기

Node.js 22 이상이 필요합니다. 압축을 푼 폴더에서 터미널을 열고 실행합니다.

```bash
npm install
npm run dev
```

터미널에 표시되는 `Local` 주소를 브라우저에서 열면 됩니다.

## 테스트용 단서

- 숨김 앨범: `1012`
- 삭제된 대화: `2357`
- 음성메모: `0416`
- 암호화 영상: `NARI`
- 기기 기록: `0004`
- 윤서아 전화번호: `010-4821-0416`

## 유의사항

- 통화 음성은 브라우저의 한국어 음성 합성 기능을 사용합니다.
- 모바일 브라우저에서는 무음 모드나 음성 권한 설정에 따라 음량이 달라질 수 있습니다.
- 해제한 단서는 해당 브라우저의 로컬 저장소에 기록됩니다.
