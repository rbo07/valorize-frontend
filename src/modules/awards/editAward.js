import React from 'react';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";
import ActiveMenu from "../../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import axios from 'axios';
import { baseURL } from '../../services/api';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

// Spin
import { Spin } from 'antd';

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



class EditAward extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAward: [],
            dataCriterionsLookUp: [],
            dataPeriodLookUp: [],
            messagePeriodLookUp: '',
            messageCriterionLookUp: '',
            campAwardName: "",
            campAwardDescription: "",
            valueSelectedPeriodsLookUp: null,
            valueSelectedCriterionsLookUp: null,
            valueSelectedPeriodName: "",
            valueSelectedCriterionName: "",
            loading: false
        }
    }
    componentDidMount() {
        this.loadDataEditAward();
        this.criterionsLookUp();
        this.periodsLookUp();
        ActiveMenu.setActive('.lk-award');
    }
    checkIfCriterionIDisNull(data) {
        if (data !== null) { return data.id } else { return null }
    }
    checkIfPeriodIDisNull(data) {
        if (data !== null) { return data.id } else { return null }
    }
    checkIfCriterionNameisNull(data) {
        if (data !== null) { return data.criterion_name } else { return 'Selecione o Critério' }
    }
    checkIfPeriodNameisNull(data) {
        if (data !== null) { return data.period_name } else { return 'Selecione o Período' }
    }

    loadDataEditAward() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        let awardId = this.props.match.params.id;
        const url = baseURL + "/awards/edit/" + awardId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.award
                    this.setState({
                        dataAward: data,
                        campAwardName: data.award_name,
                        campAwardDescription: data.award_description,
                        valueSelectedCriterionsLookUp: this.checkIfCriterionIDisNull(data.criterions),
                        valueSelectedPeriodsLookUp: this.checkIfPeriodIDisNull(data.periods),
                        valueSelectedCriterionName: this.checkIfCriterionNameisNull(data.criterions),
                        valueSelectedPeriodName: this.checkIfPeriodNameisNull(data.periods),
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

    criterionsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlCriterionsLookUp = baseURL + "/criterionsLookUp"
        axios.get(urlCriterionsLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.criterions
                    this.setState({
                        dataCriterionsLookUp: data
                    })

                } else {
                    this.setState({
                        messageCriterionLookUp: res.data.message
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }


    periodsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlLookUp = baseURL + '/periodsLookUp';
        axios.get(urlLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.periods
                    this.setState({
                        dataPeriodLookUp: data
                    })

                } else {
                    this.setState({
                        messagePeriodLookUp: res.data.message
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    closeModal() {
        $('#cancelButton').click();
    }

    renderCancelButton() {
        if (currentRoleUser == 1) {
            return (
                <Link class="btn btn-outline-secondary" to={"/admin/awards"} >Cancelar</Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link class="btn btn-outline-secondary" to={"/awards"} >Cancelar</Link>
            )
        }
    }


    handleChangePeriod(value) {
        this.setState({ valueSelectedPeriodsLookUp: value });
    }

    handleChangeCriterion(value) {
        this.setState({ valueSelectedCriterionsLookUp: value });
    }

    getMessagePeriod() {
        if (this.state.messagePeriodLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messagePeriodLookUp}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else {
            return ''
        }
    }

    getMessageCriterion() {
        if (this.state.messageCriterionLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageCriterionLookUp}
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
                <h1>Editar Prêmio</h1>

                {this.getMessagePeriod()}
                {this.getMessageCriterion()}

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-4">
                            <label for="inputAwardName">Nome do Prêmio <span class="label-required">*</span></label>
                            <input maxlength="100" type="text" class="form-control" id="inputAwardName" placeholder="Nome do Prêmio" value={this.state.campAwardName} onChange={(value) => this.setState({ campAwardName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-4">
                            <label for="selectPeriodLookUp">Período Associado</label>
                            <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} value={this.state.valueSelectedPeriodsLookUp} placeholder="Selecione o Período" >
                            <Option value={null} >Selecione o Período</Option>
                                {this.state.dataPeriodLookUp.map(data => <Option value={data.id} key={data.id}>{data.period_name}</Option>)}
                            </Select>
                        </div>


                        <div class="form-group col-md-4">
                            <label for="selectCriterionLookUp">Critério Associado</label>
                            <Select onChange={(value) => this.handleChangeCriterion(value)} size={'40px'} value={this.state.valueSelectedCriterionsLookUp} placeholder="Selecione o Critério" >
                                <Option value={null} >Selecione o Critério</Option>
                                {this.state.dataCriterionsLookUp.map(data => <Option value={data.id} key={data.id}>{data.criterion_name}</Option>)}
                            </Select>
                        </div>

                        <div class="form-group col-md-12">
                            <label for="inputAwardDescription">Descrição do Prêmio <span class="label-required">*</span></label>
                            <textarea maxlength="255" type="text" class="inputDate form-control" id="inputAwardDescription" placeholder="Descrição do Prêmio" value={this.state.campAwardDescription} onChange={(value) => this.setState({ campAwardDescription: value.target.value })} />
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

        if (this.state.campAwardName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Prêmio",
                'warning'
            )
        }
        else if (this.state.campAwardDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição do Prêmio",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let awardId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/award/edit/" + awardId

            const datapost = {
                award_name: this.state.campAwardName,
                award_description: this.state.campAwardDescription,
                criterion_id: this.state.valueSelectedCriterionsLookUp,
                period_id: this.state.valueSelectedPeriodsLookUp,
            }

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.success === true) {
                    this.setState({ loading: false });
                    Swal.fire(
                        'Prêmio Atualizado!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/awards");
                    })
                }
                else {
                    this.setState({ loading: false });
                    Swal.fire(
                        'Alerta!',
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

export default EditAward;