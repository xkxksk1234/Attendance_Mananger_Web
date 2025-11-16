import { EmployeeManagement } from '../employees/components/EmployeeManagement.jsx';
import { useStore } from '../hooks/useStore.js';

export const EmployeesTab = ({ tab }) => {
  const { hasStores } = useStore();

  return (
    <section className="tab-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasStores ? (
        <p className="store-empty">매장을 먼저 등록하세요.</p>
      ) : (
        <>
          <EmployeeManagement />
          <p className="tab-hint">* {tab.label} 기능은 지속적으로 확장될 예정입니다.</p>
        </>
      )}
    </section>
  );
};
