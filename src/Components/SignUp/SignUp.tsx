import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../../index';
import { useContext } from 'react';
import Header from '../../Parts/Header/Header';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Body from '../../Parts/Body/Body';

const SignUp: React.FC = () => {
  const loginValid = /^[0-9A-Za-z]{6,}$/;
  const passwordValid = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [errors, setErrors] = useState<(string[] | any)>([]);
  const [loginChecker, setLoginChecker] = useState(true);
  const [passwordChecker, setPasswordChecker] = useState(true);
  const [passwordEquality, setPasswordEquality] = useState(true);
  const [snackText, setSnackText] = useState('');
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const [snackOpen, setSnackOpen] = useState(false);
  const Alert:any = React.forwardRef(function Alert(props, ref:any) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = () => {
    setSnackOpen(false);
  };

  const checkForSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([])
    if (loginValid.test(login)) {
      setLoginChecker(true)
    } else {
      errors.push('noLogin')
      setLoginChecker(false)
    }
    if (passwordValid.test(password)) {
      setPasswordChecker(true)
    } else {
      errors.push('noPassword')
      setPasswordChecker(false)
    }
    if (!(password === passwordCheck) || passwordCheck === '') {
      setPasswordEquality(false)
      errors.push('notIdentical')
    } else {
      setPasswordEquality(true)
    }
    if (errors.length === 0) {
      
      await store.registration(login, password)
      if(store.isError === 'loginExist'){
        setSnackText('Пользователь с таким логином уже существует');
        setSnackOpen(true);
      }
      navigate('/appointment');
    };
  };

  return (
    <>
      <Header>
        <p>Зарегистрироваться в системе</p>
        <Snackbar
          open={snackOpen}
          onClose={handleClose}
        >
          <Alert severity="error">{snackText}</Alert>
        </Snackbar>
      </Header>
      <Body>
        <svg width="376" height="376" viewBox="0 0 376 376" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M188 83.8333V0.5H0.500031V375.5H375.5V83.8333H188ZM75.5 333.833H38V292.167H75.5V333.833ZM75.5 250.5H38V208.833H75.5V250.5ZM75.5 167.167H38V125.5H75.5V167.167ZM75.5 83.8333H38V42.1667H75.5V83.8333ZM150.5 333.833H113V292.167H150.5V333.833ZM150.5 250.5H113V208.833H150.5V250.5ZM150.5 167.167H113V125.5H150.5V167.167ZM150.5 83.8333H113V42.1667H150.5V83.8333ZM338 333.833H188V292.167H225.5V250.5H188V208.833H225.5V167.167H188V125.5H338V333.833ZM300.5 167.167H263V208.833H300.5V167.167ZM300.5 250.5H263V292.167H300.5V250.5Z" fill="black" fill-opacity="0.8" />
        </svg>
        <form onSubmit={checkForSignUp}>
          <h1>Регистрация</h1>
          <label htmlFor="">Login:</label>
          {!loginChecker ? <p>* Логин должен содержать не менее 6 символов</p> : ''}
          <input placeholder='Login' onChange={(e) => setLogin(e.target.value)} />
          <label htmlFor="">Password:</label>
          {!passwordChecker ? <p>* Пароль должен содержать не менее 6 символов и  содержать хотя 1 число</p> : ''}
          <input type={'password'} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
          <label htmlFor="">Repeat password:</label>
          {!passwordEquality ? <p>* Пароли должны совпадать!</p> : ''}
          <input type={'password'} placeholder='Password' onChange={(e) => setPasswordCheck(e.target.value)} />
          <button type="submit">Зарегистрироваться</button>
          <Link to='/signin'><a onClick={() => store.changeReg()}>Авторизоваться</a></Link>
        </form>
      </Body>
    </>
  )
}

export default SignUp;