import React from 'react';
import ActiveMenu from "../../services/setMenu";

import { createBrowserHistory } from 'history';
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

import axios from 'axios';
import { baseURL } from '../../services/api';

// React Input Mask
import MaskedInput from 'react-text-mask'

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

class AddUser extends React.Component {

  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);

    this.state = {
      dataRoleLookUp: [],
      dataTeamLookUp: [],
      messageTeamLookUp: '',
      campName: "",
      campEmail: "",
      campPassword: "",
      campAddress: "",
      campPhone: "",
      valueSelectRole: null,
      selectRole: "",
      valueSelectTeam: null,
      selectTeam: "",
      profileImg: '',
      loading: false
    }
  }

  componentDidMount() {
    this.rolesLookUp();
    this.teamsLookUp();
    const upload = new FileUploadWithPreview("photoUploader");
    ActiveMenu.setActive('.lk-user');
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
    const history = createBrowserHistory({ forceRefresh: true });
    return (

      <div class={'Content ' + ActiveMenu.getClassMenu()}>
        <Menu />
        <Header />
        <h1>Adicionar Novo Usuário</h1>
        {this.getMessageTeam()}

        <div class="card card-form form-edit-user" >
          <div class="form-row justify-content-center">
            <div class="form-group col-md-6">
              <label for="inputName">Nome <span class="label-required">*</span></label>
              <input maxlength="100" type="text" class="form-control" placeholder="Insira seu Nome Completo" value={this.state.campName} onChange={(value) => this.setState({ campName: value.target.value })} />
            </div>

            <div class="form-group col-md-6">
              <label for="inputEmail">E-mail <span class="label-required">*</span></label>
              <input maxlength="100" id="email" type="email" class="form-control" placeholder="Insira seu Email" value={this.state.campEmail} onChange={(value) => this.setState({ campEmail: value.target.value })} />
            </div>
          </div>

          <div class="form-row justify-content-center">
            <div class="form-group col-md-6">
              <label for="inputAddress">Endereço <span class="label-required">*</span></label>
              <input maxlength="150" type="text" class="form-control" id="inputAddress" placeholder="Insira seu Endereço Completo" value={this.state.campAddress} onChange={(value) => this.setState({ campAddress: value.target.value })} />
            </div>

            <div class="form-group col-md-6">
              <label for="inputPhone">Telefone <span class="label-required">*</span></label>
              <MaskedInput
                mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
                className="form-control"
                placeholder="Insira seu Número de Celular"
                guide={false}
                onChange={(value) => this.setState({ campPhone: value.target.value })}
              />
            </div>
          </div>

          <div class="form-row justify-content-center">
            <div class="form-group col-md-6">
              <label for="inputTeam">Equipe</label>

              <Select onChange={(value) => this.handleChangeTeam(value)} size={'40px'} value={this.state.valueSelectTeam} placeholder="Selecione a Equipe" >
                {this.state.dataTeamLookUp.map(data => <Option value={data.id} key={data.id}>{data.team_name}</Option>)}
              </Select>
            </div>

            <div class="form-group col-md-6">
              <label for="inputRole">Função</label>

              <Select onChange={(value) => this.handleChangeRole(value)} size={'40px'} value={this.state.valueSelectRole} placeholder="Selecione a Função" >
                {this.state.dataRoleLookUp.map(data => <Option value={data.id} key={data.id}>{data.role_name}</Option>)}
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
            <div class="form-group col-md-6">
              <label for="inputPassword">Senha <span class="label-required">*</span></label>
              <input maxlength="20" type="password" class="form-control" id="inputPassword" placeholder="" value={this.state.campPassword} onChange={(value) => this.setState({ campPassword: value.target.value })} />
            </div>
          </div>

          <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

          <div class="card-footer">
            <button type="submit" class="btn btn-primary" onClick={() => this.sendSave()}>Salvar <Spin size="small" spinning={this.state.loading} /></button>
            <button type="submit" class="btn btn-outline-secondary" onClick={() => history.push("/admin/users")}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  //Enviar dados ao lado Servidor
  sendSave() {
    const history = createBrowserHistory({ forceRefresh: true });
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
    else if (this.state.campPassword == "") {

      Swal.fire(
        'Alerta!',
        "Preencha o campo Senha",
        'warning'
      )
    }
    else if (!this.validate()) {

      Swal.fire(
        'Alerta!',
        "O Email digitado não é válido",
        'warning'
      )

    }
    else {
      this.setState({ loading: true });
      const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
      const url = baseURL + '/addUser';

      const datapost = new FormData();

      datapost.append('user_name', this.state.campName);
      datapost.append('user_email', this.state.campEmail);
      datapost.append('user_address', this.state.campAddress);
      datapost.append('user_phone', this.state.campPhone);
      datapost.append('password_user', this.state.campPassword);
      datapost.append('id_team', this.state.valueSelectTeam);
      datapost.append('role_id', this.state.valueSelectRole);

      if (this.state.profileImg !== '') {
        datapost.append('user_photo', this.state.profileImg);
      } else {
        datapost.append('user_photo', undefined);
      }


      axios.post(url, datapost, {
        headers: {
          'Authorization': token
        }
      })
        .then(res => {
          if (res.data.success === true) {
            this.setState({ loading: false });

            Swal.fire(
              'Sucesso!',
              res.data.message,
              'success'
            ).then((result) => {
              history.push("/admin/users");
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


export default AddUser;