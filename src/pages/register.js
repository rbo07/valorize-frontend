import React from 'react';

import { createBrowserHistory } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

// File Upload
import FileUploadWithPreview from "file-upload-with-preview";
import "file-upload-with-preview/dist/file-upload-with-preview.min.css";

// React Input Mask
import MaskedInput from 'react-text-mask'

import axios from 'axios';
import { baseURL } from '../services/api';

// Spin
import { Spin } from 'antd';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const url = baseURL + '/register';

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);

        this.state = {
            campName: "",
            campEmail: "",
            campPassword: "",
            campAddress: "",
            campPhone: "",
            profileImg: '',
            loading: false
        };
    }

    componentDidMount() {
        const upload = new FileUploadWithPreview("photoUploader");
    }

    // Validar email
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    
      validate() {
        let email = $("#emailreg").val();
    
        if (this.validateEmail(email)) {
          return true
        } else {
          return false
        }
      }

    onFileChange(e) {
        this.setState({ profileImg: e.target.files[0] })
    }

    //Renderizar tela
    render() {
        const history = createBrowserHistory({ forceRefresh: true });
        return (
            <div class="ContentRegister">
                <div class="form-row justify-content-center">
                    <div class="form-group col-md-6">
                        <label for="inputName">Nome <span class="label-required">*</span></label>
                        <input maxlength="100" type="text" class="form-control" placeholder="Insira seu Nome Completo" value={this.state.campName} onChange={(value) => this.setState({ campName: value.target.value })} />
                    </div>

                    <div class="form-group col-md-6">
                        <label for="inputEmail">Email <span class="label-required">*</span></label>
                        <input maxlength="100" id="emailreg" type="email" class="form-control" placeholder="Insira seu Email" value={this.state.campEmail} onChange={(value) => this.setState({ campEmail: value.target.value })} />
                    </div>
                </div>

                <div class="form-row">
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
                            id="my-input-id"
                            onBlur={() => { }}
                            onChange={(value) => this.setState({ campPhone: value.target.value })}
                        />

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
                        <input maxlength="20" type="password" class="form-control" id="inputPassword" placeholder="Insira sua Senha" value={this.state.campPassword} onChange={(value) => this.setState({ campPassword: value.target.value })} />
                    </div>
                </div>
                <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

                <div class="footer-register">
                    <button type="submit" class="btn btn-primary" onClick={() => this.sendSave()}>Finalizar Cadastro <Spin size="small" spinning={this.state.loading} /></button>
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
        // else if (this.state.profileImg == "") {

        //     Swal.fire(
        //         'Alerta!',
        //         "Preencha o campo Foto do Perfil",
        //         'warning'
        //     )
        // }
        else if (this.state.campPassword == "") {

            Swal.fire(
                'Alerta!',
                "Preencha o campo Senha",
                'warning'
            )
        } else if (!this.validate()) {

            console.log(!this.validate())
            Swal.fire(
                'Alerta!',
                "O Email digitado não é válido",
                'warning'
            )
        } else {
            this.setState({ loading: true });

            const datapost = new FormData();

            datapost.append('user_name', this.state.campName);
            datapost.append('user_email', this.state.campEmail);
            datapost.append('user_address', this.state.campAddress);
            datapost.append('user_phone', this.state.campPhone);
            datapost.append('password_user', this.state.campPassword);
            datapost.append('user_photo', this.state.profileImg);

            axios.post(url, datapost)
                .then(res => {
                    if (res.data.success === true) {
                        this.setState({ loading: false });

                        Swal.fire(
                            'Sucesso!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            history.push("/login");

                        })
                    }
                    else {
                        this.setState({ loading: false });
                        Swal.fire(
                            'Atenção!',
                            res.data.message,
                            'warning'
                        )

                    }
                }).catch(error => {
                    alert("Error 34 " + error)
                })

        }

    }
}


export default Register;