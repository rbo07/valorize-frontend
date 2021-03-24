import React from 'react';
import { Link } from "react-router-dom";
import Auth from "../services/auth";

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Controle de Rotas
import RoutesTeam from "./getTeam";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const currentUser = localStorage.getItem('USER_KEY');
const currentRoleUser = localStorage.getItem('ROLE_KEY');
const url = baseURL + '/dataHeader/' + currentUser

class Header extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      dataUser: {},
      data_name: "",
      data_email: "",
      data_role: "",
      data_team: "",
      data_team_leader: '',
      photo_profile: ""
    }
  }

  checkRole(obj) {
    if (obj == undefined) return "Usuário sem função cadastrada"
    else return obj.role_name
  }

  checkTeam(obj) {
    if (obj == undefined) return "Usuário sem equipe cadastrada"
    else return obj.team_name
  }

  componentDidMount() {

    RoutesTeam.getTeam()

    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

    // console.log(token)

    axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.dataHeader
          const dataRole = res.data.dataHeader.roles
          const dataTeam = res.data.dataHeader.teams[0]
          const dataTeamLeader = res.data.teamLeader
          const dataPhoto = res.data.dataHeader.user_photo

          this.setState({
            dataUser: data,
            data_name: data.user_name,
            data_email: data.user_email,
            data_role: this.checkRole(dataRole),
            data_team: this.checkTeam(dataTeam),
            data_team_leader: dataTeamLeader,
            photo_profile: dataPhoto
          })
        }
        else {
          Auth.logout()
        }
      })
      .catch(error => {
        Auth.logout()
      })



    /* //// STICKY HEADER /// */

    // When the user scrolls the page, execute myFunction
    window.onscroll = function () { myFunction() };

    // Get the header
    var header = document.getElementById("Header");
    var btn = document.getElementById("btn-menu-mobile");
    

    // Get the offset position of the navbar
    var sticky = header.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        btn.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
        btn.classList.remove("sticky");
      }
    }


  }

  getLogo() {
    if (currentRoleUser == 1) {
      return (
        <Link class="logo" to="/admin/dashboard" ></Link>
      )

    } else if (currentRoleUser == 2) {
      return (
        <Link class="logo" to="/leader/dashboard" ></Link>
      )

    } else if (currentRoleUser == 3) {
      return (
        <Link class="logo" to="/dashboard" ></Link>
      )

    } else {
      return (
        <Link class="logo" to="/dashboard" ></Link>
      )
    }
  }

  checkTeamLeader(team, teamLeader) {
    if (teamLeader !== null) {
      return teamLeader
    } else { return team }
  }

  render() {
    return (
      <div id="Header" className='Header'>
        <div class="row">
          <div class="col-md-6 col-sm-9 col-9">
            {this.getLogo()}
            <h4 class="title-header">Valorize</h4>
            <div class="title-description">Avaliação e Desempenho</div>
          </div>
          <div class="col-md-6 col-sm-3 col-3">
            <button class="btn btn-avatar dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="avatar">
                <img width='70px' src={this.state.photo_profile} />
              </span>
            </button>

            <div class="info-user">
              <div class="info-name">{this.state.data_name}</div>
              <div class="info-role">{this.state.data_role}</div>
            </div>

            <div class="dropdown-menu">
              <h6 class="dropdown-header">Meus Dados</h6>
              <li class="dropdown-item">{this.state.data_name}</li>
              <li class="dropdown-item">{this.state.data_email}</li>
              <div class="dropdown-divider"></div>
              <li class="dropdown-item">{this.state.data_role}</li>
              <li class="dropdown-item">{this.checkTeamLeader(this.state.data_team, this.state.data_team_leader)}</li>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" onClick={() => Auth.logout()}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Sair
                </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;