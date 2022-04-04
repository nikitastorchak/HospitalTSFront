import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Context } from '../../index';
import Header from '../../Parts/Header/Header';
import Body from '../../Parts/Body/Body';
import '../../css/SnackBar.scss';

const SignIn: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
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

  const checkToken = async () => {
    if (localStorage.getItem('token')) navigate('/appointment')
  }
  useEffect(() => {
    checkToken()
  }, []);

  const onClick = async (login:string, password:string) => {
    console.log('LOGIN', login)
    let re = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/; 
    if (re.test(password) && login.length > 5) {
      await store.login(login, password)
      if(await store.isError === 'loginNoExist'){
        setSnackText('Пользователя с таким логином не существует')
        setSnackOpen(true);
      };
    } else {
      setSnackText('Логин и пароль должны содержать минимум 6 символов')
      setSnackOpen(true);
    };
  };

  return (
    <>
      <Header>
        <p>Войти в систему</p>
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
        <form>
          <h1>Войти в систему</h1>
          <label htmlFor="">Login:</label>
          <input placeholder='Login' onChange={(e) => setLogin(e.target.value)} />
          <label htmlFor="">Password:</label>
          <input type={'password'} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
          <Link to='/appointment'><button type="submit" onClick={() => onClick(login, password)}>Войти</button></Link>
          <Link to='/signup'><a onClick={() => store.changeReg()}>Зарегистрироваться</a></Link>
        </form>
      </Body>
    </>
  )
}

export default observer(SignIn);
