import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../hooks/useEmployees.js';
import {
  addYearsToDateInput,
  formatKoreanPhoneNumber,
  formatResidentRegistrationNumber,
  onlyDigits,
  toDateInputValue
} from '../utils/formatters.js';
import { EMPLOYEE_LIMITS, validateEmployeeForm } from '../utils/validators.js';

const createInitialState = (overrides = {}) => {
  const today = toDateInputValue(new Date());

  return {
    emp_id: '',
    name: '',
    rrn: '',
    role: '',
    phone: '',
    pay: '',
    bank_name: '',
    bank_account: '',
    address: '',
    contract_date: today,
    expiration_date: addYearsToDateInput(today, 1),
    memo: '',
    ...overrides
  };
};

const mapEmployeeToFormState = (employee) => {
  if (!employee) {
    return null;
  }

  const baseContractDate = employee.contract_date ?? toDateInputValue(new Date());

  return {
    emp_id: String(employee.emp_id ?? ''),
    name: employee.name ?? '',
    rrn: employee.rrn ?? '',
    role: employee.role ?? '',
    phone: employee.phone ?? '',
    pay: String(employee.pay ?? ''),
    bank_name: employee.bank_name ?? '',
    bank_account: employee.bank_account ? String(employee.bank_account) : '',
    address: employee.address ?? '',
    contract_date: baseContractDate,
    expiration_date: employee.expiration_date ?? addYearsToDateInput(baseContractDate, 1),
    memo: employee.memo ?? ''
  };
};

export const EmployeeForm = ({ availableRoles, onComplete, initialValues }) => {
  const { registerEmployee, updateEmployee } = useEmployees();
  const [formState, setFormState] = useState(() => createInitialState());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  const roleOptions = useMemo(() => availableRoles ?? [], [availableRoles]);
  const isEditMode = Boolean(initialValues);

  useEffect(() => {
    if (initialValues) {
      setFormState(createInitialState(mapEmployeeToFormState(initialValues)));
      setCurrentEmployeeId(initialValues.id);
    } else {
      setFormState(createInitialState());
      setCurrentEmployeeId(null);
    }
    setErrors({});
  }, [initialValues]);

  const resetForm = () => {
    setFormState(createInitialState());
    setErrors({});
    setCurrentEmployeeId(null);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'emp_id':
      case 'pay':
        setFormState((prev) => ({
          ...prev,
          [name]: onlyDigits(value)
        }));
        break;
      case 'bank_account':
        setFormState((prev) => ({
          ...prev,
          [name]: onlyDigits(value).slice(0, 20)
        }));
        break;
      case 'rrn':
        setFormState((prev) => ({
          ...prev,
          rrn: formatResidentRegistrationNumber(value)
        }));
        break;
      case 'phone':
        setFormState((prev) => ({
          ...prev,
          phone: formatKoreanPhoneNumber(value)
        }));
        break;
      case 'contract_date': {
        const nextDate = value;
        setFormState((prev) => ({
          ...prev,
          contract_date: nextDate,
          expiration_date: addYearsToDateInput(nextDate, 1)
        }));
        break;
      }
      default:
        setFormState((prev) => ({
          ...prev,
          [name]: value
        }));
    }
  };

  const handleExpirationChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      expiration_date: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationState = {
      ...formState,
      name: formState.name.trim(),
      bank_name: formState.bank_name.trim(),
      address: formState.address.trim(),
      memo: formState.memo.trim()
    };

    const nextErrors = validateEmployeeForm(validationState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        emp_id: Number(formState.emp_id),
        name: validationState.name,
        rrn: validationState.rrn || '',
        role: formState.role,
        phone: formState.phone,
        pay: Number(formState.pay),
        bank_name: validationState.bank_name || '',
        bank_account: formState.bank_account ? Number(formState.bank_account) : null,
        address: validationState.address || '',
        contract_date: formState.contract_date,
        expiration_date: formState.expiration_date,
        memo: validationState.memo
      };

      const result = isEditMode
        ? await updateEmployee(currentEmployeeId, payload)
        : await registerEmployee(payload);

      onComplete?.({
        mode: isEditMode ? 'edit' : 'create',
        employeeId: result?.id ?? currentEmployeeId ?? null
      });

      resetForm();
    } catch (error) {
      console.error('직원 정보를 저장하는 중 오류가 발생했습니다.', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="employee-form-title">
        <h3>{isEditMode ? '직원 정보 수정' : '직원 등록'}</h3>
      </div>
      <div className="employee-form-grid">
        <label className="employee-field">
          <span>사번 *</span>
          <input
            type="text"
            name="emp_id"
            inputMode="numeric"
            value={formState.emp_id}
            onChange={handleFieldChange}
            required
          />
          {errors.emp_id && <p className="field-error">{errors.emp_id}</p>}
        </label>

        <label className="employee-field">
          <span>이름 *</span>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleFieldChange}
            maxLength={EMPLOYEE_LIMITS.name}
            required
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </label>

        <label className="employee-field">
          <span>주민등록번호</span>
          <input
            type="text"
            name="rrn"
            value={formState.rrn}
            onChange={handleFieldChange}
            placeholder="000000-0000000"
            inputMode="numeric"
            maxLength={14}
          />
          {errors.rrn && <p className="field-error">{errors.rrn}</p>}
        </label>

        <label className="employee-field">
          <span>직급 *</span>
          <select name="role" value={formState.role} onChange={handleFieldChange} required>
            <option value="" disabled>
              직급을 선택하세요
            </option>
            {roleOptions.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          {errors.role && <p className="field-error">{errors.role}</p>}
        </label>

        <label className="employee-field">
          <span>전화번호 *</span>
          <input
            type="text"
            name="phone"
            value={formState.phone}
            onChange={handleFieldChange}
            placeholder="010-1234-5678"
            inputMode="tel"
            maxLength={13}
            required
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </label>

        <label className="employee-field">
          <span>시급 *</span>
          <input
            type="text"
            name="pay"
            inputMode="numeric"
            value={formState.pay}
            onChange={handleFieldChange}
            placeholder="예: 9860"
            required
          />
          {errors.pay && <p className="field-error">{errors.pay}</p>}
        </label>

        <label className="employee-field">
          <span>은행</span>
          <input
            type="text"
            name="bank_name"
            value={formState.bank_name}
            onChange={handleFieldChange}
            maxLength={EMPLOYEE_LIMITS.bankName}
          />
          {errors.bank_name && <p className="field-error">{errors.bank_name}</p>}
        </label>

        <label className="employee-field">
          <span>계좌번호</span>
          <input
            type="text"
            name="bank_account"
            inputMode="numeric"
            value={formState.bank_account}
            onChange={handleFieldChange}
            placeholder="숫자만 입력"
          />
          {errors.bank_account && <p className="field-error">{errors.bank_account}</p>}
        </label>

        <label className="employee-field">
          <span>주소</span>
          <input
            type="text"
            name="address"
            value={formState.address}
            onChange={handleFieldChange}
            maxLength={EMPLOYEE_LIMITS.address}
            placeholder="최대 50자"
          />
          {errors.address && <p className="field-error">{errors.address}</p>}
        </label>

        <label className="employee-field">
          <span>계약일 *</span>
          <input
            type="date"
            name="contract_date"
            value={formState.contract_date}
            onChange={handleFieldChange}
            required
          />
          {errors.contract_date && <p className="field-error">{errors.contract_date}</p>}
        </label>

        <label className="employee-field">
          <span>계약만기일 *</span>
          <input
            type="date"
            name="expiration_date"
            value={formState.expiration_date}
            onChange={handleExpirationChange}
            required
          />
          {errors.expiration_date && <p className="field-error">{errors.expiration_date}</p>}
        </label>
      </div>

      <label className="employee-field">
        <span>비고</span>
        <textarea
          name="memo"
          value={formState.memo}
          onChange={handleFieldChange}
          maxLength={EMPLOYEE_LIMITS.memo}
          rows={3}
          placeholder="최대 50자까지 입력 가능"
        />
        {errors.memo && <p className="field-error">{errors.memo}</p>}
      </label>

      <div className="employee-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : isEditMode ? '직원 수정' : '직원 저장'}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            resetForm();
            onComplete?.({ mode: 'cancel' });
          }}
        >
          닫기
        </button>
      </div>
    </form>
  );
};
