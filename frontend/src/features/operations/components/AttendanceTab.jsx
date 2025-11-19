import { useStore } from '../hooks/useStore.js';
import { AttendanceManagement } from '../attendance/components/AttendanceManagement.jsx';

export const AttendanceTab = ({ tab }) => {
  const { hasStores, selectedStore } = useStore();

  return (
    <section className="tab-panel attendance-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasStores ? (
        <p className="store-empty">매장을 먼저 등록하세요.</p>
      ) : (
        <div className="attendance-content">
          <p className="tab-context">
            선택된 매장: <strong>{selectedStore?.name ?? '선택되지 않음'}</strong>
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
