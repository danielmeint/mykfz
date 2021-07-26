import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ImageCard from './ImageCard';
import offers from './Offers';

const useStyles = makeStyles((theme) => ({
    root: {
        minheight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('lg')]: {
            flexDirection: 'column'
        }
    }
}));

function Offering() {
    const classes = useStyles();
    return (
        <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item sm={12} lg={4} xl={3}>
                <ImageCard offer={offers[0]} />
            </Grid>
            <Grid item sm={12} lg={4} xl={3}>
                <ImageCard offer={offers[1]} />
            </Grid>
            <Grid item sm={12} lg={4} xl={3}>
                <ImageCard offer={offers[2]} />
            </Grid>
            <Grid item sm={12} lg={4} xl={3}>
                <ImageCard offer={offers[3]} />
            </Grid>
        </Grid>
    );
}

export default Offering;
