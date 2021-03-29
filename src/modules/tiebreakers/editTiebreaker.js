import React from 'react';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";
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

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentRoleUser = localStorage.getItem('ROLE_KEY');



class EditTiebreaker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ListTiebreak: [],
            campTiebreakName: "",
            campTiebreakWeight: null,
            loading: false
        }
    }
    componentDidMount() {
        this.loadDataEditTiebreak();
        ActiveMenu.setActive('.lk-tiebreak');
    }

    loadDataEditTiebreak() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let tiebreakId = this.props.match.params.id;

        const url = baseURL + "/tiebreak/edit/" + tiebreakId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.tiebreak
                    this.setState({
                        ListTiebreak: data,
                        campTiebreakName: data.tiebreaker_name,
                        campTiebreakWeight: data.tiebreaker_weight,
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

    closeModal() {
        $('#cancelButton').click();
    }

    renderCancelButton() {
        if (currentRoleUser == 1) {
            return (
                <Link class="btn btn-outline-secondary" to={"/admin/tiebreakers"} >Cancelar</Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link class="btn btn-outline-secondary" to={"/tiebreakers"} >Cancelar</Link>
            )
        }
    }


    handleChangeTiebreak(value) {
        this.setState({ campTiebreakWeight: value });
    }

    render() {
        const { Option } = Select;
        const history = createBrowserHistory({ forceRefresh: true });
        return (

            <div class={'Content ' + ActiveMenu.getClassMenu()}>
                <Menu />
                <Header />
                <h1>Editar Critério de Desempate</h1>

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-8">
                            <label for="inputTiebreakName">Nome do Critério de Desempate <span class="label-required">*</span></label>
                            <input maxlength="100" type="text" class="form-control" id="inputTiebreakName" placeholder="Nome do Critério de Desempate" value={this.state.campTiebreakName} onChange={(value) => this.setState({ campTiebreakName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-4">
                            <label for="selectTiebreakWeight">Peso <span class="label-required">*</span></label>

                            <Select onChange={(value) => this.handleChangeTiebreak(value)} size={'40px'} value={this.state.campTiebreakWeight} placeholder="Selecione o Critério de Desempate" >
                                <Option value={5} key={5}>5</Option>
                                <Option value={10} key={10}>{10}</Option>
                                <Option value={15} key={15}>{15}</Option>
                                <Option value={20} key={20}>{20}</Option>
                                <Option value={25} key={25}>{25}</Option>
                                <Option value={30} key={30}>{30}</Option>
                                <Option value={35} key={35}>{35}</Option>
                                <Option value={40} key={40}>{40}</Option>
                                <Option value={45} key={45}>{45}</Option>
                                <Option value={50} key={50}>{50}</Option>
                                <Option value={55} key={55}>{55}</Option>
                                <Option value={60} key={60}>{60}</Option>
                                <Option value={65} key={65}>{65}</Option>
                                <Option value={70} key={70}>{70}</Option>
                                <Option value={75} key={75}>{75}</Option>
                                <Option value={80} key={80}>{80}</Option>
                                <Option value={85} key={85}>{85}</Option>
                                <Option value={90} key={90}>{90}</Option>
                                <Option value={95} key={95}>{95}</Option>
                                <Option value={100} key={100}>{100}</Option>
                            </Select>
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

        if (this.state.campTiebreakName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Critério de Desempate",
                'warning'
            )
        }
        else if (this.state.campTiebreakWeight == null) {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Peso",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let tiebreakId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/tiebreak/edit/" + tiebreakId

            const datapost = {
                tiebreaker_name: this.state.campTiebreakName,
                tiebreaker_weight: this.state.campTiebreakWeight,
            }

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.success === true) {
                    this.setState({ loading: false });
                    Swal.fire(
                        'Critério de Desempate Atualizado!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/tiebreakers");
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

export default EditTiebreaker;