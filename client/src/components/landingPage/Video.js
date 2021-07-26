import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logo_large from '../../../resources/logo_large.png';
import logo from '../../../resources/logo_small.png';

const useStyles = makeStyles((theme) => ({
    root: {
        fontFamily: 'Open Sans',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
    },
    welcome: {
        color: 'white'
    },
    logoLarge: {
        width: '35vw',
        marginBottom: '2vw'
    },
    video: {
        background: 'lightgrey',
        objectFit: 'cover',
        width: '100vw',
        height: '100vh',
        zIndex: -1
    },
    content: {
        zIndex: 1
    },
    videoHeader: {
        position: 'absolute',
        textAlign: 'center',
        width: '100vw',
        height: '100vh'
    },
    secondHeader: {
        marginTop: '-70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

function Header() {
    let history = useHistory();
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);
    return (
        <div>
            <AppBar position="absolute">
                <Toolbar>
                    <Grid
                        container
                        style={{ position: 'fixed' }}
                        alignItems="center"
                        justify="space-between"
                        spacing={4}
                    >
                        <Grid item>
                            <img
                                src={logo}
                                style={{ height: '35px' }}
                                alt="logo"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={() => {
                                    history.push('/login');
                                }}
                                style={{ marginRight: '2vw' }}
                                color="inherit"
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <header className={classes.videoHeader}>
                <video
                    className={classes.video}
                    style={{ zIndex: -1 }}
                    src="https://static.videezy.com/system/resources/previews/000/000/094/original/FroggerHighway.mp4"
                    autoplay="autoplay"
                    loop="loop"
                    muted
                ></video>
                <div className={classes.secondHeader}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={classes.content}
                    >
                        <Grid item>
                            <Typography
                                className={classes.welcome}
                                variant="h1"
                            >
                                Welcome to
                            </Typography>
                        </Grid>
                        <Grid item>
                            <img
                                className={classes.logoLarge}
                                src={logo_large}
                                alt="logo"
                            />
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid item>
                                    <Button
                                        onClick={() => {
                                            history.push('/register');
                                        }}
                                        variant="contained"
                                    >
                                        Register
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={() => {
                                            history.push('/login');
                                        }}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </header>
        </div>
    );
}

export default Header;
