import { useWorkspace } from '../hooks/useWorkspace.js';

export const PayrollTab = ({ tab }) => {
  const { hasWorkspaces, selectedWorkspace } = useWorkspace();

  return (
    <section className="tab-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasWorkspaces ? (
        <p className="workspace-empty">워크스페이스를 먼저 등록하세요.</p>
      ) : (
        <>
          <p className="tab-context">
            선택된 워크스페이스: <strong>{selectedWorkspace?.name ?? '선택되지 않음'}</strong>
          </p>
          <ul className="tab-list">
            {tab.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </>
      )}

      <p className="tab-hint">* 해당 기능은 곧 구현될 예정입니다.</p>
    </section>
  );
};
