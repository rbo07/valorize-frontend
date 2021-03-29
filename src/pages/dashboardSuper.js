import React from 'react';
import { Link } from "react-router-dom";
import ActiveMenu from "../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Spin
import { Spin } from 'antd';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

// Donut Chart React
import { Donut } from 'react-donut-component'

//Template
import Header from "../components/header";
import Menu from "../components/menu";

//Components
import Ranking from "../components/ranking";
import ListTeam from "../components/listTeam";

class DashboardSuper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAverage: "",
            dataLastPeriod: "",
            message: '',
            messagePeriodLookUp: '',
            dataPeriodLookUp: [],
            temp_period: null,
            loading: false
        }
    }

    componentDidMount() {
        this.loadDataAverage();
        this.periodsLookUp();
        ActiveMenu.setActive('.lk-dashboard');
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

    handleChangePeriod(value) {
        this.setState({ temp_period: value }, () => {
            this.loadDataAverage()
        });
    }

    loadFillDataPeriodLookUp() {
        const { Option } = Select;
        if(this.state.messagePeriodLookUp !== ''){
            return (
                <Option value={0} >{this.state.messagePeriodLookUp}</Option>
            )
        } else {
            return this.state.dataPeriodLookUp.map((data) => {
                return (
                    <Option value={data.id} >{data.period_name}</Option>
                )
            })
        }
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    loadDataAverage() {
        this.setState({ loading: true });
        const idPeriod = this.checkId(this.state.temp_period)

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        const url = baseURL + '/report/average/total/' + idPeriod;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataAverage = res.data.average
                    const dataPariodName = res.data.lastPeriodName

                    this.setState({
                        dataAverage: dataAverage,
                        dataLastPeriod: dataPariodName,
                        loading: false
                    })

                } else {
                    const dataPariodName = res.data.lastPeriodName
                    this.setState({
                        dataAverage: '',
                        message: res.data.message,
                        dataLastPeriod: dataPariodName,
                        loading: false
                    })

                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    getDonut() {
        if (this.state.dataAverage !== '') {
            return (
                <Donut
                    styleTrack={{ strokeWidth: 15, stroke: 'AliceBlue' }}
                    styleIndicator={{ stroke: 'rgb(74, 181, 235)' }}>
                    {this.state.dataAverage}
                </Donut>
            )
        } else {
            return (
                // Caso não retorne dados
                <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                </div>
            )
        }
    }

    render() {
        const { Option } = Select;
        return (
            <div class={'Content content-super ' + ActiveMenu.getClassMenu()}>
                <Menu />
                <Header />
                <div id="dashboard" class="row">
                    <div class="col-md-6 col-sm-12 col-12">
                        <h1>Desempenho Geral</h1>
                    </div>
                    <div class="col-md-6 col-sm-12 col-12 actions text-right">
                        <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} defaultValue="Selecione o Período" style={{ width: 170 }} >
                            <Option value={null} >Selecione o Período</Option>
                            {this.loadFillDataPeriodLookUp()}
                        </Select>
                    </div>
                </div>
                <div class='row'>
                    <ListTeam id={this.state.temp_period} key={this.state.temp_period} />
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                        <div class="card average-dashboard">
                            <label>Desempenho Geral <span>| {this.state.dataLastPeriod}</span></label>
                            <Spin size="large" spinning={this.state.loading} />
                            {this.getDonut()}
                            <Link class="btn btn-link" to={"/admin/reports/"} >Ver Relatório</Link>
                        </div>
                        <div class="card">
                            <Ranking id={this.state.temp_period} key={this.state.temp_period} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardSuper;