import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
    }
}));

export default function SignInSide(props) {
    let history = useHistory();
    const classes = useStyles();
    const [account, setAccount] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        account[name] = value;
        setAccount(account);
    };

    const login = (e) => {
        e.preventDefault();
        try {
            UserService.login(account.username, account.password)
                .then(() => {
                    console.log('ERROR2');
                    history.push('/');
                })
                .catch((error) => {
                    if (error == 'User Not Found') {
                        setErrorMessage(
                            'The username you entered does not belong to an account. Please check your username and try again.'
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
                                console.log(error);
                                setErrorMessage(
                                    'There is an issue with the login process, please contact the customer service.'
                                );
                            }
                        }
                    }
                });
        } catch (err) {
            console.error(err);
            setErrorMessage(err);
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
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
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
                        <Grid container>
                            <Grid item xs></Grid>
                            <Grid item>
                                <Link href="/#/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>

                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
