import './App.css';
import { AuthProvider } from '../features/auth/context/AuthProvider.jsx';
import { AuthGate } from '../features/auth/components/AuthGate.jsx';
import { CredentialHint } from '../features/auth/components/CredentialHint.jsx';

const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <h1 className="app-title">근태관리 로그인</h1>
        <AuthGate />
        <CredentialHint />
      </div>
    </AuthProvider>
  );
};

export default App;
