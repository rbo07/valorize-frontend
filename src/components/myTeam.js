import React from 'react';
import { Link } from "react-router-dom";

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

//Rate Ant Design
import { Rate } from 'antd';
import 'antd/dist/antd.css';

//Spin
import { Spin } from 'antd';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const currentUser = localStorage.getItem('USER_KEY');


class MyTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listMyTeam: [],
            team_name: '',
            leader_name: '',
            message: "",
            loading: false
        }
    }


    componentDidMount() {
        this.loadingMyTeam();
    }

    checkRoleName(data) {
        if (data == null) {
            return 'Sem função cadastrada'
        } else { return data.role_name }
    }

    checkPhoto(data) {
        if (data == null) {
            return ''
        } else { return data.user_photo }
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    checkUrl(leaderId, currentUser) {
        if (leaderId == 0) {
            return currentUser
        } else {
            return leaderId
        }
    }

    loadingMyTeam() {
        this.setState({ loading: true });

        const leaderId = this.checkId(this.props.leaderId)
        const idPeriod = this.checkId(this.props.id)

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/usersRolesTeam/" + this.checkUrl(leaderId, currentUser) + ':' + idPeriod;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.myTeam
                    this.setState({
                        listMyTeam: data,
                        team_name: res.data.teamName,
                        leader_name: res.data.userName,
                        loading: false
                    })
                    this.props.setName(this.state.team_name, this.state.leader_name);

                } else {
                    const message = res.data.message
                    this.setState({
                        listMyTeam: null,
                        message: message,
                        loading: false
                    })
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                alert('Error server ' + error)
            })
    }

    getRating(data) {
        if (data !== null) {
            let score = data.average
            if (score >= 80) {
                return <Rate disabled defaultValue={5} />

            } else if (score >= 60) {
                return <Rate disabled defaultValue={4} />

            } else if (score >= 40) {
                return <Rate disabled defaultValue={3} />

            } else if (score >= 20) {
                return <Rate disabled defaultValue={2} />

            } else if (score > 0) {
                return <Rate disabled defaultValue={1} />

            } else if (score == 0) {
                return <Rate disabled defaultValue={0} />
                
            }
        } else {
            return <Rate disabled defaultValue={0} />
        }
    }


    getPath() {
        let path = ''
        let role = localStorage.getItem('ROLE_KEY')
        localStorage.getItem('TOKEN_KEY')
        if (role == 1) {
            return path = '/admin/user/'
        } else if (role == 2) {
            return path = '/leader/user/'
        }
    }
    loadFillData() {
        const path = this.getPath()
        if ((this.state.listMyTeam == null || this.state.listMyTeam == '') && this.state.loading == false) {
            return (
                <div class="col-md-12">
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Ops!</strong> {this.state.message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            )
        } else {
            return this.state.listMyTeam.map((data) => {
                return (
                    <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                        <Link class="card card-link" to={path + data.user.id} >
                            <div className="row">
                                <div class="col-xl-3 col-lg-2 col-md-2 col-sm-3 col-4">
                                    <span class="avatar">
                                        <img width='70px' src={this.checkPhoto(data.user)} />
                                    </span>
                                </div>
                                <div class="col-xl-9 col-lg-10 col-md-10 col-sm-9 col-8">
                                    <div class="user-name">{data.user.user_name}</div>
                                    <div class="role-name">{this.checkRoleName(data.user.roles)}</div>
                                    <div class="rating">{this.getRating(data.average)}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            })
        }
    }

    render() {
        return (
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                <div class="row users">
                    <Spin size="large" spinning={this.state.loading} />
                    {this.loadFillData()}
                </div>
            </div>
        );
    }

}

export default MyTeam;