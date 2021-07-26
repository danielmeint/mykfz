import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from '@material-ui/core';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import VehicleService from '../services/VehicleService';

const VehicleEditDialog = ({ open, handleClose, vehicle }) => {
    const [generalInspectionYear, setGeneralInspectionYear] = useState(
        vehicle.generalInspectionYear
    );
    const [generalInspectionMonth, setGeneralInspectionMonth] = useState(
        vehicle.generalInspectionMonth
    );

    const handleSubmit = async () => {
        await VehicleService.updateVehicle({
            _id: vehicle._id,
            generalInspectionMonth: generalInspectionMonth,
            generalInspectionYear: generalInspectionYear
        });
        handleClose();
    };

    const yearOptions = Array(4)
        .fill()
        .map((element, index) => new Date().getFullYear() + index);
    const monthOptions = Array(12)
        .fill()
        .map((element, index) => index + 1);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                Edit General Inspection
            </DialogTitle>
            <DialogContent>
                <Grid
                    justify="space-evenly"
                    container
                    direction="row"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <DialogContentText>
                            Edit the general inspection date for vehicle with
                            VIN {vehicle.vin}. For older vehicles, the district
                            may require manual proof for a valid general
                            inspection before vehicles may be registered.
                        </DialogContentText>
                    </Grid>

                    <Grid item xs={4}>
                        <InputLabel variant="outlined">Year</InputLabel>
                        <Select
                            variant="outlined"
                            label="Year"
                            labelId="StateField"
                            value={generalInspectionYear}
                            required={true}
                            fullWidth
                            name="generalInspectionYear"
                            onChange={(e) => {
                                setGeneralInspectionYear(e.target.value);
                            }}
                        >
                            {yearOptions.map((year) => {
                                return <MenuItem value={year}>{year}</MenuItem>;
                            })}
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <InputLabel variant="outlined">Month</InputLabel>
                        <Select
                            variant="outlined"
                            label="Month"
                            labelId="StateField"
                            value={generalInspectionMonth}
                            required={true}
                            fullWidth
                            name="generalInspectionMonth"
                            onChange={(e) => {
                                setGeneralInspectionMonth(e.target.value);
                            }}
                        >
                            {monthOptions.map((month, i) => {
                                return (
                                    <MenuItem value={month} key={i}>
                                        {month}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withRouter(VehicleEditDialog);
