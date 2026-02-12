import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple admin check
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      alert('Invalid Credentials!');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-card">
        <h2>Admin Login</h2>
        
        <div className="input-group">
          <input 
            className="form-input" 
            placeholder="Username" 
            autoComplete="off"
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required 
          />
        </div>

        <div className="input-group">
          <input 
            className="form-input" 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required 
          />
        </div>

        <button type="submit" className="login-button">
          Login to Dashboard
        </button>
      </form>
    </div>
  );
};

export default Login;