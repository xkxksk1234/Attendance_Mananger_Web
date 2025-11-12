import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export const SessionPanel = () => {
  const { user, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await logout();
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="card">
      <p>
        <strong>{user.name}</strong>님 환영합니다!
      </p>
      <p>역할: {user.role}</p>
      <p>이메일: {user.email}</p>
      <button type="button" onClick={handleLogout} disabled={submitting}>
        {submitting ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  );
};
