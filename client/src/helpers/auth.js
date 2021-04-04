export function isAuth() {
    return localStorage.getItem('isAuth') && localStorage.getItem('user');
}

export function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuth');
    return true;
}
