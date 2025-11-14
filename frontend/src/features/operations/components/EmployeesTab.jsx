import { EmployeeManagement } from '../employees/components/EmployeeManagement.jsx';
import { useWorkspace } from '../hooks/useWorkspace.js';

export const EmployeesTab = ({ tab }) => {
  const { hasWorkspaces } = useWorkspace();

  return (
    <section className="tab-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasWorkspaces ? (
        <p className="workspace-empty">워크스페이스를 먼저 등록하세요.</p>
      ) : (
        <>
          <EmployeeManagement />
          <p className="tab-hint">* {tab.label} 기능은 지속적으로 확장될 예정입니다.</p>
        </>
      )}
    </section>
  );
};
