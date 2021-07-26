import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    CssBaseline,
    Grid,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Copyright from '../Copyright';
import Offering from './Offering';
import Video from './Video';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '110%',
        width: '100%',
        backgroundImage: `url(${'https://media.istockphoto.com/photos/the-gray-and-silver-are-light-black-with-white-the-gradient-is-the-picture-id1257367584?b=1&k=6&m=1257367584&s=170667a&w=0&h=xCJhP9RRYYYx-d2yX0HhFvnsGAuTAQA4EI-LfN9OcQc='})`,
        backgroundRepeat: 'no_repeat',
        backgroundSize: 'cover'
    },
    offering: {
        width: '100vw'
    },
    heroContent: {
        padding: theme.spacing(10, 0, 10)
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
        height: 100
    },
    copyright: {
        paddingBottom: '2vh'
    },
    logos: {
        minheight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        logo: {
            maxWidth: 200
        },
        getStarted: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '10vw'
        }
    }
}));

const tiers = [
    {
        title: 'Deregistration',
        price: '5,70€',
        description: [
            'Possible for cars licensed after 2015 that feature the new security code',
            'Cheaper than on site'
        ]
    },
    {
        title: 'Registration',
        price: '27,90€',
        description: [
            'Benefit from the security codes on the new type of vehicle certificate',
            'Use your plate reservation'
        ]
    },
    {
        title: 'License plate reservation',
        price: '10,20€',
        description: [
            'Only pay fee after using the plate during registration, otherwise it is free',
            'Reserve up to 5 plates for 30 days'
        ]
    }
];

export default function LandingPage({ offer }) {
    let history = useHistory();
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);

    return (
        <body>
            <div className={classes.root}>
                <div style={{ height: '100vh' }}>
                    <Video />
                </div>
                <CssBaseline></CssBaseline>
                <div>
                    <Container
                        maxWidth="md"
                        component="main"
                        className={classes.heroContent}
                    >
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            Our idea
                        </Typography>
                        <Typography
                            variant="h4"
                            align="center"
                            color="textSecondary"
                            component="p"
                            maxwidth="sm"
                        >
                            myKFZ is an online vehicle registration platform to
                            enable citizens to register and deregister cars and
                            motorcycles from the comfort of their own home.
                        </Typography>
                    </Container>
                </div>
                <Container
                    maxWidth="xl"
                    component="main"
                    className={classes.heroContent}
                >
                    <Offering className={classes.offering} />
                </Container>
                <div id="pricing">
                    <Container
                        maxWidth="md"
                        component="main"
                        className={classes.heroContent}
                    >
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            Pricing
                        </Typography>
                        <Typography
                            variant="h4"
                            align="center"
                            color="textSecondary"
                            component="p"
                            maxwidth="sm"
                        >
                            All myKFZ-specific services are provided for free.
                            Processes offered together with the respective
                            districts are similar in price compared to
                            initiation at the district office.
                        </Typography>
                    </Container>
                    <Container maxWidth="xl" component="main">
                        <Grid container spacing={5} alignItems="flex-end">
                            {tiers.map((tier) => (
                                <Grid item key={tier.title} sm={12} md={4}>
                                    <Card>
                                        <CardHeader
                                            title={tier.title}
                                            subheader={tier.subheader}
                                            titleTypographyProps={{
                                                align: 'center'
                                            }}
                                            subheaderTypographyProps={{
                                                align: 'center'
                                            }}
                                            className={classes.cardHeader}
                                        />
                                        <CardContent>
                                            <div
                                                className={classes.cardPricing}
                                            >
                                                <Typography
                                                    component="h2"
                                                    variant="h6"
                                                    color="textPrimary"
                                                    align="center"
                                                >
                                                    {tier.price}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                ></Typography>
                                            </div>
                                            {tier.description.map((line) => (
                                                <Typography
                                                    variant="subtitle1"
                                                    align="center"
                                                >
                                                    {line}
                                                </Typography>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </div>
                <Container
                    maxWidth="md"
                    component="main"
                    className={classes.heroContent}
                >
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >
                        In cooperation with
                    </Typography>
                    <div className={classes.logos}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/cd/BMI_Logo.svg"
                            alt="BMI"
                            className={classes.logo}
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg"
                            alt="TUM"
                            className={classes.logo}
                        />
                        <img
                            src="https://wwwmatthes.in.tum.de/document/download?id=bv58sfhkoi0q"
                            alt="SEBIS"
                            className={classes.logo}
                        />
                    </div>
                    <div className={classes.getStarted}>
                        <Button
                            onClick={() => {
                                history.push('/login');
                            }}
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Get started
                        </Button>
                    </div>
                </Container>
                <Box pt={4} className={classes.copyright}>
                    <Copyright />
                    <Typography
                        variant="caption"
                        align="center"
                        display="block"
                        color="textSecondary"
                        gutterBottom
                    >
                        Video CC by http://www.beachfrontbroll.com/
                    </Typography>
                </Box>
            </div>
        </body>
    );
}
