import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import AppUsers from '../AppUsers';
import Contests from '../Contests';

export default function AdminHome() {
    const [page, setPage] = useState("appusers");
    const btnselstyle = { color: "white", backgroundColor: "black" };
    const unbtnselstyle = { color: "black" };
    
  return (
    <div>
         <div className='Header'>
      <h1 className='HeadLogo'>Twinpy</h1>
      <div className='button'>
        <Link to="/admin/appusers">
          <h1 className='buttonbox' style={page === "appusers" ? btnselstyle : unbtnselstyle} onClick={() => { setPage("appusers") }}>Users</h1>
        </Link>
        <Link to="/admin/contests">
          <h1 className='buttonbox' style={page === "contests" ? btnselstyle : unbtnselstyle} onClick={() => { setPage("contests") }}>Contests</h1>
        </Link>
      </div>
    </div>
    <Routes>
      <Route path="/appusers" element={<AppUsers />} />
      <Route path="/contests" element={<Contests />} />
    </Routes>
    </div>
  )
}
