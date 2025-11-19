export const truncateMemo = (memo = '') => {
  if (!memo) {
    return '-';
  }

  if (memo.length <= 10) {
    return memo;
  }

  return `${memo.slice(0, 10)}....`;
};
