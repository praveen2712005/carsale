import { useState } from "react";
import Axios from "../../axios/axios"
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Import the CSS file

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [userregister, setUserRegister] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post("/registeruser", userregister);

      if (response.data.success) {
        navigate("/Home");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      alert("Error occurred during registration");
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <div className="register-container">
      {/* Background floating elements */}
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>
      
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p className="register-subtitle">Join our community today</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="Name"
              value={userregister.name}
              onChange={(e) =>
                setUserRegister({ ...userregister, name: e.target.value })
              }
              required
            />
            <span className="form-input-icon">👤</span>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              value={userregister.email}
              onChange={(e) =>
                setUserRegister({ ...userregister, email: e.target.value })
              }
              required
            />
            <span className="form-input-icon">✉️</span>
          </div>
          
          <div className="form-group">
            <input
              className="form-input"
              type="number"
              placeholder="Phone Number"
              value={userregister.number}
              onChange={(e) =>
                setUserRegister({ ...userregister, number: e.target.value })
              }
              required
            />
            <span className="form-input-icon">📱</span>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={userregister.password}
              onChange={(e) =>
                setUserRegister({ ...userregister, password: e.target.value })
              }
              required
            />
            <span className="form-input-icon">🔒</span>
          </div>

          <button 
            className="register-button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Registering...
              </span>
            ) : "Sign Up"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <button 
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;