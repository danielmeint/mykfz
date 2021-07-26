import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import logo from '../../resources/logo_small.png';
import VehicleForm from '../components/VehicleForm';
import UserService from '../services/UserService';
import Copyright from './Copyright';
import LicensePlateReservationForm from './LicensePlateReservationForm';
import LicensePlateReservationList from './LicensePlateReservationList';
import { mainListItems } from './listItems';
import UserProfile from './UserProfile';
import VehicleDeregisterForm from './VehicleDeregisterForm';
import VehicleList from './VehicleList';
import VehicleRegisterForm from './VehicleRegisterForm';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    toolbar: {
        paddingRight: 24 // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    menuButtonHidden: {
        display: 'none'
    },
    title: {
        marginBottom: '5px'
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9)
        }
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },
    fixedHeight: {
        height: 240
    }
}));

function Dashboard(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const logout = () => {
        UserService.logout();
        if (props.location.pathname != '/') {
            props.history.push('/');
        } else {
            window.location.reload();
        }
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    useEffect(() => {
        const fetchData = async () => {
            let userResult = await UserService.getUserDetails();
            setUser(userResult);
            setLoading(false);
        };

        fetchData();
    }, []);

    const containerContent = loading ? (
        <h2>Loading</h2>
    ) : (
        <Switch>
            <Route exact={true} path="/dashboard">
                <Redirect to={'/dashboard/vehicles'} />
            </Route>
            <Route exact={true} path="/dashboard/vehicles">
                <VehicleList user={user} />
            </Route>
            <Route path="/dashboard/vehicles/:vehicleId/register">
                <VehicleRegisterForm user={user} />
            </Route>
            <Route path="/dashboard/vehicles/:vehicleId/deregister">
                <VehicleDeregisterForm user={user} />
            </Route>
            <Route path="/dashboard/vehicles/:vehicleId/edit">
                <VehicleForm />
            </Route>
            <Route path="/dashboard/add">
                <VehicleForm />
            </Route>
            <Route path="/dashboard/plates">
                <LicensePlateReservationList />
            </Route>
            <Route path="/dashboard/reservation">
                <LicensePlateReservationForm />
            </Route>
            <Route path="/dashboard/user">
                <UserProfile />
            </Route>
        </Switch>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(
                            classes.menuButton,
                            open && classes.menuButtonHidden
                        )}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Grid
                        container
                        style={{ marginRight: 'auto' }}
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>
                            <img
                                src={logo}
                                style={{ height: '35px' }}
                                alt="logo"
                            />
                        </Grid>
                        <Grid item>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                Dashboard
                            </Typography>
                        </Grid>
                    </Grid>

                    <Button
                        color="inherit"
                        onClick={logout}
                        endIcon={<ExitToAppIcon />}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {containerContent}
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
}

export default withRouter(Dashboard);
