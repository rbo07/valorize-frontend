import React from 'react';
import { Link } from "react-router-dom";
import ActiveMenu from "../../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

// File Upload
import FileUploadWithPreview from "file-upload-with-preview";
import "file-upload-with-preview/dist/file-upload-with-preview.min.css";

import axios from 'axios';
import { baseURL } from '../../services/api';

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

// React Input Mask
import MaskedInput from 'react-text-mask'

// Spin
import { Spin } from 'antd';

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentRoleUser = localStorage.getItem('ROLE_KEY');


class UpdateUser extends React.Component {

  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);

    this.state = {
      dataUser: {},
      campName: "",
      campEmail: "",
      campAddress: "",
      campPhone: "",
      campPassword: "",
      profileImg: '',
      profileImgTemp: '',
      loading: false
    }
  }

  componentDidMount() {
    this.loadEditView()
    const upload = new FileUploadWithPreview("photoUploader");
    ActiveMenu.setActive('.lk-update');
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

  loadEditView() {
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
            campPassword: data.user_password,
            profileImgTemp: data.user_photo
          })
        }
        else {

          alert("Error web service!")
        }
      })
      .catch(error => {
        alert("Error server " + error)
      })
  }

  onFileChange(e) {
    this.setState({ profileImg: e.target.files[0] })
    $('.preview-img').css('display','none')
    
  }

  renderCancelButton() {
    if (currentRoleUser == 1) {
      return (
        <Link class="btn btn-outline-secondary" to={"/admin/dashboard"} >Cancelar</Link>
      )
    } else if (currentRoleUser == 2) {
      return (
        <Link class="btn btn-outline-secondary" to={"/leader/dashboard"} >Cancelar</Link>
      )
    } else if (currentRoleUser == 3) {
      return (
        <Link class="btn btn-outline-secondary" to={"/dashboard"} >Cancelar</Link>
      )
    }
  }

  getPreview(){
    if(this.state.profileImgTemp !== ''){
      return (
        <img width='170px' src={this.state.profileImgTemp} />
      )
    } else {
      return ''
    }
  }

  render() {
    return (

      <div class={'Content ' + ActiveMenu.getClassMenu()}>
        <Menu />
        <Header />
        <h1>Meus Dados</h1>

        <div class="card card-form form-edit-user" >

          <div class="form-row justify-content-center">
            <div class="form-group col-md-6">
              <label for="inputName">Nome <span class="label-required">*</span></label>
              <input maxlength="100" type="text" class="form-control" placeholder="inputName"
                value={this.state.campName} onChange={(value) => this.setState({ campName: value.target.value })} />
            </div>

            <div class="form-group col-md-6">
              <label for="inputEmail">Email <span class="label-required">*</span></label>
              <input maxlength="100" id="email" type="email" class="form-control" placeholder="inputEmail"
                value={this.state.campEmail} onChange={(value) => this.setState({ campEmail: value.target.value })} />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="inputAddress">Endereço <span class="label-required">*</span></label>
              <input maxlength="150" type="text" class="form-control" id="inputAddress" placeholder="Cadastre seu endereço"
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
            <div class="form-group col-md-6">
              <label for="inputPassword">Senha</label>
              <input maxlength="20" type="password" class="form-control" id="inputPassword" placeholder="Atualize sua senha" value={this.state.campPassword} onChange={(value) => this.setState({ campPassword: value.target.value })} />
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
                <div class="preview-img">
                  {this.getPreview()}
                </div>
                <div class="custom-file-container__image-preview"></div>
              </div>
            </div>
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
    } else if (!this.validate()) {

      Swal.fire(
        'Atenção!',
        "O Email digitado não é válido",
        'warning'
      )

    } else {

      this.setState({ loading: true });
      const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
      //  get parameter id
      let userId = this.props.match.params.id;

      // url de backend
      const url = baseURL + "/update/" + userId

      const datapost = new FormData();


      datapost.append('user_name', this.state.campName);
      datapost.append('user_email', this.state.campEmail);
      datapost.append('user_address', this.state.campAddress);
      datapost.append('user_phone', this.state.campPhone);
      datapost.append('password_user', this.state.campPassword);

      if (this.state.profileImg !== '') {
        datapost.append('user_photo', this.state.profileImg);
      } else {
        datapost.append('user_photo', undefined);
      }

      // console.log(...datapost)
      axios.put(url, datapost, {
        headers: {
          'Authorization': token
        }
      })
        .then(res => {
          if (res.data.success === true) {
            this.setState({ loading: false });
            Swal.fire(
              'Usuário Atualizado!',
              res.data.message,
              'success'
            ).then((result) => {
              this.loadEditView()
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
          Swal.fire(
            'Erro!',
            error,
            'error'
          )
        })
    }


  }

}

export default UpdateUser;