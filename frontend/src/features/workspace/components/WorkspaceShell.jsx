import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';

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

export const WorkspaceShell = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    industry: '',
    underFive: false
  });
  const [formErrors, setFormErrors] = useState({});
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (workspaces.length === 0) {
      setSelectedWorkspaceId(null);
      return;
    }

    if (!workspaces.some((workspace) => workspace.id === selectedWorkspaceId)) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [selectedWorkspaceId, workspaces]);

  const tab = useMemo(() => {
    return TAB_CONFIG.find((item) => item.id === activeTab) ?? TAB_CONFIG[0];
  }, [activeTab]);

  const selectedWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? null;
  }, [selectedWorkspaceId, workspaces]);

  if (!user) {
    return null;
  }

  const generateWorkspaceId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `ws-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  };

  const handleWorkspaceFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setWorkspaceForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleWorkspaceSubmit = (event) => {
    event.preventDefault();

    const trimmedName = workspaceForm.name.trim();
    const trimmedIndustry = workspaceForm.industry.trim();
    const nextErrors = {};

    if (!trimmedName) {
      nextErrors.name = '매장명을 입력해주세요.';
    }

    if (!trimmedIndustry) {
      nextErrors.industry = '업종을 입력해주세요.';
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const workspace = {
      id: generateWorkspaceId(),
      name: trimmedName,
      industry: trimmedIndustry,
      underFive: workspaceForm.underFive
    };

    const nextWorkspaces = [...workspaces, workspace];
    setWorkspaces(nextWorkspaces);
    setSelectedWorkspaceId(workspace.id);
    setWorkspaceForm({ name: '', industry: '', underFive: false });
    setFormErrors({});
    setIsCreatingWorkspace(false);
  };

  const handleCancelWorkspaceCreation = () => {
    setIsCreatingWorkspace(false);
    setWorkspaceForm({ name: '', industry: '', underFive: false });
    setFormErrors({});
  };

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

  const renderDashboard = () => {
    return (
      <section className="tab-panel" aria-live="polite">
        <div className="workspace-dashboard">
          <div className="workspace-actions">
            <div className="workspace-intro">
              <h2>{tab.label}</h2>
              <p className="tab-description">{tab.description}</p>
            </div>

            {workspaces.length > 0 && (
              <div className="workspace-selector">
                <label htmlFor="workspaceSelect">워크스페이스 선택</label>
                <select
                  id="workspaceSelect"
                  name="workspaceSelect"
                  className="workspace-select"
                  value={selectedWorkspaceId ?? ''}
                  onChange={(event) => setSelectedWorkspaceId(event.target.value)}
                >
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              className="workspace-create-button"
              onClick={() => setIsCreatingWorkspace(true)}
            >
              워크스페이스 만들기
            </button>
          </div>

          {isCreatingWorkspace && (
            <form className="workspace-form" onSubmit={handleWorkspaceSubmit}>
              <div className="workspace-form-grid">
                <label className="workspace-field">
                  <span>매장명</span>
                  <input
                    type="text"
                    name="name"
                    value={workspaceForm.name}
                    onChange={handleWorkspaceFormChange}
                    placeholder="예: 서울 본점"
                  />
                  {formErrors.name && <p className="workspace-error">{formErrors.name}</p>}
                </label>

                <label className="workspace-field">
                  <span>업종</span>
                  <input
                    type="text"
                    name="industry"
                    value={workspaceForm.industry}
                    onChange={handleWorkspaceFormChange}
                    placeholder="예: F&B, 리테일 등"
                  />
                  {formErrors.industry && (
                    <p className="workspace-error">{formErrors.industry}</p>
                  )}
                </label>

                <label className="workspace-checkbox">
                  <input
                    type="checkbox"
                    name="underFive"
                    checked={workspaceForm.underFive}
                    onChange={handleWorkspaceFormChange}
                  />
                  <span>상시근로자 5인 미만 사업장</span>
                </label>
              </div>

              <div className="workspace-form-actions">
                <button type="submit">워크스페이스 등록</button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleCancelWorkspaceCreation}
                >
                  취소
                </button>
              </div>
            </form>
          )}

          {workspaces.length === 0 ? (
            <p className="workspace-empty">워크스페이스를 먼저 등록하세요.</p>
          ) : (
            <div className="workspace-overview">
              <div className="workspace-overview-header">
                <h3>{selectedWorkspace?.name} 워크스페이스</h3>
                <p>
                  업종: {selectedWorkspace?.industry} · 상시근로자 5인 미만{' '}
                  {selectedWorkspace?.underFive ? '예' : '아니오'}
                </p>
              </div>

              <ul className="tab-list">
                {tab.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <p className="tab-hint">* 해당 기능은 곧 구현될 예정입니다.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderDefaultTab = () => {
    return (
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
    );
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

      {tab.id === 'dashboard' ? renderDashboard() : renderDefaultTab()}
    </div>
  );
};
