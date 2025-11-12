import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const initialFormState = {
  email: '',
  password: ''
};

export const LoginPanel = () => {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({ email: form.email, password: form.password });
      if (isMountedRef.current) {
        setForm(initialFormState);
      }
    } catch (submitError) {
      if (!isMountedRef.current) {
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
    <form className="card" onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="admin@example.com"
        autoComplete="email"
        value={form.email}
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
    </form>
  );
};
