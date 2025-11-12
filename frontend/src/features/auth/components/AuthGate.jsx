import { LoginPanel } from './LoginPanel.jsx';
import { SessionPanel } from './SessionPanel.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const AuthGate = () => {
  const { status, user } = useAuth();

  if (status === 'checking') {
    return (
      <div className="card">
        <p className="status-message">세션을 확인하는 중입니다...</p>
      </div>
    );
  }

  if (user) {
    return <SessionPanel />;
  }

  return <LoginPanel />;
};
