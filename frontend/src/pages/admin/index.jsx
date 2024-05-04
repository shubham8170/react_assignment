import './Admin.css'
import { useEffect, useState } from 'react'

import Login from './login/login';
import AdminHome from './home/Home';

function Admin() {
 
  const [isAdminLogin, setadminLogin] = useState(false);
  useEffect(() => {
    const adminId = localStorage.getItem('adminid');
    const adminToken = localStorage.getItem('admintoken');
    if(adminId && adminToken){
      setadminLogin(true);
    }
  }, [])
  

  return (<>
  {!isAdminLogin ? (<Login/>):  (< AdminHome/>)}
   
  </>
  )
}

export default Admin