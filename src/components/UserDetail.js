import React from 'react';
import { createBrowserHistory } from 'history';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Services
import axios from 'axios';
import { baseURL } from '../services/api';

//Spin
import { Spin } from 'antd';

//Template
import Header from "../components/header";
import Menu from "../components/menu";

//Components
import UserAwards from "../components/userAwards";
import RatingsPeriod from "../components/ratingsPeriod";
import CumulativeAverage from "../components/cumulativeAverage";


class UserDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            userName: "",
            userEmail: "",
            userAddress: "",
            userPhone: "",
            userRole: '',
            userTeam: '',
            loading: false
        }
    }

    componentDidMount() {
        this.loadDataEditUser();
    }

    checkRoleName(data) {
        if (data == null) {
            return null
        } else { return data.role_name }
    }

    checkTeamName(data) {
        if (data == null) {
            return null
        } else { return data.team_name }
    }

    loadDataEditUser() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        let userId = this.props.match.params.userId;
        const url = baseURL + "/users/edit/" + userId

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.users
                    this.setState({
                        dataUser: data,
                        userName: data.user_name,
                        userEmail: data.user_email,
                        userAddress: data.user_address,
                        userPhone: data.user_phone,
                        userRole: this.checkRoleName(data.roles),
                        userTeam: this.checkTeamName(data.teams[0]),
                        userPhoto: data.user_photo,
                        loading: false
                    })
                } else {
                    this.setState({
                        loading: false
                    });
                }
            })
            .catch(error => {
                alert("Error server " + error)
            })
    }

    render() {
        const history = createBrowserHistory({ forceRefresh: true });
        return (
            <div class='Content content-super'>
                <Menu />
                <Header />
                <div id="dashboard" class="row">
                    <div class="col-md-6 col-sm-10 col-10">
                        <h1>Dados do Usuário</h1>
                    </div>
                </div>
                <div class='dashboard row'>
                    <div class='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                        <div class="text-center">
                            <Spin size="large" spinning={this.state.loading} />
                        </div>

                        <div class="card user-detail">
                            <div class='row'>
                                <div class='col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12'>
                                    <div class="block-avatar">
                                        <span class="avatar">
                                            <img width='70px' src={this.state.userPhoto} />
                                        </span>
                                    </div>
                                </div>
                                <div class='col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12'>
                                    <div class="block-info">
                                        <div class='row separator'>
                                            <div class='col-md-12'>
                                                <div class="user_name">
                                                    {this.state.userName}
                                                </div>
                                                <div class="role_name">
                                                    {this.state.userRole}
                                                </div>
                                            </div>
                                        </div>
                                        <div class='row'>
                                            <div class='col-md-4'>
                                                <label>Email</label>
                                                <div>
                                                    {this.state.userEmail}
                                                </div>
                                            </div>
                                            <div class='col-md-4'>
                                                <label>Endereço</label>
                                                <div>
                                                    {this.state.userAddress}
                                                </div>
                                            </div>
                                            <div class='col-md-4'>
                                                <label>Telefone</label>
                                                <div>
                                                    {this.state.userPhone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card user_detail">
                            <RatingsPeriod userId={this.props.match.params.userId} />
                        </div>
                    </div>
                    <div class='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 user_detail'>
                        <div class="card awards">
                            <label>Prêmios Conquistados <span>| Últimos Períodos</span></label>
                            <UserAwards userId={this.props.match.params.userId} />
                        </div>
                        <CumulativeAverage userId={this.props.match.params.userId} />
                    </div>
                </div>
                <button class="btn btn-outline-secondary" onClick={() => history.goBack()}>Voltar</button>
            </div>
        )
    }
}

export default UserDetail;