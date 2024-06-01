import MenuItem from '@mui/material/MenuItem';
// @mui
import PropTypes from 'prop-types';
import { Box, Card, Paper, Typography, CardContent, Popover } from '@mui/material';

// ----------------------------------------------------------------------
import { useState } from 'react';

// SweetAlert
import Swal from 'sweetalert2';
import '../../../layouts/sweetalert.css';

// components
import Tooltip from '@mui/material/Tooltip';
import Iconify from '../../../components/iconify/Iconify';

// enum status tables
import { EnumStatus } from '../../../utils/EnumStatus';

AppTablesList.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
    closeTable: PropTypes.func,
    openTable: PropTypes.func,
    updateTable: PropTypes.func,
    handleClickTable: PropTypes.func,
};

export default function AppTablesList({
    onClick,
    title,
    subheader,
    list,
    closeTable,
    openTable,
    updateTable,
    handleClickTable,
    ...other
}) {
    const [open, setOpen] = useState(null);
    const [checkOpenTable, setCheckOpenTable] = useState(false);
    const [tablecurrent, setTableCurrent] = useState({});
    const handleOpenMenu = (event, value) => {
        setOpen(event.currentTarget);
        setTableCurrent(value);
        if (value.status === EnumStatus.OPEN.status) {
            setCheckOpenTable(true);
        }
    };
    const handleCloseMenu = () => {
        setOpen(null);
        setCheckOpenTable(false);
    };
    const handleCloseTable = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btnConfirm',
                cancelButton: 'btnCancel',
            },
            buttonsStyling: false,
        });

        handleCloseMenu();

        swalWithBootstrapButtons
            .fire({
                title: `Chắc chắn muốn hủy "${tablecurrent.name}"?`,
                text: 'Danh sách món ăn hiện tại của bàn sẽ bị xóa!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý!',
                cancelButtonText: 'Hủy bỏ!',
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    closeTable(tablecurrent);
                }
            });
    };

    return (
        <>
            <Card {...other}>
                <CardContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 4,
                            gridTemplateColumns: 'repeat(4, 1fr)',
                        }}
                    >
                        {list.map((table) =>
                            table.status === EnumStatus.EMPTY.status ? (
                                <Paper
                                    key={table.name}
                                    variant="outlined"
                                    sx={{
                                        py: 2.5,
                                        textAlign: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        background: 'white',
                                    }}
                                >
                                    <Box sx={{ background: '#d1e9fc', borderBottom: '1px solid #e5e8eb' }}>
                                        <Tooltip title="Mở bàn">
                                            <Iconify
                                                icon={'mdi:bell-circle'}
                                                color="black"
                                                width={32}
                                                cursor="pointer"
                                                onClick={() => {
                                                    openTable(table);
                                                }}
                                                sx={{
                                                    '&:hover': {
                                                        color: 'red',
                                                        opacity: [0.9, 0.8, 0.7],
                                                    },
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>

                                    <Box
                                        onClick={() => {
                                            openTable(table);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            pt: 1.5,
                                            pb: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'orange',
                                                color: 'white',
                                                opacity: [0.9, 0.8, 0.7],
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'gray' }}>
                                            {table.statusValue}
                                        </Typography>

                                        <Typography variant="h6">{table.name}</Typography>
                                    </Box>
                                </Paper>
                            ) : table.status === EnumStatus.OPEN.status ? (
                                <Paper
                                    key={table.name}
                                    variant="outlined"
                                    sx={{
                                        py: 2.5,
                                        textAlign: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        background: '#3bb23b',
                                    }}
                                >
                                    <Box sx={{ background: '#0b7c0b', borderBottom: '1px solid #e5e8eb' }}>
                                        <Iconify
                                            icon={'mdi:bell-circle'}
                                            color="white"
                                            width={32}
                                            cursor="pointer"
                                            onClick={(e) => {
                                                handleOpenMenu(e, table);
                                            }}
                                            sx={{
                                                '&:hover': {
                                                    color: 'yellow',
                                                    opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        onClick={() => {
                                            updateTable(table);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            pt: 1.5,
                                            pb: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'orange',
                                                color: 'white',
                                                opacity: [0.9, 0.8, 0.7],
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            {table.statusValue}
                                        </Typography>

                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            {table.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ) : table.status === EnumStatus.HANDLING.status ? (
                                <Paper
                                    key={table.name}
                                    variant="outlined"
                                    sx={{
                                        py: 2.5,
                                        textAlign: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        background: '#c2722b',
                                    }}
                                >
                                    <Box sx={{ background: '#9d510e', borderBottom: '1px solid #e5e8eb' }}>
                                        <Iconify
                                            icon={'mdi:bell-circle'}
                                            color="white"
                                            width={32}
                                            cursor="pointer"
                                            onClick={(e) => {
                                                handleOpenMenu(e, table);
                                            }}
                                            sx={{
                                                '&:hover': {
                                                    color: '#40c940',
                                                    opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        onClick={() => {
                                            onClick(table);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            pt: 1.5,
                                            pb: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'orange',
                                                color: 'white',
                                                opacity: [0.9, 0.8, 0.7],
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            {table.statusValue}
                                        </Typography>

                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            {table.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ) : (
                                <Paper
                                    key={table.name}
                                    variant="outlined"
                                    sx={{
                                        py: 2.5,
                                        textAlign: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        background: '#a42ece',
                                    }}
                                >
                                    <Box sx={{ background: '#772096', borderBottom: '1px solid #e5e8eb' }}>
                                        <Iconify
                                            icon={'mdi:bell-circle'}
                                            color="white"
                                            width={32}
                                            cursor="pointer"
                                            onClick={(e) => {
                                                handleOpenMenu(e, table);
                                            }}
                                            sx={{
                                                '&:hover': {
                                                    color: '#10e89c',
                                                    opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        onClick={() => {
                                            onClick(table);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            pt: 1.5,
                                            pb: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'orange',
                                                color: 'white',
                                                opacity: [0.9, 0.8, 0.7],
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            {table.statusValue}
                                        </Typography>

                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            {table.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            )
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
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
                {checkOpenTable && (
                    <MenuItem onClick={handleCloseTable}>
                        <Iconify icon={'material-symbols:close-rounded'} sx={{ mr: 2 }} />
                        Hủy bàn
                    </MenuItem>
                )}
                <MenuItem>
                    <Iconify icon={'codicon:arrow-swap'} sx={{ mr: 2 }} />
                    Chuyển bàn
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'heroicons:arrow-down-on-square-stack-solid'} sx={{ mr: 2 }} />
                    Nhập bàn
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'heroicons:share-solid'} sx={{ mr: 2 }} />
                    Tách bàn
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'codicon:type-hierarchy'} sx={{ mr: 2 }} />
                    Ghép bàn
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'heroicons:document-plus-solid'} sx={{ mr: 2 }} />
                    Thêm order
                </MenuItem>
                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'heroicons:bell-alert-solid'} sx={{ mr: 2 }} />
                    Thanh toán
                </MenuItem>
            </Popover>
        </>
    );
}
