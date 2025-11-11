import { useMemo, useState } from 'react';
import axios from 'axios';

const initialState = {
  email: '',
  password: ''
};

export default function App() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${apiBaseUrl}/api/login`, {
        email: form.email,
        password: form.password
      });

      setUser(response.data.user);
    } catch (submitError) {
      if (submitError.response?.data?.message) {
        setError(submitError.response.data.message);
      } else {
        setError('로그인 중 문제가 발생했습니다.');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setForm(initialState);
  };

  return (
    <div className="app-container">
      <h1>근태관리 로그인</h1>

      {user ? (
        <div className="card">
          <p>
            <strong>{user.name}</strong>님 환영합니다!
          </p>
          <p>역할: {user.role}</p>
          <p>이메일: {user.email}</p>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      )}

      <section className="hint">
        <h2>테스트 계정</h2>
        <ul>
          <li>
            <strong>관리자:</strong> admin@example.com / admin123
          </li>
          <li>
            <strong>직원:</strong> hong@example.com / password123
          </li>
        </ul>
      </section>
    </div>
  );
}
