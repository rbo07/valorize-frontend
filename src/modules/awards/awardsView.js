//Import React
import React from 'react';

import { baseURL } from '../../services/api';

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';

//Spin
import { Spin } from 'antd';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'


//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

const url = baseURL + '/periodsAwards';
const urlLookUp = baseURL + '/periodsLookUp';

class AwardsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAwards: [],
            dataPeriodLookUp: [],
            data_period_id: null,
            data_period_name: "",
            messagePeriodLookUp: '',
            loading: false
        }
    }

    componentDidMount() {
        this.awardsPeriod();
        this.periodsLookUp();
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + ' ...' : str;
    };

    awardsPeriod() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        let id = this.state.data_period_id;

        if (id == null || id == undefined) {
            // chama a rota que tras o último período
            axios.get(url, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => {
                    if (res.data.success) {
                        const data = res.data.awardsByPeriod
                        this.setState({
                            data_period_id: data.id,
                            data_period_name: data.period_name,
                            dataAwards: data.awards,
                            loading: false
                        })

                    } else {
                        this.setState({
                            messagePeriodLookUp: res.data.message,
                            loading: false
                        })
                    }
                })
                .catch(error => {
                    alert('Error server ' + error)
                })
        } else {
            this.setState({ loading: true });
            // chama a rota que tras o período com ID específico
            axios.get(url + '/' + id, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => {
                    if (res.data.success) {
                        const data = res.data.awardsByPeriod
                        this.setState({
                            data_period_id: data.id,
                            data_period_name: data.period_name,
                            dataAwards: data.awards,
                            loading: false
                        })

                    } else {
                        this.setState({
                            messagePeriodLookUp: res.data.message,
                            loading: false
                        })
                    }
                })
                .catch(error => {
                    alert('Error server ' + error)
                })
        }
    }

    periodsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

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

    loadFillData() {
        return this.state.dataAwards.map((data) => {
            return (
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <article class="card-ticket fl-left">
                        <section class="date">
                            <time>
                                <span>Prêmio</span>
                            </time>
                        </section>
                        <section class="card-cont">
                            <small>{this.state.data_period_name}</small>
                            <h3>{data.award_name}</h3>
                            <div class="even-date">
                                <time>
                                    <span>{this.truncate(data.award_description, 40)}</span>
                                    <span></span>
                                </time>
                            </div>
                        </section>
                    </article>
                </div>
            )
        })
    }

    handleChangePeriod(value) {
        this.setState({ data_period_id: value }, () => {
            this.awardsPeriod()
        });
    }

    getMessage() {
        if (this.state.dataAwards.length == 0) {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> Nenhum prêmio cadastrado para o período!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
        else if (this.state.messagePeriodLookUp !== '') {
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

    render() {
        const { Option } = Select;
        return (
            <div class='Content awards-view' >
                <Menu />
                <Header />
                <div class="row">
                    <div class="col-md-8">
                        <h1>Prêmios</h1>
                    </div>
                    <div class="col-md-4 actions text-right">
                        <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} value={this.state.data_period_id} style={{ width: 170 }} placeholder="Selecione o Período" >
                            {this.state.dataPeriodLookUp.map(data => <Option value={data.id} key={data.id}>{data.period_name}</Option>)}
                        </Select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        {this.getMessage()}
                        <div class="row">
                            <div class="text-center">
                                <Spin size="large" spinning={this.state.loading} />
                            </div>
                            {this.loadFillData()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default AwardsView;