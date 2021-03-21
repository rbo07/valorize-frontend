import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Auth from "../services/auth";
import Dashboard from '../pages/dashboard';
import DashboardLeader from '../pages/dashboardLeader';
import DashboardSuper from '../pages/dashboardSuper';
import Login from '../pages/login';

const history = createBrowserHistory({ forceRefresh: true });
const currentRoleUser = localStorage.getItem('ROLE_KEY');
const currentUser = localStorage.getItem('USER_KEY');

// Rota Privada
const PrivateRoute = ({ component: Component, currentId, team, roles, ...rest }) => (
    <Route

        {...rest}
        render={
            props => {

               // check if authenticated
                if (!Auth.isAuthenticated()) {
                    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                }

                // check if route is restricted by role
                if (roles !== currentRoleUser) {
                    return history.goBack()
                }

                if (isNaN(currentId)) {
                    return <Component {...props} />

                } else if (team !== undefined) {

                    if (!team.includes(currentId)) {
                        return history.goBack({ forceRefresh: true })

                    } else {
                        return <Component {...props} />
                    }

                } else if (currentId !== currentUser) {
                    return history.goBack(history.location.pathname)

                } else {
                    return <Component {...props} />
                }
            }} />
);


export const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/admin/dashboard' component={DashboardSuper} />
            <PrivateRoute exact path='/leader/dashboard' component={DashboardLeader} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
        </Switch>
    </BrowserRouter>
);

export default PrivateRoute