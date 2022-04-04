import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import Appointment from './Components/Appointment/Appointment';
import './css/App.scss';

const App = () => {

  const { store } = useContext(Context);
  useEffect(() => {
    
    if (localStorage.getItem('token')) {
      store.checkAuth();
      
    }
  }, []);

  if (store.isLoading) {
    return <div>Загрузка....</div>;
  }
  if (!store.isAuth) {
    if (!store.isReg) {
      return (
        <SignIn />
      )
    } else {
      return (
        <SignUp />
      )
    }
  }
  return (
    <Routes>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/appointment' element={<Appointment />} />
      <Route path="*" element={<SignUp />} />
    </Routes>
  );
}

export default observer(App);