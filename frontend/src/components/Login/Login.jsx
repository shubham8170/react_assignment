import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { login, googleAuth } from '../../api';
import { toJson } from '../../utils';
import config from "../../../src/api/config"

import { GoogleLogin } from '@react-oauth/google';// added
import jwt_decode from "jwt-decode";// added

export const Login = ({ setIsLogin }) => {
  const navigate = useNavigate();

  const [eye, setEye] = useState(false);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    login(toJson(formData))
      .then((res) => {
        console.log('response ', res);
        if (res.response) {
          setErrors(res.response?.data?.message);
          return;
        }
        localStorage.setItem('@twinphy-token', res?.data?.access_token);
        localStorage.setItem('@twinphy-user', JSON.stringify(res?.data?._id));
        // window.open('/', '_self');
        setLoading(false);
        setIsLogin(true);
        navigate("/")
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrors('');
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [errors]);

  const handleGoogleAuth = (req) => {
    try {
      googleAuth(req).then((res) => {
        localStorage.setItem('@twinphy-token', res?.data?.access_token);
        localStorage.setItem('@twinphy-user', JSON.stringify(res?.data?._id));
        navigate("/");
        window.location.reload();
      }).catch((err) => {
        setErrors(err?.message);
      })
    }
    catch (err) {
      setErrors(err?.message);

    }
  }

  return (
    <div className='content-body'>
      <div className='container vh-100'>
        <div className='welcome-area'>
          <div
            className='bg-image bg-image-overlay'
            style={{ backgroundImage: "url('assets/images/login/pic4.jpg')" }}
          ></div>
          <div className='join-area'>
            <div className='started'>
              <h1 className='title'>Sign in</h1>
              <p>Join a vibrant community where you can interact</p>
            </div>
           
            <div className='d-flex align-items-center justify-content-center'>
              {errors}
            </div>
            <div className='social-box'>
              <span>sign in with</span>
              <div className='d-flex justify-content-center'>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    handleGoogleAuth(jwt_decode(credentialResponse.credential))
                  }}
                  onError={(err) => {
                    console.log('Login Failed', err.message);
                  }}
                  useOneTap
                />

              </div>
            </div>
            {/* <div className='d-flex align-items-center justify-content-center'>
              <Link to='/signup' className='text-light text-center d-block'>
                Don’t have an account?
              </Link>
              <Link to='/signup' className='btn-link d-block ms-3 text-underline'>
                Signup here
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
