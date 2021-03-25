import React from 'react';
import ActiveMenu from "../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

//Template
import Header from "../components/header";
import Menu from "../components/menu";

// Donut Chart React
import { Donut } from 'react-donut-component'

//Components
import ChartLine from "../components/chartLine";
import ChartBar from "../components/chartBar";
import ChartArea from "../components/chartArea";
import ChartColumn from "../components/chartColumn";



class Reports extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAverage: "",
            dataLastPeriod: "",
            message: ''
        }
    }

    componentDidMount() {
        this.loadDataAverage();
        ActiveMenu.setActive('.lk-report');
    }

    loadDataAverage() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/report/average/total/' + 0;

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
                    })

                } else {
                    const dataPariodName = res.data.lastPeriodName
                    this.setState({
                        dataLastPeriod: dataPariodName,
                        message: 'Nenhuma média cadastrada neste período.',
                    })

                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    getDonut() {
        if (this.state.dataAverage == '') {
            return (
                <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                </div>
            )
        } else {
            return (
                <Donut
                    styleTrack={{ strokeWidth: 15, stroke: 'AliceBlue' }}
                    styleIndicator={{ stroke: 'rgb(74, 181, 235)' }}>
                    {this.state.dataAverage}
                </Donut>
            )
        }
    }

    render() {

        return (
            <div class='Content'>
                <Menu />
                <Header />
                <div class="row">
                    <div class="col-md-12">
                        <h1>Relatórios</h1>
                    </div>
                </div>
                <div id="reports" class='reports row'>
                    <div class='col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div class='row'>
                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <label>Desempenho por Equipe <span>| {this.state.dataLastPeriod}</span></label>
                                    <ChartBar />
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div class="card donut">
                                    <label>Desempenho Geral <span>| {this.state.dataLastPeriod}</span></label>
                                    {this.getDonut()}
                                </div>
                            </div>
                        </div>
                        <div class='row'>
                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <label>Desempenho por Equipe <span>| Últimos Períodos</span></label>
                                    <ChartLine />
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <label>Desempenho Geral <span>| Últimos Períodos</span></label>
                                    <ChartArea />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div class='row'>
                            <div class='col-md-12'>
                                <div id="spotlight" class="card spotlight">
                                    <label>Usuários Premiados <span>| {this.state.dataLastPeriod}</span></label>
                                    <ChartColumn />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}

export default Reports;