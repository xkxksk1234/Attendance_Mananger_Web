import './App.css';
import { AuthProvider } from '../features/auth/context/AuthProvider.jsx';
import { AuthGate } from '../features/auth/components/AuthGate.jsx';
import { CredentialHint } from '../features/auth/components/CredentialHint.jsx';
import { useAuth } from '../features/auth/hooks/useAuth.js';

const AppContent = () => {
  const { user } = useAuth();
  const containerClassName = `app-container${user ? ' app-container--session' : ''}`;

  return (
    <div className={containerClassName}>
      <h1 className="app-title">근태관리 로그인</h1>
      <AuthGate />
      <CredentialHint />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
