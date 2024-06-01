import { PropTypes } from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { Grid, Typography, Paper, Stack, Divider, TextField, Input } from '@mui/material';

import Slide from '@mui/material/Slide';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { LoadingButton } from '@mui/lab';

import { NumericFormat } from 'react-number-format';
// Toast
import { toast } from 'react-toastify';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// sections
import CashierService from '../../../services/cashierService';

import Iconify from '../../../components/iconify/Iconify';
import Helper from '../../../helper/Helper';
import myLogo from '../../../assets/images/favicon.png';

// *-------------------------------
const style = {
    position: 'absolute',
    top: '0',
    right: 0,
    transform: 'translate(-50%, -50%)',
    width: '65%',
    height: '100%',
    bgcolor: 'background.paper',
    // border: '2px solid #d8d8df',
    borderRadius: '12px',
    boxShadow: 24,
    p: 3,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        lineHeight: '7px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        lineHeight: '5px',
        paddingRight: 0,
        paddingLeft: 0,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

Bill.prototype = {
    openBill: PropTypes.bool,
    handleCloseBill: PropTypes.func,
    listOrderItems: PropTypes.arr,
    totalBill: PropTypes.number,
    orders: PropTypes.obj,
    tableCurrent: PropTypes.obj,
    handlePayMoneyToClose: PropTypes.func,
};

export default function Bill({
    openBill,
    handleCloseBill,
    listOrderItems,
    totalBill,
    orders,
    tableCurrent,
    handlePayMoneyToClose,
}) {
    const [state, setState] = useState({
        moneyReceived: 0,
        changeMoney: 0,
        orderBill: {
            orderItems: [],
        },
        loading: false,
    });

    const { moneyReceived, changeMoney, orderBill, loading } = state;

    const handlePrint = async () => {
        if (moneyReceived === 0) {
            toast.error('Chưa nhập số tiền!');
            return;
        }
        if (moneyReceived < totalBill) {
            toast.error('Số tiền không đủ!');
            return;
        }

        try {
            setState({
                ...state,
                loading: true,
            });
            const result = await CashierService.payBill(orders.orderId);
            setState({
                ...state,
                orderBill: result.data,
                loading: false,
            });
        } catch (error) {
            toast.error('Lỗi hệ thống, vui lòng kiểm tra lại dữ liệu!');
        }

        setTimeout(() => {
            const content = document.getElementById('divcontents');
            const pri = document.getElementById('ifmcontentstoprint').contentWindow;
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
            handlePayMoneyToClose(tableCurrent.id);
            setState({
                ...state,
                moneyReceived: 0,
                changeMoney: 0,
                orderBill: {
                    orderItems: [],
                },
                loading: false,
            });
        }, 500);
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openBill}
                onClose={handleCloseBill}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableAutoFocus
            >
                <Slide direction="left" in={openBill}>
                    <Box sx={style}>
                        <Iconify
                            icon={'material-symbols:close'}
                            position="absolute"
                            top="10px"
                            right="10px"
                            bgcolor="white"
                            color="#5A5A72"
                            borderRadius="50%"
                            width={35}
                            padding={0.6}
                            cursor="pointer"
                            sx={{
                                '&:hover': {
                                    color: '#131318',
                                    bgcolor: '#EBEBEF',
                                    border: '1px solid #B9B9c6',
                                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 12px 0px',
                                },
                            }}
                            onClick={handleCloseBill}
                        />
                        <Typography
                            id="transition-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{
                                color: 'black',
                                fontWeight: 'bolder',
                                fontFamily: 'fontkhachhang',
                                mt: -1,
                            }}
                        >
                            Phiếu thanh toán - {tableCurrent.name}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={7} md={7} lg={7}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                    sx={{
                                        my: 2,
                                    }}
                                >
                                    <Iconify icon={'material-symbols:frame-person-sharp'} />
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            ml: 1,
                                            fontSize: '14px',
                                            color: '#333333',
                                            fontWeight: 'bolder',
                                        }}
                                    >
                                        Khách lẻ
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        overflow: 'auto',
                                        position: 'relative',
                                        maxHeight: '580px',
                                        minHeight: '580px',
                                    }}
                                >
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: '50%' }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center">#</StyledTableCell>
                                                    <StyledTableCell align="center">Món</StyledTableCell>
                                                    <StyledTableCell align="center">SL</StyledTableCell>
                                                    <StyledTableCell align="center">Giá</StyledTableCell>
                                                    <StyledTableCell align="center">Tổng</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listOrderItems.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell align="center" component="th" scope="row">
                                                            {index + 1}
                                                        </StyledTableCell>
                                                        {row.size === 'NO' ? (
                                                            <StyledTableCell align="left">
                                                                {row.productName}
                                                            </StyledTableCell>
                                                        ) : (
                                                            <StyledTableCell align="left">
                                                                {`${row.productName}[${row.size}]`}
                                                            </StyledTableCell>
                                                        )}

                                                        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            {Helper.formatCurrencyToVND(row.price)}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ paddingRight: '5px !important' }}
                                                            align="right"
                                                        >
                                                            {Helper.formatCurrencyToVND(row.amount)}
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                            <Grid item xs={5} md={5} lg={5} sx={{ textAlign: 'justify', mt: 6 }}>
                                <Stack direction="row" alignItems="center" sx={{ mb: 2 }} justifyContent="flex-end">
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            mr: 1,
                                            fontSize: '14px',
                                            color: '#333333',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        {new Date().toLocaleString()}
                                    </Typography>
                                    <Iconify icon={'uil:calender'} />
                                    <Iconify icon={'mdi:alarm-clock'} />
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            fontSize: '17px',
                                            color: '#333333',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        Tổng tiền hàng:
                                    </Typography>
                                    <NumericFormat
                                        value={totalBill}
                                        thousandSeparator=","
                                        customInput={TextField}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                            readOnly: true,
                                        }}
                                        sx={{
                                            input: {
                                                color: 'red',
                                                backgroundColor: 'white',
                                                fontSize: '17px',
                                                padding: ' 0px',
                                                fontWeight: 'bold',
                                                textAlign: 'right',
                                                width: '150px',
                                            },
                                        }}
                                    />
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            fontSize: '17px',
                                            color: '#333333',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        Khách thanh toán:
                                    </Typography>
                                    <NumericFormat
                                        value=""
                                        thousandSeparator=","
                                        customInput={Input}
                                        placeholder="0"
                                        sx={{
                                            ml: 2,
                                            input: {
                                                color: 'black',
                                                fontWeight: 'bold',
                                                fontSize: '17px',
                                                textAlign: 'right',
                                                width: '150px',
                                            },
                                        }}
                                        onValueChange={({ floatValue }) => {
                                            return setState({
                                                ...state,
                                                moneyReceived: floatValue,
                                                changeMoney: floatValue - totalBill,
                                            });
                                        }}
                                    />
                                </Stack>

                                <Divider sx={{ mb: 2 }} />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            mr: 1,
                                            fontSize: '17px',
                                            color: '#333333',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        Tiền thừa trả khách:
                                    </Typography>
                                    <NumericFormat
                                        value={changeMoney}
                                        thousandSeparator=","
                                        customInput={TextField}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                            readOnly: true,
                                        }}
                                        sx={{
                                            input: {
                                                color: 'green',
                                                backgroundColor: 'white',
                                                fontSize: '17px',
                                                padding: ' 0px',
                                                fontWeight: 'bold',
                                                textAlign: 'right',
                                                width: '150px',
                                            },
                                        }}
                                    />
                                </Stack>

                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#28B44F',
                                        border: '1px solid #28B44F',
                                        mt: 2,
                                        ml: '36%',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#d0181b',
                                        },
                                    }}
                                    onClick={handlePrint}
                                >
                                    <Iconify
                                        icon={'ri:money-dollar-circle-line'}
                                        width="25px"
                                        height={50}
                                        sx={{
                                            mr: 1,
                                        }}
                                    />
                                    Thanh toán
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Slide>
            </Modal>
            <iframe title="helo" id="ifmcontentstoprint" style={{ height: '0px', width: '0px', position: 'absolute' }}>
                <div id="divcontents">
                    <div className="invoice-POS" style={{ textAlign: 'center', margin: 0, padding: 0 }}>
                        <center id="top">
                            <img src={myLogo} alt="Logo" height="50" style={{ margin: 0 }} />
                            <h2 style={{ margin: 0 }}>Coffee Legend</h2>
                        </center>

                        <div id="mid">
                            <div className="info">
                                <p>
                                    ĐC : 28 Nguyễn Tri Phương, phường Phú Nhuận, thành phố Huế
                                    <br />
                                    Email : CoffeeLegend@gmail.com
                                    <br />
                                    Điện thoại: 034677667
                                    <br />
                                </p>
                            </div>
                        </div>
                        <Divider />
                        <h3 style={{ margin: 0, padding: 0 }}>HÓA ĐƠN BÁN HÀNG</h3>
                        <h3 style={{ margin: 0 }}>{orderBill.tableName}</h3>

                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr style={{ fontSize: '13px' }}>
                                    <td>
                                        <p>Ngày: {new Date().toLocaleDateString()}</p>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <p>Số: {orderBill.orderId}</p>
                                    </td>
                                </tr>
                                <tr style={{ fontSize: '13px' }}>
                                    <td colSpan={2}>
                                        <p>Thu ngân: {orderBill.staffName}</p>
                                    </td>
                                </tr>
                                <tr style={{ fontSize: '13px' }}>
                                    <td colSpan={2}>
                                        <p>In lúc: {new Date().toLocaleTimeString()}</p>
                                    </td>
                                </tr>
                                <tr style={{ fontSize: '13px' }}>
                                    <td>
                                        <p>Giờ vào: {new Date(orderBill.creatAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td>
                                        <p style={{ textAlign: 'right', fontSize: '13px' }}>
                                            Giờ ra: {new Date().toLocaleTimeString()}
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            style={{ width: '100%', border: '1px dashed black', borderCollapse: 'collapse' }}
                            className="tableBill"
                        >
                            <tbody>
                                <tr>
                                    <th style={{ border: '1px dashed black' }}>
                                        <p style={{ textAlign: 'left' }}>MẶT HÀNG</p>
                                    </th>
                                    <th style={{ border: '1px dashed black' }}>
                                        <p style={{ textAlign: 'center' }}>SL</p>
                                    </th>
                                    <th style={{ textAlign: 'right', border: '1px dashed black' }}>
                                        <p>GIÁ</p>
                                    </th>
                                    <th style={{ textAlign: 'right', border: '1px dashed black' }}>
                                        <p>TỔNG</p>
                                    </th>
                                </tr>
                                {orderBill.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        {item.size === 'NO' ? (
                                            <td style={{ textAlign: 'left', border: '1px dashed black' }}>
                                                <p>{item.productName}</p>
                                            </td>
                                        ) : (
                                            <td style={{ textAlign: 'left', border: '1px dashed black' }}>
                                                <p>{`${item.productName}[${item.size}]`}</p>
                                            </td>
                                        )}
                                        <td style={{ textAlign: 'center', border: '1px dashed black' }}>
                                            <p>{item.quantity}</p>
                                        </td>
                                        <td style={{ textAlign: 'right', border: '1px dashed black' }}>
                                            <p>{item.price.toLocaleString()}</p>
                                        </td>
                                        <td style={{ textAlign: 'right', border: '1px dashed black' }}>
                                            <p>{item.amount.toLocaleString()}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3>Tổng tiền:</h3>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <h3>{Helper.formatCurrencyToVND(orderBill.totalAmount)}</h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div id="bot">
                            <div id="legalcopy">
                                <p className="legal">
                                    <strong>Cảm ơn Quý Khách, hẹn gặp lại!</strong>&nbsp;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </iframe>
        </>
    );
}
