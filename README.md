# Attendance Manager Web

근태관리 프로그램의 초기 버전입니다. Express 기반의 백엔드와 React(Vite) 기반의 프론트엔드를 포함하고 있으며, JWT를 활용한 로그인 및 세션 유지 기능을 제공합니다. 2025년 이후 기능 확장을 염두에 두고 백엔드와 프론트엔드를 도메인 별 패키지 구조로 리팩토링했습니다.

## 프로젝트 구조

```
.
├── backend
│   ├── package.json
│   └── src
│       ├── app.js                  # 공통 미들웨어 및 라우터 등록
│       ├── server.js               # 서버 부트스트랩
│       ├── config                  # 환경 변수, CORS, 쿠키 설정
│       ├── middleware              # 공용 미들웨어
│       ├── routes                  # 최상위 라우팅 조합
│       └── features
│           ├── auth                # 인증 도메인 (컨트롤러, 서비스, 리포지토리 등)
│           └── health              # 헬스체크 라우터
├── frontend
│   ├── package.json
│   └── src
│       ├── app                     # 최상위 App 컴포넌트 및 전역 스타일
│       ├── features
│       │   └── auth                # 인증 관련 API, 컨텍스트, UI 컴포넌트
│       └── shared                  # 환경 설정, HTTP 클라이언트 등 공용 리소스
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

### 백엔드 환경 변수

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `PORT` | 서버 포트 | `4000` |
| `JWT_SECRET` | JWT 서명 시크릿 | `development-secret` |
| `CORS_ORIGIN` | 허용할 CORS Origin (`,`로 다중 지정 가능) | `http://localhost:5173` |
| `SESSION_TTL_HOURS` | 세션 만료 시간(시간 단위) | `2` |
| `TOKEN_COOKIE_NAME` | HttpOnly 쿠키 이름 | `attendance_token` |
| `COOKIE_SAME_SITE` | SameSite 속성 (`lax`, `strict`, `none`) | `lax` |

### 프론트엔드 환경 변수

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL | `http://localhost:4000` |

## 실행 방법

### 1. 백엔드 (Express)

```bash
cd backend
npm install
npm run dev
```

기본적으로 `http://localhost:4000`에서 API가 실행되며, 로그인 성공 시 HttpOnly 쿠키에 JWT가 저장되어 브라우저 새로고침 이후에도 세션이 유지됩니다.

#### 주요 엔드포인트

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/health` | 애플리케이션 상태 확인 |
| `POST` | `/api/auth/login` | 사용자 로그인 및 세션 발급 |
| `GET` | `/api/auth/session` | 현재 로그인 세션 조회 |
| `POST` | `/api/auth/logout` | 세션 만료 및 쿠키 삭제 |

### 2. 프론트엔드 (React)

다른 터미널에서 다음을 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:5173`에서 실행되며, 페이지 로드 시 기존 세션이 있는 경우 자동으로 로그인 상태를 복원합니다. `src/features/auth` 디렉터리에 인증 관련 API 모듈과 컨텍스트, UI 컴포넌트가 분리되어 있으므로 향후 기능 추가 시 손쉽게 확장할 수 있습니다.

## 테스트 계정

| 이름 | 이메일 | 비밀번호 | 역할 |
| --- | --- | --- | --- |
| 관리자 | admin@example.com | admin123 | admin |
| 홍길동 | hong@example.com | password123 | employee |

## 향후 확장 아이디어

- 출퇴근 기록, 휴가 신청 등 근태 기능 구현
- DB 연동 및 사용자 관리 기능 추가
- 역할/권한 기반 접근 제어 및 감사 로그 도입
