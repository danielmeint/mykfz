import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
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
            'url(https://images.unsplash.com/photo-1485920694980-9c5db37b0d44?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg)',
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
    avatarDistrict: {
        margin: theme.spacing(1)
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function SignInSide(props) {
    let history = useHistory();
    const classes = useStyles();
    const [account, setAccount] = useState({
        username: '',
        password: ''
    });
    const [districtUserOptions, setDistrictUserOptions] = useState([]);
    const [districtLogo, setDistrictLogo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const districtData = await DistrictService.getDistricts();
            const allUser = await UserService.getAllUser();
            const districtUser = allUser.filter(function (u) {
                return u.isDistrictUser;
            });

            const districtUserOptions = districtUser.map((user) => {
                var district = districtData.find((d) => {
                    return d.user == user.username;
                });

                var obj = {};
                obj['name'] = district.name;
                obj['picture'] = district.picture;
                obj['username'] = user.username;

                return obj;
            });
            setDistrictUserOptions(districtUserOptions);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        account[name] = value;
        setAccount(account);
    };

    const handleDistrictChange = (e, value) => {
        account.username = value.username;
        setDistrictLogo(value.picture);
    };

    const login = (e) => {
        e.preventDefault();
        try {
            UserService.districtLogin(account.username, account.password)
                .then(() => {
                    history.push('/');
                })
                .catch((error) => {
                    if (error == 'User Not Found') {
                        setErrorMessage(
                            'The district you selected does not have permisson to log in. Please contact customer service.'
                        );
                    } else {
                        if (error == 'Unauthorized') {
                            setErrorMessage(
                                'Sorry, your password was incorrect. Please double-check your password.'
                            );
                        } else {
                            if (error == 'Failed to fetch') {
                                setErrorMessage(
                                    'Login is currently not possible due to a server error, we are working on a solution.'
                                );
                            } else {
                                setErrorMessage(
                                    'There is an issue with the login process, please contact the customer service.'
                                );
                            }
                        }
                    }
                });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    {account.username ? (
                        <Avatar
                            imgProps={{
                                style: { objectFit: 'contain' }
                            }}
                            className={classes.avatarDistrict}
                            variant="square"
                            alt={'District'}
                            src={districtLogo}
                        />
                    ) : (
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                    )}
                    <Typography component="h1" variant="h5">
                        District Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid item>
                            <Autocomplete
                                options={districtUserOptions}
                                getOptionLabel={(option) => option.name}
                                name="username"
                                required={true}
                                fullWidth
                                onChange={handleDistrictChange}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        {/* <Avatar
                                            variant="square"
                                            alt={'D'}
                                            src={option.picture}
                                        /> */}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={login}
                        >
                            Login
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
