import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 55;
const APP_BAR_DESKTOP = 55;

const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    minHeight: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    // [theme.breakpoints.up('lg')]: {
    //     paddingTop: 0,
    //     paddingLeft: theme.spacing(2),
    //     paddingRight: theme.spacing(2),
    // },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    const [open, setOpen] = useState(false);

    return (
        <StyledRoot>
            {/* <Header onOpenNav={() => setOpen(true)} /> */}
            {/* <Nav openNav={open} onCloseNav={() => setOpen(false)} /> */}

            <Main>
                <Outlet />
            </Main>
        </StyledRoot>
    );
}
