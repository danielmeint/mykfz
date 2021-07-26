'use strict';

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Dashboard from '../components/Dashboard';
import DistrictDashboard from '../components/DistrictDashboard';
import UserService from '../services/UserService';
import LoadingView from './LoadingView';

function DashboardView() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            let userResult = await UserService.getUserDetails();
            setUser(userResult);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingView />;
    }

    if (user.isDistrictUser) {
        console.log(`logged in as district user`);
        return <DistrictDashboard />;
    }
    console.log(`logged in as regular user`);

    return <Dashboard />;
}

export default withRouter(DashboardView);
