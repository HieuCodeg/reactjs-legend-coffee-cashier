import PropTypes from 'prop-types';

// @mui
import { Typography, Grid, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// SweetAlert
import Swal from 'sweetalert2';
import '../../../layouts/sweetalert.css';

// Toast
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Iconify from '../../../components/iconify/Iconify';
import Helper from '../../../helper/Helper';
import { OrderItemStatus } from '../../../utils/OrderItemStatus';

// ----------------------------------------------------------------------

const style = {
    position: 'relative',
    width: '100%',
    paddingTop: '4px',
    bgcolor: 'background.paper',
    borderRadius: '12px',
    marginBottom: '1px',
    border: '1px solid white',
    '&:hover': {
        border: '1px solid blue',
    },
};
const styleReadonly = {
    position: 'relative',
    width: '100%',
    paddingTop: '4px',
    bgcolor: 'background.paper',
    borderRadius: '12px',
    marginBottom: '1px',
    border: '1px solid white',
};
const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    borderRadius: '12px',
});

AppOrderDetail.propTypes = {
    orders: PropTypes.object,
    handleChangeOrderItems: PropTypes.func,
    handleDeleteOrderItem: PropTypes.func,
    handleOpenEditModal: PropTypes.func,
};

export default function AppOrderDetail({
    orders,
    handleChangeOrderItems,
    handleDeleteOrderItem,
    handleOpenEditModal,
    ...other
}) {
    const handleDecreaseQuantity = (index, orderItem) => {
        orderItem.quantity -= 1;
        handleChangeOrderItems(index, orderItem);
    };
    const handleIncreaseQuantity = (index, orderItem) => {
        orderItem.quantity += 1;
        handleChangeOrderItems(index, orderItem);
    };
    const handleChangeQuantity = (e, index, orderItem) => {
        if (e.target.value >= 1 && e.target.value <= 100) {
            orderItem.quantity = Number(e.target.value);
            handleChangeOrderItems(index, orderItem);
        }
    };
    const handleClickDeleteItem = (index, orderItem) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                title: 'titleDeleteItem',
            },
        });

        swalWithBootstrapButtons
            .fire({
                title: `Chắc chắn muốn xóa "${orderItem.productName}"`,
                showCancelButton: true,
                confirmButtonText: 'Chấp nhận',
                cancelButtonText: `Hủy bỏ`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    handleDeleteOrderItem(index);
                    toast.success(`${orderItem.productName} xóa thành công`);
                }
            });
    };
    return (
        <>
            {orders.orderItems.map((item, index) =>
                item.orderItemStatus === OrderItemStatus.NEW.status ? (
                    <Box sx={style} key={index}>
                        <Iconify
                            icon={'material-symbols:close'}
                            position="absolute"
                            top="2px"
                            right="10px"
                            bgcolor="white"
                            color="#5A5A72"
                            width={25}
                            padding={0.4}
                            cursor="pointer"
                            sx={{
                                '&:hover': {
                                    color: '#131318',
                                    bgcolor: '#EBEBEF',
                                    border: '1px solid #B9B9c6',
                                },
                            }}
                            onClick={() => {
                                handleClickDeleteItem(index, item);
                            }}
                        />
                        <Grid container spacing={1}>
                            <Grid item xs={2} md={2} lg={2}>
                                <Box
                                    sx={{ pt: '100%', position: 'relative', top: 0, cursor: 'pointer' }}
                                    onClick={() => {
                                        handleOpenEditModal(item, index);
                                    }}
                                >
                                    <StyledProductImg alt={item.productName} src={item.productPhoto} />
                                </Box>
                            </Grid>
                            <Grid item xs={10} md={10} lg={10} sx={{ textAlign: 'justify', top: 0 }}>
                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        id="transition-modal-title"
                                        variant="body2"
                                        sx={{
                                            color: '#53382c',
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
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#53382c',
                                            fontSize: '15px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {`Giá: ${Helper.formatCurrencyToVND(item.price)}`}
                                    </Typography>

                                    <TextField
                                        value={item.quantity}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        inputProps={{
                                            pattern: '^[0-9]+$',
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            ml: '230px',
                                            input: {
                                                color: '#53382c',
                                                backgroundColor: 'white',
                                                fontSize: '17px',
                                                padding: ' 0px',
                                                fontWeight: 500,
                                                fontFamily: 'sans-serif',
                                                textAlign: 'center',
                                                width: '100px',
                                            },
                                        }}
                                        onChange={(e) => {
                                            handleChangeQuantity(e, index, item);
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mr: '25px',
                                            color: '#53382c',
                                            fontSize: '17px',
                                            fontWeight: 600,
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {Helper.formatCurrencyToVND(item.amount)}
                                    </Typography>

                                    {item.quantity <= 1 ? (
                                        <Button
                                            disabled
                                            sx={{
                                                color: '#f42525',
                                                cursor: 'pointer',
                                                ml: '225px',
                                                borderRadius: '50%',
                                                maxWidth: '25px',
                                                minWidth: '25px',
                                                maxHeight: '25px',
                                                minHeight: '25px',
                                                border: '1px solid gray',
                                                // backgroundColor: '#0008100a',
                                                position: 'absolute',
                                                padding: 0,
                                                '&:hover': {
                                                    backgroundColor: '#ff563014',
                                                    border: 'none',
                                                },
                                            }}
                                            onClick={() => {
                                                handleDecreaseQuantity(index, item);
                                            }}
                                        >
                                            <Iconify icon="ic:outline-minus" />
                                        </Button>
                                    ) : (
                                        <Button
                                            sx={{
                                                color: '#f42525',
                                                cursor: 'pointer',
                                                ml: '225px',
                                                borderRadius: '50%',
                                                maxWidth: '25px',
                                                minWidth: '25px',
                                                maxHeight: '25px',
                                                minHeight: '25px',
                                                border: '1px solid gray',
                                                // backgroundColor: '#0008100a',
                                                position: 'absolute',
                                                padding: 0,
                                                '&:hover': {
                                                    backgroundColor: '#ff563014',
                                                    border: 'none',
                                                },
                                            }}
                                            onClick={() => {
                                                handleDecreaseQuantity(index, item);
                                            }}
                                        >
                                            <Iconify icon="ic:outline-minus" />
                                        </Button>
                                    )}

                                    {item.quantity < 100 ? (
                                        <Button
                                            sx={{
                                                color: '#0dbd16',
                                                cursor: 'pointer',
                                                ml: '310px',
                                                borderRadius: '50%',
                                                maxWidth: '25px',
                                                minWidth: '25px',
                                                maxHeight: '25px',
                                                minHeight: '25px',
                                                border: '1px solid gray',
                                                position: 'absolute',
                                                padding: 0,
                                                '&:hover': {
                                                    backgroundColor: '##cedfcf',
                                                    border: 'none',
                                                },
                                            }}
                                            onClick={() => {
                                                handleIncreaseQuantity(index, item);
                                            }}
                                        >
                                            <Iconify icon="ic:baseline-plus" />
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            sx={{
                                                color: '#0dbd16',
                                                cursor: 'pointer',
                                                ml: '310px',
                                                borderRadius: '50%',
                                                maxWidth: '25px',
                                                minWidth: '25px',
                                                maxHeight: '25px',
                                                minHeight: '25px',
                                                border: '1px solid gray',
                                                position: 'absolute',
                                                padding: 0,
                                                '&:hover': {
                                                    backgroundColor: '##cedfcf',
                                                    border: 'none',
                                                },
                                            }}
                                            onClick={() => {
                                                handleIncreaseQuantity(index, item);
                                            }}
                                        >
                                            <Iconify icon="ic:baseline-plus" />
                                        </Button>
                                    )}
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <Iconify icon="material-symbols:note-outline" sx={{ color: 'gray' }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#53382c',
                                            fontSize: '12px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {item.note ? item.note : 'Không có ghi chú'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <Iconify icon="fluent-mdl2:status-circle-checkmark" sx={{ color: 'gray' }} />

                                    {/* <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#ff4842',
                                        fontSize: '12px',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    {item.orderItemStatus === OrderItemStatus.NEW.status
                                        ? OrderItemStatus.NEW.statusValue
                                        : item.orderItemStatus === OrderItemStatus.COOKING.status
                                        ? OrderItemStatus.COOKING.statusValue
                                        : item.orderItemStatus === OrderItemStatus.WAITER.status
                                        ? OrderItemStatus.WAITER.statusValue
                                        : item.orderItemStatus === OrderItemStatus.DELIVERY.status
                                        ? OrderItemStatus.DELIVERY.statusValue
                                        : OrderItemStatus.DONE.statusValue}
                                </Typography> */}

                                    {item.orderItemStatus === OrderItemStatus.NEW.status ? (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#ff4842',
                                                fontSize: '12px',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            {OrderItemStatus.NEW.statusValue}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'green',
                                                fontSize: '12px',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            {item.orderItemStatus === OrderItemStatus.COOKING.status
                                                ? OrderItemStatus.COOKING.statusValue
                                                : item.orderItemStatus === OrderItemStatus.WAITER.status
                                                ? OrderItemStatus.WAITER.statusValue
                                                : item.orderItemStatus === OrderItemStatus.DELIVERY.status
                                                ? OrderItemStatus.DELIVERY.statusValue
                                                : OrderItemStatus.DONE.statusValue}
                                        </Typography>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={styleReadonly} key={index}>
                        <Grid container spacing={1}>
                            <Grid item xs={2} md={2} lg={2}>
                                <Box sx={{ pt: '100%', position: 'relative', top: 0 }}>
                                    <StyledProductImg alt={item.productName} src={item.productPhoto} />
                                </Box>
                            </Grid>
                            <Grid item xs={10} md={10} lg={10} sx={{ textAlign: 'justify', top: 0 }}>
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
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#53382c',
                                            fontSize: '15px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {`Giá: ${Helper.formatCurrencyToVND(item.price)}`}
                                    </Typography>

                                    <TextField
                                        value={item.quantity}
                                        variant="filled"
                                        disabled
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        inputProps={{
                                            pattern: '^[0-9]+$',
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            ml: '230px',
                                            input: {
                                                color: '#53382c',
                                                backgroundColor: 'white',
                                                fontSize: '17px',
                                                padding: ' 0px',
                                                fontWeight: 500,
                                                fontFamily: 'sans-serif',
                                                textAlign: 'center',
                                                width: '100px',
                                            },
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mr: '25px',
                                            color: '#53382c',
                                            fontSize: '17px',
                                            fontWeight: 600,
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {Helper.formatCurrencyToVND(item.amount)}
                                    </Typography>

                                    <Button
                                        disabled
                                        sx={{
                                            color: '#f42525',
                                            cursor: 'pointer',
                                            ml: '225px',
                                            borderRadius: '50%',
                                            maxWidth: '25px',
                                            minWidth: '25px',
                                            maxHeight: '25px',
                                            minHeight: '25px',
                                            border: '1px solid gray',
                                            // backgroundColor: '#0008100a',
                                            position: 'absolute',
                                            padding: 0,
                                            '&:hover': {
                                                backgroundColor: '#ff563014',
                                                border: 'none',
                                            },
                                        }}
                                    >
                                        <Iconify icon="ic:outline-minus" />
                                    </Button>

                                    <Button
                                        disabled
                                        sx={{
                                            color: '#0dbd16',
                                            cursor: 'pointer',
                                            ml: '310px',
                                            borderRadius: '50%',
                                            maxWidth: '25px',
                                            minWidth: '25px',
                                            maxHeight: '25px',
                                            minHeight: '25px',
                                            border: '1px solid gray',
                                            position: 'absolute',
                                            padding: 0,
                                            '&:hover': {
                                                backgroundColor: '##cedfcf',
                                                border: 'none',
                                            },
                                        }}
                                    >
                                        <Iconify icon="ic:baseline-plus" />
                                    </Button>
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <Iconify icon="material-symbols:note-outline" sx={{ color: 'gray' }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#53382c',
                                            fontSize: '12px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {item.note ? item.note : 'Không có ghi chú'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <Iconify icon="fluent-mdl2:status-circle-checkmark" sx={{ color: 'gray' }} />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'green',
                                            fontSize: '12px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {item.orderItemStatus === OrderItemStatus.COOKING.status
                                            ? OrderItemStatus.COOKING.statusValue
                                            : item.orderItemStatus === OrderItemStatus.WAITER.status
                                            ? OrderItemStatus.WAITER.statusValue
                                            : item.orderItemStatus === OrderItemStatus.DELIVERY.status
                                            ? OrderItemStatus.DELIVERY.statusValue
                                            : OrderItemStatus.DONE.statusValue}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                )
            )}
        </>
    );
}
