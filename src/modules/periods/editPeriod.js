import React from 'react';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Spin
import { Spin } from 'antd';

import axios from 'axios';
import { baseURL } from '../../services/api';

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/datepicker.css';
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-pt-BR';

//Multiselect
import { Multiselect } from 'multiselect-react-dropdown';

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentRoleUser = localStorage.getItem('ROLE_KEY');

// DatePicker
datepickerFactory($);
datepickerJAFactory($);


class EditPeriod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPeriod: {},
            dataAwardsLookUp: [],
            dataCriterionsLookUp: [],
            messageCriterionLookUp: '',
            messageAwardLookUp: '',
            campPeriodName: "",
            campPeriodInitialDate: "",
            campPeriodFinalDate: "",
            campPeriodInitialDateSub: "",
            campPeriodFinalDateSub: "",
            valueSelectedAwardsLookUp: [],
            valueSelectedCriterionsLookUp: [],
            loading: false
        }
    }
    componentDidMount() {
        const self = this;

        this.loadDataEditPeriod();
        this.awardsLookUp();
        this.criterionsLookUp();

        // Captura Data Inicial do DatePicker Calendar
        $("#inputPeriodInitialDate").change(function () {
            var dateComplete = $(this).datepicker("getDate");
            var date = $.datepicker.formatDate("yy-mm-dd", dateComplete);
            var date2 = $.datepicker.formatDate("dd-mm-yy", dateComplete);
            self.setState({
                campPeriodInitialDate: date + ' 00:00:00',
                campPeriodInitialDateSub: date2,
            })
        })

        // Captura Data Final do DatePicker Calendar
        $("#inputPeriodFinalDate").change(function () {
            var dateComplete = $(this).datepicker("getDate");
            var date = $.datepicker.formatDate("yy-mm-dd", dateComplete);
            var date2 = $.datepicker.formatDate("dd-mm-yy", dateComplete);
            self.setState({
                campPeriodFinalDate: date + ' 00:00:00',
                campPeriodFinalDateSub: date2,
            })
        })

        // Inicializa o DatePicker
        $(".inputDate").datepicker({ dateFormat: "yy-mm-dd" });
    }

    // Adiciona Prêmios no Array
    onSelectAwardLookUp(selectedList, selectedItem) {
        this.setState({
            valueSelectedAwardsLookUp: selectedList
        })
    }
    // Adiciona Prêmios no Array
    onRemoveAwardLookUp(selectedList, removedItem) {
        this.setState({
            valueSelectedAwardsLookUp: selectedList,
        })
    }

    // Adiciona Critérios no Array
    onSelectCriterionLookUp(selectedList, selectedItem) {
        this.setState({
            valueSelectedCriterionsLookUp: selectedList
        })
    }
    // Remove Critérios no Array
    onRemoveCriterionLookUp(selectedList, removedItem) {
        this.setState({
            valueSelectedCriterionsLookUp: selectedList,
        })
    }

    loadDataEditPeriod() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let periodId = this.props.match.params.id;
        const url = baseURL + "/period/edit/" + periodId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.period
                    this.setState({
                        dataPeriod: data,
                        campPeriodName: data.period_name,
                        campPeriodInitialDate: data.period_initial_date,
                        campPeriodFinalDate: data.period_final_date,
                        campPeriodInitialDateSub: this.formatDate(data.period_initial_date),
                        campPeriodFinalDateSub: this.formatDate(data.period_final_date),
                        valueSelectedAwardsLookUp: data.awards,
                        valueSelectedCriterionsLookUp: data.criterions,
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
    closeModal() {
        $('#cancelButton').click();
    }

    // Formata da Data vinda do Objeto
    formatDate(str) {
        let string = str.slice(0, str.lastIndexOf('T'))
        let fields = string.split('-');
        let finalString = fields[2] + '-' + fields[1] + '-' + fields[0]
        return finalString
    }

    renderCancelButton() {
        if (currentRoleUser == 1) {
            return (
                <Link class="btn btn-outline-secondary" to={"/admin/periods"} >Cancelar</Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link class="btn btn-outline-secondary" to={"/periods"} >Cancelar</Link>
            )
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
        } else {
            return ''
        }
    }


    render() {
        const history = createBrowserHistory({ forceRefresh: true });
        return (

            <div class='Content'>
                <Menu />
                <Header />
                <h1>Editar Período</h1>
                {this.getMessageCriterion()}
                {this.getMessageAward()}

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-12">
                            <label for="inputPeriodName">Nome do Período <span class="label-required">*</span></label>
                            <input maxlength="100" type="text" class="form-control" id="inputPeriodName" placeholder="Nome do Período" value={this.state.campPeriodName} onChange={(value) => this.setState({ campPeriodName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-6">
                            <label for="inputPeriodInitialDate">Data Inicial <span class="label-required">*</span></label>
                            <input type="text" class="inputDate form-control" id="inputPeriodInitialDate" placeholder="Data Inicial" value={this.state.campPeriodInitialDateSub} />
                        </div>

                        <div class="form-group col-md-6">
                            <label for="inputPeriodFinalDate">Data Final <span class="label-required">*</span></label>
                            <input type="text" class="inputDate form-control" id="inputPeriodFinalDate" placeholder="Data Final" value={this.state.campPeriodFinalDateSub} />
                        </div>

                        <div class="form-group col-md-6">
                            <label>Prêmios Associados</label>
                            <Multiselect
                                options={this.state.dataAwardsLookUp}
                                displayValue="award_name"
                                selectedValues={this.state.valueSelectedAwardsLookUp}
                                onSelect={this.onSelectAwardLookUp.bind(this)}
                                onRemove={this.onRemoveAwardLookUp.bind(this)}
                            />
                        </div>

                        <div class="form-group col-md-6">
                            <label>Critérios Associados</label>
                            <Multiselect
                                options={this.state.dataCriterionsLookUp}
                                displayValue="criterion_name"
                                selectedValues={this.state.valueSelectedCriterionsLookUp}
                                onSelect={this.onSelectCriterionLookUp.bind(this)}
                                onRemove={this.onRemoveCriterionLookUp.bind(this)}
                            />
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

        if (this.state.campPeriodName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Período",
                'warning'
            )
        }
        else if (this.state.campPeriodInitialDate == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Data Inicial",
                'warning'
            )
        }
        else if (this.state.campPeriodFinalDate == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Data Final",
                'warning'
            )
        }
        else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let periodId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/period/edit/" + periodId

            // Transforma o Array de Prêmios em array de IDs apenas
            const awardsAssociateID = []
            for (var i = 0; i < this.state.valueSelectedAwardsLookUp.length; i++) {
                awardsAssociateID[i] = this.state.valueSelectedAwardsLookUp[i].id
            }
            // Transforma o Array de Critérios em array de IDs apenas
            const criterionsAssociateID = []
            for (var i = 0; i < this.state.valueSelectedCriterionsLookUp.length; i++) {
                criterionsAssociateID[i] = this.state.valueSelectedCriterionsLookUp[i].id
            }

            const datapost = {
                period_name: this.state.campPeriodName,
                period_initial_date: this.state.campPeriodInitialDate,
                period_final_date: this.state.campPeriodFinalDate,
                awardsAssociate: awardsAssociateID,
                criterionsAssociate: criterionsAssociateID,
            }

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.success === true) {
                    this.setState({ loading: false });
                    Swal.fire(
                        'Período Atualizado!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/periods");
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

export default EditPeriod;