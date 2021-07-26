'use strict';

import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Grid,
    IconButton,
    Tooltip
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PrintIcon from '@material-ui/icons/Print';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import LicensePlateService from '../services/LicensePlateService';
import ProcessService from '../services/ProcessService';
import VehicleService from '../services/VehicleService';
import LicensePlate from './LicensePlate';
import VehicleEditDialog from './VehicleEditDialog';

const makeLogos = require('../../resources/carLogos');

const styles = (theme) => ({
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        willChange: 'transform, box-shadow, z-index'
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    }
});

class VehicleListPaper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            licensePlate: {
                areaCode: '  ',
                digits: '  ',
                letters: '  '
            },
            expanded: false,
            editOpen: false
        };
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.createPdfAndDownload = this.createPdfAndDownload.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount(props) {
        (async () => {
            try {
                if (this.props.vehicle.licensePlate) {
                    let licensePlate =
                        await LicensePlateService.getLicensePlate(
                            this.props.vehicle.licensePlate
                        );
                    this.setState({
                        licensePlate: licensePlate
                    });
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }

    handleExpandClick() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    createPdfAndDownload(processId) {
        (async () => {
            try {
                await ProcessService.generateProcessStatusPDF(
                    this.props.vehicle._id,
                    processId
                );
            } catch (err) {
                console.error(err);
            }
        })();
    }

    handleEditOpen() {
        this.setState({ editOpen: true });
    }

    handleEditClose() {
        this.setState({ editOpen: false });
        this.props.onChange();
    }

    async handleDelete() {
        await VehicleService.deleteVehicle(this.props.vehicle._id);
        this.props.onChange();
    }

    hasPendingProcesses(vehicle) {
        return vehicle.processes.some((p) => p.state == 'PENDING');
    }

    hasValidGeneralInspection(vehicle) {
        return (
            vehicle.generalInspectionYear &&
            vehicle.generalInspectionYear &&
            (vehicle.generalInspectionYear > new Date().getFullYear() || // größeres Jahr
                (vehicle.generalInspectionYear == new Date().getFullYear() &&
                    vehicle.generalInspectionMonth >= new Date().getMonth())) // gleiches Jahr und minestens gleicher Monat
        );
    }

    render() {
        const { classes, vehicle } = this.props;
        const cardContent =
            vehicle.state == 'REGISTERED' ? (
                <LicensePlate
                    vehicleState={vehicle.state}
                    licensePlate={this.state.licensePlate}
                />
            ) : (
                <LicensePlate vehicleState={vehicle.state} />
            );

        const state_colors = {
            PENDING: 'yellow',
            ACCEPTED: '#7ac142',
            REJECTED: 'lightsalmon'
        };

        const canDelete = () => {
            const vehicle = this.props.vehicle;
            if (
                this.hasPendingProcesses(vehicle) ||
                vehicle.state == 'REGISTERED'
            ) {
                return false;
            }
            return true;
        };

        const deregisterButton = (
            <Button
                style={{ marginLeft: 'auto' }}
                variant="contained"
                component={Link}
                to={`/dashboard/vehicles/${this.props.vehicle._id}/deregister`}
            >
                Deregister
            </Button>
        );

        const registerButton = (
            <Button
                style={{ marginLeft: 'auto' }}
                variant="contained"
                component={Link}
                to={`/dashboard/vehicles/${this.props.vehicle._id}/register`}
            >
                Register
            </Button>
        );

        const giInvalidButton = (
            <Button
                style={{ marginLeft: 'auto' }}
                variant="contained"
                disabled={true}
            >
                General Inspection Invalid
            </Button>
        );

        const processPendingButton = (
            <Button
                style={{ marginLeft: 'auto' }}
                variant="contained"
                disabled={true}
            >
                Process Pending
            </Button>
        );

        const processButton = this.hasPendingProcesses(vehicle)
            ? processPendingButton
            : vehicle.state == 'REGISTERED'
            ? deregisterButton
            : this.hasValidGeneralInspection(vehicle)
            ? registerButton
            : giInvalidButton;

        return (
            <Grid item xs={12} sm={6} md={6}>
                <Card
                    style={{
                        display: 'flex',
                        justiyContent: 'space-between',
                        flexDirection: 'column'
                    }}
                >
                    <CardHeader
                        avatar={
                            makeLogos[vehicle.make] ? (
                                <Avatar
                                    // variant="square"
                                    imgProps={{
                                        style: { objectFit: 'contain' }
                                    }}
                                    // style={{ '> *': { objectFit: 'contain' } }}
                                    aria-label="make"
                                    src={makeLogos[vehicle.make]}
                                />
                            ) : (
                                <Avatar
                                    // variant="square"
                                    aria-label="make"
                                >
                                    <DirectionsCarIcon />
                                </Avatar>
                            )
                        }
                        action={
                            <Tooltip
                                title={
                                    canDelete()
                                        ? 'Delete Vehicle'
                                        : 'Registered vehicles and vehicles with active processes cannot be deleted!'
                                }
                            >
                                <span>
                                    <IconButton
                                        disabled={!canDelete()}
                                        onClick={this.handleDelete}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        }
                        title={vehicle.make + ' ' + vehicle.model}
                        subheader={vehicle.vin}
                    />
                    <VehicleEditDialog
                        vehicle={vehicle}
                        open={this.state.editOpen}
                        handleClose={this.handleEditClose}
                    />
                    <CardContent
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        {cardContent}
                        <Chip
                            style={{
                                marginTop: '1em',
                                width: '200px',
                                justifyContent: 'space-between'
                            }}
                            color={
                                this.hasValidGeneralInspection(vehicle)
                                    ? 'primary'
                                    : 'secondary'
                            }
                            label={`${vehicle.generalInspectionMonth} / ${vehicle.generalInspectionYear}`}
                            avatar={
                                <Avatar src="https://www.kues-fahrzeugueberwachung.de/wordpress/wp-content/uploads/2018/09/hu-plakette-gelb.png" />
                            }
                            // onClick={this.handleEditOpen}
                            onDelete={this.handleEditOpen}
                            deleteIcon={<EditIcon />}
                        />
                    </CardContent>
                    <CardActions
                        disableSpacing
                        style={{ alignContent: 'center' }}
                    >
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: this.state.expanded
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                        {processButton}
                    </CardActions>
                    <Collapse
                        in={this.state.expanded}
                        timeout="auto"
                        unmountOnExit
                    >
                        <CardContent>
                            <Table
                                className={classes.table}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Process type</TableCell>
                                        <TableCell align="center">
                                            Submission Date
                                        </TableCell>
                                        <TableCell align="center">
                                            State
                                        </TableCell>
                                        <TableCell align="center">
                                            Print
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vehicle.processes.map((process) => (
                                        <TableRow key={process._id}>
                                            <TableCell scope="row">
                                                {process.processType}
                                            </TableCell>
                                            <TableCell align="center">
                                                {new Date(
                                                    Date.parse(process.date)
                                                ).toLocaleString('de-DE', {
                                                    timeZone: 'Europe/Andorra'
                                                })}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    style={{
                                                        backgroundColor:
                                                            state_colors[
                                                                process.state
                                                            ]
                                                    }}
                                                    label={process.state}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    //style={{float: "right"}}
                                                    onClick={() =>
                                                        this.createPdfAndDownload(
                                                            process._id
                                                        )
                                                    }
                                                >
                                                    <PrintIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        );
    }
}

VehicleListPaper.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VehicleListPaper);
