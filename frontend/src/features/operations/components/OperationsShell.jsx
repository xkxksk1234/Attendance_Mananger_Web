import { useEffect, useMemo, useRef, useState } from 'react';
import { StoreSelect } from '../../../shared/components/StoreSelect.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { TAB_CONFIG } from '../constants/tabConfig.js';
import { StoreProvider } from '../context/StoreProvider.jsx';
import { useStore } from '../hooks/useStore.js';
import { EmployeesProvider } from '../employees/context/EmployeesProvider.jsx';
import { AttendanceTab } from './AttendanceTab.jsx';
import { DashboardTab } from './DashboardTab.jsx';
import { EmployeesTab } from './EmployeesTab.jsx';
import { PayrollTab } from './PayrollTab.jsx';
import { AttendanceProvider } from '../attendance/context/AttendanceProvider.jsx';

const TAB_COMPONENT_MAP = {
  dashboard: DashboardTab,
  employees: EmployeesTab,
  attendance: AttendanceTab,
  payroll: PayrollTab
};

const OperationsContent = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].id);
  const [submitting, setSubmitting] = useState(false);
  const isMountedRef = useRef(true);
  const {
    stores,
    selectedStoreId,
    selectedStore,
    selectStore,
    hasStores,
    isLoading: storeLoading
  } = useStore();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const tab = useMemo(() => {
    return TAB_CONFIG.find((item) => item.id === activeTab) ?? TAB_CONFIG[0];
  }, [activeTab]);

  const ActiveTabComponent = TAB_COMPONENT_MAP[tab.id] ?? DashboardTab;

  const handleLogout = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await onLogout();
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

      <div className="operations-toolbar" aria-live="polite">
        {storeLoading ? (
          <p className="store-loading">매장 정보를 불러오는 중입니다...</p>
        ) : (
          <>
            <StoreSelect
              stores={stores}
              selectedStoreId={selectedStoreId}
              onChange={selectStore}
              selectId="operationsStoreSelect"
            />

            {hasStores ? (
              <p className="store-active-hint">
                현재 선택된 매장: <strong>{selectedStore?.name ?? '선택되지 않음'}</strong>
              </p>
            ) : (
              <p className="store-empty-hint">
                매장을 생성하면 모든 탭에서 선택할 수 있습니다.
              </p>
            )}
          </>
        )}
      </div>

      <ActiveTabComponent tab={tab} />
    </div>
  );
};

export const OperationsShell = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <StoreProvider>
      <EmployeesProvider>
        <AttendanceProvider>
          <OperationsContent user={user} onLogout={logout} />
        </AttendanceProvider>
      </EmployeesProvider>
    </StoreProvider>
  );
};
