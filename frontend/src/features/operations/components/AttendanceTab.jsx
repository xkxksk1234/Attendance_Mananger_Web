import { useWorkspace } from '../hooks/useWorkspace.js';
import { AttendanceManagement } from '../attendance/components/AttendanceManagement.jsx';

export const AttendanceTab = ({ tab }) => {
  const { hasWorkspaces, selectedWorkspace } = useWorkspace();

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

          <AttendanceManagement />
        </div>
      )}

      <p className="tab-hint">근태 등록 · 수정 · 삭제 내역은 백엔드 MySQL DB와 연동되어 영구 저장됩니다.</p>
    </section>
  );
};
