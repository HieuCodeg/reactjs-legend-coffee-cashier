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

ListItemCooking.prototype = {
    listOrderItemsCooking: PropTypes.array,
    handleCookingAllByProduct: PropTypes.func,
    loadingAllProduct: PropTypes.bool,
    loadingOneProduct: PropTypes.bool,
    handleCookingOneByProduct: PropTypes.func,
};

export default function ListItemCooking({
    listOrderItemsCooking,
    handleCookingAllByProduct,
    loadingAllProduct,
    loadingOneProduct,
    handleCookingOneByProduct,
}) {
    const [state, setState] = useState({
        indexLoadingAllProduct: -1,
        indexLoadingOneProduct: -1,
    });

    const { indexLoadingAllProduct, indexLoadingOneProduct } = state;

    const handleClickAllByProduct = (productId, size, index) => {
        setState({
            ...state,
            indexLoadingAllProduct: index,
        });
        handleCookingAllByProduct(productId, size, index);
    };

    const handleClickOneByProduct = (productId, size, index) => {
        setState({
            ...state,
            indexLoadingOneProduct: index,
        });
        handleCookingOneByProduct(productId, size, index);
    };

    return (
        <>
            {listOrderItemsCooking.map((item, index) => (
                <Box key={index} sx={style}>
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
                            <Stack direction="row" alignItems="center">
                                <Typography
                                    id="transition-modal-title"
                                    variant="body2"
                                    sx={{
                                        color: '#9d0d0d',
                                        lineHeight: 0.6,
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
                                        color: '#53382c',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    {item.size === 'NO' ? '' : `[${item.size}]`}
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
                                        mr: 10,
                                    }}
                                >
                                    {item.quantity}
                                </Typography>

                                <LoadingButton
                                    loading={loadingOneProduct && index === indexLoadingOneProduct}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: '#F9FAFB',
                                        color: '#f4557e',
                                        boxShadow: 'none',
                                        border: '1px solid #f4557e',
                                        mr: 1,
                                        '&:hover': {
                                            backgroundColor: '#f4557e',
                                            color: 'white',
                                        },
                                    }}
                                    onClick={() => {
                                        handleClickOneByProduct(item.productId, item.size, index);
                                    }}
                                >
                                    <Iconify icon={'ic:sharp-keyboard-arrow-right'} width={20} />
                                </LoadingButton>
                                <LoadingButton
                                    loading={loadingAllProduct && index === indexLoadingAllProduct}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: '#f4557e',

                                        color: 'white',
                                        boxShadow: 'none',
                                        border: '1px solid #f4557e',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                            color: '#f4557e',
                                        },
                                    }}
                                    onClick={() => {
                                        handleClickAllByProduct(item.productId, item.size, index);
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
