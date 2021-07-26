'use strict';

import {
    Button,
    CircularProgress,
    Fab,
    Grid,
    Slider,
    Typography
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import LoopIcon from '@material-ui/icons/Loop';
import PhotoIcon from '@material-ui/icons/PhotoCamera';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { useEffect, useRef, useState } from 'react';
import { Checkmark } from 'react-checkmark';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import UserService from '../services/UserService';

const useStyles = makeStyles((theme) => ({
    buttonSuccess: {
        backgroundColor: '#7ac142',
        '&:hover': {
            backgroundColor: '#7ac142'
        }
    },
    buttonFailure: {
        backgroundColor: 'lightsalmon',
        '&:hover': {
            backgroundColor: 'lightsalmon'
        }
    },
    slider: {
        width: 200
    },

    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

const WebcamCapture = () => {
    const classes = useStyles();
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [monochrome, setMonochrome] = useState(null);
    const [running, setRunning] = useState(false);
    const [dropOff, setValue] = useState(320);
    const [verified, setVerified] = useState(0);
    const [user, setUser] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    useEffect(() => {
        const fetchUserProfileData = async () => {
            const userResult = await UserService.getUserDetails();
            setUser(userResult);
        };

        fetchUserProfileData();
    }, []);

    function verifyUser() {
        UserService.verify();
    }

    function startVerification() {
        setCameraActive(true);
    }

    function StartButton() {
        return (
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={startVerification}
            >
                Start Authentication
            </Button>
        );
    }

    // verified states
    // -1: verification failed
    // 0: initial
    // 3: verification successful

    function updateMonochrome(src) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            var imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            for (var i = 0; i < imageData.data.length; i += 4) {
                // var grayscale = imageData.data[i] * .3 + imageData.data[i+1] * .59 + imageData.data[i+2] * .11;
                //     imageData.data[i  ] = grayscale;
                //     imageData.data[i+1] = grayscale;
                //     imageData.data[i+2] = grayscale;

                let count =
                    imageData.data[i] +
                    imageData.data[i + 1] +
                    imageData.data[i + 2];
                let colour = 0;
                if (count > dropOff) colour = 255;

                imageData.data[i] = colour;
                imageData.data[i + 1] = colour;
                imageData.data[i + 2] = colour;
            }

            context.putImageData(imageData, 0, 0);
            var newbase64 = canvas.toDataURL('image/jpeg');
            setMonochrome(newbase64);
        };
        image.src = src;
    }

    function matchesUser(text) {
        text = text.replace(/\s/g, '');
        text = text.toUpperCase();
        const lastName = user.lastName.toUpperCase();
        const firstName = user.firstName.toUpperCase();
        const id = user.identityDocument.idId;

        if (
            text.includes(firstName) ||
            text.includes(lastName) ||
            text.includes(id)
        ) {
            return true;
        } else {
            return false;
        }
    }

    const capture = React.useCallback(() => {
        setVerified(0);
        const imageSrc = webcamRef.current.getScreenshot({
            width: 1000,
            height: 500
        });
        setImageSrc(imageSrc);
        updateMonochrome(imageSrc);
    }, [webcamRef]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        updateMonochrome(imageSrc);
    };

    function recognize() {
        setVerified(0);
        console.log('Start recognize');
        setRunning(true);
        Tesseract.recognize(monochrome, 'eng', {
            logger: (m) => console.log(m)
        }).then((data) => {
            let decision = 0;

            if (matchesUser(data.text)) {
                setVerified(3);
                verifyUser();
            } else {
                setVerified(-1);
            }
            setRunning(false);
        });
    }

    function resetMonochrome() {
        setMonochrome(null);
    }

    function Decision() {
        switch (verified) {
            case 0:
                return [];
            case -1:
                return (
                    <div>
                        <Fab color="primary" className={classes.buttonFailure}>
                            <ClearIcon />
                        </Fab>
                        <Button
                            color="primary"
                            className={classes.buttonFailure}
                            variant="contained"
                        >
                            Failed, try new capture
                        </Button>
                    </div>
                );
            case 3:
                return (
                    <Grid
                        container
                        direction="column"
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Checkmark size="96px" className={classes.submit} />
                        </Grid>
                        <Grid item>
                            <Button
                                color="primary"
                                component={Link}
                                to="/dashboard"
                                variant="contained"
                                className={classes.buttonSuccess}
                            >
                                Continue To Dashboard
                            </Button>
                        </Grid>
                    </Grid>
                );
        }
    }

    function CameraVerification() {
        const liveWebcam = (
            <Grid item>
                <Grid
                    container
                    direction="column"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Webcam
                            imageSmoothing={false}
                            audio={false}
                            height={300}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={600}
                            screenshotQuality={1}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={capture}
                            variant="contained"
                            color="primary"
                            startIcon={<PhotoIcon />}
                        >
                            Capture
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );

        const capturedWebcam = (
            <Grid item>
                <Grid
                    container
                    direction="column"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <img
                            style={{ width: '450px' }}
                            src={monochrome}
                            alt="Image"
                        />
                    </Grid>
                    <Grid item>
                        <div className={classes.slider}>
                            <Typography id="continuous-slider" gutterBottom>
                                Brightness
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <RemoveIcon />
                                </Grid>
                                <Grid item xs>
                                    <Slider
                                        step={5}
                                        value={dropOff}
                                        onChange={handleChange}
                                        min={200}
                                        max={450}
                                    />
                                </Grid>
                                <Grid item>
                                    <AddIcon />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={recognize}
                            variant="contained"
                            color="primary"
                            startIcon={<LoopIcon />}
                        >
                            Recognize
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={resetMonochrome}
                            variant="contained"
                            color="primary"
                        >
                            New capture
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );

        return (
            <Grid
                container
                direction="column"
                spacing={2}
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        justify="center"
                    >
                        {monochrome == null ? liveWebcam : capturedWebcam}
                    </Grid>
                </Grid>
                {running ? (
                    <Grid item xs>
                        {<CircularProgress size={56} />}
                    </Grid>
                ) : (
                    []
                )}
                <Grid item>
                    <Decision />
                </Grid>
            </Grid>
        );
    }

    return cameraActive ? <CameraVerification /> : <StartButton />;
};

export default function UserVerification() {
    return (
        <div>
            <WebcamCapture />
        </div>
    );
}
