import http from "../http-common.js";

class UserAuthDataService {
    login(data) {
        return http.post('/login', data);
    }

    checkAuth() {
        return http.get('/checkauth');
    }

    logout() {
        return http.post('/logout');
    }
}

export default new UserAuthDataService();