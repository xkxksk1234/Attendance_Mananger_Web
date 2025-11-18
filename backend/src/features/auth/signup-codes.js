export const SIGNUP_CODES = Object.freeze([
  'OPS-ACCESS-2025',
  'OPS-GLOBAL-BETA'
]);

const SIGNUP_CODE_SET = new Set(SIGNUP_CODES.map((code) => code.trim().toUpperCase()));

export const isValidSignupCode = (code) => {
  if (!code) {
    return false;
  }

  return SIGNUP_CODE_SET.has(code.trim().toUpperCase());
};
