import { useStore } from '../hooks/useStore.js';

export const PayrollTab = ({ tab }) => {
  const { hasStores, selectedStore } = useStore();

  return (
    <section className="tab-panel" aria-live="polite">
      <h2>{tab.label}</h2>
      <p className="tab-description">{tab.description}</p>

      {!hasStores ? (
        <p className="store-empty">매장을 먼저 등록하세요.</p>
      ) : (
        <>
          <p className="tab-context">
            선택된 매장: <strong>{selectedStore?.name ?? '선택되지 않음'}</strong>
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
