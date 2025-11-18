# Attendance Manager Web

근태관리 프로그램의 초기 버전입니다. Express 기반의 백엔드와 React(Vite) 기반의 프론트엔드를 포함하고 있으며, JWT를 활용한 아이디 기반 로그인/세션 유지 기능을 제공합니다. 2025년 이후 기능 확장을 염두에 두고 백엔드와 프론트엔드를 도메인 별 패키지 구조로 리팩토링했으며, 현재 매장/직원/출퇴근 데이터는 MySQL에 영구 저장됩니다.

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
│           ├── health              # 헬스체크 라우터
│           ├── stores          # 매장 및 직급 관리
│           ├── employees           # 직원 CRUD API
│           └── attendance          # 출퇴근 기록 API
│   └── sql
│       └── schema.sql              # MySQL 초기 스키마 및 샘플 데이터
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
| `DB_HOST` | MySQL 호스트 | `127.0.0.1` |
| `DB_PORT` | MySQL 포트 | `3306` |
| `DB_USER` | MySQL 계정 | `attendance_user` |
| `DB_PASSWORD` | MySQL 계정 비밀번호 | `attendance_password` |
| `DB_NAME` | 사용할 데이터베이스 이름 | `attendance_manager` |
| `DB_POOL_SIZE` | 커넥션 풀 크기 | `10` |

### 프론트엔드 환경 변수

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL | `http://localhost:4000` |

## 데이터베이스 초기화

백엔드는 MySQL 8 이상을 사용하여 매장, 직원, 출퇴근 데이터를 영구 저장합니다.

1. MySQL 서버를 설치하고 실행합니다.
2. 예시와 같이 데이터베이스 및 전용 계정을 생성합니다.

   ```sql
   CREATE DATABASE attendance_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'attendance_user'@'%' IDENTIFIED BY 'attendance_password';
   GRANT ALL PRIVILEGES ON attendance_manager.* TO 'attendance_user'@'%';
   FLUSH PRIVILEGES;
   ```

3. 스키마와 샘플 관리자를 로드합니다.

   ```bash
   mysql -u attendance_user -p attendance_manager < backend/sql/schema.sql
   ```

   위 스크립트는 `admin / admin123` 계정을 생성하므로 바로 로그인할 수 있습니다. 추가로 가입 가능한 초대 코드는
   `backend/src/features/auth/signup-codes.js` 파일에서 수정할 수 있습니다.

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
| `POST` | `/api/auth/register` | 가입 코드 기반 사용자 등록 및 즉시 로그인 |
| `GET` | `/api/auth/session` | 현재 로그인 세션 조회 |
| `DELETE` | `/api/auth/account` | 본인 인증 후 계정/데이터 삭제 |
| `POST` | `/api/auth/logout` | 세션 만료 및 쿠키 삭제 |
| `GET` | `/api/stores` | 로그인한 사용자의 매장 목록 조회 |
| `POST` | `/api/stores` | 매장 생성 및 기본 직급 등록 |
| `DELETE` | `/api/stores/:storeId` | 매장 및 하위 데이터 삭제 |
| `GET` | `/api/stores/:storeId/employees` | 매장별 직원 목록 조회 |
| `POST` | `/api/stores/:storeId/employees` | 직원 등록 |
| `PUT` | `/api/stores/:storeId/employees/:employeeId` | 직원 정보 수정 |
| `DELETE` | `/api/stores/:storeId/employees/:employeeId` | 직원 삭제 |
| `GET` | `/api/stores/:storeId/attendance?employeeId=...` | 직원별 근태 기록 조회 |
| `POST` | `/api/stores/:storeId/attendance` | 근태 기록 등록 |
| `PUT` | `/api/stores/:storeId/attendance/:recordId` | 근태 기록 수정 |
| `DELETE` | `/api/stores/:storeId/attendance/:recordId` | 근태 기록 삭제 |

### 2. 프론트엔드 (React)

다른 터미널에서 다음을 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:5173`에서 실행되며, 페이지 로드 시 기존 세션이 있는 경우 자동으로 로그인 상태를 복원합니다. `src/features/auth` 디렉터리에 인증 관련 API 모듈과 컨텍스트, UI 컴포넌트가 분리되어 있으므로 향후 기능 추가 시 손쉽게 확장할 수 있습니다. 매장 · 직원 · 출퇴근 탭은 `httpClient`를 통해 백엔드 REST API를 호출하므로 브라우저 새로 고침 이후에도 모든 데이터가 유지됩니다.

## 테스트 계정

| 이름 | 아이디 | 비밀번호 | 비고 |
| --- | --- | --- | --- |
| 관리자 | admin | admin123 | 가입 코드는 `backend/src/features/auth/signup-codes.js`에서 관리 |

## 향후 확장 아이디어

- 휴가/연차 신청 및 결재 흐름
- 급여 산정 자동화 및 명세서 출력
- 역할/권한 기반 접근 제어와 감사 로그
- Push 알림, 모바일 앱/웹뷰 연동
