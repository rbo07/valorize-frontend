import React from 'react';
import { Link } from "react-router-dom";
import ActiveMenu from "../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Template
import Header from "../components/header";
import Menu from "../components/menu";

//Components
import MyTeam from "../components//myTeam";
import Ranking from "../components/ranking";
import CumulativeAverageTeam from "../components/cumulativeAverageTeam";

class TeamDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            team_name: '',
            leader_name: '',
            loading: false
        }
    }

    componentDidMount() {
        ActiveMenu.setActive('.lk-dashboard');
    }


    handleLanguage = (team_name, leader_name) => {

        this.setState({
            team_name: team_name,
            leader_name: leader_name
        });
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }
    getLeader() {
        if(this.state.leader_name !== ''){
            return (
                <small class="title-leader-detail">
                    Líder:  {this.state.leader_name}
                </small>
            )
        }
    }

    render() {
        return (
            <div class={'Content content-super ' + ActiveMenu.getClassMenu()}>
                <Menu />
                <Header />
                <div id="dashboard" class="row">
                    <div class="col-md-6 col-sm-12 col-12">
                        <h1 class="title-header-detail">{this.state.team_name}</h1>
                        {this.getLeader()}
                    </div>
                    <div class="col-md-6 actions text-right">
                        <Link class="btn btn-outline-secondary" to={"/admin/dashboard"} >Voltar</Link>
                    </div>
                </div>
                <div class='row'>
                    <MyTeam id={this.state.temp_period} leaderId={this.props.match.params.leaderId} key={this.state.temp_period} setName={this.handleLanguage} />
                    <div class='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12'>
                        <CumulativeAverageTeam id={this.state.temp_period} leaderId={this.props.match.params.leaderId} key={this.state.temp_period} />
                        <div class="card">
                            <Ranking id={this.state.temp_period} leaderId={this.props.match.params.leaderId} key={this.state.temp_period} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TeamDetail;