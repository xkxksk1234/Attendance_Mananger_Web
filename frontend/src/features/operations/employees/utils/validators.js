import { onlyDigits } from './formatters.js';

export const EMPLOYEE_LIMITS = {
  name: 10,
  bankName: 10,
  address: 50,
  memo: 50
};

const RRN_PATTERN = /^\d{6}-\d{7}$/;
const PHONE_PATTERN = /^(?:\d{2,3}-)?\d{3,4}-\d{4}$/;

const isDigitsOnly = (value) => onlyDigits(value) === value;

export const validateEmployeeForm = (state) => {
  const errors = {};

  if (!state.emp_id) {
    errors.emp_id = '사번을 입력해주세요.';
  } else if (!isDigitsOnly(state.emp_id)) {
    errors.emp_id = '사번은 숫자만 입력할 수 있습니다.';
  }

  if (!state.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  } else if (state.name.trim().length > EMPLOYEE_LIMITS.name) {
    errors.name = `이름은 최대 ${EMPLOYEE_LIMITS.name}자까지 가능합니다.`;
  }

  if (state.rrn && !RRN_PATTERN.test(state.rrn)) {
    errors.rrn = '주민등록번호는 000000-0000000 형식으로 입력해주세요.';
  }

  if (!state.role) {
    errors.role = '직급을 선택해주세요.';
  }

  if (!state.phone) {
    errors.phone = '전화번호를 입력해주세요.';
  } else if (!PHONE_PATTERN.test(state.phone)) {
    errors.phone = '전화번호 형식을 확인해주세요.';
  }

  if (!state.pay) {
    errors.pay = '시급을 입력해주세요.';
  } else if (!isDigitsOnly(state.pay)) {
    errors.pay = '시급은 숫자만 입력할 수 있습니다.';
  }

  if (state.bank_name && state.bank_name.length > EMPLOYEE_LIMITS.bankName) {
    errors.bank_name = `은행명은 최대 ${EMPLOYEE_LIMITS.bankName}자까지 가능합니다.`;
  }

  if (state.bank_account && !isDigitsOnly(state.bank_account)) {
    errors.bank_account = '계좌번호는 숫자만 입력할 수 있습니다.';
  }

  if (state.address && state.address.length > EMPLOYEE_LIMITS.address) {
    errors.address = `주소는 최대 ${EMPLOYEE_LIMITS.address}자까지 가능합니다.`;
  }

  if (!state.contract_date) {
    errors.contract_date = '계약일을 선택해주세요.';
  }

  if (!state.expiration_date) {
    errors.expiration_date = '계약만기일을 선택해주세요.';
  } else if (state.contract_date && state.expiration_date < state.contract_date) {
    errors.expiration_date = '계약만기일은 계약일 이후여야 합니다.';
  }

  if (state.memo && state.memo.length > EMPLOYEE_LIMITS.memo) {
    errors.memo = `비고는 최대 ${EMPLOYEE_LIMITS.memo}자까지 가능합니다.`;
  }

  return errors;
};
