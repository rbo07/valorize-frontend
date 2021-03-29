import React from 'react';
import axios from 'axios';
import Auth from "../services/auth";

import { baseURL } from '../services/api';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

//Drawer
import { Drawer} from 'antd';

// Google Login Component
import GoogleLogin from "react-google-login"

//History
import { createBrowserHistory } from 'history';

// Spin
import { Spin } from 'antd';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

//Register
import Register from "../pages/register";


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      campEmail: "",
      campPassword: "",
      visible: false,
      loading: false
    }
  }

    // Acionar botão Entrar via tecla Enter
    componentDidMount() {
      $(document).keypress(function(e) {
        if(e.which == 13) $('#Entrar').click();
    });
  }

    // Validar email
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  
    validate() {
      let email = $("#email").val();
  
      if (this.validateEmail(email)) {
        return true
      } else {
        return false
      }
    }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  responseGoogleFailure = (response) => {
    Swal.fire(
      'Erro!',
      response,
      'error'
    )
  }

  responseGoogle = (response) => {
    const history = createBrowserHistory({ forceRefresh: true });
    const url = baseURL + '/users/loginGoogle';

    const datapost = {
      user_email: response.profileObj.email,
      user_name: response.profileObj.name,
    }

    // Autenticação com Google oAuth
    axios.post(url, datapost)
      .then(res => {
        if (res.data.success === true && res.data.role_access == 1) {
          history.push("/admin/dashboard");
          { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

        } else if (res.data.success === true && res.data.role_access == 2) {
          history.push("/leader/dashboard");
          { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

        } else if (res.data.success === true && res.data.role_access == 3) {
          history.push("/dashboard");
          { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

        } else if (res.data.success === true && res.data.role_access == null) {
          history.push("/dashboard");
          { Auth.login(res.data.token, 3, res.data.user_id) }

        } else {
          Swal.fire(
            'Falha no Login!',
            res.data.message,
            'error'
          )
        }
      });
  }

  //Enviar dados ao lado Servidor
  login() {

    const history = createBrowserHistory({ forceRefresh: true });

    if (this.state.campEmail == "") {
      Swal.fire(
        'Alerta!',
        "Preencha o campo Email",
        'warning'
      )
    }
    else if (this.state.campPassword == "") {
      Swal.fire(
        'Alerta!',
        "Preencha o campo Senha",
        'warning'
      )
    }
    else if(!this.validate()){

      Swal.fire(
        'Alerta!',
        "O Email digitado não é válido",
        'warning'
      )

    } else {
      this.setState({ loading: true });
      const url = baseURL + '/users/login';

      const datapost = {
        user_email: this.state.campEmail,
        user_password: this.state.campPassword,
      }

      axios.post(url, datapost)
        .then(res => {
          // Usuário Super Administrador
          if (res.data.success === true && res.data.role_access == 1) {
            this.setState({ loading: false });
            history.push("/admin/dashboard");
            { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

            // Usuário Líder de Equipe
          } else if (res.data.success === true && res.data.role_access == 2) {
            this.setState({ loading: false });
            history.push("/leader/dashboard");
            { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

            // Usuário Básico
          } else if (res.data.success === true && res.data.role_access == 3) {
            this.setState({ loading: false });
            history.push("/dashboard");
            { Auth.login(res.data.token, res.data.role_access, res.data.user_id) }

          } else if (res.data.success === true && res.data.role_access == null) {
            this.setState({ loading: false });
            history.push("/dashboard");
            { Auth.login(res.data.token, 3, res.data.user_id) }

          } else {
            Swal.fire(
              'Falha no Login!',
              res.data.message,
              'error'
            )
            this.setState({ loading: false });

          }
        }).catch(error => {
          alert("Error 34 " + error)
          this.setState({ loading: false });
        })

    }

  }

  render() {
    return (
      <div className="container-login">
        <div className="row align-items-center">
        <div className="col-xl-4 col-lg-3 col-md-2 col-sm-2 col"></div>
          <div className="col-xl-4 col-lg-6 col-md-8 col-sm-8 col-12">
            {/* <h1 className="h3">Entrar</h1> */}

            <div className="form-group">
              <div class="text-center">
                <div class="logo"></div>
              </div>
              <label>Email</label>
              <input 
                id="email"
                type="email"
                className="form-control"
                name="campEmail"
                placeholder="Insira o Email"
                value={this.state.campEmail}
                maxlength="100"
                onChange={(value) => this.setState({ campEmail: value.target.value })}
              />
            </div>

            <div className="form-group">

              <label>Senha</label>
              <input type="password"
                className="form-control"
                name="campPassword"
                placeholder="Insira a senha"
                value={this.state.campPassword}
                maxlength="20"
                onChange={(value) => this.setState({ campPassword: value.target.value })}
              />
            </div>

            <button id="Entrar" className="btn btn-lg btn-primary" onClick={() => this.login()}>Entrar <Spin size="small" spinning={this.state.loading} /></button>


            <GoogleLogin
              clientId="975744223808-1b100tg5pe2s9so4eoh5tgcd3c4eu58e.apps.googleusercontent.com"
              buttonText="Entrar com Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogleFailure}
              cookiePolicy={'single_host_origin'}
              className="btn-google"
            />

            <div className="row">
              <div className="col-md-6"></div>
              <div className="col-md-6 text-right">
                <button className="btn btn-link" onClick={this.showDrawer}><FontAwesomeIcon icon={faPlus} /> Criar Nova Conta</button>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-3 col-md-2 col-sm-2 col"></div>
        </div>

        {/* //////////////// DRAWER ////////////////// */}
        <Drawer
          title="Criar Nova Conta de Usuário"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <button class="btn btn-outline-secondary" onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancelar
              </button>
            </div>
          }
        >
          <Register />
        </Drawer>

      </div>
    )
  }
}

export default Login;