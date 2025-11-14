const pad = (value) => `${value}`.padStart(2, '0');

export const onlyDigits = (value = '') => value.replace(/\D/g, '');

export const formatResidentRegistrationNumber = (value = '') => {
  const digits = onlyDigits(value).slice(0, 13);

  if (digits.length <= 6) {
    return digits;
  }

  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
};

export const formatKoreanPhoneNumber = (value = '') => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.startsWith('02')) {
    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 5) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, digits.length - 4)}-${digits.slice(-4)}`;
  }

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  const middleLength = digits.length === 11 ? 4 : 3;
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + middleLength)}-${digits.slice(3 + middleLength)}`;
};

export const toDateInputValue = (date) => {
  const workingDate = date instanceof Date ? date : new Date(date);
  return `${workingDate.getFullYear()}-${pad(workingDate.getMonth() + 1)}-${pad(workingDate.getDate())}`;
};

export const addYearsToDateInput = (dateString, years) => {
  const baseDate = new Date(dateString);
  baseDate.setFullYear(baseDate.getFullYear() + years);
  return toDateInputValue(baseDate);
};
