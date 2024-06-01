import PropTypes from 'prop-types';

// @mui
import { Typography, Grid, Stack } from '@mui/material';

// import Paper from '@mui/material/Paper';

import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';

import Iconify from '../../../components/iconify/Iconify';
// ----------------------------------------------------------------------
const style = {
    position: 'relative',
    width: '100%',
    paddingTop: '4px',
    bgcolor: 'background.paper',
    borderRadius: '12px',
    marginBottom: '1px',
    border: '1px solid white',
};
const countTime = (timeA, timeB) => {
    let result;
    const c = parseInt((timeA - timeB) / (1000 * 60), 10);
    if (c <= 0) {
        result = 'vài giây trước';
    } else if (c < 60) {
        result = `${c} phút trước`;
    } else {
        const d = parseInt((timeA - timeB) / (1000 * 60 * 60), 10);
        result = `${d} giờ trước`;
    }
    return result;
};
ListWaiter.prototype = {
    listWaiter: PropTypes.array,
    handleWaiterALL: PropTypes.func,
    loadingAllWaiter: PropTypes.bool,
    handleWaiterONE: PropTypes.func,
    loadingOneWaiter: PropTypes.bool,
};

export default function ListWaiter({
    listWaiter,
    handleWaiterALL,
    loadingAllWaiter,
    handleWaiterONE,
    loadingOneWaiter,
}) {
    const [state, setState] = useState({
        indexAllWaiter: -1,
        indexOneWaiter: -1,
    });

    const { indexAllWaiter, indexOneWaiter } = state;

    const handleClickAllWaiter = (orderItemId, index, orderId, tableId) => {
        setState({
            ...state,
            indexAllWaiter: index,
        });
        handleWaiterALL(orderItemId, index, orderId, tableId);
    };

    const handleClickOneWaiter = (orderItemId, index, orderId, tableId) => {
        setState({
            ...state,
            indexOneWaiter: index,
        });
        handleWaiterONE(orderItemId, index, orderId, tableId);
    };
    return (
        <>
            {listWaiter.map((item, index) => (
                <Box sx={style} key={index}>
                    <Grid>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                padding: '12px 5px',
                                border: '1px solid white',
                                '&:hover': {
                                    border: '1px solid #9d0d0d',
                                },
                            }}
                        >
                            <Stack direction="column" alignItems="flex-start">
                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        id="transition-modal-title"
                                        variant="body2"
                                        sx={{
                                            color: '#0a9275',
                                            textTransform: 'uppercase',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            fontFamily: 'serif',
                                            mt: 1,
                                        }}
                                    >
                                        {item.productName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#d52323',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {item.size === 'NO' ? '' : `[${item.size}]`}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'gray',
                                        fontSize: '12px',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    {item.createdAt}
                                </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <Typography
                                    id="transition-modal-title"
                                    variant="body2"
                                    sx={{
                                        color: 'black',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        fontFamily: 'serif',
                                        mr: 5,
                                    }}
                                >
                                    {item.quantity}
                                </Typography>
                                <Stack
                                    direction="column"
                                    alignItems="flex-start"
                                    sx={{
                                        mr: 3,
                                    }}
                                >
                                    <Typography
                                        id="transition-modal-title"
                                        variant="body2"
                                        sx={{
                                            color: 'black',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            fontFamily: 'serif',
                                        }}
                                    >
                                        {item.tableName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'gray',
                                            fontSize: '12px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {/* {item.updatedAt} */}
                                        {countTime(new Date(), new Date(item.updatedAt))}
                                    </Typography>
                                </Stack>
                                <LoadingButton
                                    loading={loadingOneWaiter && index === indexOneWaiter}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: '#F9FAFB',
                                        color: '#28B44F',
                                        boxShadow: 'none',
                                        border: '1px solid #28B44F',
                                        mr: 3,
                                        '&:hover': {
                                            backgroundColor: '#28B44F',
                                            color: 'white',
                                        },
                                    }}
                                    onClick={() => {
                                        handleClickOneWaiter(item.orderItemId, index, item.orderId, item.tableId);
                                    }}
                                >
                                    <Iconify icon={'ic:sharp-keyboard-arrow-right'} width={20} />
                                </LoadingButton>
                                <LoadingButton
                                    loading={loadingAllWaiter && index === indexAllWaiter}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: '#28B44F',

                                        color: 'white',
                                        boxShadow: 'none',
                                        border: '1px solid #28B44F',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                            color: '#28B44F',
                                        },
                                    }}
                                    onClick={() => {
                                        handleClickAllWaiter(item.orderItemId, index, item.orderId, item.tableId);
                                    }}
                                >
                                    <Iconify icon={'ic:outline-double-arrow'} width={20} />
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Box>
            ))}
        </>
    );
}
