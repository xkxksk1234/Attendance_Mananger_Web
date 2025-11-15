import { getAttendanceStatusLabel } from '../constants/statusOptions.js';
import { calculateWorkMinutes, formatDateLabel, formatWorkDuration } from '../utils/timeCalculations.js';

export const AttendanceRecordList = ({ records, onEdit, onDelete }) => {
  if (!records?.length) {
    return <p className="attendance-empty">아직 등록된 근태 기록이 없습니다. 새로운 기록을 추가해 주세요.</p>;
  }

  return (
    <div className="attendance-records" aria-live="polite">
      {records.map((record) => {
        const totalMinutes = calculateWorkMinutes(record);
        const statusLabel = getAttendanceStatusLabel(record.status);

        return (
          <article key={record.id} className="attendance-record">
            <div className="attendance-record-main">
              <div>
                <p className="attendance-record-date">{formatDateLabel(record.date)}</p>
                <p className="attendance-record-status">{statusLabel}</p>
              </div>
              <div className="attendance-record-actions">
                <button type="button" className="button-tertiary" onClick={() => onEdit(record)}>
                  수정
                </button>
                <button type="button" className="button-danger" onClick={() => onDelete(record)}>
                  삭제
                </button>
              </div>
            </div>

            <dl className="attendance-record-grid">
              <div className="attendance-record-field">
                <dt>출근 시간</dt>
                <dd>{record.checkIn ? `${record.checkIn}` : '-'}</dd>
              </div>
              <div className="attendance-record-field">
                <dt>퇴근 시간</dt>
                <dd>{record.checkOut ? `${record.checkOut}` : '-'}</dd>
              </div>
              <div className="attendance-record-field">
                <dt>휴게 시간</dt>
                <dd>{record.breakMinutes ? `${record.breakMinutes}분` : '0분'}</dd>
              </div>
              <div className="attendance-record-field">
                <dt>총 근무 시간</dt>
                <dd>{formatWorkDuration(totalMinutes)}</dd>
              </div>
            </dl>

            {record.memo ? <p className="attendance-record-memo">{record.memo}</p> : null}
          </article>
        );
      })}
    </div>
  );
};
