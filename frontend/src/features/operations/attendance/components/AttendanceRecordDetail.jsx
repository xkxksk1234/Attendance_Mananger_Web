import { getAttendanceStatusLabel } from '../constants/statusOptions.js';
import { calculateWorkMinutes, formatDateLabel, formatWorkDuration } from '../utils/timeCalculations.js';

export const AttendanceRecordDetail = ({ record, employeeName, employeeNumber, onClose, onEdit, onDelete }) => {
  if (!record) {
    return null;
  }

  const totalMinutes = calculateWorkMinutes(record);
  const totalLabel = formatWorkDuration(totalMinutes);
  const breakLabel = record.breakMinutes ? `${record.breakMinutes}분` : '0분';
  const statusLabel = getAttendanceStatusLabel(record.status);
  const memo = record.memo?.trim();

  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(record);
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(record);
    }
  };

  return (
    <section className="attendance-detail" aria-live="polite">
      <div className="attendance-detail-header">
        <div>
          <h3>{formatDateLabel(record.date)} 근태 상세</h3>
          <p>
            {employeeName} 직원의 모든 근태 정보를 확인할 수 있습니다.
          </p>
        </div>
        <button type="button" className="button-tertiary" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="attendance-detail-grid">
        <DetailField label="직원">
          {employeeName}
          {employeeNumber ? ` (${employeeNumber})` : ''}
        </DetailField>
        <DetailField label="근무 상태">{statusLabel}</DetailField>
        <DetailField label="출근 시간">{record.checkIn || '-'}</DetailField>
        <DetailField label="퇴근 시간">{record.checkOut || '-'}</DetailField>
        <DetailField label="총 근무 시간">{totalLabel}</DetailField>
        <DetailField label="휴게 시간">{breakLabel}</DetailField>
        <DetailField label="등록 일자">{formatDateLabel(record.date)}</DetailField>
      </div>

      <div className="attendance-detail-memo">
        <p className="attendance-detail-memo-label">비고</p>
        <p className="attendance-detail-memo-value">{memo || '등록된 비고가 없습니다.'}</p>
      </div>

      <div className="attendance-detail-actions">
        <button type="button" className="button-primary" onClick={handleEdit}>
          수정하기
        </button>
        <button type="button" className="button-danger" onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </section>
  );
};

const DetailField = ({ label, children }) => {
  return (
    <div className="attendance-detail-field">
      <p className="attendance-detail-label">{label}</p>
      <p className="attendance-detail-value">{children}</p>
    </div>
  );
};
