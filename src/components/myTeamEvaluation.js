import React from 'react';
import { Link } from "react-router-dom";
import { createBrowserHistory } from 'history';


//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Spin
import { Spin } from 'antd';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'


//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Jquery
import $ from "jquery"

//Template
import Header from "../components/header";
import Menu from "../components/menu";

const currentUser = localStorage.getItem('USER_KEY');


class MyTeamEvaluation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUserCriterions: [],
            listMyTeam: [],
            listCriterions: [],
            listEvaluated: [],
            listUnratedUsers: [],
            usersAverages: [],
            periodName: "",
            periodId: null,
            message: "",
            success: null,
            finalSize: null,
            loading: false
        }
    }

    componentDidMount() {
        const self = this
        this.loadingMyTeam();
        this.resizeCriterions();
        
        //Calcula Média
        $(document).on('input', '.custom-range', function () {

            $(this).closest('.inputCriterion').find('.display').val(this.value)
            $(this).closest('.inputCriterion').find('.custom-range').val(this.value)
            $(this).closest('.inputCriterion').find('.chart').removeClass().addClass('chart x-' + this.value);
            let values = $(this).closest('ul').find('input')
            let size = values.length - 1
            let soma = 0

            for (let i = 0; i < size; i++) {
                soma += Number($(this).closest('ul').find('input:eq(' + i + ')').val())
            }

            let media = Math.round(soma / size)

            $(this).closest('ul').find('.media').find('.chart').removeClass().addClass('chart x-' + media)
            $(this).closest('ul').find('.media_value').val(media)

        })


        // Click Right
        $(document).on('click', '.arrow_nav_right', function () {
            let sizeChildrens = $(this).closest('.container-criterions').find('li').width();
            let numberChildrens = $(this).closest('.container-criterions').find('li').length;
            let sizeContainer = self.state.finalSize;
            let widthChildrens = numberChildrens * sizeChildrens
            let limit = sizeContainer - widthChildrens

            let current_left = $(this).closest('.container-criterions').find('li:first').css('margin-left');
            let margin_left = parseInt(current_left, 10) - 250 + 'px';

            if (parseInt(margin_left, 10) > (limit - 250)) {
                $(this).closest('.container-criterions').find('li:first').css({ 'margin-left': margin_left, transition: 'margin-left 0.5s ease' })
            }
        });

        // Click Left
        $(document).on('click', '.arrow_nav_left', function () {
            let current_left = $(this).closest('.container-criterions').find('li:first').css('margin-left');
            let margin_left = parseInt(current_left, 10) + 250 + 'px';

            if (parseInt(margin_left, 10) < 150) {
                $(this).closest('.container-criterions').find('li:first').css({ 'margin-left': margin_left, transition: 'margin-left 0.5s ease' })
            }
        });

        // Redimensionameto do Container Criterions
        $(window).resize(function () {
            self.resizeCriterions()
        }); 
       
    }

 

    resizeCriterions() {
        // Calula a largura do container para os critérios
        let size1 = $('.Content').outerWidth()
        let size2 = $('.Menu').outerWidth()

        let finalSize = size1 - size2 - 500;

        this.setState({
            finalSize: finalSize,
        })
    }

    loadingMyTeam() {
        this.setState({ loading: true });

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/evaluation/" + currentUser;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success == 2) {
                    const data = res.data.myTeam
                    const dataCriterion = res.data.criterionsLastPeriod
                    const dataPeriod = res.data.lastPeriodName
                    const dataPeriodId = res.data.lastPeriod

                    this.setState({
                        listMyTeam: data,
                        listCriterions: dataCriterion,
                        periodName: dataPeriod,
                        periodId: dataPeriodId,
                        success: 2,
                        loading: false
                    })

                } else if (res.data.success == 1) {
                    const dataEvaluated = res.data.usersEvaluatedFinal
                    const dataPeriod = res.data.lastPeriodName
                    const dataUnrated = res.data.unratedUsersFinal
                    const dataAverages = res.data.usersAverages

                    this.setState({
                        listMyTeam: null,
                        listCriterions: null,
                        periodName: dataPeriod,
                        listEvaluated: dataEvaluated,
                        listUnratedUsers: dataUnrated,
                        usersAverages: dataAverages,
                        success: 1,
                        loading: false
                    })
                } else {
                    const dataPeriod = res.data.lastPeriodName
                    const message = res.data.message
                    this.setState({
                        listMyTeam: null,
                        listCriterions: null,
                        periodName: dataPeriod,
                        message: message,
                        success: 0,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }
    getCriterions() {
        return this.state.listCriterions.map((data) => {
            return (
                <li>
                    <div class="inputCriterion">
                        <div class='chart x-1'>
                            <input id={'c-' + data.id} disabled type="text" value="0" class="display" />
                        </div>

                        <input type="range" value='0' class="custom-range" min="0" max="100" id={'slider-' + data.id} />
                        <label>{data.criterion_name}</label>
                    </div>
                </li>
            )
        })
    }

    getScoreCriterions(name) {
        return this.state.listEvaluated.map((data) => {
            if (name == data.user.user_name) {
                return (
                    <li>
                        <div class={'chart x-' + data.rating_score}>
                            <span class="final_score">{data.rating_score}<small>%</small></span>
                        </div>
                        <span class="criterion_name">{data.criterions.criterion_name}</span>
                    </li>
                )
            } else {
                return ""
            }
        });
    }
    checkRole(data) {
        if (data !== null) {
            return data.role_name
        } else {
            return 'Sem Função'
        }
    }
    checkPhoto(data) {
        if (data !== null) {
            return data.user_photo
        } else {
            return ''
        }
    }

    loadFillUnratedUsers() {
        let data = this.state.listUnratedUsers
        if (data.length > 0) {
            return data.map((dt) => {
                return (
                    <div class="alert alert-warning" role="alert">
                        <FontAwesomeIcon icon={faExclamationTriangle} size='lg' />
                        <span>Usuário <b>{dt.user_name}</b> não participou desta avaliação.</span>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )
            });
        }
    }
    getScoreAverage(count) {
        let data = this.state.usersAverages
        return data[count]
    }

    loadFillData() {
        if (this.state.success == 0) {
            // Quando não tem dados
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )

        } else if (this.state.success == 1) {
            // Quando a avaliação já foi feita
            let temp = []
            let count = 0
            let countUser = 0

            return this.state.listEvaluated.map((data) => {
                count++

                temp.push(data.user.user_name)

                if (temp[count - 2] !== data.user.user_name) {
                    countUser++
                    return (
                        <div class="card evaluated">
                            <ul class="list_criterions">
                                <li>
                                    <span class="avatar">
                                        <img width='70px' src={data.user.user_photo} />
                                    </span>
                                    <h3 class="user_name">{data.user.user_name}</h3>
                                </li>
                                <li class="container-criterions" style={{ width: this.state.finalSize }} >
                                    <span class="arrow_nav_left">
                                        <FontAwesomeIcon icon={faAngleLeft} size='lg' />
                                    </span>
                                    <span class="arrow_nav_right">
                                        <FontAwesomeIcon icon={faAngleRight} size='lg' />
                                    </span>
                                    {this.getScoreCriterions(data.user.user_name)}
                                </li>
                                <div class="media">
                                    <div class={'chart x-' + this.getScoreAverage(countUser - 1)}>
                                        <span class="final_score">{this.getScoreAverage(countUser - 1)}<small>%</small></span>
                                    </div>
                                    <span class="label_madia">Média</span>
                                </div>
                            </ul>
                        </div>
                    )
                } else {
                    return ''
                }
            });
        } else if (this.state.success == 2) {
            //Quando está tudo ok
            return this.state.listMyTeam.map((data) => {
                return (
                    <li>
                        <ul id={'u-' + data.id} >
                            <li>
                                <div class="container-avatar">
                                    <span class="avatar">
                                        <img width='70px' src={data.user_photo} />
                                    </span>
                                    <span class="user_name">{data.user_name}</span>
                                    <span class="user_role">{this.checkRole(data.roles)}</span>
                                </div>
                            </li>
                            <li class="container-criterions" style={{ width: this.state.finalSize }} >
                                <span class="arrow_nav_left">
                                    <FontAwesomeIcon icon={faAngleLeft} size='lg' />
                                </span>
                                <span class="arrow_nav_right">
                                    <FontAwesomeIcon icon={faAngleRight} size='lg' />
                                </span>
                                {this.getCriterions()}
                            </li>
                            <li class="media">
                                <div class='chart x-1'>
                                    <input disabled id={'m-' + data.id} value="0" type="text" class="media_value" />
                                </div>
                                <label>Média</label>
                            </li>
                        </ul>
                    </li>
                )
            })
        }
    }

    getMessage() {
        if (this.state.success == 1) {
            return (
                <div class="alert alert-success" role="alert">
                    <FontAwesomeIcon icon={faCheckCircle} size='lg' />
                    <strong> As avaliações</strong> desta equipe já foram realizadas neste período
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else {
            return ""
        }
    }

    getButtons() {
        if (this.state.listMyTeam == null) {
            return ""
        } else {
            return (
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary float-right" onClick={() => this.sendSave()}>
                        Concluir Avaliação <Spin size="small" spinning={this.state.loading} />
                </button>
                    <Link class="btn btn-outline-secondary float-right" to={"/leader/dashboard"} >Cancelar</Link>
                </div>
            )
        }
    }

    render() {
        const { sliderValues } = this.state;

        return (
            <div class='Content'>
                <Menu />
                <Header />

                <h1>Avaliação
                    <small> | {this.state.periodName}</small>
                </h1>

                {this.getMessage()}

                <ul class="user-criterions">
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    {this.loadFillData()}
                    {this.loadFillUnratedUsers()}
                </ul>
                <div class="row">
                    {this.getButtons()}
                </div>
            </div>
        );
    }

    checkValidation() {
        let result = true
        let criterions = document.querySelectorAll('[id^="c-"]');
        for (const criterion of criterions.values()) {
            let value_criterion = criterion.value
            if (value_criterion == "" || value_criterion == null || value_criterion == 0) {
                criterion.closest('.inputCriterion').classList.add('required');
                result = false
            } else {
                criterion.closest('.inputCriterion').classList.remove('required');
            }
        }
        console.log(result)
        return result
    }

    sendSave() {
        const history = createBrowserHistory({ forceRefresh: true });
        if (!this.checkValidation()) {
            Swal.fire(
                'Atenção!',
                "Preencha os campos indicados antes de enviar a avaliação",
                'warning'
            )
        } else {

            this.setState({ loading: true });
            const datapost = []
            const periodId = this.state.periodId
            const url = baseURL + "/evaluation/" + periodId;
            const users = document.querySelectorAll('[id^="u-"]');
            const user_evaluator_id = Number(currentUser)

            for (const user of users.values()) {
                let datapostCriterion = []
                let el_user_id = document.getElementById(user.id)
                let criterions = el_user_id.querySelectorAll('[id^="c-"]');
                let average = el_user_id.querySelector('[id^="m-"]');
                let user_id = Number(el_user_id.id.slice(2))
                let average_value = Number(average.value)

                for (const criterion of criterions.values()) {
                    let id_criterion = Number(criterion.id.slice(2))
                    let value_criterion = Number(criterion.value)
                    datapostCriterion.push({ id_criterion, value_criterion });
                }

                datapost.push({ user_id, user_evaluator_id, average_value, datapostCriterion });
            }

            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

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
                            history.push("/ratings");
                        })
                    } else {
                        Swal.fire(
                            'Atenção!',
                            res.data.message,
                            'warning'
                        ).then((result) => {
                            history.push("/ratings");
                        })
                    }
                }).catch(error => {
                    alert("Error 34 " + error)
                })
        }

    }
}

export default MyTeamEvaluation;