import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/axios"
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logindata, setLoginData] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    console.log(logindata);
    const response = await Axios.post("/loginuser", logindata);
    console.log(response.data);
    if (response.data.success) {
      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
        "userdata",
        JSON.stringify(response.data.user)
      );
      alert("Login successful");
      navigate("/Home");
    } else {
      alert("login failed.tryagain");
    }
  }

  return (
    <div className="login-container">
      {/* Background floating elements */}
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>
      
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Email Address"
              value={logindata.email}
              onChange={(e) => setLoginData({...logindata, email: e.target.value})}
              required
            />
            <span className="form-input-icon">✉️</span>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={logindata.password}
              onChange={(e) => setLoginData({...logindata, password: e.target.value})}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button 
            className="login-button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <div className="register-link">
            Don't have an account?{" "}
            <a href="/register" onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}>
              Register here
            </a>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default Login;