import React from 'react';
import ActiveMenu from "../services/setMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Template
import Header from "../components/header";
import Menu from "../components/menu";

//Components
import RatingsPeriod from "../components/ratingsPeriod";
import RatingsPeriods from "../components/ratingsPeriods";
import CumulativeAverage from "../components/cumulativeAverage";
import UserAwards from "../components/userAwards";
import Ranking from "../components/ranking";

class Dashboard extends React.Component {

    componentDidMount() {
        ActiveMenu.setActive('.lk-dashboard');
    }

    render() {

        return (
            <div class='Content'>
                <Menu />
                <Header />
                <div id="dashboard" class="row">
                    <div class="col-md-12">
                        <h1>Meu Desempenho</h1>
                    </div>
                </div>
                <div class='dashboard row'>
                    <div class='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                        <div class="card">
                            <RatingsPeriod />
                        </div>
                        <div class="row">
                            <div class='col-md-6'>
                                <div class="card">
                                    <label>Meu Desempenho <span>| por Período</span></label>
                                    <RatingsPeriods />
                                </div>
                            </div>
                            <div class='col-md-6'>
                                <div class="card awards">
                                    <label>Prêmios Conquistados <span>| Todos os Períodos</span></label>
                                    <UserAwards />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12'>
                        <CumulativeAverage />
                        <div class="card ranking">
                            <Ranking />
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

export default Dashboard;