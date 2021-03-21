//React
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

//Services
import history from './services/history';
import PrivateRoute from './components/routes';

//Styles & Js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './assets/css/valorize.css';
import './assets/css/donut.css';
import './assets/css/responsive.css';

//Pages
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import DashboardLeader from './pages/dashboardLeader';
import DashboardSuper from './pages/dashboardSuper';
import Register from './pages/register';

// Evaluation
import MyTeamEvaluation from './components/myTeamEvaluation';

// FinalistsWinners
import Winners from './components/winners';

// Reports
import Reports from './components/reports';

///// MODULES

// Users
import ListUser from './modules/users/listUser';
import EditUser from './modules/users/editUser';
import AddUser from './modules/users/addUser';
import UpdateUser from './modules/users/updateUser';

// Roles
import ListRole from './modules/roles/listRole';
import EditRole from './modules/roles/editRole';

// Teams
import ListTeam from './modules/teams/listTeam';
import EditTeam from './modules/teams/editTeam';

// Periods
import ListPeriod from './modules/periods/listPeriod';
import EditPeriod from './modules/periods/editPeriod';

// Awards
import AwardsView from './modules/awards/awardsView';
import ListAward from './modules/awards/listAward';
import EditAward from './modules/awards/editAward';

// Criterions
import CriterionsView from './modules/criterions/criterionsView';
import ListCriterion from './modules/criterions/listCriterion';
import EditCriterion from './modules/criterions/editCriterion';

// Tiebreakers
import ListTiebreaker from './modules/tiebreakers/listTiebreaker';
import EditTiebreaker from './modules/tiebreakers/editTiebreaker';

// Ratings
import ListRatings from './modules/ratings/listRating';
import EditRating from './modules/ratings/editRating';

// Team Detail
import TeamDetail from './components/TeamDetail';

// User Detail
import UserDetail from './components/UserDetail';


// Pega o ID da URL
function getPathId() {
  let location = history.location.pathname
  let result = location.substring(location.lastIndexOf("/") + 1);
  return result
}

function App() {

  const teamLeader = localStorage.getItem('TEAM_KEY');
  const id = getPathId();

  function checkNull(data) {
    if (data !== null) {
      return data.split(',')
    }
  }

  const users = checkNull(teamLeader)

  return (

    <div class='page-wrapper'>
      <Router history={history}>

        <Switch>
          <Redirect exact from="/" to="/dashboard" />
        </Switch>

        {/* Pages */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" exact component={Register} />

        {/* Pages Details */}
        <PrivateRoute exact path="/admin/team/:leaderId" roles="1" exact component={TeamDetail} />
        <PrivateRoute exact path="/admin/user/:userId" roles="1" exact component={UserDetail} />
        <PrivateRoute exact path="/leader/user/:userId" roles="2" exact component={UserDetail} />

        {/* Dashboarders */}
        <PrivateRoute exact roles="1" exact path="/admin/dashboard" component={DashboardSuper} />
        <PrivateRoute exact roles="2" exact path="/leader/dashboard" component={DashboardLeader} />
        <PrivateRoute exact roles="3" exact path="/dashboard" component={Dashboard} />

        {/* Users */}
        <PrivateRoute exact roles="1" path="/admin/users" component={ListUser} />
        <PrivateRoute exact roles="1" path="/admin/users/add" component={AddUser} />
        <PrivateRoute exact roles="1" path="/admin/users/edit/:id" component={EditUser} />
        <PrivateRoute exact roles="2" path="/users" component={ListUser} />
        <PrivateRoute exact currentId={id} team={users} roles="2" path="/users/edit/:id" component={EditUser} />
        <PrivateRoute exact currentId={id} roles="1" path="/admin/update/:id" component={UpdateUser} />
        <PrivateRoute exact currentId={id} roles="2" path="/leader/update/:id" component={UpdateUser} />
        <PrivateRoute exact currentId={id} roles="3" path="/update/:id" component={UpdateUser} />

        {/* Roles */}
        <PrivateRoute exact roles="1" path="/admin/roles" component={ListRole} />
        <PrivateRoute exact roles="1" path="/admin/roles/edit/:id" component={EditRole} />

        {/* Teams */}
        <PrivateRoute exact roles="1" path="/admin/teams" component={ListTeam} />
        <PrivateRoute exact roles="1" path="/admin/teams/edit/:id" component={EditTeam} />

        {/* Periods */}
        <PrivateRoute exact roles="1" path="/admin/periods" component={ListPeriod} />
        <PrivateRoute exact roles="1" path="/admin/periods/edit/:id" component={EditPeriod} />
        {/* <PrivateRoute exact roles="2" path="/periods" component={ListPeriod} />
        <PrivateRoute exact roles="2" path="/periods/edit/:id" component={EditPeriod} /> */}

        {/* Criterions */}
        <PrivateRoute exact roles="1" path="/admin/criterions" component={ListCriterion} />
        <PrivateRoute exact roles="1" path="/admin/criterions/edit/:id" component={EditCriterion} />
        {/* <PrivateRoute exact roles="2" path="/criterions" component={ListCriterion} />
        <PrivateRoute exact roles="2" path="/criterions/edit/:id" component={EditCriterion} /> */}
        <PrivateRoute exact roles="3" path="/criterions/view" component={CriterionsView} />

        {/* Awards */}
        <PrivateRoute exact roles="1" path="/admin/awards" component={ListAward} />
        <PrivateRoute exact roles="1" path="/admin/awards/edit/:id" component={EditAward} />
        {/* <PrivateRoute exact roles="2" path="/awards" component={ListAward} />
        <PrivateRoute exact roles="2" path="/awards/edit/:id" component={EditAward} /> */}
        <PrivateRoute exact roles="3" path="/awards/view" component={AwardsView} />

        {/* Tiebreakers */}
        <PrivateRoute exact roles="1" path="/admin/tiebreakers" component={ListTiebreaker} />
        <PrivateRoute exact roles="1" path="/admin/tiebreakers/edit/:id" component={EditTiebreaker} />
        {/* <PrivateRoute exact roles="2" path="/tiebreakers" component={ListTiebreaker} />
        <PrivateRoute exact roles="2" path="/tiebreakers/edit/:id" component={EditTiebreaker} /> */}

        {/* Ratings */}
        <PrivateRoute exact roles="1" path="/admin/ratings" component={ListRatings} />
        <PrivateRoute exact roles="1" path="/admin/ratings/edit/:id" component={EditRating} />
        <PrivateRoute exact roles="2" path="/ratings" component={ListRatings} />
        <PrivateRoute exact currentId={id} team={users} roles="2" path="/ratings/edit/:id" component={EditRating} />

        {/* Evaluation */}
        <PrivateRoute exact roles="2" path="/evaluation" component={MyTeamEvaluation} />

        {/* Winners */}
        <PrivateRoute exact roles="2" path="/winners" component={Winners} />

        {/* Reports */}
        <PrivateRoute exact roles="1" path="/admin/reports" component={Reports} />



      </Router>
    </div>
  );
}

export default App;