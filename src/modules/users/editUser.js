import React from 'react';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

// File Upload
import FileUploadWithPreview from "file-upload-with-preview";
import "file-upload-with-preview/dist/file-upload-with-preview.min.css";

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

// React Input Mask
import MaskedInput from 'react-text-mask'

import axios from 'axios';
import { baseURL } from '../../services/api';

// Spin
import { Spin } from 'antd';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentUser = localStorage.getItem('USER_KEY');
const currentRoleUser = localStorage.getItem('ROLE_KEY');


class EditUser extends React.Component {

  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);

    this.state = {
      dataUser: {},
      dataRoleLookUp: [],
      dataTeamLookUp: [],
      messageTeamLookUp: '',
      campName: "",
      campEmail: "",
      campAddress: "",
      campPhone: "",
      campPassword: "",
      valueSelectRole: null,
      selectRole: "",
      valueSelectTeam: null,
      selectTeam: "",
      currentUserLeader: null,
      currentTeam: null,
      currentRole: null,
      profileImg: '',
      loading: false
    }
  }

  componentDidMount() {
    this.loadDataEditUser();
    this.rolesLookUp();
    this.teamsLookUp();
    const upload = new FileUploadWithPreview("photoUploader");
  }

  insertPassword() {
    if (currentRoleUser == 1) {
      return (
        <div class="form-group col-md-6">
          <label for="inputPassword">Senha</label>
          <input maxlength="20" type="password" class="form-control" id="inputPassword" placeholder="Atualize sua senha" value={this.state.campPassword} onChange={(value) => this.setState({ campPassword: value.target.value })} />
        </div>
      )

    } else if (currentRoleUser == 2) {
      return ''
    }
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

  onFileChange(e) {
    this.setState({ profileImg: e.target.files[0] })
  }

  checkRoleName(data) {
    if (data == null) {
      return null
    } else { return data.role_name }
  }
  checkRoleId(data) {
    if (data == null) {
      return null
    } else { return data.id }
  }

  checkTeamName(data) {
    if (data == null) {
      return null
    } else { return data.team_name }
  }
  checkTeamId(data) {
    if (data == null) {
      return null
    } else { return data.id }
  }

  loadDataEditUser() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    let userId = this.props.match.params.id;
    const url = baseURL + "/users/edit/" + userId

    axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.users
          this.setState({
            dataUser: data,
            campName: data.user_name,
            campEmail: data.user_email,
            campAddress: data.user_address,
            campPhone: data.user_phone,
            valueSelectRole: this.checkRoleId(data.roles),
            selectRole: this.checkRoleName(data.roles),
            valueSelectTeam: this.checkTeamId(data.teams[0]),
            selectTeam: this.checkTeamName(data.teams[0]),
            currentTeam: this.checkTeamId(data.teams[0]),
            currentRole: this.checkRoleId(data.roles)
          })
        }
        else {
          alert("Error web service fuck!")
        }
      })
      .catch(error => {
        alert("Error server " + error)
      })
  }

  rolesLookUp() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const urlRoleLookUp = baseURL + "/rolesLookUp"

    axios.get(urlRoleLookUp, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.roles
          this.setState({
            dataRoleLookUp: data
          })

        } else {
          alert('Error Web Service');
        }
      })
      .catch(error => {
        alert('Error server ' + error)
      })
  }

  teamsLookUp() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const urlTeamLookUp = baseURL + "/teamsLookUp"

    axios.get(urlTeamLookUp, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.teams
          this.setState({
            dataTeamLookUp: data
          })

        } else {
          this.setState({
            messageTeamLookUp: res.data.message
          })
        }
      })
      .catch(error => {
        alert('Error server ' + error)
      })
  }

  renderCancelButton() {
    if (currentRoleUser == 1) {
      return (
        <Link class="btn btn-outline-secondary" to={"/admin/users"} >Cancelar</Link>
      )
    } else if (currentRoleUser == 2) {
      return (
        <Link class="btn btn-outline-secondary" to={"/users"} >Cancelar</Link>
      )
    }
  }

  handleChangeRole(value) {
    this.setState({ valueSelectRole: value });
  }

  handleChangeTeam(value) {
    this.setState({ valueSelectTeam: value });
  }

  getMessageTeam() {
    if (this.state.messageTeamLookUp !== '') {
      return (
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Ops!</strong> {this.state.messageTeamLookUp}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    } else {
      return ''
    }
  }


  render() {
    const { Option } = Select;

    return (

      <div class='Content'>
        <Menu />
        <Header />
        <h1>Editar Usuário</h1>
        {this.getMessageTeam()}

        <div class="card card-form form-edit-user" >

          <div class="form-row justify-content-center">
            <div class="form-group col-md-6">
              <label for="inputName">Nome <span class="label-required">*</span></label>
              <input maxlength="100" type="text" class="form-control" placeholder="inputName"
                value={this.state.campName} onChange={(value) => this.setState({ campName: value.target.value })} />
            </div>

            <div class="form-group col-md-6">
              <label for="inputEmail">E-mail <span class="label-required">*</span></label>
              <input maxlength="100" id="email" type="email" class="form-control" placeholder="inputEmail"
                value={this.state.campEmail} onChange={(value) => this.setState({ campEmail: value.target.value })} />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputAddress">Endereço <span class="label-required">*</span></label>
              <input maxlength="150" type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"
                value={this.state.campAddress} onChange={(value) => this.setState({ campAddress: value.target.value })} />
            </div>

            <div class="form-group col-md-6">
              <label for="inputPhone">Telefone <span class="label-required">*</span></label>
              <MaskedInput
                mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
                className="form-control"
                placeholder="Insira seu Número de Celular"
                guide={false}
                id="my-input-id"
                onBlur={() => { }}
                value={this.state.campPhone}
                onChange={(value) => this.setState({ campPhone: value.target.value })}
              />
            </div>

          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputPhone">Função</label>
              <Select onChange={(value) => this.handleChangeRole(value)} size={'40px'} value={this.state.valueSelectRole} placeholder="Selecione a Função" >
                {this.state.dataRoleLookUp.map(data => <Option value={data.id} key={data.id}>{data.role_name}</Option>)}
              </Select>
            </div>

            <div class="form-group col-md-6">
              <label for="inputPhone">Equipe</label>

              <Select onChange={(value) => this.handleChangeTeam(value)} size={'40px'} value={this.state.valueSelectTeam} placeholder="Selecione a Equipe" >
                {this.state.dataTeamLookUp.map(data => <Option value={data.id} key={data.id}>{data.team_name}</Option>)}
              </Select>

            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <div data-upload-id="photoUploader" class="custom-file-container">
                <label>Foto do Perfil</label>
                <a href="javascript:void(0)" class="custom-file-container__image-clear" title="Clear Image">
                  <FontAwesomeIcon icon={faEraser} />
                </a>
                <label class="custom-file-container__custom-file">
                  <input
                    type="file"
                    onChange={this.onFileChange}
                    class="custom-file-container__custom-file__custom-file-input"
                    accept="*"
                    aria-label="Selecione a Imagem"
                  />
                  <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                  <span
                    class="custom-file-container__custom-file__custom-file-control"
                  ></span>
                </label>
                <div class="custom-file-container__image-preview"></div>
              </div>
            </div>
            {this.insertPassword()}
          </div>

          <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

          <div class="card-footer">
            <button type="submit" class="btn btn-primary" onClick={() => this.sendUpdate()}>Atualizar Dados <Spin size="small" spinning={this.state.loading} /></button>
            {this.renderCancelButton()}
          </div>
        </div>
      </div>
    );
  }

  sendUpdate() {

    if (this.state.campName == "") {

      Swal.fire(
        'Alerta!',
        "Preencha o campo Nome",
        'warning'
      )
    }
    else if (this.state.campEmail == "") {

      Swal.fire(
        'Alerta!',
        "Preencha o campo Email",
        'warning'
      )
    }
    else if (this.state.campAddress == "") {

      Swal.fire(
        'Alerta!',
        "Preencha o campo Endereço",
        'warning'
      )
    }
    else if (this.state.campPhone == "") {

      Swal.fire(
        'Alerta!',
        "Preencha o campo Telefone",
        'warning'
      )
    }
    else if (!this.validate()) {

      Swal.fire(
        'Alerta!',
        "O Email digitado não é válido",
        'warning'
      )

    } else {

      this.setState({ loading: true });

      const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
      const history = createBrowserHistory({ forceRefresh: true });
      //  get parameter id
      let userId = this.props.match.params.id;

      // url de backend
      const url = baseURL + "/users/edit/" + userId

      const datapost = new FormData();

      datapost.append('user_name', this.state.campName);
      datapost.append('user_email', this.state.campEmail);
      datapost.append('user_address', this.state.campAddress);
      datapost.append('user_phone', this.state.campPhone);
      datapost.append('role_id', this.state.valueSelectRole);
      datapost.append('role_current', this.state.currentRole);
      datapost.append('team_id', this.state.valueSelectTeam);
      datapost.append('team_current', this.state.currentTeam);
      datapost.append('password_user', this.state.campPassword);

      if (this.state.profileImg !== '') {
        datapost.append('user_photo', this.state.profileImg);
      } else {
        datapost.append('user_photo', undefined);
      }

      axios.put(url, datapost, {
        headers: {
          'Authorization': token
        }
      }).then(res => {
        if (res.data.success === true) {
          this.setState({ loading: false });

          Swal.fire(
            'Usuário Atualizado!',
            res.data.message,
            'success'
          ).then((result) => {
            if (currentRoleUser == 1) {
              history.push("/admin/users");
            } else if (currentRoleUser == 2) {
              history.push("/users");
            }
          })
        }
        else {
          this.setState({ loading: false });

          Swal.fire(
            'Erro!',
            res.data.message,
            'error'
          )
        }
      }).catch(error => {
        alert("Error 34 " + error)
      })

    }


  }

}

export default EditUser;