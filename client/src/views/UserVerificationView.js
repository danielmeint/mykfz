'use strict';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Redirect, useHistory } from 'react-router-dom';
import Copyright from '../components/Copyright';
import UserVerification from '../components/UserVerification';
import UserService from '../services/UserService';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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
    verifiedIcon: {
        margin: theme.spacing(3, 'auto')
    }
}));

function UserVerificationContent({ user, verified, verifyUser }) {
    const classes = useStyles();
    return (
        <div>
            {verificationForm}
            {actionButton}
        </div>
    );
}

function UserVerificationView(props) {
    let history = useHistory();
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let userResult = await UserService.getUserDetails();
            if (userResult.isDistrictUser) {
                // automatically verify district user
                verifyUser();
            }
            setUser(userResult);
        };
        fetchData();
    }, []);

    const verifyUser = () => {
        UserService.verify();
        setVerified(true);
        history.push('/');
    };

    const cancel = () => {
        UserService.logout();
        history.push('/');
    };

    function VerifyButton() {
        return (
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={verifyUser}
            >
                Verify x
            </Button>
        );
    }

    function CancelButton() {
        return (
            <Button
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={cancel}
            >
                Cancel
            </Button>
        );
    }

    if (user.isDistrictUser && verified) {
        return <Redirect to={'/dashboard'} />;
    }

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
        >
            <CssBaseline />
            <Grid item>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                </div>
            </Grid>
            <Grid item>
                <Typography component="h1" variant="h5">
                    Authentication
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography
                    variant="subtitle2"
                    align="center"
                    display="block"
                    color="textSecondary"
                >
                    Since our myKFZ processes are legally binding procedures, we
                    first ask you to verify your identity. Hold your ID card or
                    passport in front of the camera. Your name and id number
                    must be clearly visible. After capturing, you can still
                    adjust the brightness of the image on the right side. Start
                    the authentication process by clicking on "Recognize".
                </Typography>
            </Grid>
            <Grid item>
                <UserVerification />
            </Grid>
            <Grid
                item
                style={{
                    opacity: 0,
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                }}
            >
                <VerifyButton />
            </Grid>
            <Grid item>
                <CancelButton />
            </Grid>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Grid>
    );
}

export default withRouter(UserVerificationView);
