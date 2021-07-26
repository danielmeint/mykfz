'use strict';

import {
    Button,
    Card,
    FormControl,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    Select,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { withRouter } from 'react-router-dom';
import DistrictService from '../services/DistrictService';
import LicensePlateService from '../services/LicensePlateService';
import UserService from '../services/UserService';
import LicensePlate from './LicensePlate';

class LicensePlateReservationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaCode: '',
            letters: '',
            digits: '',
            page: 0,
            rowsPerPage: 5,
            areaCodeOptions: [],
            queriedLicensePlates: [],
            selectedPlate: null,
            errorMessage: '',
            alreadyReservedPlates: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelection = this.handleChangeSelection.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleErrorMessage = this.handleErrorMessage.bind(this);
    }

    componentWillMount(props) {
        this.setState({
            loading: true
        });
        (async () => {
            try {
                let user = await UserService.getUserDetails();
                let district = await DistrictService.getDistrict(
                    user.address.district
                );
                this.setState({
                    user: user,
                    areaCodeOptions: district.areaCode,
                    alreadyReservedPlates: user.licensePlateReservations.length
                });
            } catch (err) {
                this.handleErrorMessage(
                    'Reservation is currently not possible due to a server error, we are working on a solution.'
                );
                console.error(err);
            }
        })();
    }

    handleChange(event) {
        // if value is not blank, then test the regex
        if (event.target.name === 'digits') {
            // only allow blank or numbers
            const re = /^[0-9?]{1,4}$/;
            if (event.target.value === '' || re.test(event.target.value)) {
                this.setState({ digits: event.target.value });
            } else {
                this.handleErrorMessage(
                    "This field only accepts digits and the wildcard character '?'."
                );
            }
        } else if (event.target.name === 'letters') {
            // only allow letters
            const value = event.target.value.toUpperCase();
            const re = /^[A-Z?]{1,2}$/;
            if (value === '' || re.test(value)) {
                this.setState({ letters: value });
            } else {
                this.handleErrorMessage(
                    "This field only accepts letters and the wildcard character '?'."
                );
            }
        } else {
            // area code
            this.setState({ [event.target.name]: event.target.value });
        }
    }

    handleChangePage(event, newPage) {
        this.setState({ page: newPage });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value, page: 0 });
        this.setState({ page: 0 });
    }

    handleChangeSelection(event) {
        this.setState({ selectedPlate: event.target.value });
        let id = this.state.selectedPlate;
    }

    handleErrorMessage(error) {
        this.setState({ errorMessage: error });
    }

    handleSearch(event) {
        event.preventDefault();
        const query = {
            areaCode: this.state.areaCode,
            letters: this.state.letters,
            digits: this.state.digits
        };
        (async () => {
            try {
                const queriedPlates =
                    await LicensePlateService.getAvailableLicensePlates(query);
                this.setState({
                    queriedLicensePlates: queriedPlates
                });
                if (queriedPlates.length == 0) {
                    this.handleErrorMessage('No license plate found.');
                } else {
                    this.handleErrorMessage('');
                }
            } catch (err) {
                console.log(error);
            }
        })();
    }

    handleSubmit(event) {
        event.preventDefault();

        let user = this.state.user;
        let id = this.state.selectedPlate;

        const licensePlate = this.state.queriedLicensePlates[id];

        (async () => {
            try {
                const validatedPlate =
                    await LicensePlateService.createLicensePlate(
                        licensePlate,
                        true
                    );
                this.setState({
                    newLicensePlate: validatedPlate._id
                });
            } catch (err) {
                console.error(err);
            }
        })().then(async () => {
            const reservation = await UserService.createLicensePlateReservation(
                user._id,
                this.state.newLicensePlate,
                // TODO: set to 30 days
                2592000
            );
            this.props.history.push('/dashboard/plates');
        });
    }

    render() {
        return (
            <Grid
                justify="space-between"
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={3}
            >
                {this.state.alreadyReservedPlates < 5 ? (
                    <Grid item>
                        <Card style={{ padding: '20px', maxWidth: '500px' }}>
                            <Grid
                                container
                                alignItems="center"
                                justify="center"
                            >
                                <Grid item xs={12}>
                                    <form
                                        onSubmit={this.handleSearch}
                                        onReset={() =>
                                            this.props.history.goBack()
                                        }
                                    >
                                        <Typography
                                            style={{ marginBottom: '10px' }}
                                            component="h5"
                                            variant="h5"
                                        >
                                            License Plate Reservation
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
                                                <Typography
                                                    // syle={{ marginTop: '10px' }}
                                                    variant="body1"
                                                    // align="center"
                                                    // display="block"
                                                    // color="textSecondary"
                                                    // gutterBottom
                                                >
                                                    Reserve a free license plate
                                                    for up to 30 days. This
                                                    plate may be used when
                                                    registering a vehicle within
                                                    myKfz.
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    Hint – You can use the
                                                    wildcard character '?' in
                                                    your query to search for all
                                                    matching patterns!
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormGroup
                                                    row
                                                    style={{
                                                        justifyContent:
                                                            'space-between',
                                                        padding:
                                                            '30px 30px 20px 20%',
                                                        height: '120px',
                                                        backgroundImage: `url(${'https://t3.ftcdn.net/jpg/00/11/79/08/240_F_11790850_Gi4UC9cwGMUMGWtZhSP4yKpFg3tqlPis.jpg'})`,
                                                        backgroundSize:
                                                            'contain',
                                                        backgroundRepeat:
                                                            'no-repeat'
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        style={{
                                                            width: '80px'
                                                        }}
                                                    >
                                                        <InputLabel
                                                            style={{
                                                                backgroundColor:
                                                                    'white',
                                                                padding:
                                                                    '0 10px 0 5px'
                                                            }}
                                                        >
                                                            Area
                                                        </InputLabel>

                                                        <Select
                                                            value={
                                                                this.state
                                                                    .areaCode
                                                            }
                                                            required={true}
                                                            name="areaCode"
                                                            onChange={
                                                                this
                                                                    .handleChange
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
                                                                            {
                                                                                areaCode
                                                                            }
                                                                        </MenuItem>
                                                                    );
                                                                }
                                                            )}
                                                            ;
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl
                                                        style={{
                                                            width: '80px'
                                                        }}
                                                    >
                                                        <TextField
                                                            variant="outlined"
                                                            label="Letters"
                                                            required={true}
                                                            name="letters"
                                                            value={
                                                                this.state
                                                                    .letters
                                                            }
                                                            // ToDo add regex

                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            inputProps={{
                                                                maxLength: 2,
                                                                style: {
                                                                    textTransform:
                                                                        'uppercase'
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormControl
                                                        style={{
                                                            width: '80px'
                                                        }}
                                                    >
                                                        <TextField
                                                            variant="outlined"
                                                            label="Digits"
                                                            required={true}
                                                            name="digits"
                                                            value={
                                                                this.state
                                                                    .digits
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            inputProps={{
                                                                maxLength: 4
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormGroup>
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
                                                >
                                                    Search
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
                                        </Grid>
                                    </form>
                                </Grid>
                                {this.state.errorMessage && (
                                    <Grid
                                        item
                                        xs={12}
                                        style={{ marginTop: '1em' }}
                                    >
                                        <Alert severity="error">
                                            {this.state.errorMessage}
                                        </Alert>
                                    </Grid>
                                )}
                                {this.state.queriedLicensePlates ? (
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction="column"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <TableBody>
                                                    {this.state.queriedLicensePlates
                                                        .slice(
                                                            this.state.page *
                                                                this.state
                                                                    .rowsPerPage,
                                                            this.state.page *
                                                                this.state
                                                                    .rowsPerPage +
                                                                this.state
                                                                    .rowsPerPage
                                                        )
                                                        .map((plate, index) => (
                                                            <TableRow>
                                                                <TableCell padding="checkbox">
                                                                    <Radio
                                                                        value={
                                                                            index
                                                                        }
                                                                        defaultSelected={
                                                                            false
                                                                        }
                                                                        checked={
                                                                            index !=
                                                                            this
                                                                                .state
                                                                                .selectedPlate
                                                                                ? false
                                                                                : true
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleChangeSelection
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <LicensePlate
                                                                        licensePlate={
                                                                            plate
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Grid>
                                            <Grid item>
                                                <TablePagination
                                                    style={{
                                                        borderBottom: 'None'
                                                    }}
                                                    rowsPerPageOptions={[
                                                        {
                                                            label: '5',
                                                            value: 5
                                                        },
                                                        {
                                                            label: '10',
                                                            value: 10
                                                        },
                                                        {
                                                            label: '25',
                                                            value: 25
                                                        }
                                                    ]}
                                                    colSpan={3}
                                                    count={
                                                        this.state
                                                            .queriedLicensePlates
                                                            .length
                                                    }
                                                    rowsPerPage={
                                                        this.state.rowsPerPage
                                                    }
                                                    page={this.state.page}
                                                    onChangePage={
                                                        this.handleChangePage
                                                    }
                                                    onChangeRowsPerPage={
                                                        this
                                                            .handleChangeRowsPerPage
                                                    }
                                                    //ActionsComponent={TablePaginationActions}
                                                />
                                            </Grid>
                                        </Grid>
                                        {(this.state.queriedLicensePlates
                                            .length != 0 &&
                                        this.state.selectedPlate != null) ? (
                                            <Button
                                                style={{
                                                    float: 'right',
                                                    marginTop: '5px',
                                                    marginLeft: '15px'
                                                }}
                                                type="submit"
                                                variant="contained"
                                                type="submit"
                                                color="primary"
                                                onClick={this.handleSubmit}
                                            >
                                                Reserve
                                            </Button>
                                        ) : (
                                            []
                                        )}
                                    </Grid>
                                ) : (
                                    []
                                )}
                            </Grid>
                            <Typography
                                style={{ marginTop: '1em' }}
                                variant="caption"
                                align="center"
                                display="block"
                                color="textSecondary"
                                gutterBottom
                            >
                                You can reserve up to 5 license plates. A
                                reservation costs 10,20€ and is valid for 30
                                days. You are only charged after using the plate
                                for a new registration.
                            </Typography>
                        </Card>
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            {
                                'You can only reserve up to 5 different license plates. You need to delete one of your reservations first.'
                            }
                        </Alert>
                    </Grid>
                )}
            </Grid>
        );
    }
}

export default withRouter(LicensePlateReservationForm);
