import DashboardIcon from '@material-ui/icons/Dashboard';
import SvgIcon from '@material-ui/core/SvgIcon';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import DescriptionIcon from '@material-ui/icons/Description';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateIcon from '@material-ui/icons/Create';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import ListItemLink from './ListItemLink';

export const mainListItems = (
    <div>
        <ListItemLink
            icon={<DirectionsCarIcon />}
            text="Vehicles"
            url="/dashboard/vehicles"
        />
        <ListItemLink
            icon={ <SvgIcon viewBox="0 0 24 24">
                <path d="M 18 1 L 18 4 L 15 4 L 15 6 L 18 6 L 18 9 L 20 9 L 20 6 L 23 6 L 23 4 L 20 4 L 20 1 L 18 1 z M 4.8300781 8.4433594 C 4.234231 8.4433594 3.7384158 8.8228176 3.5488281 9.3554688 L 1.671875 14.763672 L 1.671875 21.986328 C 1.671875 22.482867 2.0776794 22.888672 2.5742188 22.888672 L 3.4765625 22.888672 C 3.9731018 22.888672 4.3789062 22.482867 4.3789062 21.986328 L 4.3789062 21.082031 L 15.212891 21.082031 L 15.212891 21.986328 C 15.212891 22.482867 15.618695 22.888672 16.115234 22.888672 L 17.019531 22.888672 C 17.51607 22.888672 17.921875 22.482867 17.921875 21.986328 L 17.921875 14.763672 L 16.042969 9.3554688 C 15.86241 8.8228175 15.357566 8.4433594 14.761719 8.4433594 L 4.8300781 8.4433594 z M 4.8300781 9.7988281 L 14.761719 9.7988281 L 16.115234 13.861328 L 3.4765625 13.861328 L 4.8300781 9.7988281 z M 4.8300781 15.666016 C 5.579401 15.666016 6.1855469 16.270208 6.1855469 17.019531 C 6.1855469 17.768853 5.579401 18.375 4.8300781 18.375 C 4.0807551 18.375 3.4765625 17.768853 3.4765625 17.019531 C 3.4765625 16.270208 4.0807551 15.666016 4.8300781 15.666016 z M 14.761719 15.666016 C 15.511041 15.666016 16.115234 16.270208 16.115234 17.019531 C 16.115234 17.768853 15.511041 18.375 14.761719 18.375 C 14.012395 18.375 13.408203 17.768853 13.408203 17.019531 C 13.408203 16.270208 14.012395 15.666016 14.761719 15.666016 z "
                />
                </SvgIcon>
            }
            text="Add Vehicle"
            url="/dashboard/add"
        />
        <ListItemLink
            icon={ <SvgIcon viewBox="0 0 24 24">
            <path d="m 2.7045108,7.8855055 c -1.2763723,0 -2.28932385,0.5013666 -2.28932385,1.1251785 l -0.0121827,6.743762 c 0,0.623813 1.02512865,1.122744 2.30150105,1.122744 H 22.020072 c 1.276372,0 1.380901,-0.498931 1.380901,-1.122744 V 9.010684 c 0,-0.6238119 -1.022694,-1.1251785 -2.299066,-1.1251785 z M 1.3236101,8.7135594 H 22.448711 l 0.03409,0.8621482 V 12.33751 16.049136 H 1.3236101 V 12.381348 Z M 2.1959887,9.5951917 V 15.081775 H 4.5651953 V 9.5951917 Z"
     />
            </SvgIcon>
        }
            text="License Plates"
            url="/dashboard/plates"
        />
        <ListItemLink
            icon={ <SvgIcon viewBox="0 0 24 24">
                <path d="m 18,1 v 3 h -3 v 2 h 3 v 3 h 2 V 6 h 3 V 4 H 20 V 1 Z M 3.0078125,10.128906 c -1.0235947,0 -1.8359375,0.402074 -1.8359375,0.902344 l -0.00977,5.408203 c 0,0.50027 0.8221083,0.900391 1.8457031,0.900391 H 18.498047 c 1.023594,0 1.107422,-0.400121 1.107422,-0.900391 V 11.03125 c 0,-0.50027 -0.820156,-0.902344 -1.84375,-0.902344 z M 1.9003906,10.792969 H 18.841797 l 0.02734,0.691406 v 2.214844 2.976562 H 1.9003906 V 13.734375 Z M 2.6,11.5 v 4.4 h 1.9 v -4.4 z"
            />
                </SvgIcon>
            }
            text="Add Plate Reservation"
            url="/dashboard/reservation"
        />
        <ListItemLink
            icon={<PersonIcon />}
            text="User Profile"
            url="/dashboard/user"
        />
    </div>
);