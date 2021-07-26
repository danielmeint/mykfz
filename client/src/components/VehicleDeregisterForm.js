import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router';
import { useParams } from 'react-router-dom';
import VehicleService from '../services/VehicleService';
import PaymentForm from './PaymentForm';
import ProcessDetailsForm from './ProcessDetailsForm';
import Review from './Review';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative'
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3)
        }
    },
    stepper: {
        padding: theme.spacing(3, 0, 5)
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1)
    },
    alert: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1)
    }
}));

const steps = [
    'Process details',
    'Payment details',
    'Review your registration'
];

function isNumLet(input) {
    var re = /^[0-9a-zA-Z]+$/;
    return re.test(input);
}

function VehicleDeregisterForm({ user }) {
    const classes = useStyles();
    let { vehicleId } = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [process, setProcess] = useState({
        processType: 'DEREGISTRATION',
        date: Date(),
        state: 'PENDING',
        info: {
            reservePlate: false,
            secCodeI: '',
            plateCode: ''
        },
        isPaid: false,
        paymentDetails: {}
    });

    const [vehicle, setVehicle] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const vehicleResult = await VehicleService.getVehicle(vehicleId);
            setVehicle(vehicleResult);
            setLoading(false);
        };

        fetchData();
    }, []);

    const onProcessPaid = (details, data) => {
        if (details && data) {
            setProcess((prevState) => ({
                ...prevState,
                isPaid: true,
                paymentDetails: details
            }));
        } else {
            setProcess((prevState) => ({
                ...prevState,
                isPaid: true
            }));
        }
    };

    const onProcessChange = (e) => {
        let { name, value } = e.target;
        const processInfo = process.info;
        if (name === 'reservePlate') {
            // check checked
            value = e.target.checked;
        }
        processInfo[name] = value;
        setProcess((prevState) => ({
            ...prevState,
            ['info']: processInfo
        }));
    };

    const handleNext = () => {
        if (
            process.info.secCodeI.length != 7 ||
            !isNumLet(process.info.secCodeI)
        ) {
            setErrorMessage('Provide a valid security code.');
            return;
        } else if (
            process.info.plateCode.length != 3 ||
            !isNumLet(process.info.plateCode)
        ) {
            setErrorMessage('Provide a valid plate code.');
            return;
        } else {
            setActiveStep(activeStep + 1);
            setErrorMessage('');
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ProcessDetailsForm
                        user={user}
                        process={process}
                        onProcessChange={onProcessChange}
                        vehicle={vehicle}
                    />
                );
            case 1:
                return (
                    <PaymentForm
                        process={process}
                        onProcessPaid={onProcessPaid}
                    />
                );
            case 2:
                return <Review vehicle={vehicle} process={process} />;
            default:
                throw new Error('Unknown step');
        }
    };

    const handleSubmit = async () => {
        if (!isSubmitting) {
            setIsSubmitting(true);
            await VehicleService.createProcess(vehicleId, process);
            setIsSubmitting(false);
            setActiveStep(activeStep + 1);
        }
    };

    const isProcessComplete = (process) => {
        return (
            (process.processType == 'REGISTRATION' &&
                process.info.licensePlate &&
                process.info.evb &&
                process.info.iban &&
                process.info.secCodeII) ||
            (process.processType == 'DEREGISTRATION' &&
                process.info.secCodeI &&
                process.info.plateCode)
        );
    };

    const getStepButton = (step) => {
        switch (step) {
            case 0:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isProcessComplete(process)}
                        onClick={handleNext}
                        className={classes.button}
                    >
                        Next
                    </Button>
                );
            case 1:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!process.isPaid}
                        onClick={handleNext}
                        className={classes.button}
                    >
                        Next
                    </Button>
                );
            case 2:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className={classes.button}
                    >
                        Complete Deregistration
                    </Button>
                );
            default:
                throw new Error('Unknown step');
        }
    };

    if (loading) {
        return <h2>Loading</h2>;
    }

    return (
        <React.Fragment>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Deregister Vehicle
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Thank you for your request.
                                </Typography>
                                <Typography variant="subtitle1">
                                    An employee will review your information.
                                    You can see the state of your process on the
                                    dashboard.
                                </Typography>
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
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <div className={classes.buttons}>
                                    {errorMessage && (
                                        <Grid
                                            className={classes.alert}
                                            item
                                            xs={12}
                                        >
                                            <Alert severity="error">
                                                {errorMessage}
                                            </Alert>
                                        </Grid>
                                    )}

                                    {activeStep !== 0 && (
                                        <Button
                                            onClick={handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {getStepButton(activeStep)}
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </Paper>
            </main>
        </React.Fragment>
    );
}

export default withRouter(VehicleDeregisterForm);
