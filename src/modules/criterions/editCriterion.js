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



class EditCriterion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCriterion: [],
            dataAwardsLookUp: [],
            dataPeriodLookUp: [],
            messagePeriodLookUp: '',
            messageAwardLookUp: '',
            campCriterionName: "",
            campCriterionDescription: "",
            valueSelectedPeriodsLookUp: null,
            valueSelectedAwardsLookUp: null,
            valueSelectedPeriodName: "",
            valueSelectedAwardName: "",
            loading: false
        }
    }
    componentDidMount() {
        this.loadDataEditCriterion();
        this.awardsLookUp();
        this.periodsLookUp();
        ActiveMenu.setActive('.lk-criterion');
    }
    checkIfAwardIDisNull(data) {
        if (data !== null) { return data.id } else { return null }
    }
    checkIfPeriodIDisNull(data) {
        if (data !== null) { return data.id } else { return null }
    }
    checkIfAwardNameisNull(data) {
        if (data !== null) { return data.award_name } else { return 'Selecione o Prêmio' }
    }
    checkIfPeriodNameisNull(data) {
        if (data !== null) { return data.period_name } else { return 'Selecione o Período' }
    }

    loadDataEditCriterion() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let criterionId = this.props.match.params.id;
        const url = baseURL + "/criterions/edit/" + criterionId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.criterion
                    this.setState({
                        dataCriterion: data,
                        campCriterionName: data.criterion_name,
                        campCriterionDescription: data.criterion_description,
                        valueSelectedAwardsLookUp: this.checkIfAwardIDisNull(data.awards),
                        valueSelectedPeriodsLookUp: this.checkIfPeriodIDisNull(data.periods),
                        valueSelectedAwardName: this.checkIfAwardNameisNull(data.awards),
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

    awardsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlAwardsLookUp = baseURL + "/awardsLookUp"
        axios.get(urlAwardsLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.awards
                    this.setState({
                        dataAwardsLookUp: data,
                    })

                } else {
                    this.setState({
                        messageAwardLookUp: res.data.message
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
                <Link class="btn btn-outline-secondary" to={"/admin/criterions"} >Cancelar</Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link class="btn btn-outline-secondary" to={"/criterions"} >Cancelar</Link>
            )
        }
    }

    handleChangePeriod(value) {
        this.setState({ valueSelectedPeriodsLookUp: value });
    }

    handleChangeAward(value) {
        this.setState({ valueSelectedAwardsLookUp: value });
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
        }
    }

    getMessageAward() {
        if (this.state.messageAwardLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageAwardLookUp}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
    }

    render() {
        const { Option } = Select;
        const history = createBrowserHistory({ forceRefresh: true });
        return (

            <div class='Content'>
                <Menu />
                <Header />
                <h1>Editar Critério</h1>

                {this.getMessagePeriod()}
                {this.getMessageAward()}

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-6">
                            <label for="inputCriterionName">Nome do Critério <span class="label-required">*</span></label>
                            <input maxlength="100" type="text" class="form-control" id="inputCriterionName" placeholder="Nome do Critério" value={this.state.campCriterionName} onChange={(value) => this.setState({ campCriterionName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-6">
                            <label for="selectPeriodLookUp">Período Associado</label>
                            <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} value={this.state.valueSelectedPeriodsLookUp} placeholder="Selecione o Período" >
                                <Option value={null} >Selecione o Período</Option>
                                {this.state.dataPeriodLookUp.map(data => <Option value={data.id} key={data.id}>{data.period_name}</Option>)}
                            </Select>
                        </div>

                        <div class="form-group col-md-12">
                            <label for="inputCriterionDescription">Descrição do Critério <span class="label-required">*</span></label>
                            <textarea maxlength="255" type="text" class="inputDate form-control" id="inputCriterionDescription" placeholder="Descrição do Critério" value={this.state.campCriterionDescription} onChange={(value) => this.setState({ campCriterionDescription: value.target.value })} />
                        </div>

                        {/* <div class="form-group col-md-4">
                            <label for="selectAwardLookUp">Prêmio Associado</label>
                            <Select onChange={(value) => this.handleChangeAward(value)} size={'40px'} value={this.state.valueSelectedAwardsLookUp} placeholder="Selecione o Prêmio" >
                                {this.state.dataAwardsLookUp.map(data => <Option value={data.id} key={data.id}>{data.award_name}</Option>)}
                            </Select>
                        </div> */}

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

        if (this.state.campCriterionName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Critério",
                'warning'
            )
        }
        else if (this.state.campCriterionDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição do Critério",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let criterionId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/criterion/edit/" + criterionId

            const datapost = {
                criterion_name: this.state.campCriterionName,
                criterion_description: this.state.campCriterionDescription,
                award_id: this.state.valueSelectedAwardsLookUp,
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
                        'Critério Atualizado!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/criterions");
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

export default EditCriterion;