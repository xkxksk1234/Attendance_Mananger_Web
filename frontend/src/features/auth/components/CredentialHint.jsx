export const CredentialHint = () => (
  <section className="hint">
    <h2>테스트 계정 & 코드</h2>
    <ul>
      <li>
        <strong>관리자 아이디:</strong> <code>admin</code>
      </li>
      <li>
        <strong>비밀번호:</strong> <code>admin123</code>
      </li>
      <li>
        <strong>가입 코드 예시:</strong> <code>OPS-ACCESS-2025</code>
      </li>
    </ul>
    <p className="hint-note">
      가입 가능한 코드는 <code>backend/src/features/auth/signup-codes.js</code> 파일에서 관리할 수 있습니다.
    </p>
  </section>
);
