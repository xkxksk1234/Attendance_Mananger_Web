import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const initialFormState = {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setSubmitting(true);

    try {
      await registerAccount({
        signupCode: form.signupCode.trim(),
        accountId: form.accountId.trim(),
        name: form.name.trim(),
        password: form.password
      });
    } catch (submitError) {
      if (!isMountedRef.current) {
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

      <label htmlFor="newAccountId">아이디</label>
      <input
        id="newAccountId"
        name="accountId"
        type="text"
        placeholder="영문/숫자 4~32자"
        autoComplete="username"
        value={form.accountId}
        onChange={handleChange}
        required
      />

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

      <label htmlFor="newPassword">비밀번호</label>
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
