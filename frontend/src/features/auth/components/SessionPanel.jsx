import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const TAB_CONFIG = [
  {
    id: 'dashboard',
    label: '대시보드',
    description: '근태 현황과 알림을 한눈에 확인할 수 있는 메인 화면입니다.',
    highlights: [
      '일일/주간 근무 현황과 누적 근무 시간 요약',
      '다가오는 일정 및 공지사항 카드',
      '관리자가 주목해야 할 예외 상황 알림'
    ]
  },
  {
    id: 'employees',
    label: '직원관리',
    description: '구성원 정보를 조회하고 역할, 부서, 근무 형태를 관리할 수 있습니다.',
    highlights: [
      '직원 기본 정보 및 근무 형태 관리',
      '부서/팀 단위 필터링과 검색',
      '입/퇴사 처리와 권한 설정 지원'
    ]
  },
  {
    id: 'attendance',
    label: '출퇴근 등록',
    description: '직원 출퇴근 기록을 등록하고 실시간으로 확인하는 공간입니다.',
    highlights: [
      'QR/모바일 기반 출퇴근 기록 연동',
      '지각 및 초과 근무 자동 감지',
      '수정 요청 승인 흐름 지원'
    ]
  },
  {
    id: 'payroll',
    label: '명세서',
    description: '급여 및 수당 명세서를 확인하고 배포할 수 있는 탭입니다.',
    highlights: [
      '월별 급여 명세서 미리보기',
      '자동화된 지급 내역 검증',
      '직원별 발송 이력 추적'
    ]
  }
];

export const SessionPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const tab = useMemo(() => {
    return TAB_CONFIG.find((item) => item.id === activeTab) ?? TAB_CONFIG[0];
  }, [activeTab]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await logout();
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="card session-card">
      <div className="session-header">
        <div className="session-user">
          <p className="session-title">
            <strong>{user.name}</strong>님 환영합니다!
          </p>
          <p className="session-meta">
            역할: {user.role} · 이메일: {user.email}
          </p>
        </div>
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          disabled={submitting}
        >
          {submitting ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      <nav className="tab-nav" aria-label="근태관리 주요 기능">
        {TAB_CONFIG.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tab-button${tab.id === item.id ? ' active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="tab-panel" aria-live="polite">
        <h2>{tab.label}</h2>
        <p className="tab-description">{tab.description}</p>
        <ul className="tab-list">
          {tab.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <p className="tab-hint">* 해당 기능은 곧 구현될 예정입니다.</p>
      </section>
    </div>
  );
};
