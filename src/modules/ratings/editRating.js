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

// React Input Mask
import MaskedInput from 'react-text-mask'

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

class EditRating extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataRating: [],
            campRatingScore: null,
            campRatingFinalScore: null,
            campUserName: "",
            campUserEvaluatorName: "",
            campUserId: null,
            campUserEvaluatorId: null,
            campAwardName: "",
            campPeriodName: "",
            campCriterionName: "",
            campTiebreakName: "",
            campTiebreakWeight: "",
            dataAwardsLookUp: [],
            dataPeriodLookUp: [],
            dataCriterionsLookUp: [],
            dataTiebreakLookUp: [],
            valueSelectedAwardsLookUp: null,
            valueSelectedPeriodsLookUp: null,
            valueSelectedCriterionsLookUp: null,
            valueSelectedTiebreakLookUp: null,
            loading: false
        }
    }
    componentDidMount() {
        this.loadDataEditRating();
        ActiveMenu.setActive('.lk-rating');

        $("#inputRatingScore").on('keyup keypress blur change', function (e) {
            $(this).val().replace(/^0+/g, '')
            if ($(this).val() > 100) {
                $(this).val('100');
                return false;
            }
        });
    }

    turnDataUser(obj) {
        if (obj !== null) return obj.user_name
    }

    turnDataUserId(obj) {
        if (obj !== null) return obj.id
    }

    turnDataAward(obj) {
        if (obj !== null) return obj.award_name
        else return 'Nenhum Prêmio Conquistado'
    }
    turnDataAwardID(obj) {
        if (obj !== null) return obj.id
        else return null
    }

    turnDataPeriod(obj) {
        if (obj !== null) return obj.period_name
    }
    turnDataPeriodID(obj) {
        if (obj !== null) return obj.id
        else return null
    }

    turnDataCriterion(obj) {
        if (obj !== null) return obj.criterion_name
    }
    turnDataCriterionID(obj) {
        if (obj !== null) return obj.id
        else return null
    }

    turnDataTiebreakName(obj) {
        if (obj !== null) return obj.tiebreaker_name
        else return 'Nenhum Critério de Desempate Adicionado'
    }
    turnDataTiebreakWeight(obj) {
        if (obj !== null) return obj.tiebreaker_weight
        else return "0"
    }
    turnDataTiebreakID(obj) {
        if (obj !== null) return obj.id
        else return null
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + ' ...' : str;
    };


    loadDataEditRating() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let ratingId = this.props.match.params.id;
        const url = baseURL + "/rating/edit/" + ratingId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.rating
                    this.setState({
                        dataRating: data,
                        campRatingScore: data.rating_score,
                        campRatingFinalScore: data.final_score,
                        campUserName: this.turnDataUser(data.user),
                        campUserEvaluatorName: this.turnDataUser(data.user_evaluator),
                        campUserId: this.turnDataUserId(data.user),
                        campUserEvaluatorId: this.turnDataUserId(data.user_evaluator),
                        campAwardName: this.turnDataAward(data.awards),
                        campPeriodName: this.turnDataPeriod(data.periods),
                        campCriterionName: this.turnDataCriterion(data.criterions),
                        campTiebreakName: this.turnDataTiebreakName(data.tiebreakers),
                        campTiebreakWeight: this.turnDataTiebreakWeight(data.tiebreakers),
                        valueSelectedAwardsLookUp: this.turnDataAwardID(data.awards),
                        valueSelectedPeriodsLookUp: this.turnDataPeriodID(data.periods),
                        valueSelectedCriterionsLookUp: this.turnDataCriterionID(data.criterions),
                        valueSelectedTiebreakLookUp: this.turnDataTiebreakID(data.tiebreakers),
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
                <Link class="btn btn-outline-secondary" to={"/admin/ratings"} >Cancelar</Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link class="btn btn-outline-secondary" to={"/ratings"} >Cancelar</Link>
            )
        }
    }

    render() {
        const { Option } = Select;
        const history = createBrowserHistory({ forceRefresh: true });
        return (

            <div class={'Content ' + ActiveMenu.getClassMenu()}>
                <Menu />
                <Header />
                <h1>Editar Avaliação</h1>

                <div class="card card-form form-edit-user" >

                    <div class="form-row justify-content-center">
                        <div class="form-group col-md-4">
                            <label for="inputRatingName">Avaliado</label>
                            <input disabled type="text" class="form-control" id="inputRatingName" placeholder="Nome do Avaliado" value={this.state.campUserName} onChange={(value) => this.setState({ campUserName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-4">
                            <label for="inputRatingEvaluaterName">Avaliador</label>
                            <input disabled type="text" class="form-control" id="inputRatingEvaluaterName" placeholder="Nome do Avaliado" value={this.state.campUserEvaluatorName} onChange={(value) => this.setState({ campUserEvaluatorName: value.target.value })} />
                        </div>

                        <div class="form-group col-md-2">
                            <label for="inputRatingScore">Nota <span class="label-required">*</span></label>
                            <input type="number" min="0" max="100" maxlength="3" class="form-control" id="inputRatingScore" placeholder="Nota" value={this.state.campRatingScore} onChange={(value) => this.setState({ campRatingScore: value.target.value })} />
                        </div>

                        <div class="form-group col-md-2">
                            <label for="inputRatingFinalScore">Nota Final</label>
                            <input disabled type="text" class="form-control" id="inputRatingFinalScore" placeholder="Nota Final" value={this.state.campRatingFinalScore} onChange={(value) => this.setState({ campRatingFinalScore: value.target.value })} />
                        </div>
                    </div>

                    <div class="message-required-form"><span class="label-required">*</span> Campo Obrigatório</div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary" onClick={() => this.sendUpdate()}>Atualizar Dados <Spin size="small" spinning={this.state.loading} /></button>
                        {this.renderCancelButton()}
                    </div>
                </div>
            </div>
        );
    }

    validate(value) {
        if (value >= 0 && value <= 100) {
            return true
        } else {
            return false
        }
    }

    sendUpdate() {

        if (!this.validate(this.state.campRatingScore) || this.state.campRatingScore == '') {
            Swal.fire(
                'Alerta!',
                "O campo Nota está vazio ou não corresponde a um número válido",
                'warning'
            )
        } else {

            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const history = createBrowserHistory({ forceRefresh: true });
            //  get parameter id
            let ratingId = this.props.match.params.id;

            // url de backend
            const url = baseURL + "/rating/edit/" + ratingId

            const datapost = {
                user_id: this.state.campUserId,
                user_evaluator_id: this.state.campUserEvaluatorId,
                rating_score: this.state.campRatingScore,
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
                        'Avaliação Atualizada!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        history.push("/admin/ratings");
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

export default EditRating;