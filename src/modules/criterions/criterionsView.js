//Import React
import React from 'react';
import ActiveMenu from "../../services/setMenu";

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
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faTh } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

const url = baseURL + '/periodsCriterions';
const urlLookUp = baseURL + '/periodsLookUp';

class CriterionsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCriterions: [],
            dataPeriodLookUp: [],
            data_period_id: "",
            data_period_name: "",
            messagePeriodLookUp: '',
            loading: false
        }
    }

    componentDidMount() {
        this.criterionsPeriod();
        this.periodsLookUp();
        ActiveMenu.setActive('.lk-criterion');
    }


    criterionsPeriod() {
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
                        const data = res.data.criterionsByPeriod
                        this.setState({
                            data_period_id: data.id,
                            data_period_name: data.period_name,
                            dataCriterions: data.criterions,
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
                        const data = res.data.criterionsByPeriod
                        this.setState({
                            data_period_id: data.id,
                            data_period_name: data.period_name,
                            dataCriterions: data.criterions,
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

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + ' ...' : str;
    };

    loadFillData() {
        return this.state.dataCriterions.map((data) => {
            return (
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <article class="card-ticket card-criterio fl-left">
                        <section class="date">
                            <time>
                                <span>Critério</span>
                            </time>
                        </section>
                        <section class="card-cont">
                            <small>{this.state.data_period_name}</small>
                            <h3>{data.criterion_name}</h3>
                            <div class="even-date">
                                <time>
                                    <span>{this.truncate(data.criterion_description, 40)}</span>
                                    <span></span>
                                </time>
                            </div>
                        </section>
                    </article>
                </div>
            )
        })
    }

    loadFillDataLookUp() {
        return this.state.dataPeriodLookUp.map((data) => {
            return (
                <option value={data.id} > {data.period_name}</option>
            )
        })
    }

    handleChangePeriod(value) {
        this.setState({ data_period_id: value }, () => {
            this.criterionsPeriod()
        });
    }

    getMessage() {
        if (this.state.dataCriterions.length == 0) {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> Nenhum critério cadastrado para o período!
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
            <div class='Content criterions-view' >
                <Menu />
                <Header />
                <div class="row">
                    <div class="col-md-8">
                        <h1>Critérios de Avaliação</h1>
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



export default CriterionsView;