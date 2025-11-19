export const ATTENDANCE_STATUS_OPTIONS = [
  { value: 'normal', label: '정상근무' },
  { value: 'late', label: '지각' },
  { value: 'earlyLeave', label: '조퇴' },
  { value: 'absence', label: '결근' },
  { value: 'remote', label: '재택/외근' },
  { value: 'holiday', label: '휴무/연차' }
];

export const getAttendanceStatusLabel = (value) => {
  return ATTENDANCE_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
};
