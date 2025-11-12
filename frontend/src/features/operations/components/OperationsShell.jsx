import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { TAB_CONFIG } from '../constants/tabConfig.js';
import { WorkspaceProvider } from '../context/WorkspaceProvider.jsx';
import { AttendanceTab } from './AttendanceTab.jsx';
import { DashboardTab } from './DashboardTab.jsx';
import { EmployeesTab } from './EmployeesTab.jsx';
import { PayrollTab } from './PayrollTab.jsx';

const TAB_COMPONENT_MAP = {
  dashboard: DashboardTab,
  employees: EmployeesTab,
  attendance: AttendanceTab,
  payroll: PayrollTab
};

export const OperationsShell = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].id);
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

  const ActiveTabComponent = TAB_COMPONENT_MAP[tab.id] ?? DashboardTab;

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
    <WorkspaceProvider>
      <div className="card session-card">
        <div className="session-header">
          <div className="session-user">
            <p className="session-title">
              <strong>{user.name}</strong>님 환영합니다!
            </p>
            <p className="session-meta">역할: {user.role} · 이메일: {user.email}</p>
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

        <ActiveTabComponent tab={tab} />
      </div>
    </WorkspaceProvider>
  );
};
