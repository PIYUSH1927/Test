import React, { useState } from "react";

const SignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="/login" method="POST" className="sign-in-form">
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
              />
              <i
                className={`bi ${passwordVisible ? "bi-eye" : "bi-eye-slash"}`}
                id="togglePassword"
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New user?</h3>
            <a href="./register">
              <button className="btn transparent" id="sign-up-btn">
                Sign Up
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
