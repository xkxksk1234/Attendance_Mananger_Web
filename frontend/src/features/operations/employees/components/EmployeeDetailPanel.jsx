import { useMemo } from 'react';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '미입력';
  }

  return value;
};

const formatPay = (pay) => {
  if (typeof pay !== 'number' || Number.isNaN(pay)) {
    return '미입력';
  }

  return `${pay.toLocaleString('ko-KR')} 원 / 시`;
};

export const EmployeeDetailPanel = ({ employee, onClose }) => {
  const rows = useMemo(
    () => [
      { label: '사번', value: formatValue(employee.emp_id) },
      { label: '이름', value: formatValue(employee.name) },
      { label: '주민등록번호', value: formatValue(employee.rrn) },
      { label: '직급', value: formatValue(employee.role) },
      { label: '전화번호', value: formatValue(employee.phone) },
      { label: '시급', value: formatPay(employee.pay) },
      { label: '은행', value: formatValue(employee.bank_name) },
      { label: '계좌번호', value: formatValue(employee.bank_account) },
      { label: '주소', value: formatValue(employee.address) },
      { label: '계약일', value: formatValue(employee.contract_date) },
      { label: '계약만기일', value: formatValue(employee.expiration_date) },
      { label: '비고', value: formatValue(employee.memo) }
    ],
    [employee]
  );

  return (
    <section className="employee-detail" aria-live="polite">
      <div className="employee-detail-header">
        <div>
          <p>직원 상세 정보</p>
          <h4>{employee.name}</h4>
        </div>
        <button type="button" className="button-tertiary" onClick={onClose}>
          상세 보기 닫기
        </button>
      </div>

      <dl className="employee-detail-grid">
        {rows.map((row) => (
          <div key={row.label} className="employee-detail-field">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
