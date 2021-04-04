import axios from 'axios';
import config from '../config';
import { logout } from '../helpers/auth';
const instance = axios.create({
    baseURL: config.API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

instance.interceptors.request.use(function (config) {
    const userLocal = localStorage.getItem('user');
    if (!userLocal) {
        logout();
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default instance;