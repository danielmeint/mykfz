'use strict';

import {
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alert, AlertTitle } from '@material-ui/lab';
import React from 'react';
import { withRouter } from 'react-router-dom';
import LicensePlateService from '../services/LicensePlateService';
import UserService from '../services/UserService';
import LicensePlate from './LicensePlate';

const makeLogos = require('../../resources/carLogos');

class LicensePlateReservationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            user: {},
            licensePlates: [],
            licensePlateReservations: [],
            reservedPlates: []
        };
        this.handleDeleteLicensePlateReservation =
            this.handleDeleteLicensePlateReservation.bind(this);
        this.fetchPlates = this.fetchPlates.bind(this);
    }

    componentWillMount(props) {
        this.fetchPlates();
    }

    fetchPlates() {
        (async () => {
            // this.setState({ loading: true });
            let reservedPlates = [];
            const user = await UserService.getUserDetails();
            this.setState({ user: user });
            await Promise.all(
                user.licensePlateReservations.map(
                    async (licensePlateReservation) => {
                        const licensePlate =
                            await LicensePlateService.getLicensePlate(
                                licensePlateReservation.licensePlate
                            );
                        reservedPlates.push({
                            info: licensePlate,
                            reservation: licensePlateReservation
                        });
                    }
                )
            );
            return reservedPlates;
        })().then((reservedPlates) => {
            this.setState({
                reservedPlates: reservedPlates,
                loading: false
            });
        });
    }

    formatDate(expiryDate) {
        return new Date(Date.parse(expiryDate)).toLocaleString('de-DE', {
            timeZone: 'Europe/Andorra'
        });
    }

    getDaysLeft(expiryDate) {
        let currently = new Date();
        let difference = new Date(expiryDate).getTime() - currently;
        let daysLeft = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (daysLeft < 0) {
            return 'EXPIRED';
        } else {
            return daysLeft;
        }
    }

    handleDeleteLicensePlateReservation(plateReservationId, plateId) {
        (async () => {
            try {
                let user = await UserService.deleteLicensePlateReservation(
                    this.state.user._id,
                    plateReservationId
                );
                this.fetchPlates();
            } catch (err) {
                console.error(err);
            }
        })();
    }

    render() {
        if (this.state.loading) {
            return <CircularProgress />;
        }

        if (
            !this.state.reservedPlates ||
            this.state.reservedPlates.length == 0
        ) {
            return (
                <Grid
                    justify="center"
                    container
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs={6}>
                        <Alert severity="info">
                            <AlertTitle>No License Plates</AlertTitle>
                            Try reserving a new license plate on the side bar.
                        </Alert>
                    </Grid>
                </Grid>
            );
        }

        return (
            //this.state.reservedPlates.length > 0 ?
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">Days Left</TableCell>
                            <TableCell align="center">Expires</TableCell>
                            <TableCell align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.reservedPlates.map((licensePlate) => (
                            <TableRow
                                key={licensePlate._id}
                                style={
                                    this.getDaysLeft(
                                        licensePlate.reservation.expiryDate
                                    ) == 'EXPIRED'
                                        ? { backgroundColor: 'lightsalmon' }
                                        : {}
                                }
                            >
                                <TableCell align="left">
                                    <LicensePlate
                                        key={licensePlate._id}
                                        licensePlate={licensePlate.info}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {this.getDaysLeft(
                                        licensePlate.reservation.expiryDate
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {this.formatDate(
                                        licensePlate.reservation.expiryDate
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() =>
                                            this.handleDeleteLicensePlateReservation(
                                                licensePlate.reservation._id,
                                                licensePlate.info._id
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <caption style={{ textAlign: 'center' }}>
                        You can use your license plates as part of your vehicle
                        registration. Expired license plate reservations are highlighted
                        in red.
                    </caption>
                </Table>
            </TableContainer>
        );
        // : (
        //     <div>No plate reservations</div>
        // )}
        //);
    }
}

export default withRouter(LicensePlateReservationList);
