import { InputAdornment, Tooltip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import SecurityIcon from '@material-ui/icons/Security';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useRef, useState } from 'react';
import { Checkmark } from 'react-checkmark';
import { useHistory } from 'react-router-dom';
import DistrictService from '../services/DistrictService';
import UserService from '../services/UserService';
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage:
            'url(https://www.anytimeholidays.com.my/wp-content/uploads/2019/01/rental-car-facebook.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'right'
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    buttonSuccess: {
        backgroundColor: '#7ac142',
        '&:hover': {
            backgroundColor: '#7ac142'
        }
    }
}));

const LightTooltip = withStyles(() => ({
    tooltip: {
        backgroundColor: '#3f51b5',
        color: 'white',
        fontSize: 14,
        fontFamily: 'Nunito'
    }
}))(Tooltip);

function validateEmail(email) {
    var re =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
}

function isnum(input) {
    var re = /^\d+$/;
    return re.test(input);
}

function isletter(input) {
    var re = /^[a-zA-ZäöüÄÖÜ -]+$/i;
    return re.test(input);
}

function isNumLet(input) {
    var re = /^[0-9a-zA-Z]+$/;
    return re.test(input);
}

export default function SignUpSide(props) {
    let history = useHistory();
    const classes = useStyles();
    const [account, setAccount] = useState({
        username: '',
        password: '',
        passwordRepeat: '',
        firstName: '',
        lastName: '',
        district: '',
        zipCode: '',
        city: '',
        street: '',
        houseNumber: '',
        idId: ''
    });
    const [districtLogo, setDistrictLogo] = useState(null);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const descriptionElementRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const districtData = await DistrictService.getDistricts();
            setDistrictOptions(districtData);
        };

        fetchData();
    }, []);

    const handleClickOpen = () => {
        setAccepted(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = () => {
        setAccepted(true);
        setOpen(false);
    };

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        account[name] = value;
        setAccount(account);
    };

    const handleDistrictChange = (e, value) => {
        account.district = value._id;
        setDistrictLogo(value.picture);
    };

    const register = (e) => {
        e.preventDefault();
        console.log(validateEmail(account.username));

        if (!validateEmail(account.username) || account.username.length < 5) {
            setErrorMessage('Please provide a valid email address.');
            return;
        }
        if (account.password.length < 4) {
            setErrorMessage(
                'Your password is not valid. It requires at least 4 characters.'
            );
            return;
        } else {
            {
                if (account.password != account.passwordRepeat) {
                    setErrorMessage(
                        'Your passwords do not match. Please correct your repeat password.'
                    );
                    return;
                }
            }
        }
        if (account.firstName.length < 2 || !isletter(account.firstName)) {
            setErrorMessage('Please fill in your first name.');
            return;
        }
        if (account.lastName.length < 2 || !isletter(account.lastName)) {
            setErrorMessage('Please fill in your last name');
            return;
        }
        if (account.district === '') {
            setErrorMessage('Please select your district.');
            return;
        }
        if (account.city.length < 2 || !isletter(account.city)) {
            setErrorMessage('Please provide your city.');
            return;
        }
        if (account.idId === '' || !isNumLet(account.idId)) {
            setErrorMessage(
                'Please type in your identity document information.'
            );
            return;
        }
        if (
            account.houseNumber > 999 ||
            account.houseNumber < 0 ||
            account.houseNumber.length == 0 ||
            !isnum(account.houseNumber)
        ) {
            setErrorMessage('Please provide your correct housenumber.');
            return;
        }
        if (account.zipCode.length != 5 || !isnum(account.zipCode)) {
            setErrorMessage(
                'Please provide your correct zip code. It consists of 5 digits.'
            );
            return;
        }
        if (account.street.length < 3) {
            setErrorMessage(
                'Please provide your correct street. It consists of at least 3 characters.'
            );
            return;
        }
        if (account.idId < 4) {
            setErrorMessage(
                'Please type in your identity document information.'
            );
            return;
        }

        let user = {
            username: account.username,
            password: account.password,
            firstName: account.firstName,
            lastName: account.lastName,
            address: {
                district: account.district,
                zipCode: account.zipCode,
                city: account.city,
                street: account.street,
                houseNumber: account.houseNumber
            },
            identityDocument: {
                idId: account.idId
            },
            isDistrictUser: false
        };

        try {
            UserService.register(user)
                .then(() => {
                    history.push('/');
                })
                .catch((error) => {
                    if (error == 'Failed to fetch') {
                        setErrorMessage(
                            'Login is currently not possible due to a server error, we are working on a solution.'
                        );
                    } else {
                        if (error == 'User exists') {
                            setErrorMessage(
                                'This user already exits, if it is your account please log in via the login form, if not contact the customer service.'
                            );
                        } else {
                            console.log(error);
                            setErrorMessage(
                                'There is an issue with the register process, please contact the customer service.'
                            );
                        }
                    }
                });
        } catch (err) {
            console.error(err);
        }
    };

    const PrivacyDialog = () => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Privacy Statement
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <h1>Disclaimer</h1>
                        <p>Last updated: July 25, 2021</p>
                        <h1>Interpretation and Definitions</h1>
                        <h2>Interpretation</h2>
                        <p>
                            The words of which the initial letter is capitalized
                            have meanings defined under the following
                            conditions. The following definitions shall have the
                            same meaning regardless of whether they appear in
                            singular or in plural.
                        </p>
                        <h2>Definitions</h2>
                        <p>For the purposes of this Disclaimer:</p>
                        <ul>
                            <li>
                                <strong>Company</strong> (referred to as either
                                &quot;the Company&quot;, &quot;We&quot;,
                                &quot;Us&quot; or &quot;Our&quot; in this
                                Disclaimer) refers to MyKfz, Arcisstraße 21,
                                80333 München.
                            </li>
                            <li>
                                <strong>Service</strong> refers to the Website.
                            </li>
                            <li>
                                <strong>You</strong> means the individual
                                accessing the Service, or the company, or other
                                legal entity on behalf of which such individual
                                is accessing or using the Service, as
                                applicable.
                            </li>
                            <li>
                                <strong>Website</strong> refers to MyKfz,
                                accessible from{' '}
                                <a
                                    href="http://mykfz.eu"
                                    rel="external nofollow noopener"
                                    target="_blank"
                                >
                                    http://mykfz.eu
                                </a>
                            </li>
                        </ul>
                        <h1>Disclaimer</h1>
                        <p>
                            The information contained on the Service is for
                            general information purposes only.
                        </p>
                        <p>
                            The Company assumes no responsibility for errors or
                            omissions in the contents of the Service.
                        </p>
                        <p>
                            In no event shall the Company be liable for any
                            special, direct, indirect, consequential, or
                            incidental damages or any damages whatsoever,
                            whether in an action of contract, negligence or
                            other tort, arising out of or in connection with the
                            use of the Service or the contents of the Service.
                            The Company reserves the right to make additions,
                            deletions, or modifications to the contents on the
                            Service at any time without prior notice. This
                            Disclaimer has been created with the help of the{' '}
                            <a
                                href="https://www.privacypolicies.com/disclaimer-generator/"
                                target="_blank"
                            >
                                Disclaimer Generator
                            </a>
                            .
                        </p>
                        <p>
                            The Company does not warrant that the Service is
                            free of viruses or other harmful components.
                        </p>
                        <h1>External Links Disclaimer</h1>
                        <p>
                            The Service may contain links to external websites
                            that are not provided or maintained by or in any way
                            affiliated with the Company.
                        </p>
                        <p>
                            Please note that the Company does not guarantee the
                            accuracy, relevance, timeliness, or completeness of
                            any information on these external websites.
                        </p>
                        <h1>Errors and Omissions Disclaimer</h1>
                        <p>
                            The information given by the Service is for general
                            guidance on matters of interest only. Even if the
                            Company takes every precaution to insure that the
                            content of the Service is both current and accurate,
                            errors can occur. Plus, given the changing nature of
                            laws, rules and regulations, there may be delays,
                            omissions or inaccuracies in the information
                            contained on the Service.
                        </p>
                        <p>
                            The Company is not responsible for any errors or
                            omissions, or for the results obtained from the use
                            of this information.
                        </p>
                        <h1>Fair Use Disclaimer</h1>
                        <p>
                            The Company may use copyrighted material which has
                            not always been specifically authorized by the
                            copyright owner. The Company is making such material
                            available for criticism, comment, news reporting,
                            teaching, scholarship, or research.
                        </p>
                        <p>
                            The Company believes this constitutes a &quot;fair
                            use&quot; of any such copyrighted material as
                            provided for in section 107 of the United States
                            Copyright law.
                        </p>
                        <p>
                            If You wish to use copyrighted material from the
                            Service for your own purposes that go beyond fair
                            use, You must obtain permission from the copyright
                            owner.
                        </p>
                        <h1>Views Expressed Disclaimer</h1>
                        <p>
                            The Service may contain views and opinions which are
                            those of the authors and do not necessarily reflect
                            the official policy or position of any other author,
                            agency, organization, employer or company, including
                            the Company.
                        </p>
                        <p>
                            Comments published by users are their sole
                            responsibility and the users will take full
                            responsibility, liability and blame for any libel or
                            litigation that results from something written in or
                            as a direct result of something written in a
                            comment. The Company is not liable for any comment
                            published by users and reserve the right to delete
                            any comment for any reason whatsoever.
                        </p>
                        <h1>No Responsibility Disclaimer</h1>
                        <p>
                            The information on the Service is provided with the
                            understanding that the Company is not herein engaged
                            in rendering legal, accounting, tax, or other
                            professional advice and services. As such, it should
                            not be used as a substitute for consultation with
                            professional accounting, tax, legal or other
                            competent advisers.
                        </p>
                        <p>
                            In no event shall the Company or its suppliers be
                            liable for any special, incidental, indirect, or
                            consequential damages whatsoever arising out of or
                            in connection with your access or use or inability
                            to access or use the Service.
                        </p>
                        <h1>&quot;Use at Your Own Risk&quot; Disclaimer</h1>
                        <p>
                            All information in the Service is provided &quot;as
                            is&quot;, with no guarantee of completeness,
                            accuracy, timeliness or of the results obtained from
                            the use of this information, and without warranty of
                            any kind, express or implied, including, but not
                            limited to warranties of performance,
                            merchantability and fitness for a particular
                            purpose.
                        </p>
                        <p>
                            The Company will not be liable to You or anyone else
                            for any decision made or action taken in reliance on
                            the information given by the Service or for any
                            consequential, special or similar damages, even if
                            advised of the possibility of such damages.
                        </p>
                        <h1>Contact Us</h1>
                        <p>
                            If you have any questions about this Disclaimer, You
                            can contact Us:
                        </p>
                        <ul>
                            <li>By email: mike@mykfz.eu</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAccept} color="primary">
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const PrivacyButton = () => {
        if (accepted)
            return (
                <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    justify="center"
                >
                    <Grid item>
                        <Checkmark size="48px" className={classes.submit} />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.buttonSuccess}
                            onClick={handleClickOpen}
                        >
                            Accepted
                        </Button>
                    </Grid>
                </Grid>
            );
        else
            return (
                <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    justify="center"
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleClickOpen}
                        startIcon={<SecurityIcon />}
                    >
                        Read Privacy
                    </Button>
                </Grid>
            );
    };
    const tooltipImgTxt = (
        <div>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={1}
            >
                <Grid item>
                    <label>
                        To check your identity we need your identity document
                        number. You can find it on the top right of your id.
                    </label>
                </Grid>
                <Grid item>
                    <img
                        width="282"
                        height="200"
                        src="http://www.kartenlesegeraet-personalausweis.de/bilder/ausweisnummer-neuer-personalausweis.jpg"
                        alt=""
                    ></img>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item sm={false} md={7} className={classes.image} />
            <Grid item sm={12} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Email Address"
                                    name="username"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="passwordRepeat"
                                    label="Repeat Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={districtOptions}
                                    getOptionLabel={(option) => option.name}
                                    name="district"
                                    required={true}
                                    fullWidth
                                    onChange={handleDistrictChange}
                                    renderOption={(option) => (
                                        <React.Fragment>
                                            <Avatar
                                                imgProps={{
                                                    style: {
                                                        objectFit: 'contain'
                                                    }
                                                }}
                                                variant="square"
                                                alt={'D'}
                                                src={option.picture}
                                            />
                                            <span>&nbsp;{option.name}</span>
                                        </React.Fragment>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required={true}
                                            label="District"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            {account.district ? (
                                <Grid item xs={3}>
                                    <Grid
                                        container
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <Avatar
                                                imgProps={{
                                                    style: {
                                                        objectFit: 'contain'
                                                    }
                                                }}
                                                variant="square"
                                                alt={'District'}
                                                src={districtLogo}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item xs={3}></Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="city"
                                    label="City"
                                    name="city"
                                    autoComplete="city"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="zipCode"
                                    label="Zip Code"
                                    name="zipCode"
                                    autoComplete="postal-code"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="street"
                                    label="Street"
                                    name="street"
                                    autoComplete="street-address"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="houseNumber"
                                    label="House Number"
                                    name="houseNumber"
                                    autoComplete="houseNumber"
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="idId"
                                    label="Identity Document"
                                    name="idId"
                                    autoFocus
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <LightTooltip
                                                title={tooltipImgTxt}
                                                placement="right"
                                            >
                                                <InputAdornment position="end">
                                                    <InfoOutlinedIcon color="inherit" />
                                                </InputAdornment>
                                            </LightTooltip>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <PrivacyButton />
                            </Grid>
                        </Grid>

                        <PrivacyDialog />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={register}
                            disabled={!accepted}
                        >
                            Register
                        </Button>
                        <div>
                            {errorMessage && (
                                <Grid item xs={12}>
                                    <Alert severity="error">
                                        {errorMessage}
                                    </Alert>
                                </Grid>
                            )}
                        </div>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
