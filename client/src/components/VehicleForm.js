'use strict';

import {
    Button,
    Card,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import DistrictService from '../services/DistrictService';
import LicensePlateService from '../services/LicensePlateService';
import UserService from '../services/UserService';
import VehicleService from '../services/VehicleService';
import VINService from '../services/VINService';

const LightTooltip = withStyles(() => ({
    tooltip: {
        backgroundColor: '#3f51b5',
        color: 'white',
        fontSize: 14,
        fontFamily: 'Nunito'
    }
}))(Tooltip);

class VehicleForm extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.vehicle != undefined) {
            this.state = {
                owner: UserService.isAuthenticated()
                    ? UserService.getCurrentUser().id
                    : undefined,
                error: null,
                areaCodeOptions: [],
                areaCode: '',
                letters: '',
                digits: '',
                ownerName: '',
                vin: props.vehicle.vin,
                make: props.vehicle.make,
                model: props.vehicle.model,
                licensePlate: props.vehicle.licensePlate,
                state: props.vehicle.state,
                generalInspection: props.vehicle.generalInspection,
                generalInspectionMonth: props.vehicle.generalInspectionMonth,
                generalInspectionYear: props.vehicle.generalInspectionYear,
                generalInspectionBool:
                    props.vehicle.generalInspectionMonth != '' ? true : false,
                processes: props.vehicle.processes
            };
        } else {
            this.state = {
                owner: UserService.isAuthenticated()
                    ? UserService.getCurrentUser().id
                    : undefined,
                error: null,
                areaCodeOptions: [],
                areaCode: '',
                letters: '',
                digits: '',
                ownerName: '',
                vin: '',
                make: '',
                model: '',
                licensePlate: null,
                state: '',
                generalInspection: null,
                generalInspectionMonth: '',
                generalInspectionYear: '',
                generalInspectionBool: false,
                processes: []
            };
        }

        this.yearOptions = this.monthOptions = Array(4)
            .fill()
            .map((element, index) => new Date().getFullYear() + index);
        this.monthOptions = Array(12)
            .fill()
            .map((element, index) => index + 1);

        this.handleChangeVIN = this.handleChangeVIN.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangePlate = this.handleChangePlate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleGIBool = this.toggleGIBool.bind(this);
    }

    componentWillMount() {
        this.setState({ loading: true });
        UserService.getUserDetails().then((user) => {
            this.setState({ ownerName: `${user.firstName} ${user.lastName}` });
            DistrictService.getDistrict(user.address.district).then(
                (district) => {
                    this.setState({
                        areaCodeOptions: district.areaCode,
                        loading: false
                    });
                }
            );
        });
    }

    async handleChangeVIN(event) {
        const vin = event.target.value;
        this.setState({ vin: vin });
        if (vin.length == 17) {
            const result = await VINService.getVehicleInfo(vin);
            const make_value = result.Make;
            const model_value = result.Model;
            if (make_value) {
                this.setState({ make: make_value });
            }
            if (model_value) {
                this.setState({ model: model_value });
            }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeDate(date) {
        this.setState({ generalInspection: date });
    }

    handleChangePlate(event) {
        // if value is not blank, then test the regex
        if (event.target.name === 'digits') {
            // only allow blank or numbers
            const re = /^[0-9\b]+$/;
            if (event.target.value === '' || re.test(event.target.value)) {
                this.setState({ digits: event.target.value });
            }
        } else if (event.target.name === 'letters') {
            // only allow letters
            const re = /^[a-zA-Z]+$/;
            if (event.target.value === '' || re.test(event.target.value)) {
                this.setState({ letters: event.target.value.toUpperCase() });
            }
        } else {
            // area code
            this.setState({ [event.target.name]: event.target.value });
        }
    }

    toggleGIBool(event) {
        this.setState({ generalInspectionBool: event.target.checked });
        this.setState({ generalInspectionMonth: '' });
        this.setState({ generalInspectionYear: '' });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.state == 'REGISTERED') {
            LicensePlateService.getAvailableLicensePlates(this.state).then(
                (plateResult) => {
                    if (plateResult.length != 1) {
                        this.setState({
                            error: 'License Plate is invalid or already in use! Confirm your input.'
                        });
                        return;
                    }

                    const plateToCreate = plateResult[0];
                    LicensePlateService.createLicensePlate(plateToCreate).then(
                        (createdPlate) => {
                            const plateId = createdPlate._id;
                            this.setState({ licensePlate: plateId });

                            let vehicle = this.props.vehicle;
                            if (vehicle == undefined) {
                                vehicle = {};
                            }

                            vehicle.owner = this.state.owner;
                            vehicle.vin = this.state.vin;
                            vehicle.make = this.state.make;
                            vehicle.model = this.state.model;
                            vehicle.licensePlate = plateId;
                            vehicle.state = this.state.state;
                            vehicle.generalInspectionMonth =
                                this.state.generalInspectionMonth;
                            vehicle.generalInspectionYear =
                                this.state.generalInspectionYear;

                            (vehicle._id
                                ? VehicleService.updateVehicle(vehicle)
                                : VehicleService.createVehicle(vehicle)
                            )
                                .then((data) => {
                                    this.props.history.push('/dashboard');
                                })
                                .catch((error) => {
                                    this.setState({
                                        error: 'A server error occured. Please confirm your input!'
                                    });
                                });
                        }
                    );
                }
            );
        } else {
            let vehicle = this.props.vehicle;
            if (vehicle == undefined) {
                vehicle = {};
            }

            vehicle.owner = this.state.owner;
            vehicle.vin = this.state.vin;
            vehicle.make = this.state.make;
            vehicle.model = this.state.model;
            vehicle.licensePlate = this.state.licensePlate;
            vehicle.state = this.state.state;
            vehicle.generalInspectionMonth = this.state.generalInspectionMonth;
            vehicle.generalInspectionYear = this.state.generalInspectionYear;

            (vehicle._id
                ? VehicleService.updateVehicle(vehicle)
                : VehicleService.createVehicle(vehicle)
            )
                .then((data) => {
                    this.props.history.push('/dashboard');
                })
                .catch((error) => {
                    this.setState({
                        error: 'A server error occured. Please confirm your input!'
                    });
                });
        }
    }

    render() {
        if (this.state.loading) {
            return <h2>Loading</h2>;
        }
        return (
            <Grid
                justify="space-between"
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Card style={{ padding: '20px', maxWidth: '500px' }}>
                        <form
                            onSubmit={this.handleSubmit}
                            onReset={() => this.props.history.goBack()}
                        >
                            <Typography
                                style={{ marginBottom: '10px' }}
                                component="h5"
                                variant="h5"
                            >
                                Vehicle
                            </Typography>
                            <Grid
                                justify="space-between"
                                container
                                direction="row"
                                alignItems="center"
                                justify="center"
                                spacing={3}
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        label="Owner"
                                        name="owner"
                                        id="OwnerField"
                                        fullWidth
                                        disabled={true}
                                        value={this.state.ownerName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        label="VIN (17)"
                                        id="VINField"
                                        name="vin"
                                        fullWidth
                                        required={true}
                                        value={this.state.vin}
                                        onChange={this.handleChangeVIN}
                                        InputProps={{
                                            endAdornment: (
                                                <LightTooltip
                                                    title="The vehicle identification number provides a unique identifier for your vehicle and can be found 
                                                    on the acceptance paper part 1 and 2 of your vehicle. "
                                                    placement="right"
                                                >
                                                    <InputAdornment position="end">
                                                        <InfoOutlinedIcon />
                                                    </InputAdornment>
                                                </LightTooltip>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Make"
                                        required={true}
                                        fullWidth
                                        value={this.state.make}
                                        name="make"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Model"
                                        required={true}
                                        fullWidth
                                        value={this.state.model}
                                        name="model"
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth component="fieldset">
                                        <FormLabel component="legend">
                                            Current Registration State of the
                                            Vehicle
                                        </FormLabel>
                                        <RadioGroup
                                            style={{ justifyContent: 'center' }}
                                            row
                                            aria-label="gender"
                                            name="state"
                                            value={this.state.state}
                                            onChange={this.handleChange.bind(
                                                this
                                            )}
                                        >
                                            <FormControlLabel
                                                value="NEW"
                                                control={<Radio />}
                                                label="New"
                                            />
                                            <FormControlLabel
                                                value="REGISTERED"
                                                control={<Radio />}
                                                label="Registered"
                                            />
                                            <FormControlLabel
                                                value="DEREGISTERED"
                                                control={<Radio />}
                                                label="Deregistered"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {this.state.state == 'REGISTERED' ? (
                                    <Grid item xs={12}>
                                        <InputLabel>
                                            Current License Plate
                                        </InputLabel>
                                        <FormGroup
                                            row
                                            style={{
                                                justifyContent: 'space-between',
                                                padding: '30px 30px 20px 20%',
                                                height: '120px',
                                                backgroundImage: `url(${'https://t3.ftcdn.net/jpg/00/11/79/08/240_F_11790850_Gi4UC9cwGMUMGWtZhSP4yKpFg3tqlPis.jpg'})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            <FormControl
                                                variant="outlined"
                                                style={{ width: '80px' }}
                                            >
                                                <InputLabel
                                                    style={{
                                                        backgroundColor:
                                                            'white',
                                                        padding: '0 10px 0 5px'
                                                    }}
                                                >
                                                    Area
                                                </InputLabel>

                                                <Select
                                                    value={this.state.areaCode}
                                                    required={true}
                                                    name="areaCode"
                                                    onChange={
                                                        this.handleChangePlate
                                                    }
                                                >
                                                    {this.state.areaCodeOptions.map(
                                                        (areaCode) => {
                                                            return (
                                                                <MenuItem
                                                                    value={
                                                                        areaCode
                                                                    }
                                                                >
                                                                    {areaCode}
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                                    ;
                                                </Select>
                                            </FormControl>
                                            <FormControl
                                                style={{ width: '80px' }}
                                            >
                                                <TextField
                                                    variant="outlined"
                                                    label="Letters"
                                                    required={true}
                                                    name="letters"
                                                    value={this.state.letters}
                                                    // ToDo add regex

                                                    onChange={
                                                        this.handleChangePlate
                                                    }
                                                    inputProps={{
                                                        minLength: 1,
                                                        maxLength: 2,
                                                        style: {
                                                            textTransform:
                                                                'uppercase'
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormControl
                                                style={{ width: '80px' }}
                                            >
                                                <TextField
                                                    variant="outlined"
                                                    label="Digits"
                                                    required={true}
                                                    name="digits"
                                                    value={this.state.digits}
                                                    onChange={
                                                        this.handleChangePlate
                                                    }
                                                    inputProps={{
                                                        minLength: 2,
                                                        maxLength: 4
                                                    }}
                                                />
                                            </FormControl>
                                        </FormGroup>
                                    </Grid>
                                ) : (
                                    []
                                )}
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={
                                                    this.state
                                                        .generalInspectionBool
                                                }
                                                onChange={this.toggleGIBool}
                                                name="generalInspectionBool"
                                                color="primary"
                                            />
                                        }
                                        label="General Inspection available"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <InputLabel variant="outlined">
                                        Month
                                    </InputLabel>
                                    <Select
                                        variant="outlined"
                                        label="Month"
                                        labelId="StateField"
                                        value={
                                            this.state.generalInspectionMonth
                                        }
                                        disabled={
                                            !this.state.generalInspectionBool
                                        }
                                        required={
                                            this.state.generalInspectionBool
                                        }
                                        fullWidth
                                        name="generalInspectionMonth"
                                        onChange={this.handleChange}
                                    >
                                        {this.monthOptions.map((year, i) => {
                                            return (
                                                <MenuItem value={year} key={i}>
                                                    {year}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <InputLabel variant="outlined">
                                        Year
                                    </InputLabel>
                                    <Select
                                        variant="outlined"
                                        label="Year"
                                        labelId="StateField"
                                        value={this.state.generalInspectionYear}
                                        disabled={
                                            !this.state.generalInspectionBool
                                        }
                                        required={
                                            this.state.generalInspectionBool
                                        }
                                        fullWidth
                                        name="generalInspectionYear"
                                        onChange={this.handleChange}
                                    >
                                        {this.yearOptions.map((year) => {
                                            return (
                                                <MenuItem value={year}>
                                                    {year}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        style={{
                                            float: 'right',
                                            marginLeft: '15px'
                                        }}
                                        id="submit"
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        disabled={
                                            this.state.vin.toString().length !=
                                            17
                                        }
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        style={{ float: 'right' }}
                                        id="reset"
                                        type="reset"
                                        color="default"
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                                {this.state.error && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">
                                            {this.state.error}
                                        </Alert>
                                    </Grid>
                                )}
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(VehicleForm);
