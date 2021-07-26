import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { AppBar, Collapse, IconButton, Toolbar } from '@material-ui/core';
import Offering from './Offering';
import Welcome from './Welcome';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',

        // backgroundImage: `url(${
        //   process.env.PUBLIC_URL + "/assets/landingpagebackground.png"
        // })`,
        backgroundImage: `url(${'https://image.freepik.com/vektoren-kostenlos/eleganter-weisser-hintergrund-mit-glaenzenden-linien_1017-17580.jpg'})`,
        backgroundRepeat: 'no_repeat',
        backgroundSize: 'cover'
    }
}));

export default function LandingPage({ offer }) {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline></CssBaseline>
            <Welcome></Welcome>
            <Offering></Offering>
        </div>
    );
}
