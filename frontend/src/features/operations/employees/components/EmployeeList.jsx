import { truncateMemo } from '../utils/truncateMemo.js';

export const EmployeeList = ({ employees, onSelect, selectedEmployeeId }) => {
  const handleRowSelect = (employee) => {
    if (!onSelect) {
      return;
    }

    onSelect(employee);
  };

  const handleRowKeyDown = (event, employee) => {
    if (!onSelect) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(employee);
    }
  };

  if (!employees?.length) {
    return <p className="employee-empty">직원을 등록해 주세요!</p>;
  }

  return (
    <div className="employee-list">
      <div className="employee-table" role="table" aria-label="직원 목록">
        <div className="employee-row employee-row--header" role="row">
          <span role="columnheader">사번</span>
          <span role="columnheader">이름</span>
          <span role="columnheader">직급</span>
          <span role="columnheader">계약만기일</span>
          <span role="columnheader">비고</span>
          <span role="columnheader" className="employee-row-actions">
            작업
          </span>
        </div>
        {employees.map((employee) => {
          const isSelected = selectedEmployeeId === employee.id;

          return (
            <div
              className={`employee-row employee-row--clickable${
                isSelected ? ' employee-row--selected' : ''
              }`}
              role="row"
              key={employee.id}
              tabIndex={0}
              aria-selected={isSelected}
              data-hover-hint="직원 상세 정보를 보려면 눌러주세요."
              onClick={() => handleRowSelect(employee)}
              onKeyDown={(event) => handleRowKeyDown(event, employee)}
            >
              <span role="cell">{employee.emp_id}</span>
              <span role="cell">{employee.name}</span>
              <span role="cell">{employee.role}</span>
              <span role="cell">{employee.expiration_date}</span>
              <span role="cell">{truncateMemo(employee.memo)}</span>
              <span role="cell" className="employee-row-actions">
                <button
                  type="button"
                  className="button-tertiary"
                  onClick={(event) => event.stopPropagation()}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="button-danger"
                  onClick={(event) => event.stopPropagation()}
                >
                  삭제
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
