'use strict';

import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import VehicleService from '../services/VehicleService';
import VehicleListPaper from './VehicleListPaper';

function VehicleList({ user }) {
    const [loading, setLoading] = useState(true);
    const [hasChanged, setHasChanged] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let vehiclesResult = await VehicleService.getVehiclesForUser(
                user._id
            );
            setVehicles(vehiclesResult);
            setLoading(false);
            setHasChanged(false);
        };

        fetchData();
    }, [hasChanged]);

    const onChange = () => {
        setHasChanged(true);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!vehicles || vehicles.length == 0) {
        return (
            <Grid justify="center" container alignItems="center" spacing={3}>
                <Grid item xs={6}>
                    <Alert severity="info">
                        <AlertTitle>No Vehicles</AlertTitle>
                        Try adding a new vehicle on the side bar.
                    </Alert>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid
            justify="flex-start"
            container
            direction="row"
            alignItems="flex-start"
            spacing={3}
        >
            {vehicles.map((vehicle, i) => (
                <VehicleListPaper
                    onChange={onChange}
                    key={vehicle._id}
                    vehicle={vehicle}
                />
            ))}
        </Grid>
    );
}

export default withRouter(VehicleList);
