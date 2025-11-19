import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const ACCOUNT_ID_REGEX = /^[a-zA-Z0-9]{4,32}$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*_\-+=?]{8,64}$/;
const PASSWORD_SPECIALS_LABEL = '! @ # $ % ^ & * _ - + = ?';

const initialFormState = {
  signupCode: '',
  accountId: '',
  name: '',
  password: '',
  confirmPassword: ''
};

const initialFieldErrors = {
  signupCode: '',
  accountId: '',
  name: '',
  password: '',
  confirmPassword: ''
};

export const SignupPanel = ({ onSwitch }) => {
  const { registerAccount } = useAuth();
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ ...initialFieldErrors });
  const [submitting, setSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const trimmedSignupCode = form.signupCode.trim();
    const trimmedAccountId = form.accountId.trim();
    const trimmedName = form.name.trim();
    const errors = { ...initialFieldErrors };

    if (!trimmedSignupCode) {
      errors.signupCode = '부여코드를 입력해주세요.';
    }

    if (!trimmedAccountId) {
      errors.accountId = '아이디를 입력해주세요.';
    } else if (!ACCOUNT_ID_REGEX.test(trimmedAccountId)) {
      errors.accountId = '아이디는 영문/숫자 조합 4~32자로 입력해주세요.';
    }

    if (!trimmedName) {
      errors.name = '이름을 입력해주세요.';
    } else if (trimmedName.length < 2) {
      errors.name = '이름을 두 글자 이상 입력해주세요.';
    }

    if (!form.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (!PASSWORD_REGEX.test(form.password)) {
      errors.password = `비밀번호는 8~64자의 영문, 숫자, (${PASSWORD_SPECIALS_LABEL})만 사용할 수 있습니다.`;
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = '비밀번호 확인이 일치하지 않습니다.';
    }

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({ ...initialFieldErrors });

    setSubmitting(true);

    try {
      await registerAccount({
        signupCode: trimmedSignupCode,
        accountId: trimmedAccountId,
        name: trimmedName,
        password: form.password
      });
    } catch (submitError) {
      if (!isMountedRef.current) {
        return;
      }

      const status = submitError?.response?.status;

      if (status === 403) {
        setFieldErrors((prev) => ({ ...prev, signupCode: '올바른 부여코드를 입력해주세요.' }));
        return;
      }

      const message =
        submitError?.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <form className="card auth-panel" onSubmit={handleSubmit} noValidate>
      <h2>회원가입</h2>
      <label htmlFor="signupCode">가입 코드</label>
      <input
        id="signupCode"
        name="signupCode"
        type="text"
        placeholder="OPS-ACCESS-2025"
        value={form.signupCode}
        onChange={handleChange}
        required
      />
      <p className="form-hint">발급된 코드로만 가입할 수 있습니다.</p>
      {fieldErrors.signupCode && <p className="error">{fieldErrors.signupCode}</p>}

      <label htmlFor="newAccountId">아이디</label>
      <input
        id="newAccountId"
        name="accountId"
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        placeholder="영문/숫자 4~32자"
        autoComplete="username"
        pattern="[A-Za-z0-9]{4,32}"
        title="아이디는 영문과 숫자로 4~32자까지 입력할 수 있습니다."
        value={form.accountId}
        onChange={handleChange}
        required
      />
      {fieldErrors.accountId && <p className="error">{fieldErrors.accountId}</p>}

      <label htmlFor="name">이름</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="이름"
        autoComplete="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      {fieldErrors.name && <p className="error">{fieldErrors.name}</p>}

      <label htmlFor="newPassword">비밀번호</label>
      <p className="form-hint form-hint--danger">
        사용 가능한 특수문자 : {PASSWORD_SPECIALS_LABEL}
      </p>
      <input
        id="newPassword"
        name="password"
        type="password"
        placeholder="최소 8자"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        required
      />
      {fieldErrors.password && <p className="error">{fieldErrors.password}</p>}

      <label htmlFor="confirmPassword">비밀번호 확인</label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="비밀번호 재입력"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
      {fieldErrors.confirmPassword && <p className="error">{fieldErrors.confirmPassword}</p>}

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? '가입 중...' : '회원가입'}
      </button>

      <p className="form-hint">
        이미 계정이 있다면{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => onSwitch?.('login')}
        >
          로그인으로 이동하세요.
        </button>
      </p>
    </form>
  );
};
