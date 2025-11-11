# Attendance Manager Web

근태관리 프로그램의 초기 버전입니다. Express 기반의 백엔드와 React(Vite) 기반의 프론트엔드를 포함하고 있으며, 간단한 로그인 기능을 제공합니다.

## 프로젝트 구조

```
.
├── backend          # Express 서버 (로그인 API)
├── frontend         # React 프론트엔드 (로그인 화면)
└── README.md
```

## 사전 준비

- Node.js 18 이상
- npm 9 이상

## 환경 변수 설정

각 패키지 디렉터리에 `.env.example` 파일이 제공됩니다. 필요한 경우 복사하여 `.env` 파일을 생성하세요.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## 설치 및 실행

### 1. 백엔드 (Express)

```bash
cd backend
npm install
npm run dev
```

기본적으로 `http://localhost:4000`에서 API가 실행됩니다.

### 2. 프론트엔드 (React)

다른 터미널에서 다음을 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:5173`에서 실행되며, `.env` 파일의 `VITE_API_BASE_URL`을 통해 백엔드 주소를 변경할 수 있습니다.

## 테스트 계정

| 이름     | 이메일              | 비밀번호    | 역할      |
|----------|----------------------|-------------|-----------|
| 관리자   | admin@example.com    | admin123    | admin     |
| 홍길동   | hong@example.com     | password123 | employee  |

## 향후 확장 아이디어

- JWT 기반 인증을 활용한 세션 유지
- 출퇴근 기록, 휴가 신청 등 근태 기능 구현
- DB 연동 및 사용자 관리 기능 추가
