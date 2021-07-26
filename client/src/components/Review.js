import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import LicensePlateService from '../services/LicensePlateService';
import ProcessService from '../services/ProcessService';

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0)
    },
    total: {
        fontWeight: 700
    },
    title: {
        marginTop: theme.spacing(2)
    }
}));

function RegistrationReviewList({ process }) {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [plate, setPlate] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const plateId = process.info.licensePlate;
            const plate = await LicensePlateService.getLicensePlate(plateId);

            setPlate(plate);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Grid item xs={12}>
            <List disablePadding>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Process Type" />
                    <Typography variant="body2">
                        {process.processType}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="License Plate" />
                    <Typography variant="body2">
                        {`${plate.areaCode} - ${plate.letters} ${plate.digits}`}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="EVB" />
                    <Typography variant="body2">{process.info.evb}</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Security Code II" />
                    <Typography variant="body2">
                        {process.info.secCodeII}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="IBAN for vehicle tax" />
                    <Typography variant="body2">{process.info.iban}</Typography>
                </ListItem>
                <Divider />
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Registration fee" />
                    <Typography variant="body2">€27.90</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Reserved license plate fee" />
                    <Typography variant="body2">€10.20</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" className={classes.total}>
                        €{ProcessService.calculatePrice(process).toFixed(2)}
                    </Typography>
                </ListItem>
            </List>
        </Grid>
    );
}

function DeregistrationReviewList({ process }) {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <List disablePadding>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Process Type" />
                    <Typography variant="body2">
                        {process.processType}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="License Plate Security Code" />
                    <Typography variant="body2">
                        {process.info.plateCode}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Security Code I" />
                    <Typography variant="body2">
                        {process.info.secCodeI}
                    </Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Reserve License Plate?" />
                    <Typography variant="body2">
                        {process.info.reservePlate ? 'Yes' : 'No'}
                    </Typography>
                </ListItem>
                <Divider />
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Deregistration fee" />
                    <Typography variant="body2">€5.70</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" className={classes.total}>
                        €{ProcessService.calculatePrice(process).toFixed(2)}
                    </Typography>
                </ListItem>
            </List>
        </Grid>
    );
}

export default function Review({ vehicle, process }) {
    const classes = useStyles();

    let payerName = '';
    try {
        payerName = `${process.paymentDetails.payer.name.given_name} ${process.paymentDetails.payer.name.surname}`;
    } catch (e) {}

    let payerEmail = '';
    try {
        payerEmail = process.paymentDetails.payer.email_address;
    } catch (e) {}

    let payerId = '';
    try {
        payerId = process.paymentDetails.payer.payer_id;
    } catch (e) {}

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Process summary
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert severity="info">
                        You are about to{' '}
                        <strong>
                            {process.processType == 'REGISTRATION'
                                ? 'register'
                                : 'deregister'}
                        </strong>{' '}
                        vehicle {vehicle.vin} with the following information:
                    </Alert>
                </Grid>
                {process.processType == 'REGISTRATION' ? (
                    <RegistrationReviewList process={process} />
                ) : (
                    <DeregistrationReviewList process={process} />
                )}

                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.title}
                    >
                        Payment details
                    </Typography>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Name</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{payerName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>E-Mail</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{payerEmail}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Payer ID</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{payerId}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
