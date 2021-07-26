'use strict';

import React from 'react';
import {
    HashRouter as Router,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import DistrictSignInSide from './components/DistrictSignInSide';
import LandingPage from './components/landingPage/LandingPage';
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';
import UserService from './services/UserService';
import DashboardView from './views/DashboardView';
import UserVerificationView from './views/UserVerificationView';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'MyKfz',
            routes: [
                {
                    render: (props) => {
                        if (UserService.isAuthenticated()) {
                            return <Redirect to={'/dashboard'} />;
                        } else {
                            return <Redirect to={'/home'} />;
                        }
                    },
                    path: '/',
                    exact: true
                },
                {
                    render: (props) => {
                        if (UserService.isAuthenticated()) {
                            // Check here if district user
                            if (UserService.isVerified()) {
                                return <DashboardView />;
                            } else {
                                // unverified regular user --> needs to verify first
                                return <Redirect to={'/verification'} />;
                            }
                        } else {
                            return <Redirect to={'/login'} />;
                        }
                    },
                    path: '/dashboard',
                    exact: false
                },
                {
                    render: (props) => {
                        if (UserService.isAuthenticated()) {
                            return <UserVerificationView />;
                        } else {
                            return <Redirect to={'/login'} />;
                        }
                    },
                    path: '/verification'
                },

                //{ component: UserLoginView, path: '/login' },
                { component: DistrictSignInSide, path: '/districtLogin' },
                { component: SignInSide, path: '/login' },
                { component: SignUpSide, path: '/register' },
                { component: LandingPage, path: '/home' }
            ]
        };
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        return (
            <Router>
                <Switch>
                    {this.state.routes.map((route, i) => (
                        <Route key={i} {...route} />
                    ))}
                </Switch>
            </Router>
        );
    }
}
