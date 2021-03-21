import React from 'react';
import { Link } from "react-router-dom";

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Spin
import { Spin } from 'antd';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'


//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

//Jquery
import $ from "jquery"

//Template
import Header from "./header";
import Menu from "./menu";

const currentUser = localStorage.getItem('USER_KEY');


class Winners extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tie: false,
            dataFinalistsWinners: [],
            dataListsCriterions: [],
            dataTiebreakLookUp: [],
            dataAwardedUsers: [],
            messageTiebreakLookUp: '',
            valueSelectedTiebreakLookUp: null,
            periodName: "",
            periodId: null,
            user_evaluator: null,
            message: "",
            campTiebreakName: "",
            campTiebreakWeight: "",
            dataSendTie: [],
            noAward: false,
            sizes: [],
            loading: false

        }
    }

    componentDidMount() {
        this.loadingFinalistsWinners();
        this.tiebreakersLookUp();
    }

    tiebreakersLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlTiebreakersLookUp = baseURL + "/tiebreakersLookUp"

        axios.get(urlTiebreakersLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.tiebreakers
                    this.setState({
                        dataTiebreakLookUp: data
                    })

                } else {
                    this.setState({
                        messageTiebreakLookUp: res.data.message
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    getAwardIcon() {
        let icons = ['faAward', 'faTrophy', 'faMedal', 'faCrown', 'faShieldAlt', 'faStar']
        let icon = icons[Math.floor(Math.random() * icons.length)];

        if (icon == 'faAward') {
            return (<FontAwesomeIcon icon={faAward} />)
        } else if (icon == 'faTrophy') {
            return (<FontAwesomeIcon icon={faTrophy} />)
        } else if (icon == 'faMedal') {
            return (<FontAwesomeIcon icon={faMedal} />)
        } else if (icon == 'faCrown') {
            return (<FontAwesomeIcon icon={faCrown} />)
        } else if (icon == 'faShieldAlt') {
            return (<FontAwesomeIcon icon={faShieldAlt} />)
        } else if (icon == 'faStar') {
            return (<FontAwesomeIcon icon={faStar} />)
        }
    }

    checkTie() {
        let result = []
        let data = this.state.dataFinalistsWinners
        let temp = null
        if (data !== null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].criterions.id == temp) {
                    result.push(data[i].criterions.id)
                }
                temp = data[i].criterions.id
            }
        }
        return result
    }

    getTitle() {
        let result = this.checkTie()
        if (result.length !== 0) return "Desempate"
        else return "Premiação"
    }

    getButtons() {
        let data = this.state.dataFinalistsWinners
        let result = this.checkTie()

        if (data == null || this.state.noAward == true) {
            return ""

        } else if (result.length !== 0) {
            return (
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary float-right" onClick={() => this.sendTiebreaker()}>Desempatar</button>
                    <Link class="btn btn-outline-secondary float-right" to={"/leader/dashboard"} >Cancelar</Link>
                </div>
            )
        } else if (this.state.dataAwardedUsers.length > 0) {

            return ""

        } else {
            return (
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary float-right" onClick={() => this.sendAward()}>Premiar</button>
                    <Link class="btn btn-outline-secondary float-right" to={"/leader/dashboard"} >Cancelar</Link>
                </div>
            )
        }
    }
    getEvaluatorId(data) {
        let temp = []
        let result = null
        for (let i = 0; i < data.length; i++) {
            temp[i] = data[i].user_evaluator_id
        }
        result = temp[0]
        return result
    }

    loadingFinalistsWinners() {
        this.setState({ loading: true });

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/finalistsWinners/" + currentUser;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success == 1) {
                    const data = res.data.finalistsWinners
                    const dataUserEvaluator = this.getEvaluatorId(res.data.finalistsWinners)
                    const dataPeriod = res.data.lastPeriod
                    const dataPeriodName = res.data.lastPeriodName
                    const dataCriterions = res.data.criterionsLastPeriod

                    this.setState({
                        dataFinalistsWinners: data,
                        periodName: dataPeriodName,
                        periodId: dataPeriod,
                        dataListsCriterions: dataCriterions,
                        user_evaluator: dataUserEvaluator,
                        loading: false
                    })

                    this.checkSize()
                    this.checkAward()

                } else if (res.data.success == 2) {
                    const data = res.data.awardedUsers
                    const dataPeriodName = res.data.lastPeriodName

                    this.setState({
                        dataAwardedUsers: data,
                        periodName: dataPeriodName,
                        loading: false
                    })

                } else {
                    const message = res.data.message
                    const dataPeriodName = res.data.lastPeriodName
                    this.setState({
                        dataFinalistsWinners: null,
                        periodName: dataPeriodName,
                        message: message,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    getComboTieLookUp(id, id_criterion) {
        const { Option } = Select;
        let result = this.checkTie()

        let check = result.includes(id_criterion)

        if (check)
            return (
                <div>
                    <Select size={'40px'} defaultValue="Adicione Critérios de Desempate" style={{ width: 250 }} >
                        {this.state.dataTiebreakLookUp.map(data => <Option value={data.id} ><span class="value">{data.id}</span>{data.tiebreaker_weight + ' - '}{data.tiebreaker_name} </Option>)}
                    </Select>
                </div>
            )
        else
            return ""
    }
    getTiebreakersName(data) {
        if (data !== null) {
            return (
                <div>
                    <div class="tiebreaker_name"><strong>+ </strong>{data.tiebreaker_name}</div>
                </div>
            )
        } else {
            return ''
        }
    }

    getTiebreakersWeight(data) {
        if (data !== null) {
            return (
                <div class={'chart tie x-' + data.tiebreaker_weight}>
                    <span class="score"><small>+</small>{data.tiebreaker_weight}</span>
                </div>
            )
        } else {
            return ''
        }
    }

    checkPhoto(data) {
        if (data == null) {
            return ''
        } else { return data }
    }
    // Retorna o tamanho de cada bloco em cada agrupamento de usuários
    getWidth(count) {
        if (count == 1) {
            return '100%'
        } else if (count == 2) {
            return '50%'
        } else if (count == 3) {
            return '33.3%'
        } else if (count >= 4) {
            return '25%'
        }
    }
    // Verifica se existem critérios sem associação a prêmios
    checkAward() {
        this.state.dataListsCriterions.map((data) => {
            if (data.awards == null) {
                this.setState({
                    noAward: true
                })
            }
        });
    }

    // Monta um array com os tamanhos de cada grupo de usuários empatados
    checkSize() {
        let result = []
        let temp_criterion = ''
        let count = 0
        this.state.dataFinalistsWinners.map((data) => {

            if (temp_criterion !== data.criterions.criterion_name && temp_criterion !== '') {

                result.push(count)
                count = 0
            }
            count++
            temp_criterion = data.criterions.criterion_name

        });
        result.push(count)
        this.setState({ sizes: result })
    }

    getWinners(criterion, count) {

        return this.state.dataFinalistsWinners.map((data) => {

            if (criterion == data.criterions.criterion_name) {
                return (
                    <div id={"user-" + data.user.id} class="block-user" style={{ width: this.getWidth(this.state.sizes[count]) }}>
                        <div class="avatar">
                            <img width='70px' src={this.checkPhoto(data.user.user_photo)} />
                        </div>
                        <div class={'chart x-' + data.rating_score}>
                            <span class="score">{data.rating_score}<small> %</small></span>
                        </div>
                        {this.getTiebreakersWeight(data.tiebreakers)}
                        <div class="user_name">{data.user.user_name}</div>
                        {this.getTiebreakersName(data.tiebreakers)}
                        {this.getComboTieLookUp(data.user.id, data.criterions.id)}
                    </div>
                )
            } else {
                return ""
            }
        });
    }

    checkAwardId(data) {
        if (data == null) {
            return 'Nenhum Prêmio Associado'
        } else {
            return data.id
        }
    }
    checkAwardName(data) {
        if (data == null) {
            return 'Nenhum Prêmio Associado'
        } else {
            return data.award_name
        }
    }
    loadFillData() {

        if (this.state.dataFinalistsWinners == null) {
            // Se ainda não ocorreu a avaliação
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops! </strong> {this.state.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else if (this.state.noAward == true) {
            // Se não há prêmios associados a critérios
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <h4 class="alert-heading">Critério sem Prêmio Associado!</h4>
                    Associe prêmios a todos os critérios de avaliação antes de realizar a premiação.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )

        } else if (this.state.dataAwardedUsers.length > 0) {
            // Se os usuários já foram premiados - TELA RESULTADO DA PREMIAÇÃO
            return this.state.dataAwardedUsers.map((data) => {
                return (
                    <div class="card awarded">
                        <div class="block-user">
                            <div class="avatar">
                                <img width='90px' src={this.checkPhoto(data.user.user_photo)} />
                            </div>
                            <div class="user_name">{data.user.user_name}</div>
                        </div>
                        <div class="block-score">
                            <div class={'chart tie x-' + data.rating_score}>
                                <span class="score">{data.rating_score}<small> %</small></span>
                            </div>
                            <div>Nota Final</div>
                        </div>
                        <div class="block-rating">
                            <div class="icon"><FontAwesomeIcon icon={faCheck} /></div>
                            <div>Período de Avaliação: <strong>{data.periods.period_name}</strong></div>
                            <div>Critério Avaliado: <strong>{data.criterions.criterion_name}</strong></div>
                            <div>Avaliador: <strong>{data.user_evaluator.user_name}</strong></div>
                        </div>
                        <div class="block-award">
                            <div class="icon">{this.getAwardIcon()}</div>
                            <div>Prêmio Conquistado: <strong>{data.awards.award_name}</strong></div>
                        </div>
                    </div>
                )
            });
        } else {
            // Se os usuários ainda não foram premiados - TELA DE DESEMPATE OU PREMIAÇÃO
            let data = this.state.dataListsCriterions
            let count = 0
            return Object.values(data).map((x) => {
                count++
                return (
                    <div id={"c-" + x.id} class="card block-winners">
                        <div id={"award-" + this.checkAwardId(x.awards)} class="block-award">
                            <div class="icon">{this.getAwardIcon()}</div>
                            <h3>{this.checkAwardName(x.awards)}</h3>
                            <span class="criterion_name">Critério: {x.criterion_name}</span>
                        </div>
                        {this.getWinners(x.criterion_name, count - 1)}
                    </div>
                )
            });
        }

    }

    getMessage() {
        if (this.state.dataAwardedUsers.length > 0) {
            return (
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <FontAwesomeIcon icon={faCheckCircle} size='lg' /> Os usuários já foram premiados neste período de avaliação.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else {
            return ""
        }
    }

    getMessageTieBreak() {
        if (this.state.messageTiebreakLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageTiebreakLookUp}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else {
            return ""
        }
    }

    render() {
        return (
            <div class='Content' >
                <Menu />
                <Header />


                <h1>{this.getTitle()}
                    <small> | {this.state.periodName}</small>
                </h1>

                <div class="text-center">
                    <Spin size="large" spinning={this.state.loading} />
                </div>

                <ul class="finalists-winners">
                    {this.getMessage()}
                    {this.getMessageTieBreak()}
                    {this.loadFillData()}
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
            let temp = []
            let users = criterion.querySelectorAll('[id^="user-"]');
            
            for (const user of users.values()) {
                
                let el_user_id = user.id
                let selection = $('#' + criterion.id).find('#' + el_user_id).find('.ant-select-selection-item').attr('title')

                if(selection == undefined){
                    temp.push(selection)
                }

            }

            if (temp.length == 0) {
                $('#' + criterion.id).find('.block-user').find('.ant-select').addClass('required')
                result = false
            } else {
                $('#' + criterion.id).find('.block-user').find('.ant-select').removeClass('required')
            }
        }
        return result
    }

    sendTiebreaker() {

        if (!this.checkValidation()) {
            Swal.fire(
                'Atenção!',
                "Adicione critérios de desempate aos usuários empatados",
                'warning'
            )
        } else {

            const datapost = []
            const url = baseURL + "/tiebreak/add";

            let criterions = document.querySelectorAll('[id^="c-"]');
            let period_id = this.state.periodId
            let user_evaluator_id = this.state.user_evaluator


            for (let criterion of criterions.values()) {
                let users = criterion.querySelectorAll('[id^="user-"]');

                for (let user of users.values()) {
                    let el_user_id = user.id
                    let selection = $('#' + criterion.id).find('#' + el_user_id).find('.value').html()

                    if (selection !== undefined) {
                        let tiebreak_id = Number(selection)
                        let user_id = Number(el_user_id.slice(5))
                        let criterion_id = Number($(user).closest('.block-winners').attr('id').slice(2))
                        datapost.push({ user_id, criterion_id, tiebreak_id, period_id, user_evaluator_id });
                    }
                }
            }

            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => {
                    if (res.data.success === true) {

                        Swal.fire(
                            'Sucesso!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadingFinalistsWinners()
                        })
                    } else {
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

    sendAward() {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Deseja salvar os usuários premiados?',
            showCancelButton: true,
            confirmButtonText: 'Sim, salvar!',
            cancelButtonText: 'Não, cancelar!'
        }).then((result) => {
            if (result.value) {
                this.sendSaveAward()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Ação Cancelada',
                    'Usuários não foram premiados!',
                    'warning'
                )
            }
        })
    }

    sendSaveAward() {

        const datapost = []
        const url = baseURL + "/award/add"

        let users = document.querySelectorAll('[id^="user-"]');
        let period_id = this.state.periodId
        let user_evaluator_id = this.state.user_evaluator

        for (let user of users.values()) {
            let user_id = Number(user.id.slice(5))
            let criterion_id = Number($(user).closest('.block-winners').attr('id').slice(2))
            let award_id = Number($(user).prev('div').attr('id').slice(6))
            datapost.push({ user_id, criterion_id, period_id, user_evaluator_id, award_id });
        }


        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        axios.put(url, datapost, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success === true) {

                    Swal.fire(
                        'Sucesso!',
                        res.data.message,
                        'success'
                    ).then((result) => {
                        this.loadingFinalistsWinners()
                    })
                } else {
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

export default Winners;