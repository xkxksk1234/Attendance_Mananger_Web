import { useState } from 'react';

export const AccountSecurityPanel = ({ user, onWithdraw }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ password: '', confirmAccountId: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const togglePanel = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setForm({ password: '', confirmAccountId: '' });
        setError('');
        setSubmitting(false);
      }
      return next;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.confirmAccountId.trim() !== user.accountId) {
      setError('아이디 확인 값이 일치하지 않습니다.');
      return;
    }

    if (!window.confirm('회원탈퇴를 진행하면 모든 데이터가 삭제되며 복구할 수 없습니다. 계속하시겠습니까?')) {
      return;
    }

    setSubmitting(true);

    try {
      await onWithdraw({
        password: form.password,
        confirmAccountId: form.confirmAccountId.trim()
      });
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message || '회원탈퇴 처리 중 오류가 발생했습니다.';
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <section className="account-security">
      <div className="account-security-header">
        <div>
          <h3>계정 보안 · 회원탈퇴</h3>
          <p>민감한 작업이므로 비밀번호와 아이디를 다시 확인해주세요.</p>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={togglePanel}
          disabled={submitting}
        >
          {isOpen ? '닫기' : '회원탈퇴 절차 열기'}
        </button>
      </div>

      {isOpen && (
        <form className="account-security-form" onSubmit={handleSubmit}>
          <label>
            <span>현재 비밀번호</span>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>아이디 확인</span>
            <input
              type="text"
              name="confirmAccountId"
              placeholder={user.accountId}
              value={form.confirmAccountId}
              onChange={handleChange}
              required
            />
            <small className="form-hint">{`회원탈퇴를 진행하려면 "${user.accountId}"를 입력하세요.`}</small>
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button-danger" disabled={submitting}>
            {submitting ? '탈퇴 처리 중...' : '회원탈퇴'}
          </button>
        </form>
      )}
    </section>
  );
};
