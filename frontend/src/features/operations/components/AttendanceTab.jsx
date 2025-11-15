import { useWorkspace } from '../hooks/useWorkspace.js';
import { useEmployees } from '../employees/hooks/useEmployees.js';
import { AttendanceManagement } from '../attendance/components/AttendanceManagement.jsx';

export const AttendanceTab = ({ tab }) => {
  const { hasWorkspaces, selectedWorkspace } = useWorkspace();
  const { hasEmployees } = useEmployees();

  return (
    <section className="tab-panel attendance-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasWorkspaces ? (
        <p className="workspace-empty">워크스페이스를 먼저 등록하세요.</p>
      ) : (
        <div className="attendance-content">
          <p className="tab-context">
            선택된 워크스페이스: <strong>{selectedWorkspace?.name ?? '선택되지 않음'}</strong>
          </p>
          <ul className="tab-list">
            {tab.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          {hasEmployees ? (
            <AttendanceManagement />
          ) : (
            <p className="attendance-empty">직원 등록 후 근태 기록을 관리할 수 있습니다.</p>
          )}
        </div>
      )}

      <p className="tab-hint">근태 등록 · 수정 · 삭제는 로컬 상태로 관리되며, 나중에 백엔드 연동 시 확장될 예정입니다.</p>
    </section>
  );
};
