import { createBrowserHistory } from 'history';
import { baseURL } from '../services/api';

//import Axios
import axios from 'axios';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export const TOKEN_KEY = "@user-Token";
export const ROLE_KEY = "@user-Role";
export const USER_KEY = "@user-ID";

class Auth {

  constructor() {
    if (localStorage.getItem('TOKEN_KEY') !== null) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
  }

  login(token, access, user_id) {
    localStorage.setItem('USER_KEY', user_id);
    localStorage.setItem('TOKEN_KEY', token);
    localStorage.setItem('ROLE_KEY', access);
    this.authenticated = true;
  }

  logout() {
    const history = createBrowserHistory({ forceRefresh: true });
    let userId = localStorage.getItem('USER_KEY');
    const url = baseURL + "/users/logout/"

    const datapost = {
      user_id: userId,
      user_islogged: false,
    }

    // const token = 'Bearer '+ localStorage.getItem('TOKEN_KEY');

    axios.put( url, datapost )
      .then(res => {
        if (res.data.success === true) {
          localStorage.removeItem('USER_KEY');
          localStorage.removeItem('TOKEN_KEY');
          localStorage.removeItem('ROLE_KEY');
          localStorage.removeItem('TEAM_KEY');
          this.authenticated = false;
          history.push("/login");

        } else {
          Swal.fire(
            'Erro!',
            res.data.error,
            'error'
          )
        }
      }).catch(error => {
        Swal.fire(
          'Erro!',
          error,
          'error'
        )
      })

  }

  isAuthenticated() {
    return this.authenticated
  }


}

export default new Auth();
