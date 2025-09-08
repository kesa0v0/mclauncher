# MCLauncher

커스텀 마인크래프트 모드팩 런처로, 서버와 동기화하여 모드 및 설정을 최신 상태로 유지하고 바로 게임을 실행할 수 있습니다.

## ✨ 주요 기능

- **모드팩 동기화:** 서버에 있는 모드팩 버전과 로컬 모드팩을 자동으로 동기화합니다.
- **스마트한 설정 관리:**
    - `mods` 폴더는 항상 서버 버전과 동일하게 유지합니다.
    - `config` 파일의 경우, 변경 사항(`diff`)을 직접 확인하고 동기화 여부를 선택할 수 있습니다.
- **유연한 동기화 옵션:** 각 설정 파일에 대해 다음과 같은 동기화 방식을 선택할 수 있습니다.
    - **항상 서버와 동기화:** 로컬 파일을 덮어쓰고 항상 서버 버전을 유지합니다.
    - **변경 사항 확인 후 선택:** `diff`를 통해 변경된 부분을 확인하고 적용할지를 선택합니다.
    - **항상 로컬 파일 유지:** 서버의 변경 사항을 무시하고 항상 로컬 파일을 유지합니다.
- **게임 바로 실행:** Microsoft 계정으로 로그인하여 동기화된 모드팩으로 마인크래프트를 바로 실행합니다.
- **백업:** (예정) 동기화 전 안전을 위해 파일을 백업합니다.

## 🛠️ 기술 스택

### 클라이언트 (Client)
- **Framework:** React, Electron, Vite
- **Language:** TypeScript
- **Core Logic:** [minecraft-java-core](https://github.com/luuxis/minecraft-java-core)

### 서버 (Server)
- **Framework:** FastAPI
- **Language:** Python

## 🚀 시작하기

### 준비물
- Node.js, npm
- Python 3.x, pip

### 서버 실행
1. **저장소 복제 및 서버 폴더로 이동:**
   ```bash
   git clone <repository-url>
   cd mclauncher/server
   ```
2. **필요한 라이브러리 설치:**
   ```bash
   pip install -r requirement.txt
   ```
3. **서버 실행:**
   ```bash
   uvicorn main:app --reload
   ```

### 클라이언트 실행
1. **클라이언트 폴더로 이동:**
   ```bash
  cd ../client
   ```
2. **필요한 라이브러리 설치:**
   ```bash
   npm install
   ```
3. **클라이언트 실행:**
   ```bash
   npm run dev
   ```

## 🗺️ 로드맵

- [x] 서버와 모드팩 동기화
- [ ] 모드/컨피그 `diff` 확인 기능
- [ ] Microsoft 계정 연동 및 게임 실행
- [ ] 백업 기능 추가