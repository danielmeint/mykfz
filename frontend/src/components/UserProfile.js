'use strict';
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import DistrictService from '../services/DistrictService';
import UserService from '../services/UserService';

export default function UserProfile() {
    const [user, setUser] = useState({});
    const [district, setDistrict] = useState({});
    const [avatarLetters, setAvatarLetters] = useState([]);
    useEffect(() => {
        const fetchUserProfileData = async () => {
            let userResult = await UserService.getUserDetails();
            let districtResult = await DistrictService.getDistrict(
                userResult.address.district
            );
            setUser(userResult);
            setDistrict(districtResult);
            setAvatarLetters([
                userResult.firstName.charAt(0),
                userResult.lastName.charAt(0)
            ]);
        };

        fetchUserProfileData();
    }, []);
    return (
        <Grid
            justify="space-between"
            container
            direction="column"
            alignItems="center"
            justify="center"
        >
            <Grid item>
                <Card style={{ padding: '20px', maxWidth: '500px' }}>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography
                                    style={{ marginBottom: '10px' }}
                                    component="h5"
                                    variant="h5"
                                >
                                    Personal Data
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom variant="subtitle1">
                                    Email Address:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom variant="subtitle1">
                                    {user.username}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom variant="subtitle1">
                                    Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom variant="subtitle1">
                                    {user.firstName + ' ' + user.lastName}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom variant="subtitle1">
                                    Address:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom variant="subtitle1">
                                    {user.address
                                        ? user.address.street +
                                          ' ' +
                                          user.address.houseNumber
                                        : []}{' '}
                                    <br />
                                    {user.address
                                        ? user.address.zipCode +
                                          ' ' +
                                          user.address.city
                                        : []}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Avatar
                                    src={district.picture}
                                    imgProps={{
                                        style: { objectFit: 'contain' }
                                    }}
                                >
                                    {avatarLetters[0] + avatarLetters[1]}
                                </Avatar>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom variant="subtitle1">
                                    ID number:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom variant="subtitle1">
                                    {user.identityDocument
                                        ? user.identityDocument.idId
                                        : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
