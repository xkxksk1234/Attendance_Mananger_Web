import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const ACCOUNT_ID_REGEX = /^[a-zA-Z0-9]{4,32}$/;

const initialFormState = {
  accountId: '',
  password: ''
};

export const LoginPanel = ({ onSwitch }) => {
  const { login } = useAuth();
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
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const trimmedAccountId = form.accountId.trim();

    if (!ACCOUNT_ID_REGEX.test(trimmedAccountId)) {
      setSubmitting(false);
      setError('아이디는 영문/숫자 조합 4~32자로 입력해주세요.');
      return;
    }

    try {
      await login({ accountId: trimmedAccountId, password: form.password });
      if (isMountedRef.current) {
        setForm({ ...initialFormState });
      }
    } catch (submitError) {
      if (!isMountedRef.current) {
        return;
      }

      const status = submitError?.response?.status;
      if (status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
        return;
      }

      const message =
        submitError?.response?.data?.message || '로그인 중 문제가 발생했습니다.';
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <form className="card auth-panel" onSubmit={handleSubmit} noValidate>
      <h2>계정 로그인</h2>
      <label htmlFor="accountId">아이디</label>
      <input
        id="accountId"
        name="accountId"
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        placeholder="아이디 (예: manager01)"
        autoComplete="username"
        pattern="[A-Za-z0-9]{4,32}"
        title="아이디는 영문과 숫자로 4~32자까지 입력할 수 있습니다."
        value={form.accountId}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="********"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? '로그인 중...' : '로그인'}
      </button>

      <p className="form-hint">
        아직 계정이 없다면{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => onSwitch?.('signup')}
        >
          회원가입을 진행하세요.
        </button>
      </p>
    </form>
  );
};
