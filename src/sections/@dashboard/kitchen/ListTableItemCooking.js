import PropTypes from 'prop-types';

// @mui
import { Typography, Grid, Stack } from '@mui/material';

// SweetAlert
import Swal from 'sweetalert2';
import '../../../layouts/sweetalert.css';

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

ListTableItemCooking.prototype = {
    listTableItemsCooking: PropTypes.array,
    handleCookingAllByTable: PropTypes.func,
    handleCookingAllByProductTable: PropTypes.func,
    loadingAllTable: PropTypes.bool,
    loadingAllProductTable: PropTypes.bool,
    loadingOneProductTable: PropTypes.bool,
    handleCookingOneByTable: PropTypes.func,
    handleRemoveItem: PropTypes.func,
    handleRemoveOrder: PropTypes.func,
};
export default function ListTableItemCooking({
    listTableItemsCooking,
    handleCookingAllByTable,
    loadingAllTable,
    handleCookingAllByProductTable,
    loadingAllProductTable,
    loadingOneProductTable,
    handleCookingOneByTable,
    handleRemoveItem,
    handleRemoveOrder,
}) {
    const [state, setStateTable] = useState({
        indexLoadingAllTable: -1,
        indexLoadingAllProductTable: -1,
        indexLoadingOneProductTable: -1,
        checkShowTableDetail: [true, true, true, true],
    });

    const { indexLoadingAllTable, indexLoadingAllProductTable, checkShowTableDetail, indexLoadingOneProductTable } =
        state;
    // Click tất cả bàn
    const handleClickAllByTable = (orderId, index, tableId) => {
        setStateTable({
            ...state,
            indexLoadingAllTable: index,
            indexLoadingAllProductTable: -1,
        });
        handleCookingAllByTable(orderId, index, tableId);
    };
    // Click tất cả món ăn của bàn
    const handleClickAllByProductTable = (orderId, productId, size, indexTable, index, tableId) => {
        setStateTable({
            ...state,
            indexLoadingAllProductTable: index,
            indexLoadingAllTable: indexTable,
        });
        handleCookingAllByProductTable(orderId, productId, size, indexTable, index, tableId);
    };

    // Click 1 món ăn của bàn
    const handleClickOneByProductTable = (orderItemId, indexTable, index, orderId, tableId) => {
        setStateTable({
            ...state,
            indexLoadingAllTable: indexTable,
            indexLoadingOneProductTable: index,
        });
        handleCookingOneByTable(orderItemId, indexTable, index, orderId, tableId);
    };

    const handleClickTableDetail = (index) => {
        const list = [...checkShowTableDetail];
        if (list[index] === true) {
            list[index] = false;
        } else {
            list[index] = true;
        }
        setStateTable({
            ...state,
            checkShowTableDetail: list,
        });
    };

    // Xóa món ăn trong bàn
    const handleRemoveOrderItem = (orderItemId, productName, indexTable, index, orderId, tableId) => {
        // Swal.fire({
        //     title: `Nhập số lượng [${productName}] muốn hủy:`,
        //     input: 'number',
        //     inputAttributes: {
        //         autocapitalize: 'off',
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: 'Xác nhận',
        //     cancelButtonText: 'Hủy bỏ',
        //     showLoaderOnConfirm: true,
        //     preConfirm: async (quantity) => {
        //         try {
        //             const result = await KitchenService.RemoveOrderItem(orderItemId, quantity);
        //             handleRemoveItem(indexTable, index, quantity);
        //         } catch (error) {
        //             if (error.response.status === 400) {
        //                 Swal.showValidationMessage(`${error.response.data.message}`);
        //             } else {
        //                 Swal.showValidationMessage('Vui lòng kiểm tra lại dữ liệu');
        //             }
        //         }
        //     },

        //     allowOutsideClick: () => !Swal.isLoading(),
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         toast.success('Hủy sản phẩm thành công!!!');
        //     }
        // });
        handleRemoveItem(orderItemId, productName, indexTable, index, orderId, tableId);
    };

    //  Xóa toàn bộ bàn
    const handleClickRemoveOrder = (table) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                title: 'titleDeleteItem',
            },
        });

        swalWithBootstrapButtons
            .fire({
                title: `Chắc chắn hủy "${table.tableName}"`,
                showCancelButton: true,
                confirmButtonText: 'Chấp nhận',
                cancelButtonText: `Hủy bỏ`,
                showLoaderOnConfirm: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    handleRemoveOrder(table.orderId, table.indexTable, table.tableId);
                }
            });
    };

    return (
        <>
            {listTableItemsCooking.map((table, indexTable) => (
                <Stack key={indexTable}>
                    <Box sx={style}>
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
                                        {checkShowTableDetail[indexTable] === true ? (
                                            <Iconify
                                                icon={'ic:baseline-plus'}
                                                bgcolor="white"
                                                color="#5A5A72"
                                                width={25}
                                                padding={0.4}
                                                cursor="pointer"
                                                sx={{
                                                    borderRadius: '12px',
                                                    '&:hover': {
                                                        color: 'white',
                                                        bgcolor: '#f4557e',
                                                    },
                                                }}
                                                onClick={() => {
                                                    handleClickTableDetail(indexTable);
                                                }}
                                            />
                                        ) : (
                                            <Iconify
                                                icon={'ic:baseline-minus'}
                                                bgcolor="white"
                                                color="#5A5A72"
                                                width={25}
                                                padding={0.4}
                                                cursor="pointer"
                                                sx={{
                                                    borderRadius: '12px',
                                                    '&:hover': {
                                                        color: 'white',
                                                        bgcolor: '#f4557e',
                                                    },
                                                }}
                                                onClick={() => {
                                                    handleClickTableDetail(indexTable);
                                                }}
                                            />
                                        )}
                                        <Typography
                                            id="transition-modal-title"
                                            variant="body2"
                                            sx={{
                                                color: '#0066CC',
                                                textTransform: 'uppercase',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                fontFamily: 'serif',
                                            }}
                                        >
                                            {table.tableName}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'gray',
                                            ml: 3,
                                            fontSize: '12px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {countTime(new Date(), new Date(table.timeWait))}
                                        {/* {table.timeWait} */}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        id="transition-modal-title"
                                        variant="body2"
                                        sx={{
                                            color: '#0066CC',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            fontFamily: 'serif',
                                            mr: 5,
                                        }}
                                    >
                                        {table.countProduct}
                                    </Typography>
                                    <Iconify
                                        icon={'material-symbols:close'}
                                        bgcolor="white"
                                        color="#5A5A72"
                                        width={25}
                                        padding={0.4}
                                        cursor="pointer"
                                        sx={{
                                            mr: 11,
                                            borderRadius: '12px',
                                            '&:hover': {
                                                color: 'white',
                                                bgcolor: '#f4557e',
                                            },
                                        }}
                                        onClick={() => {
                                            handleClickRemoveOrder(table);
                                        }}
                                    />
                                    <LoadingButton
                                        loading={loadingAllTable && indexTable === indexLoadingAllTable}
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
                                            handleClickAllByTable(table.orderId, indexTable, table.tableId);
                                        }}
                                    >
                                        <Iconify icon={'ic:outline-double-arrow'} width={16} />
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Box>
                    {table.orderItems.map(
                        (item, index) =>
                            checkShowTableDetail[indexTable] && (
                                <Box sx={style} key={index}>
                                    <Grid>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{
                                                padding: '0px 5px 0px 60px',
                                                border: '1px solid white',
                                                '&:hover': {
                                                    border: '1px solid #f4557e',
                                                },
                                            }}
                                        >
                                            <Stack direction="column" alignItems="flex-start">
                                                <Stack direction="row" alignItems="center">
                                                    <Typography
                                                        id="transition-modal-title"
                                                        variant="body2"
                                                        sx={{
                                                            color: '#53382c',
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
                                                <Iconify
                                                    icon={'material-symbols:close'}
                                                    bgcolor="white"
                                                    color="#5A5A72"
                                                    width={25}
                                                    padding={0.4}
                                                    cursor="pointer"
                                                    sx={{
                                                        mr: 2,
                                                        borderRadius: '12px',
                                                        '&:hover': {
                                                            color: 'white',
                                                            bgcolor: '#f4557e',
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        handleRemoveOrderItem(
                                                            item.orderItemId,
                                                            item.productName,
                                                            indexTable,
                                                            index,
                                                            table.orderId,
                                                            table.tableId
                                                        );
                                                    }}
                                                />
                                                <LoadingButton
                                                    loading={
                                                        loadingOneProductTable &&
                                                        index === indexLoadingOneProductTable &&
                                                        indexTable === indexLoadingAllTable
                                                    }
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
                                                        handleClickOneByProductTable(
                                                            item.orderItemId,
                                                            indexTable,
                                                            index,
                                                            table.orderId,
                                                            table.tableId
                                                        );
                                                    }}
                                                >
                                                    <Iconify icon={'ic:sharp-keyboard-arrow-right'} width={16} />
                                                </LoadingButton>
                                                <LoadingButton
                                                    loading={
                                                        loadingAllProductTable &&
                                                        indexLoadingAllProductTable === index &&
                                                        indexTable === indexLoadingAllTable
                                                    }
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
                                                        handleClickAllByProductTable(
                                                            table.orderId,
                                                            item.productId,
                                                            item.size,
                                                            indexTable,
                                                            index,
                                                            table.tableId
                                                        );
                                                    }}
                                                >
                                                    <Iconify icon={'ic:outline-double-arrow'} width={16} />
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Box>
                            )
                    )}
                </Stack>
            ))}
        </>
    );
}
