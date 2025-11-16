import { getAttendanceStatusLabel } from '../constants/statusOptions.js';
import { calculateWorkMinutes, formatDateLabel, formatWorkDuration } from '../utils/timeCalculations.js';

export const AttendanceRecordList = ({ records, onEdit, onDelete, onSelect, selectedRecordId }) => {
  if (!records?.length) {
    return <p className="attendance-empty">아직 등록된 근태 기록이 없습니다. 새로운 기록을 추가해 주세요.</p>;
  }

  return (
    <div className="attendance-table-wrapper" aria-live="polite">
      <table className="attendance-table">
        <thead>
          <tr>
            <th scope="col" className="attendance-col attendance-col-date">
              날짜
            </th>
            <th scope="col" className="attendance-col attendance-col-check-in">
              출근
            </th>
            <th scope="col" className="attendance-col attendance-col-check-out">
              퇴근
            </th>
            <th scope="col" className="attendance-col attendance-col-total">
              총 근무
            </th>
            <th scope="col" className="attendance-col attendance-col-break">
              휴게
            </th>
            <th scope="col" className="attendance-col attendance-col-status">
              근무 상태
            </th>
            <th scope="col" className="attendance-col attendance-col-memo">
              비고
            </th>
            <th scope="col" className="attendance-col attendance-col-actions">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const totalMinutes = calculateWorkMinutes(record);
            const statusLabel = getAttendanceStatusLabel(record.status);
            const memoPreview = record.memo?.trim() ? record.memo : '-';
            const breakLabel = record.breakMinutes ? `${record.breakMinutes}분` : '0분';
            const totalLabel = formatWorkDuration(totalMinutes);
            const isSelected = selectedRecordId === record.id;

            const handleRowClick = () => {
              if (typeof onSelect === 'function') {
                onSelect(record);
              }
            };

            const handleRowKeyDown = (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleRowClick();
              }
            };

            return (
              <tr
                key={record.id}
                className={isSelected ? 'attendance-row is-selected' : 'attendance-row'}
                onClick={handleRowClick}
                onKeyDown={handleRowKeyDown}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                title="근태 상세 정보를 보려면 클릭하세요."
              >
                <td className="attendance-col attendance-col-date">{formatDateLabel(record.date)}</td>
                <td className="attendance-col attendance-col-check-in">{record.checkIn || '-'}</td>
                <td className="attendance-col attendance-col-check-out">{record.checkOut || '-'}</td>
                <td className="attendance-col attendance-col-total">{totalLabel}</td>
                <td className="attendance-col attendance-col-break">{breakLabel}</td>
                <td className="attendance-col attendance-col-status attendance-status-cell">{statusLabel}</td>
                <td className="attendance-col attendance-col-memo attendance-memo-cell">{memoPreview}</td>
                <td className="attendance-col attendance-col-actions">
                  <div className="attendance-table-actions">
                    <button
                      type="button"
                      className="button-tertiary"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(record);
                      }}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="button-danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(record);
                      }}
                    >
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
