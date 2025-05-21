import React from "react";
import "./LoginWithGoogle.css";

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google/login";
  };

  return (
    <div className="google-login-container">
      <h2>Login</h2>
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google logo"
        />
        Login with Google
      </button>
    </div>
  );
};

export default LoginWithGoogle;
