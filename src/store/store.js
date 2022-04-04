import { makeAutoObservable } from 'mobx';
import AuthServise from '../service/AuthService';
import axios from 'axios';
import { API_URL } from '../http';

export default class Store {


    user = {};
    isAuth = false;
    isLoading = false;
    isReg = false;
    isError = '';
    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }
    setError(val) {
        this.isError = val;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }
    setReg(bool) {
      this.isReg = bool
    }
    async changeReg() {
      this.setReg(!this.isReg);
    }

    async login(login, password) {
        try {
            const response = await AuthServise.login(login, password);
         
            // localStorage.setItem('user_id', response.data.user.id);
            localStorage.setItem('token', response.data.accessToken);
            // localStorage.setItem('login', login);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setError('')
        } catch (e) {
            console.log(e.response?.data?.message);

            this.setError('loginNoExist')
            
        }
    }

    async registration(login, password) {
        try {
            const response = await AuthServise.registration(login, password);
           
            // localStorage.setItem('user_id', response.data.user.id);
            localStorage.setItem('token', response.data.accessToken);
            // localStorage.setItem('login', login);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            this.setError('loginExist')
        }
    }

    async logout() {
        try {
            const response = await AuthServise.logout();
            
            localStorage.removeItem('token');
            // localStorage.removeItem('login');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
          console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoading(false);
        }
    }
}