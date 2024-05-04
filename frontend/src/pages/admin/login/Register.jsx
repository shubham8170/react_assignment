import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import {login,signup} from '../../../api/admin'

export default function Register() {
    const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    fullname: '',
    email: '',
    password: '',
    password1: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add your registration logic here.
    // For demonstration purposes, we'll just log the user details.
    console.log('User details submitted:', userDetails);
      const registerData = {
          name: userDetails.fullname,
          email: userDetails.email,
          password: userDetails.password
      }
      signup(registerData).then((data)=>{
        const adminData = data;
        localStorage.setItem('adminid', adminData._id);
        localStorage.setItem('admintoken', adminData.access_token);
        navigate("/admin/home")

      }).catch((err)=>{
        console.error(err.message);
      })
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <div className="name">
          <input
            type="text"
            placeholder="Full Name"
            name="fullname"
            value={userDetails.fullname}
            onChange={handleInputChange}
          />
        </div>

        <div className="email">
          <input
            type="text"
            placeholder="Enter your email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="password">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userDetails.password}
            onChange={handleInputChange}
          />
        </div>

        <div className="confirm-password">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password1"
            value={userDetails.password1}
            onChange={handleInputChange}
          />
        </div>

        <input type="submit" value="Register" />
      </form>

      <Link to="/admin">Login Here</Link>
    </div>
  );
}
