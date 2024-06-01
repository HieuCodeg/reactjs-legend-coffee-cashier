import axios from 'axios';
import { LOGIN_API_URL } from './common';

class loginService {
    static login(acount) {
        return axios.post(LOGIN_API_URL, acount);
    }
}

export default loginService;
