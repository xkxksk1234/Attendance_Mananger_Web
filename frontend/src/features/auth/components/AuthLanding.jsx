import { useState } from 'react';
import { LoginPanel } from './LoginPanel.jsx';
import { SignupPanel } from './SignupPanel.jsx';

const AUTH_MODES = ['login', 'signup'];

export const AuthLanding = () => {
  const [mode, setMode] = useState('login');

  const handleSwitch = (nextMode) => {
    if (AUTH_MODES.includes(nextMode)) {
      setMode(nextMode);
    }
  };

  return (
    <div className="auth-landing">
      <div className="auth-toggle" role="tablist" aria-label="인증 방법 전환">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => handleSwitch('login')}
          aria-pressed={mode === 'login'}
        >
          로그인
        </button>
        <button
          type="button"
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => handleSwitch('signup')}
          aria-pressed={mode === 'signup'}
        >
          회원가입
        </button>
      </div>

      {mode === 'login' ? (
        <LoginPanel onSwitch={handleSwitch} />
      ) : (
        <SignupPanel onSwitch={handleSwitch} />
      )}
    </div>
  );
};
