export const AttendanceTab = ({ tab }) => {
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
