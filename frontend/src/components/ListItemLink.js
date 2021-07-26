import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListItemLink({ icon, text, url }) {
    return (
        <ListItem button component={Link} to={url}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    );
}
