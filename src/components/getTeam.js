import React, { useEffect } from 'react';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

export const TEAM_KEY = "@team-ID";

//Controle de Rotas por Team 
class RoutesTeam extends React.Component {

    getTeam() {

        const currentUser = localStorage.getItem('USER_KEY');
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let url = baseURL + '/routes/team/' + currentUser;

        axios.get(url, { headers: { 'Authorization': token } }).then(res => {
            if (res.data.success == true) {

                localStorage.setItem('TEAM_KEY', res.data.usersTeam);

            } else {
                localStorage.setItem('TEAM_KEY', null);
            }
        }).catch(error => {
            alert("Error server " + error)
        })
    }
}

export default new RoutesTeam();