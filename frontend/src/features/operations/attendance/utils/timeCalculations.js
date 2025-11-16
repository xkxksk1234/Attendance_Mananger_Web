export const calculateWorkMinutes = (record) => {
  if (typeof record?.totalMinutes === 'number') {
    return record.totalMinutes;
  }

  if (!record?.checkIn || !record?.checkOut) {
    return 0;
  }

  const start = new Date(`${record.date}T${record.checkIn}`);
  const end = new Date(`${record.date}T${record.checkOut}`);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  const diff = Math.max(0, end.getTime() - start.getTime());
  const breakMinutes = Number(record.breakMinutes ?? 0);

  return Math.max(0, Math.floor(diff / (1000 * 60)) - breakMinutes);
};

export const formatWorkDuration = (minutes) => {
  if (!minutes) {
    return '0시간 0분';
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return `${hours}시간 ${remainder}분`;
};

export const formatDateLabel = (dateString) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
};
