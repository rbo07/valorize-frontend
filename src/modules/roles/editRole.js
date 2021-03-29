import React from 'react';
import { createBrowserHistory } from 'history';
import ActiveMenu from "../../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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


class EditRole extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataRole: {},
            campRoleName: "",
            campRoleDescription: "",
            valueSelectRoleAccess: null,
            loading: false
        }
    }
    componentDidMount() {
        this.loadDataEditRole();
        ActiveMenu.setActive('.lk-role');
    }

    loadDataEditRole() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let roleId = this.props.match.params.id;
        const url = baseURL + "/roles/edit/" + roleId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.roles
                    this.setState({
                        dataRole: data,
                        campRoleName: data.role_name,
                        campRoleDescription: data.role_description,
                        valueSelectRoleAccess: data.role_access,
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

    handleChangeAccess(value) {
        this.setState({ valueSelectRoleAccess: value });
    }

    render() {
        const { Option } = Select;
        const history = createBrowserHistory({ forceRefresh: true });
        return (

            <div class={'Content ' + ActiveMenu.getClassMenu()}>
                <Menu />
                <Header />
                <h1>Editar Função</h1>

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-6">
                            <label for="inputRoleName">Nome da Função <span class="label-required">*</span></label>
                            <input maxlength="100" id="inputRoleName" type="text" class="form-control" placeholder="Nome da Função"
                                value={this.state.campRoleName} onChange={(value) => this.setState({ campRoleName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-6">
                            <label for="selectRoleAccess">Nível de Acesso <span class="label-required">*</span></label>
                            <Select onChange={(value) => this.handleChangeAccess(value)} size={'40px'} value={this.state.valueSelectRoleAccess} placeholder="Selecione o Nível de Acesso" >
                                <Option value={1} key={1}>1 - Super Administrador</Option>
                                <Option value={2} key={2}>2 - Líder de Equipe</Option>
                                <Option value={3} key={3}>3 - Usuário Básico</Option>
                            </Select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <label for="inputRoleDescription">Descrição da Função <span class="label-required">*</span></label>
                            <textarea maxlength="255" id="inputRoleDescription" type="text" class="form-control" placeholder="Descrição da Função"
                                value={this.state.campRoleDescription} onChange={(value) => this.setState({ campRoleDescription: value.target.value })} />
                        </div>
                    </div>

                    <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary" onClick={() => this.sendUpdate()}>Atualizar Dados <Spin size="small" spinning={this.state.loading} /></button>
                        <button type="submit" class="btn btn-outline-secondary" onClick={() => history.push("/admin/roles")}>Cancelar</button>
                    </div>
                </div>
            </div>
        );
    }

    sendUpdate() {
        if (this.state.campRoleName == "") {

            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome da Função",
                'warning'
            )
        }
        else if (this.state.campRoleDescription == "") {

            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição da Função",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let roleId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/roles/edit/" + roleId

            // parametros de datos post
            const datapost = {
                role_name: this.state.campRoleName,
                role_access: this.state.valueSelectRoleAccess,
                role_description: this.state.campRoleDescription,
            }

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.success === true) {
                    this.setState({ loading: false });

                    Swal.fire(
                        'Função Atualizada!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/roles");
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

export default EditRole;