import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chat,
  Comment,
  CreatePost,
  Explore,
  HomePage,
  Message,
  Notification,
  Profile,
  Setting,
  Timeline,
} from './pages';
import {
  About,
  Forget,
  Login,
  PrivacyPolicy,
  Signup,
  Terms,
} from './components';
import { signup, login } from '../src/api/auth';
import { currentLocation, generateRandomPassword } from '../src/utils';
import Admin from "./pages/admin/index"
import Register from './pages/admin/login/Register';
import AdminHome from './pages/admin/home/Home';
import AppUsers from './pages/admin/AppUsers';
import Contests from './pages/admin/Contests';
import { generateToken, messaging} from './firebase';
import { onMessage } from "firebase/messaging";
import './i18n.js';
import { useTranslation } from 'react-i18next';


export default function App() {
  const { t, i18n } = useTranslation();
const { lang } = useParams();

  useEffect(() => {
//  const messaging = firebase.messageing();
//  messaging.requestPermission().then((token)=>{

//  })
generateToken();
onMessage(messaging, (payload)=>{
  console.log(payload);
  toast(payload.notification.body)
})
if (lang) {
  i18n.changeLanguage(lang);
}
}, [lang, i18n]);
  

  // toast.configure();
  const [islogin, setIsLogin] = useState(
    localStorage.getItem('@twinphy-token') || null
  );
  const createUser = async () => {
    const userDataCookie = document.cookie
      .split(';')
      .find((cookie) => cookie.trim().startsWith('userData='));

    if (userDataCookie) {
      const cookieName = userDataCookie.split('=')[0].trim();
      const decodedData = decodeURIComponent(userDataCookie.split('=')[1]);
      const userData =decodedData;
      currentLocation()
        .then((res) => {
          const randomPassword = generateRandomPassword();
          signup({
            firstName: userData?.name?.givenName,
            lastName: userData?.name?.familyName,
            userName: userData?.emails[0].value,
            email: userData?.emails[0].value,
            password: randomPassword,
            avatar: userData?.photos[0].value,
            gender: 'male',
            dateOfBirth: '1990-01-01',
            city: res.city,
            country: res.country,
          })
            .then((res) => {
              if (res.response) {
                if (
                  res.response?.data?.message ===
                  'User with same email already exist'
                ) {
                  login({
                    email: userData?.emails[0].value,
                    login_type: 'google',
                  })
                    .then((res) => {
                      localStorage.setItem('@twinphy-token', res?.data?.token);
                      localStorage.setItem(
                        '@twinphy-user',
                        JSON.stringify(res?.data?.user)
                      );
                    })
                    .catch((err) => console.log(err));
                }
              }
              localStorage.setItem('@twinphy-token', res?.data?.token);
              localStorage.setItem(
                '@twinphy-user',
                JSON.stringify(res?.data?.user)
              );
            })
            .catch((err) => {
              console.log(err, 'err');
            });
        })
        .catch((err) => console.log(err));
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };

  useEffect(() => {
    createUser();
  }, []);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     localStorage.getItem('@twinphy-token') === null ||
  //     localStorage.getItem('@twinphy-token') === 'undefined'
  //   ) {
  //     setIsLogin(false);
  //     // navigate('/login');
  //   } else {
  //     setIsLogin(true);
  //   }
  //   // eslint-disable-next-line
  // }, []);

  return (
    <div>
      {/* Display toast notifications */}
      <ToastContainer />
         {/* <Toaster position='top-right'/> */}

      {/* {islogin ? ( */}
        <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/timeline' element={<Timeline />} />
      <Route path='/explore' element={<Explore />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/message/:id' element={<Message />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/notifications' element={<Notification />} />
      <Route path='/comment/:id' element={<Comment />} />
      <Route path='/create-post/:id' element={<CreatePost />} />
      <Route path='/settings' element={<Setting />} />
      <Route path='/about' element={<About />} />
      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      <Route path='/terms' element={<Terms />} />
    {/* </Routes>
      ) : (
        <Routes> */}
      <Route path='/admin' element={<Admin />} />
      <Route path='/admin/register' element={<Register />} />
      <Route path='/admin/home' element={<AdminHome />} />
      <Route path='/admin/appusers' element={<AppUsers />} />

      <Route path='/admin/contests' element={<Contests />} />


      {/* <Route path='/' element={<Login setIsLogin={setIsLogin} />} /> */}
      <Route path='/login' element={<Login setIsLogin={setIsLogin} />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forget' element={<Forget />} />
      </Routes>
    </div>
  );
}