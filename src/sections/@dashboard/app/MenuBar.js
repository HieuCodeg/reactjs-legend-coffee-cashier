import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Button, Popover } from '@mui/material';
import cookies from 'react-cookies';
// ----------------------------------------------------------------------
import MenuItem from '@mui/material/MenuItem';

import { useNavigate } from 'react-router-dom';
// component
import Iconify from '../../../components/iconify';

MenuBar.propTypes = {};

export default function MenuBar() {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleLogout = () => {
        cookies.remove('accessToken');
        cookies.remove('usernameToken');
        cookies.remove('idToken');
        navigate('/');
    };
    const handleNextKitchen = () => {
        navigate('/kitchen');
    };
    return (
        <>
            {Boolean(open) ? (
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        minHeight: '35px',
                        maxHeight: '35px',
                        minWidth: '35px',
                        maxWidth: '35px',
                        padding: 0,
                        textAlign: 'center',
                        mt: '3px',
                        right: '15px !important',

                        borderRadius: '50%',
                        backgroundColor: '#F9FAFB',
                        color: '#713737',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#F9FAFB',
                            color: '#713737',
                        },
                    }}
                    onClick={handleOpenMenu}
                >
                    <Iconify icon={'mdi:menu-open'} width={20} height={50} />
                </Button>
            ) : (
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        minHeight: '35px',
                        maxHeight: '35px',
                        minWidth: '35px',
                        maxWidth: '35px',
                        padding: 0,
                        textAlign: 'center',
                        mt: '3px',
                        right: '15px !important',
                        borderRadius: '50%',
                        backgroundColor: '#793939',
                        color: 'white',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#F9FAFB',
                            color: '#713737',
                        },
                    }}
                    onClick={handleOpenMenu}
                >
                    <Iconify icon={'mdi:menu-open'} width={20} height={50} />
                </Button>
            )}

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 160,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleNextKitchen}>
                    <Iconify icon={'ep:dish-dot'} sx={{ mr: 2 }} />
                    Nhà bếp
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'twemoji:card-file-box'} sx={{ mr: 2 }} />
                    Quản lý
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'flat-color-icons:edit-image'} sx={{ mr: 2 }} />
                    Sửa thông tin
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={handleLogout}>
                    <Iconify icon={'entypo:log-out'} sx={{ mr: 2 }} />
                    Đăng xuất
                </MenuItem>
            </Popover>
        </>
    );
}
