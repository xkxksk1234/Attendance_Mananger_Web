import { useEffect, useMemo, useState } from 'react';
import { ATTENDANCE_STATUS_OPTIONS } from '../constants/statusOptions.js';

const getDefaultDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const DEFAULT_FORM_VALUES = {
  date: getDefaultDate(),
  checkIn: '09:00',
  checkOut: '18:00',
  breakMinutes: '60',
  status: 'normal',
  memo: ''
};

const sanitizeNumberInput = (value) => value.replace(/[^0-9]/g, '');

const buildInitialState = (initialValues) => {
  if (!initialValues) {
    return DEFAULT_FORM_VALUES;
  }

  return {
    date: initialValues.date ?? getDefaultDate(),
    checkIn: initialValues.checkIn ?? '09:00',
    checkOut: initialValues.checkOut ?? '18:00',
    breakMinutes: String(initialValues.breakMinutes ?? 0),
    status: initialValues.status ?? 'normal',
    memo: initialValues.memo ?? ''
  };
};

export const AttendanceRecordForm = ({ employee, onSubmit, onCancel, initialValues, isEditing = false }) => {
  const [values, setValues] = useState(() => buildInitialState(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(buildInitialState(initialValues));
    setErrors({});
  }, [initialValues, employee?.id]);

  const isAbsence = useMemo(() => values.status === 'absence' || values.status === 'holiday', [values.status]);

  const validate = () => {
    const nextErrors = {};

    if (!values.date) {
      nextErrors.date = '근무일을 선택해 주세요.';
    }

    if (!isAbsence) {
      if (!values.checkIn) {
        nextErrors.checkIn = '출근 시간을 입력해 주세요.';
      }

      if (!values.checkOut) {
        nextErrors.checkOut = '퇴근 시간을 입력해 주세요.';
      }
    }

    if (!values.status) {
      nextErrors.status = '근무 유형을 선택해 주세요.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === 'breakMinutes' ? sanitizeNumberInput(value) : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...values,
      breakMinutes: Number(values.breakMinutes || 0)
    });
  };

  const modeLabel = isEditing ? '근태 기록 수정' : '근태 기록 등록';

  return (
    <form className="attendance-form" onSubmit={handleSubmit} noValidate>
      <div className="attendance-form-header">
        <div>
          <p className="attendance-form-title">{modeLabel}</p>
          <p className="attendance-form-subtitle">{employee.name}님의 근태 정보를 입력해 주세요.</p>
        </div>
        <div className="attendance-form-actions">
          <button type="submit">{isEditing ? '저장하기' : '등록하기'}</button>
          <button type="button" className="button-secondary" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>

      <div className="attendance-form-grid">
        <label className="attendance-field">
          <span>근무일 *</span>
          <input type="date" name="date" value={values.date} onChange={handleChange} required />
          {errors.date && <p className="field-error">{errors.date}</p>}
        </label>

        <label className="attendance-field">
          <span>근무 유형 *</span>
          <select name="status" value={values.status} onChange={handleChange} required>
            <option value="">선택하세요</option>
            {ATTENDANCE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && <p className="field-error">{errors.status}</p>}
        </label>

        <label className="attendance-field">
          <span>출근 시간 {isAbsence ? '(선택)' : '*'} </span>
          <input type="time" name="checkIn" value={values.checkIn} onChange={handleChange} disabled={isAbsence} />
          {errors.checkIn && <p className="field-error">{errors.checkIn}</p>}
        </label>

        <label className="attendance-field">
          <span>퇴근 시간 {isAbsence ? '(선택)' : '*'} </span>
          <input type="time" name="checkOut" value={values.checkOut} onChange={handleChange} disabled={isAbsence} />
          {errors.checkOut && <p className="field-error">{errors.checkOut}</p>}
        </label>

        <label className="attendance-field">
          <span>휴게 시간(분)</span>
          <input
            type="text"
            inputMode="numeric"
            name="breakMinutes"
            value={values.breakMinutes}
            onChange={handleChange}
            placeholder="예: 60"
            disabled={isAbsence}
          />
        </label>

        <label className="attendance-field attendance-field--wide">
          <span>비고</span>
          <textarea
            name="memo"
            maxLength={200}
            rows={3}
            value={values.memo}
            onChange={handleChange}
            placeholder="특이 사항이나 관리자 메모를 작성해 주세요."
          />
        </label>
      </div>
    </form>
  );
};
