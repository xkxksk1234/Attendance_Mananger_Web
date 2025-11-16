import { getAttendanceStatusLabel } from '../constants/statusOptions.js';
import { calculateWorkMinutes, formatDateLabel, formatWorkDuration } from '../utils/timeCalculations.js';

export const AttendanceRecordList = ({ records, onEdit, onDelete }) => {
  if (!records?.length) {
    return <p className="attendance-empty">아직 등록된 근태 기록이 없습니다. 새로운 기록을 추가해 주세요.</p>;
  }

  return (
    <div className="attendance-table-wrapper" aria-live="polite">
      <table className="attendance-table">
        <thead>
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">근무 상태</th>
            <th scope="col">출근</th>
            <th scope="col">퇴근</th>
            <th scope="col">휴게</th>
            <th scope="col">총 근무</th>
            <th scope="col">비고</th>
            <th scope="col" className="attendance-table-actions-header">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const totalMinutes = calculateWorkMinutes(record);
            const statusLabel = getAttendanceStatusLabel(record.status);
            const memoPreview = record.memo?.trim() ? record.memo : '-';

            return (
              <tr key={record.id}>
                <td>{formatDateLabel(record.date)}</td>
                <td className="attendance-status-cell">{statusLabel}</td>
                <td>{record.checkIn || '-'}</td>
                <td>{record.checkOut || '-'}</td>
                <td>{record.breakMinutes ? `${record.breakMinutes}분` : '0분'}</td>
                <td>{formatWorkDuration(totalMinutes)}</td>
                <td className="attendance-memo-cell">{memoPreview}</td>
                <td>
                  <div className="attendance-table-actions">
                    <button type="button" className="button-tertiary" onClick={() => onEdit(record)}>
                      수정
                    </button>
                    <button type="button" className="button-danger" onClick={() => onDelete(record)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
