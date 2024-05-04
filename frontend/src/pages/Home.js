import { useEffect } from 'react';
import { Header, MenuBar, Sidebar, Home } from './../components';
import { Route, Routes, useNavigate } from 'react-router-dom';


export function HomePage() {
  const navigate = useNavigate();

    useEffect(() => {
    if (
      localStorage.getItem('@twinphy-token') === null ||
      localStorage.getItem('@twinphy-token') === 'undefined'
    ) {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Header title={'Home'} />
      <Sidebar />
      <Home />
      <MenuBar />
    </>
  );
}
