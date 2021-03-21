//Import React
import React from 'react';
import { Link } from "react-router-dom";

import { baseURL } from '../services/api';
//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Spin
import { Spin } from 'antd';

//Rate Ant Design
import { Rate } from 'antd';
import 'antd/dist/antd.css';

//import Axios
import axios from 'axios';

class ListTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTeam: [],
            dataRating: [],
            loading: false,
            message: ''
        }
    }

    componentDidMount() {
        this.listTeam();
    }

    checkLeader(data) {
        if (data == null) return 'Equipe sem Líder'
        else return data.user_name
    }

    checkLink(data) {
        if (data == null) return '/admin/dashboard'
        else return "/admin/team/" + data.id
    }

    checkLeaderPhoto(data) {
        if (data == null) return ''
        else return data.user_photo
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    listTeam() {
        this.setState({ loading: true });
        const idPeriod = this.checkId(this.props.id)
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        const url = baseURL + '/teamsleader/' + idPeriod;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.teams

                    this.setState({
                        dataTeam: data,
                        dataRating: res.data.averagesTeamsPeriod,
                        loading: false
                    })

                } else {
                    this.setState({
                        dataTeam: null,
                        dataRating: null,
                        loading: false,
                        message: res.data.message
                    });

                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    getRating(data) {

        if (data !== null) {

            if (data >= 80) {
                return <Rate disabled defaultValue={5} />

            } else if (data >= 60) {
                return <Rate disabled defaultValue={4} />

            } else if (data >= 40) {
                return <Rate disabled defaultValue={3} />

            } else if (data >= 20) {
                return <Rate disabled defaultValue={2} />

            } else if (data > 0) {
                return <Rate disabled defaultValue={1} />

            } else if (data == 0) {
                return <Rate disabled defaultValue={0} />
            }
        } else {
            return <Rate disabled defaultValue={0} />
        }
    }

    loadFillData() {

        if (this.state.dataTeam == null) {

            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )

        } else {

            let cont = 0

            return this.state.dataTeam.map((data) => {
                cont++
                return (
                    <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                        <Link class="card card-link" to={this.checkLink(data.leader)} >
                            <div className="row">
                                <div class="col-xl-3 col-lg-2 col-md-2 col-sm-3 col-4">
                                    <span class="avatar">
                                        <img width='70px' src={this.checkLeaderPhoto(data.leader)} />
                                    </span>
                                </div>
                                <div class="col-xl-9 col-lg-10 col-md-10 col-sm-9 col-8">
                                    <div class="team-name">{data.team_name}</div>
                                    <div class="leader-name">{this.checkLeader(data.leader)}</div>
                                    {this.getRating(this.state.dataRating[cont - 1])}
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
            <div className="teams col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                <div class="row">
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    {this.loadFillData()}
                </div>
            </div>
        );
    }
}



export default ListTeam;