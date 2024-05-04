import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import {login,signup} from '../../../api/admin'


export default function Login() {
    const navigate = useNavigate();

  const [adminCredentials, setAdminCredentials] = useState({
    email: '', // Changed 'username' to 'email' to match your input field's name
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminCredentials({
      ...adminCredentials,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add your login logic here, such as sending a request to a server.
    // For demonstration purposes, we'll just log the credentials.
    console.log('Admin credentials submitted:', adminCredentials);
    const loginData = {
        email: adminCredentials.email,
        password: adminCredentials.password
    }
    login(loginData).then((data)=>{
        const adminData = data;
        localStorage.setItem('adminid', adminData._id);
        localStorage.setItem('admintoken', adminData.access_token);
        navigate("/admin/home")

      }).catch((err)=>{
        console.error(err.message);
      })
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="username">
          <input
            type="text"
            placeholder="Username..."
            value={adminCredentials.email}
            onChange={handleInputChange}
            name="email"
          />
        </div>

        <div className="password">
          <input
            type="password"
            placeholder="Password..."
            value={adminCredentials.password}
            onChange={handleInputChange}
            name="password"
          />
        </div>

        <input type="submit" value="Login" />
      </form>

      <Link to="/admin/register">Create an account</Link>
    </div>
  );
}
