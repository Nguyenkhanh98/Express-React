import axios from 'axios';

import config from '../config';
import makeRequest from '../helpers/api';

const USER_ENDPOINT = '/user';

const login = (userName, password) => {
    return makeRequest({
        url: `${USER_ENDPOINT}`,
        method: 'POST',
        data: {
            userName, password
        }
    })
}

const getProfile = (userName) => {
    return makeRequest({
        url: `${USER_ENDPOINT}/${userName}`,
        method: 'GET',
    });
}

const getListUser = (params) => {
    return makeRequest({
        url: `${USER_ENDPOINT}`,
        method: 'GET',
        params
    });
}

export { login, getProfile, getListUser }