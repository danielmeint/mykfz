'use strict';

import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PrintIcon from '@material-ui/icons/Print';
import React, { useCallback, useEffect, useState } from 'react';
import LicensePlateService from '../services/LicensePlateService';
import ProcessService from '../services/ProcessService';
import UserService from '../services/UserService';
import VehicleService from '../services/VehicleService';

const VehiclesTableRow = ({ vehicle }) => {
    const [owner, setOwner] = useState({});
    const [open, setOpen] = useState(false);
    const [licensePlate, setLicensePlate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const user = await UserService.getUser(vehicle.owner);
            setOwner(user);

            if (vehicle.licensePlate) {
                const licensePlate = await LicensePlateService.getLicensePlate(
                    vehicle.licensePlate
                );

                setLicensePlate(licensePlate);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const pendingProcesses = vehicle.processes.filter(
        (p) => p.state === 'PENDING'
    );

    const chip = (
        <Chip
            label={
                vehicle.state == 'REGISTERED'
                    ? LicensePlateService.asString(licensePlate)
                    : vehicle.state
            }
            color={vehicle.state == 'REGISTERED' ? 'primary' : 'default'}
        />
    );

    const chipWithBadge = (
        <Badge badgeContent={pendingProcesses.length} color="secondary">
            {chip}
        </Badge>
    );

    if (loading) {
        return <TableRow />;
    }

    return (
        <React.Fragment>
            <TableRow hover key={vehicle.vin}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {vehicle.vin}
                </TableCell>
                <TableCell align="center">
                    {owner.firstName} {owner.lastName}
                </TableCell>
                <TableCell align="center">{vehicle.make}</TableCell>
                <TableCell align="center">{vehicle.model}</TableCell>
                <TableCell align="center">
                    {pendingProcesses.length > 0 ? chipWithBadge : chip}
                </TableCell>
            </TableRow>
            <CollapsibleRow
                vehicleId={vehicle._id}
                processes={vehicle.processes}
                open={open}
            />
        </React.Fragment>
    );
};

const CollapsibleRow = ({ vehicleId, processes, open }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Processes
                        </Typography>
                        <ProcessesTable
                            vehicleId={vehicleId}
                            processes={processes}
                        />
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};

const ProcessesTable = ({ vehicleId, processes }) => {
    return (
        <Table size="small" aria-label="purchases">
            <TableHead>
                <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Submission Date</TableCell>
                    <TableCell align="center">Details</TableCell>
                    <TableCell align="center">Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {processes.map((process) => (
                    <ProcessesTableRow
                        vehicleId={vehicleId}
                        process={process}
                    />
                ))}
            </TableBody>
        </Table>
    );
};

const ProcessesTableRow = ({ vehicleId, process }) => {
    const [isSending, setIsSending] = useState(false);
    const [processState, setProcessState] = useState(process.state);

    const acceptProcess = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);

        if (process.processType == 'REGISTRATION') {
            // remove reservation?
        } else {
            // deregistration
            const vehicle = await VehicleService.getVehicle(vehicleId);

            // remove plate or add reservation
            if (process.info.reservePlate) {
                // add reservation
                const vehicle = await VehicleService.getVehicle(vehicleId);
                const userId = vehicle.owner;
                await UserService.createLicensePlateReservation(
                    userId,
                    vehicle.licensePlate,
                    90 * 24 * 60 * 60 // 90 days in seconds
                );
            } else {
                // remove plate
                await LicensePlateService.deleteLicensePlate(
                    vehicle.licensePlate
                );
            }
        }

        // set state to accepted
        await ProcessService.accceptProcess(vehicleId, process._id);

        const newProcess = await VehicleService.getVehicleProcess(
            vehicleId,
            process._id
        );
        setProcessState(newProcess.state);
        // setProcessState('ACCEPTED');

        setIsSending(false);
    }, [isSending]);

    const rejectProcess = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);

        if (process.processType == 'REGISTRATION') {
            // create reservation
            const vehicle = await VehicleService.getVehicle(vehicleId);
            const userId = vehicle.owner;
            const plateId = process.info.licensePlate;
            await UserService.createLicensePlateReservation(
                userId,
                plateId,
                90 * 24 * 60 * 60 // 90 days in seconds
            );
        }

        await ProcessService.rejectProcess(vehicleId, process._id);
        const newProcess = await VehicleService.getVehicleProcess(
            vehicleId,
            process._id
        );
        setProcessState(newProcess.state);
        // setProcessState('REJECTED');
        setIsSending(false);
    }, [isSending]);

    // const acceptProcess = async () => {
    //     await ProcessService.accceptProcess(vehicleId, process._id);
    // };

    // const rejectProcess = async () => {
    //     await ProcessService.rejectProcess(vehicleId, process._id);
    // };

    const state_colors = {
        ACCEPTED: '#7ac142',
        REJECTED: 'lightsalmon'
    };

    return (
        <TableRow key={process._id}>
            <TableCell component="th" scope="row">
                {process.processType}
            </TableCell>
            <TableCell align="center">
                {new Date(Date.parse(process.date)).toLocaleString('de-DE', {
                    timeZone: 'Europe/Andorra'
                })}
            </TableCell>
            <TableCell align="center">
                <ProcessDetailsCell vehicleId={vehicleId} process={process} />
            </TableCell>
            <TableCell align="center">
                {processState == 'NEW' || processState == 'PENDING' ? (
                    <ButtonGroup variant="contained">
                        <Button disabled={isSending} onClick={acceptProcess}>
                            ACCEPT
                        </Button>
                        <Button disabled={isSending} onClick={rejectProcess}>
                            REJECT
                        </Button>
                    </ButtonGroup>
                ) : (
                    <Chip
                        style={{ backgroundColor: state_colors[processState] }}
                        label={processState}
                    />
                )}
            </TableCell>
        </TableRow>
    );
};

const ProcessDetailsCell = ({ vehicleId, process }) => {
    const createPdfAndDownload = () => {
        (async () => {
            try {
                await ProcessService.generateProcessStatusPDF(
                    vehicleId,
                    process._id
                );
            } catch (err) {
                console.error(err);
            }
        })();
    };

    return (
        <IconButton onClick={createPdfAndDownload}>
            <PrintIcon />
        </IconButton>
    );
};

export default function VehiclesTable({ vehicles }) {
    return (
        <div>
            <h2>Vehicles</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>VIN</TableCell>
                            <TableCell align="center">Owner</TableCell>
                            <TableCell align="center">Make</TableCell>
                            <TableCell align="center">Model</TableCell>
                            <TableCell align="center">
                                Registration State
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <VehiclesTableRow
                                key={vehicle.vin}
                                vehicle={vehicle}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
