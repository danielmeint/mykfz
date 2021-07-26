import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router';
import LicensePlateService from '../services/LicensePlateService';
import UserService from '../services/UserService';

const LightTooltip = withStyles(() => ({
    tooltip: {
        backgroundColor: '#3f51b5',
        color: 'white',
        fontSize: 14,
        fontFamily: 'Nunito'
    }
}))(Tooltip);

function RegisterProcessFormFields({
    user,
    vehicle,
    process,
    onProcessChange
}) {
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [validPlates, setValidPlates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const user = await UserService.getUserDetails(); // could have just added a new plate reservation
            const validReservations = user.licensePlateReservations.filter(
                (r) => {
                    const currentTime = new Date().getTime();
                    const expiryTime = new Date(r.expiryDate).getTime();
                    return expiryTime > currentTime;
                }
            );

            let platesResult = [];
            for (const reservedPlateId of validReservations.map(
                (reservation) => reservation.licensePlate
            )) {
                const plate = await LicensePlateService.getLicensePlate(
                    reservedPlateId
                );
                platesResult.push(plate);
            }
            setValidPlates(platesResult);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <h2>Loading</h2>;
    }

    const validPlatesAvailable = validPlates.length > 0;

    const tooltipImgTxt = (
        <div>
            <Grid container>
                <Grid item>
                    <label>
                        Security Code II can be found on the acceptance paper
                        part 2 of your vehicle.
                    </label>
                </Grid>
                <Grid item>
                    <img
                        width="285"
                        height="350"
                        src="https://www.bmvi.de/SharedDocs/DE/Bilder/VerkehrUndMobilitaet/Strasse/fahrzeugzulassung-online-3.png?__blob=normal"
                        alt=""
                    ></img>
                </Grid>
            </Grid>
        </div>
    );

    if (!validPlatesAvailable) {
        console.log('no valid plates');
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Alert severity="error">
                        You don't have valid license plate reservations. Please
                        reserve a new license plate before registering a
                        vehicle!
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        style={{ marginTop: '1em' }}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            history.push('/dashboard');
                        }}
                    >
                        Return To Dashboard
                    </Button>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    label="VIN"
                    variant="outlined"
                    disabled={true}
                    required={true}
                    fullWidth
                    value={vehicle.vin}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title="Vehicle Identifcation Number. The vehicle identification number provides a unique identifier for your vehicle and can be found 
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
            <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel
                        style={{
                            backgroundColor: 'white',
                            padding: '0 10px 0 5px'
                        }}
                    >
                        Reserved Plate *
                    </InputLabel>
                    <Select
                        // variant="outlined"
                        fullWidth
                        value={process.info.licensePlate}
                        required={true}
                        // name="licensePlate"
                        onChange={onProcessChange}
                        inputProps={{
                            name: 'licensePlate'
                        }}
                    >
                        {validPlatesAvailable ? (
                            validPlates.map((plate) => {
                                return (
                                    <MenuItem value={plate._id}>
                                        {`${plate.areaCode}` +
                                            ' - ' +
                                            `${plate.letters}` +
                                            ' ' +
                                            `${plate.digits}`}
                                    </MenuItem>
                                );
                            })
                        ) : (
                            <MenuItem value="">
                                You need to reserve a license plate before
                                registering a vehicle
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="eVB (7)"
                    name="evb"
                    variant="outlined"
                    required={true}
                    fullWidth
                    value={process.info.evb}
                    onChange={onProcessChange}
                    minLength={7}
                    maxLength={7}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title="Electronic confirmation of insurance coverage. The eVB number has to be requested from your auto insurer."
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
            <Grid item xs={12}>
                <TextField
                    label="Security Code II (12)"
                    name="secCodeII"
                    variant="outlined"
                    required={true}
                    fullWidth
                    value={process.info.secCodeII}
                    onChange={onProcessChange}
                    minLength={12}
                    maxLength={12}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title={tooltipImgTxt}
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
            <Grid item xs={12}>
                <TextField
                    label="IBAN (22)"
                    name="iban"
                    variant="outlined"
                    required={true}
                    fullWidth
                    value={process.info.iban}
                    onChange={onProcessChange}
                    minLength={22}
                    maxLength={22}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title="The IBAN is required for the recurrent payment of the vehicle tax."
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
        </Grid>
    );
}

function DeregisterProcessFormFields({ vehicle, process, onProcessChange }) {
    const tooltipSecurityCode = (
        <div>
            <Grid container justifyContent="center" spacing={1}>
                <Grid item>
                    <label>
                        The security code I can be found on the acceptance paper
                        part 1 of your vehicle. You need to uncover the
                        respective field to see the code.
                    </label>
                </Grid>
                <Grid item>
                    <img
                        width="285"
                        height="365"
                        src="https://www.bmvi.de/SharedDocs/DE/Bilder/VerkehrUndMobilitaet/Strasse/fahrzeugzulassung-online-3.png?__blob=normal"
                        alt=""
                    ></img>
                </Grid>
            </Grid>
        </div>
    );

    const tooltipPlateCode = (
        <div>
            <Grid container justifyContent="center" spacing={1}>
                <Grid item>
                    <label>
                        The plate code can be found on the license plate
                        associated to your vehicle. On the license plate, you
                        need to remove the seal form the badge to expose the
                        code. <b>Attention!</b> With the removal of the seal,
                        the validity of the license plate extingushes.
                    </label>
                </Grid>
                <Grid item>
                    <img
                        width="285"
                        height="165"
                        src="https://www.bmvi.de/SharedDocs/DE/Bilder/VerkehrUndMobilitaet/Strasse/fahrzeugzulassung-online-5.jpg?__blob=normal"
                        alt=""
                    ></img>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    label="VIN"
                    variant="outlined"
                    disabled={true}
                    required={true}
                    fullWidth
                    value={vehicle.vin}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title="Vehicle Identifcation Number. The vehicle identification number provides a unique identifier for your vehicle and can be found 
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
            <Grid item xs={12}>
                <TextField
                    label="Security Code I (7)"
                    name="secCodeI"
                    variant="outlined"
                    fullWidth
                    required={true}
                    value={process.info.secCodeI}
                    onChange={onProcessChange}
                    maxLength={7}
                    minLength={7}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title={tooltipSecurityCode}
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
            <Grid item xs={12}>
                <TextField
                    label="Plate Code (3)"
                    variant="outlined"
                    required={true}
                    name="plateCode"
                    fullWidth
                    value={process.info.plateCode}
                    onChange={onProcessChange}
                    maxLength={3}
                    InputProps={{
                        endAdornment: (
                            <LightTooltip
                                title={tooltipPlateCode}
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
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={process.info.reservePlate}
                            onChange={onProcessChange}
                            name="reservePlate"
                            color="primary"
                        />
                    }
                    label="Reserve license plate for 90 days? (when process is accepted)"
                />
            </Grid>
        </Grid>
    );
}

function ProcessDetailsForm({ user, vehicle, process, onProcessChange }) {
    const formGrid =
        process.processType == 'REGISTRATION' ? (
            <RegisterProcessFormFields
                user={user}
                vehicle={vehicle}
                process={process}
                onProcessChange={onProcessChange}
            />
        ) : (
            <DeregisterProcessFormFields
                vehicle={vehicle}
                process={process}
                onProcessChange={onProcessChange}
            />
        );

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Process Details
            </Typography>
            {formGrid}
        </React.Fragment>
    );
}

export default withRouter(ProcessDetailsForm);
