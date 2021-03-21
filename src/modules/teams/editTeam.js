import React from 'react';
import { createBrowserHistory } from 'history';

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


class EditTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTeam: {},
            dataUserLookUp: [],
            messageUserLookup: '',
            campTeamName: "",
            campTeamDescription: "",
            valueSelectTeamLeader: null,
            loading: false
        }
    }

    componentDidMount() {
        this.loadDataEditTeam();
        this.usersLookUp();
    }

    loadDataEditTeam() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let teamId = this.props.match.params.id;
        const url = baseURL + "/teams/edit/" + teamId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.team
                    this.setState({
                        dataTeam: data,
                        campTeamName: data.team_name,
                        campTeamDescription: data.team_description,
                        valueSelectTeamLeader: data.lider_id,
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

    usersLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlUserLookUp = baseURL + "/userLookUpLeader"

        axios.get(urlUserLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.users
                    this.setState({
                        dataUserLookUp: data
                    })

                } else {
                    this.setState({
                        messageUserLookup: res.data.message,
                    });
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    handleChangeLeader(value) {
        this.setState({ valueSelectTeamLeader: value });
    }

    getMessageUser() {
        if (this.state.messageUserLookup !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageUserLookup}
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

            <div class='Content'>
                <Menu />
                <Header />
                <h1>Editar Equipe</h1>
                {this.getMessageUser()}
                <div class="card card-form form-edit-user" >

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="inputTeamName">Nome da Equipe <span class="label-required">*</span></label>
                            <input maxlength="100" type="text" class="form-control" id="inputTeamName" placeholder="Nome da Equipe" value={this.state.campTeamName} onChange={(value) => this.setState({ campTeamName: value.target.value })} />
                        </div>
                        <div class="form-group col-md-6">
                            <label for="selectUserLookUp">Líder da Equipe <span class="label-required">*</span></label>
                            <Select onChange={(value) => this.handleChangeLeader(value)} size={'40px'} value={this.state.valueSelectTeamLeader} placeholder="Selecione o Líder" >
                                {this.state.dataUserLookUp.map(data => <Option value={data.id} key={data.id}>{data.user_name}</Option>)}
                            </Select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <label for="inputTeamDescription">Descrição da Equipe <span class="label-required">*</span></label>
                            <textarea maxlength="255" type="text" class="form-control" id="inputTeamDescription" placeholder="" value={this.state.campTeamDescription} onChange={(value) => this.setState({ campTeamDescription: value.target.value })} />
                        </div>
                    </div>

                    <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary" onClick={() => this.sendUpdate()}>Atualizar Dados <Spin size="small" spinning={this.state.loading} /></button>
                        <button type="submit" class="btn btn-outline-secondary" onClick={() => history.push("/admin/teams")}>Cancelar</button>
                    </div>
                </div>

            </div>
        );
    }

    sendUpdate() {

        if (this.state.campTeamName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome da Equipe",
                'warning'
            )
        }
        else if (this.state.valueSelectTeamLeader == null) {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Líder da Equipe",
                'warning'
            )
        }
        else if (this.state.campTeamDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição da Equipe",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let teamId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/teams/edit/" + teamId

            // parametros de datos post
            const datapost = {
                team_name: this.state.campTeamName,
                lider_id: this.state.valueSelectTeamLeader,
                team_description: this.state.campTeamDescription,
            }

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.success === true) {
                    this.setState({ loading: false });
                    Swal.fire(
                        'Equipe Atualizada!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/teams");
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

export default EditTeam;