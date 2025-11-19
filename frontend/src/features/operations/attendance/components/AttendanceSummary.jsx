import { getAttendanceStatusLabel } from '../constants/statusOptions.js';
import { calculateWorkMinutes, formatWorkDuration } from '../utils/timeCalculations.js';

export const AttendanceSummary = ({ records, employeeName }) => {
  const totalMinutes = records.reduce((sum, record) => sum + calculateWorkMinutes(record), 0);
  const lateCount = records.filter((record) => record.status === 'late').length;
  const absenceCount = records.filter((record) => record.status === 'absence').length;
  const favoriteStatus = (() => {
    if (!records.length) {
      return '-';
    }

    const counts = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    }, {});

    const [topStatus] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return getAttendanceStatusLabel(topStatus);
  })();

  return (
    <section className="attendance-summary" aria-live="polite">
      <div className="attendance-summary-intro">
        <h3>{employeeName}님의 근태 요약</h3>
        <p>최근 등록된 근태 기록을 기준으로 자동 계산됩니다.</p>
      </div>
      <div className="attendance-summary-grid">
        <article className="attendance-summary-card">
          <p className="attendance-summary-label">총 근무일</p>
          <p className="attendance-summary-value">{records.length}일</p>
        </article>
        <article className="attendance-summary-card">
          <p className="attendance-summary-label">총 근무 시간</p>
          <p className="attendance-summary-value">{formatWorkDuration(totalMinutes)}</p>
        </article>
        <article className="attendance-summary-card">
          <p className="attendance-summary-label">지각 / 결근</p>
          <p className="attendance-summary-value">
            {lateCount}회 / {absenceCount}회
          </p>
        </article>
        <article className="attendance-summary-card">
          <p className="attendance-summary-label">가장 많은 유형</p>
          <p className="attendance-summary-value">{favoriteStatus}</p>
        </article>
      </div>
    </section>
  );
};
