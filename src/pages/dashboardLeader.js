import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

//Template
import Header from "../components/header";
import Menu from "../components/menu";

//Components
import Ranking from "../components/ranking";
import MyTeam from "../components//myTeam";
import CumulativeAverageTeam from "../components/cumulativeAverageTeam";

class DashboardLeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPeriodLookUp: [],
            temp_period: null,
            messagePeriodLookUp: '',
            loading: false
        };
    }

    handleLanguage = (team_name, leader_name) => {

        this.setState({
            team_name: team_name,
            leader_name: leader_name
        });
    }

    componentDidMount() {
        this.periodsLookUp();
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
        this.setState({ 
            temp_period: value 
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

    render() {
        const { Option } = Select;
        return (
            <div class='Content'>
                <Menu />
                <Header />
                <div id="dashboard" class="row">
                    <div class="col-md-6 col-sm-12 col-12">
                        <h1>Minha Equipe</h1>
                    </div>
                    <div class="col-md-6 col-sm-12 col-12 actions text-right">
                        <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} defaultValue="Selecione o Período" style={{ width: 170 }} >
                            <Option value={null} >Selecione o Período</Option>
                            {this.loadFillDataPeriodLookUp()}
                        </Select>
                    </div>
                </div>
                <div class='content-myteam'>
                    <div class='row'>
                        <MyTeam id={this.state.temp_period} key={this.state.temp_period} setName={this.handleLanguage} />
                        <div class='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12'>
                            <CumulativeAverageTeam id={this.state.temp_period} key={this.state.temp_period} />
                            <div class="card">
                                <Ranking id={this.state.temp_period} key={this.state.temp_period}  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardLeader;