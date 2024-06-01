import { Helmet } from 'react-helmet-async';

import jwtDecode from 'jwt-decode';
// router
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

// @mui

import { Grid, Container, Typography, Stack } from '@mui/material';

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import cookies from 'react-cookies';

// SweetAlert
import Swal from 'sweetalert2';
import '../layouts/sweetalert.css';

// Toast
import { toast } from 'react-toastify';

import socketIOClient from 'socket.io-client';
import { SOCKET_SERVER } from '../services/common';

// sections

import Loading from '../components/Loading/Loading';

import Iconify from '../components/iconify/Iconify';

import KitchenService from '../services/kitchenService';

import ListItemCooking from '../sections/@dashboard/kitchen/ListItemCooking';
import ListTableItemCooking from '../sections/@dashboard/kitchen/ListTableItemCooking';
import ListWaiter from '../sections/@dashboard/kitchen/ListWaiter';
// Menu bar
import MenuBarKitchen from '../sections/@dashboard/app/MenuBarKitchen';
import sound from '../assets/audio/ting.mp3';

// ----------------------------------------------------------------------

const URL = SOCKET_SERVER;
let idStaff;
let clientId = null;
let staffName;
let accessToken;
let socket;
let ts;
let tingSound;

export default function Kitchen() {
    const [state, setState] = useState({
        listOrderItemsCooking: [],
        listTableItemsCooking: [],
        listWaiter: [],
        loading: false,
        loadingAllProduct: false,
        loadingAllTable: false,
        loadingAllProductTable: false,
        loadingAllWaiter: false,
        loadingOneProduct: false,
        loadingOneProductTable: false,
        loadingOneWaiter: false,
    });
    const navigate = useNavigate();

    // Lấy dữ liệu ban đầu
    async function getData() {
        setState({
            ...state,
            loading: true,
        });

        // Kiểm tra đăng nhập
        accessToken = cookies.load('accessToken');
        idStaff = cookies.load('idToken');
        staffName = cookies.load('usernameToken');
        if (!accessToken) {
            navigate('/');
            return;
        }
        try {
            const token = jwtDecode(accessToken);
            const exp = new Date(token.exp * 1000);
            const timeNow = new Date();

            if (exp < timeNow) {
                navigate('/');
                return;
            }
        } catch (error) {
            navigate('/');
            return;
        }

        let reslistOrderItemsCooking = null;
        let reslistTableItemsCooking = null;
        let reslistWaiter = null;
        try {
            axios.defaults.headers.common.Authorization = accessToken;
            reslistOrderItemsCooking = await KitchenService.getListItemsCooking();
            reslistTableItemsCooking = await KitchenService.getListItemsCookingByTable();
            reslistWaiter = await KitchenService.getListItemsWaiter();
        } catch (res) {
            if (res.response) {
                if (res.response.status === 401) {
                    toast.warning('Vui lòng đăng nhập !');
                    setState({
                        ...state,
                        loading: false,
                    });
                } else {
                    toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                    setState({
                        ...state,
                        loading: false,
                    });
                }
            } else {
                toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                setState({
                    ...state,
                    loading: false,
                });
            }

            return;
        }
        setState({
            ...state,
            listOrderItemsCooking: reslistOrderItemsCooking.data,
            listTableItemsCooking: reslistTableItemsCooking.data,
            listWaiter: reslistWaiter.data,
            loading: false,
        });
    }
    // Lấy về danh sách theo món
    async function getListProduct() {
        setState({
            ...state,
            loading: true,
        });

        let reslistOrderItemsCooking = null;

        try {
            reslistOrderItemsCooking = await KitchenService.getListItemsCooking();
        } catch (res) {
            if (res.response) {
                if (res.response.status === 401) {
                    toast.warning('Vui lòng đăng nhập !');
                    setState({
                        ...state,
                        loading: false,
                    });
                } else {
                    toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                    setState({
                        ...state,
                        loading: false,
                    });
                }
            } else {
                toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                setState({
                    ...state,
                    loading: false,
                });
            }

            return;
        }
        setState({
            ...state,
            listOrderItemsCooking: reslistOrderItemsCooking.data,
            loading: false,
        });
    }

    // Lấy về danh sách theo phòng/bàn
    async function getProductTable() {
        setState({
            ...state,
            loading: true,
        });

        let reslistTableItemsCooking = null;

        try {
            reslistTableItemsCooking = await KitchenService.getListItemsCookingByTable();
        } catch (res) {
            if (res.response) {
                if (res.response.status === 401) {
                    toast.warning('Vui lòng đăng nhập !');
                    setState({
                        ...state,
                        loading: false,
                    });
                } else {
                    toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                    setState({
                        ...state,
                        loading: false,
                    });
                }
            } else {
                toast.error('Lỗi hệ thống, không thể tải dữ liệu');
                setState({
                    ...state,
                    loading: false,
                });
            }

            return;
        }
        setState({
            ...state,
            listTableItemsCooking: reslistTableItemsCooking.data,
            loading: false,
        });
    }
    // Khởi tạo dữ liệu
    useEffect(() => {
        try {
            getData();
            tingSound = new Audio(sound);
        } catch (error) {
            setState({
                ...state,
                erroMessage: error.message,
            });
        }
    }, []);

    const [checkMenu, setCheckMenu] = useState(false);

    if (!clientId) {
        socket = socketIOClient(URL);
        socket.emit('create-room', 'Legend');
        socket.on('server-connection', (socketId) => {
            clientId = socketId;
        });
    }
    socket.removeAllListeners();
    socket.on('get-list-cooking', (obj) => {
        if (ts !== obj.ts) {
            ts = obj.ts;
            tingSound.play();
            setState({
                ...state,
                listOrderItemsCooking: obj.listOrderItemsCooking,
                listTableItemsCooking: obj.listTableItemsCooking,
            });
        }
    });

    // Mở menu theo món
    const handleClickMenuProduct = () => {
        getListProduct();
        setCheckMenu(!checkMenu);
    };

    // Mở menu theo phòng bàn
    const handleClickMenuTable = () => {
        getProductTable();
        setCheckMenu(!checkMenu);
    };
    const {
        loading,
        listOrderItemsCooking,
        listTableItemsCooking,
        listWaiter,
        loadingAllProduct,
        loadingAllTable,
        loadingAllProductTable,
        loadingAllWaiter,
        loadingOneProduct,
        loadingOneProductTable,
        loadingOneWaiter,
    } = state;

    // Click tất cả theo món [COOKING]
    const handleCookingAllByProduct = async (productId, size, index) => {
        setState({
            ...state,
            loadingAllProduct: true,
        });

        socket.emit('cooking-all-by-product', accessToken, productId, size);
        socket.on('cooking-all-by-product-success', (data) => {
            const tamp = [...listOrderItemsCooking];
            tamp.splice(index, 1);
            setState({
                ...state,
                listOrderItemsCooking: tamp,
                listWaiter: data,
                loadingAllProduct: false,
            });
        });
        socket.on('cooking-all-by-product-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingAllProduct: false,
            });
        });
        // try {
        //     const reslistWaiter = await KitchenService.cookingAllByProduct(productId, size);
        //     if (reslistWaiter.status === 200) {
        //         const tamp = listOrderItemsCooking;
        //         tamp.splice(index, 1);
        //         setState({
        //             ...state,
        //             listOrderItemsCooking: tamp,
        //             listWaiter: reslistWaiter.data,
        //             loadingAllProduct: false,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingAllProduct: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingAllProduct: false,
        //     });
        // }
    };

    // Click một món theo món [COOKING]
    const handleCookingOneByProduct = async (productId, size, index) => {
        setState({
            ...state,
            loadingOneProduct: true,
        });

        socket.emit('cooking-one-by-product', accessToken, productId, size);
        socket.on('cooking-one-by-product-success', (data) => {
            const tamp = [...listOrderItemsCooking];
            if (tamp[index].quantity > 1) {
                tamp[index].quantity -= 1;
            } else {
                tamp.splice(index, 1);
            }
            setState({
                ...state,
                listOrderItemsCooking: tamp,
                listWaiter: data,
                loadingOneProduct: false,
            });
        });
        socket.on('cooking-one-by-product-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingOneProduct: false,
            });
        });

        // try {
        //     const reslistWaiter = await KitchenService.cookingOneByProduct(productId, size);
        //     if (reslistWaiter.status === 200) {
        //         const tamp = [...listOrderItemsCooking];
        //         if (tamp[index].quantity > 1) {
        //             tamp[index].quantity -= 1;
        //         } else {
        //             tamp.splice(index, 1);
        //         }
        //         setState({
        //             ...state,
        //             listOrderItemsCooking: tamp,
        //             listWaiter: reslistWaiter.data.orderItemResponseList,
        //             loadingOneProduct: false,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingOneProduct: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingOneProduct: false,
        //     });
        // }
    };

    // Click tất cả 1 món theo bàn [COOKING]
    const handleCookingAllByProductTable = async (orderId, productId, size, indexTable, index, tableId) => {
        setState({
            ...state,
            loadingAllProductTable: true,
        });

        socket.emit('cooking-all-product-by-table', accessToken, orderId, productId, size, tableId);
        socket.on('cooking-all-product-by-table-success', (data) => {
            const list = [...listTableItemsCooking];
            list[indexTable].countProduct -= list[indexTable].orderItems[index].quantity;

            if (list[indexTable].orderItems.length <= 1) {
                list.splice(indexTable, 1);
            } else {
                list[indexTable].orderItems.splice(index, 1);
            }

            setState({
                ...state,
                listTableItemsCooking: list,
                listWaiter: data,
                loadingAllProductTable: false,
            });
        });
        socket.on('cooking-all-product-by-table-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingAllProductTable: false,
            });
        });

        // try {
        //     const reslistWaiter = await KitchenService.cookingAllByProductTable(orderId, productId, size);
        //     if (reslistWaiter.status === 200) {
        //         const list = [...listTableItemsCooking];
        //         list[indexTable].countProduct -= list[indexTable].orderItems[index].quantity;

        //         if (list[indexTable].orderItems.length <= 1) {
        //             list.splice(indexTable, 1);
        //         } else {
        //             list[indexTable].orderItems.splice(index, 1);
        //         }

        //         setState({
        //             ...state,
        //             listTableItemsCooking: list,
        //             listWaiter: reslistWaiter.data,
        //             loadingAllProductTable: false,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không tìm thấy sản phẩm!');
        //         setState({
        //             ...state,
        //             loadingAllProductTable: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingAllProductTable: false,
        //     });
        // }
    };

    // Click tất cả bàn  [COOKING]
    const handleCookingAllByTable = async (orderId, index, tableId) => {
        setState({
            ...state,
            loadingAllTable: true,
        });
        socket.emit('cooking-all-by-table', accessToken, orderId, tableId);
        socket.on('cooking-all-by-table-success', (data) => {
            const tamp = [...listTableItemsCooking];

            tamp.splice(index, 1);

            setState({
                ...state,
                listWaiter: data,
                listTableItemsCooking: tamp,
                loadingAllTable: false,
            });
        });
        socket.on('cooking-all-by-table-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingAllTable: false,
            });
        });
        // try {
        //     const reslistWaiter = await KitchenService.cookingAllByTable(orderId);
        //     if (reslistWaiter.status === 200) {
        //         const tamp = listTableItemsCooking;
        //         tamp.splice(index, 1);
        //         setState({
        //             ...state,
        //             listOrderItemsCooking: tamp,
        //             listWaiter: reslistWaiter.data,
        //             loadingAllTable: false,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingAllTable: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingAllTable: false,
        //     });
        // }
    };

    // Click 1 món theo bàn [COOKING]
    const handleCookingOneByTable = async (orderItemId, indexTable, index, orderId, tableId) => {
        setState({
            ...state,
            loadingOneProductTable: true,
        });

        socket.emit('cooking-one-by-table', accessToken, orderItemId, orderId, tableId);
        socket.on('cooking-one-by-table-success', (data) => {
            const list = [...listTableItemsCooking];
            if (list[indexTable].countProduct <= 1) {
                list.splice(indexTable, 1);
            } else if (list[indexTable].orderItems[index].quantity <= 1) {
                list[indexTable].orderItems.splice(index, 1);
                list[indexTable].countProduct -= 1;
            } else {
                list[indexTable].orderItems[index].quantity -= 1;
                list[indexTable].countProduct -= 1;
            }

            setState({
                ...state,
                listTableItemsCooking: list,
                listWaiter: data,
                loadingAllProductTable: false,
            });
        });
        socket.on('cooking-one-by-table-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingOneProductTable: false,
            });
        });

        // try {
        //     const reslistWaiter = await KitchenService.cookingOneByProductTable(orderItemId);
        //     if (reslistWaiter.status === 200) {
        //         const list = [...listTableItemsCooking];
        //         if (list[indexTable].countProduct <= 1) {
        //             list.splice(indexTable, 1);
        //         } else if (list[indexTable].orderItems[index].quantity <= 1) {
        //             list[indexTable].orderItems.splice(index, 1);
        //             list[indexTable].countProduct -= 1;
        //         } else {
        //             list[indexTable].orderItems[index].quantity -= 1;
        //             list[indexTable].countProduct -= 1;
        //         }

        //         setState({
        //             ...state,
        //             listTableItemsCooking: list,
        //             listWaiter: reslistWaiter.data,
        //             loadingAllProductTable: false,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingOneProductTable: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingOneProductTable: false,
        //     });
        // }
    };

    // Click tất cả [WAITER]
    const handleWaiterALL = async (orderItemId, index, orderId, tableId) => {
        setState({
            ...state,
            loadingAllWaiter: true,
        });

        socket.emit('waiter-all', accessToken, orderItemId, orderId, tableId);
        socket.on('waiter-all-success', (data) => {
            if (data === 200) {
                const tamp = [...listWaiter];
                tamp.splice(index, 1);
                setState({
                    ...state,
                    listWaiter: tamp,
                });
            } else {
                toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
                setState({
                    ...state,
                    loadingAllWaiter: false,
                });
            }
        });
        socket.on('waiter-all-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingOneProductTable: false,
            });
        });

        // try {
        //     const result = await KitchenService.waiterAll(orderItemId);
        //     if (result.status === 200) {
        //         const tamp = [...listWaiter];
        //         tamp.splice(index, 1);
        //         setState({
        //             ...state,
        //             listWaiter: tamp,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingAllWaiter: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingAllWaiter: false,
        //     });
        // }
    };
    // Click 1 món [WAITER]
    const handleWaiterONE = async (orderItemId, index, orderId, tableId) => {
        setState({
            ...state,
            loadingOneWaiter: true,
        });

        socket.emit('waiter-one', accessToken, orderItemId, orderId, tableId);
        socket.on('waiter-one-success', (data) => {
            if (data === 200) {
                const tamp = [...listWaiter];
                if (tamp[index].quantity <= 1) {
                    tamp.splice(index, 1);
                } else {
                    tamp[index].quantity -= 1;
                }
                setState({
                    ...state,
                    listWaiter: tamp,
                });
            } else {
                toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
                setState({
                    ...state,
                    loadingOneWaiter: false,
                });
            }
        });
        socket.on('waiter-one-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingOneWaiter: false,
            });
        });

        // try {
        //     const result = await KitchenService.waiterOne(orderItemId);
        //     if (result.status === 200) {
        //         const tamp = [...listWaiter];
        //         if (tamp[index].quantity <= 1) {
        //             tamp.splice(index, 1);
        //         } else {
        //             tamp[index].quantity -= 1;
        //         }
        //         setState({
        //             ...state,
        //             listWaiter: tamp,
        //         });
        //     } else {
        //         toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //         setState({
        //             ...state,
        //             loadingOneWaiter: false,
        //         });
        //     }
        // } catch (error) {
        //     toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
        //     setState({
        //         ...state,
        //         loadingOneWaiter: false,
        //     });
        // }
    };

    // Xóa 1 món trong bàn
    const handleRemoveItem = (orderItemId, productName, indexTable, index, orderId, tableId) => {
        Swal.fire({
            title: `Nhập số lượng [${productName}] muốn hủy:`,
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ',
            showLoaderOnConfirm: true,
            preConfirm: async (quantity) => {
                try {
                    const result = await KitchenService.RemoveOrderItem(orderItemId, quantity);
                    const list = [...listTableItemsCooking];
                    if (list[indexTable].countProduct <= quantity) {
                        list.splice(indexTable, 1);
                    } else if (+list[indexTable].orderItems[index].quantity === +quantity) {
                        list[indexTable].orderItems.splice(index, 1);
                        list[indexTable].countProduct -= quantity;
                    } else {
                        list[indexTable].orderItems[index].quantity -= quantity;
                        list[indexTable].countProduct -= quantity;
                    }
                    socket.emit('remove-order-item', accessToken, orderId, tableId);
                    setState({
                        ...state,
                        listTableItemsCooking: list,
                    });
                } catch (error) {
                    if (error.response.status === 400) {
                        Swal.showValidationMessage(`${error.response.data.message}`);
                    } else {
                        Swal.showValidationMessage('Vui lòng kiểm tra lại dữ liệu');
                    }
                }
            },

            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                toast.success('Hủy sản phẩm thành công!!!');
            }
        });
    };
    // Xóa toàn bộ món trong bàn
    const handleRemoveOrder = async (orderId, indexTable, idTable) => {
        socket.emit('remove-order', accessToken, orderId, idTable);
        socket.on('remove-order-success', (data) => {
            if (data === 202) {
                const list = [...listTableItemsCooking];
                const idStaff = cookies.load('idToken');
                list.splice(indexTable, 1);
                const newOrders = {
                    orderId: null,
                    tableId: idTable,
                    staffId: idStaff,
                    orderItems: [],
                    totalAmount: 0,
                    numberOfNewOrerItem: 0,
                };

                localStorage.setItem(`tableId${idTable}`, JSON.stringify(newOrders));
                setState({
                    ...state,
                    listTableItemsCooking: list,
                });
                toast.success('Hủy món ăn thành công');
            } else {
                toast.error('Lỗi hệ thống, không thể cập nhật dữ liệu!');
            }
        });
        socket.on('remove-order-error', (error) => {
            toast.error(error);
        });
        // try {
        //     const respon = await KitchenService.RemoveOrder(orderId);
        //     if (respon.status === 202) {
        //         const list = [...listTableItemsCooking];
        //         const idStaff = cookies.load('idToken');
        //         list.splice(indexTable, 1);
        //         const newOrders = {
        //             orderId: null,
        //             tableId: idTable,
        //             staffId: idStaff,
        //             orderItems: [],
        //             totalAmount: 0,
        //             numberOfNewOrerItem: 0,
        //         };

        //         localStorage.setItem(`tableId${idTable}`, JSON.stringify(newOrders));
        //         setState({
        //             ...state,
        //             listTableItemsCooking: list,
        //         });
        //         toast.success('Hủy món ăn thành công');
        //     } else {
        //         toast.error('Hủy món ăn thất bại');
        //     }
        // } catch (error) {
        //     toast.error(error.response.data.message);
        // }
    };
    return (
        <>
            <Helmet>
                <title> Coffee Legend | Nhà bếp</title>
            </Helmet>

            <Modal open={loading}>
                <div
                    style={{
                        outline: 'none',
                        position: 'absolute',
                        left: '42%',
                        top: '35%',
                        width: '250px',
                    }}
                >
                    <Loading />
                </div>
            </Modal>

            <Container maxWidth="xl" sx={{ backgroundColor: '#793939', height: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6} lg={6}>
                        <Stack direction="row" alignItems="center">
                            {checkMenu ? (
                                <Button
                                    variant="contained"
                                    onClick={handleClickMenuProduct}
                                    sx={{
                                        position: 'relative',
                                        mt: '4px',
                                        ml: '10px',
                                        borderRadius: '15px 15px 0 0',
                                        backgroundColor: '#cd6868',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                            color: '#713737',
                                        },
                                    }}
                                >
                                    Theo món
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    sx={{
                                        position: 'relative',
                                        mt: '4px',
                                        ml: '10px',
                                        borderRadius: '15px 15px 0 0',
                                        backgroundColor: '#F9FAFB',
                                        color: '#713737',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                        },
                                    }}
                                >
                                    Theo món
                                </Button>
                            )}
                            {checkMenu ? (
                                <Button
                                    variant="contained"
                                    sx={{
                                        position: 'relative',
                                        mt: '4px',
                                        ml: '10px',
                                        borderRadius: '15px 15px 0 0',
                                        backgroundColor: '#F9FAFB',
                                        color: '#713737',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                        },
                                    }}
                                >
                                    Theo phòng/bàn
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleClickMenuTable}
                                    sx={{
                                        position: 'relative',
                                        mt: '4px',
                                        ml: '10px',
                                        borderRadius: '15px 15px 0 0',
                                        backgroundColor: '#cd6868',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                            color: '#713737',
                                        },
                                    }}
                                >
                                    Theo phòng/bàn
                                </Button>
                            )}
                            <Typography
                                sx={{
                                    ml: '40%',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                }}
                            >
                                CHỜ CHẾ BIẾN
                            </Typography>
                        </Stack>
                        {checkMenu ? (
                            <Box
                                style={{
                                    maxHeight: 650,
                                    minHeight: 650,
                                    overflow: 'auto',
                                    paddingTop: '20px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                }}
                                className="wrapperBoard"
                            >
                                {listTableItemsCooking ? (
                                    <ListTableItemCooking
                                        handleRemoveOrder={handleRemoveOrder}
                                        handleRemoveItem={handleRemoveItem}
                                        loadingOneProductTable={loadingOneProductTable}
                                        handleCookingOneByTable={handleCookingOneByTable}
                                        loadingAllProductTable={loadingAllProductTable}
                                        loadingAllTable={loadingAllTable}
                                        listTableItemsCooking={listTableItemsCooking}
                                        handleCookingAllByTable={handleCookingAllByTable}
                                        handleCookingAllByProductTable={handleCookingAllByProductTable}
                                    />
                                ) : (
                                    <>
                                        <Iconify
                                            icon={'noto-v1:fork-and-knife-with-plate'}
                                            width="100px"
                                            height={50}
                                            sx={{
                                                position: 'relative',
                                                ml: '41%',
                                                mt: '25%',
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                fontSize: '20px',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            Chưa có món nào
                                        </Typography>
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            Bếp đang trong trạng thái chờ gọi món
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        ) : (
                            <Box
                                style={{
                                    maxHeight: 650,
                                    minHeight: 650,
                                    overflow: 'auto',
                                    paddingTop: '20px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                }}
                                className="wrapperBoard"
                            >
                                {listOrderItemsCooking ? (
                                    <ListItemCooking
                                        loadingOneProduct={loadingOneProduct}
                                        handleCookingOneByProduct={handleCookingOneByProduct}
                                        loadingAllProduct={loadingAllProduct}
                                        listOrderItemsCooking={listOrderItemsCooking}
                                        handleCookingAllByProduct={handleCookingAllByProduct}
                                    />
                                ) : (
                                    <>
                                        <Iconify
                                            icon={'noto-v1:fork-and-knife-with-plate'}
                                            width="100px"
                                            height={50}
                                            sx={{
                                                position: 'relative',
                                                ml: '41%',
                                                mt: '25%',
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                fontSize: '20px',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            Chưa có món nào
                                        </Typography>
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            Bếp đang trong trạng thái chờ gọi món
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <Button
                            variant="contained"
                            sx={{
                                position: 'relative',
                                mt: '4px',
                                ml: '10px',
                                borderRadius: '15px 15px 0 0',
                                backgroundColor: '#F9FAFB',
                                color: '#713737',
                                boxShadow: 'none',
                                cursor: 'default',
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                },
                            }}
                        >
                            ĐÃ XONG/ CHỜ CUNG ỨNG
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                position: 'absolute',
                                height: '24px',
                                mt: '8px',
                                right: '60px !important',
                                borderRadius: '15px',
                                backgroundColor: '#793939',
                                color: 'white',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                    color: '#713737',
                                },
                            }}
                        >
                            <Iconify
                                icon={'mdi:calendar-user'}
                                width={20}
                                height={50}
                                sx={{
                                    mr: 1,
                                }}
                            />
                            {staffName}
                        </Button>
                        <MenuBarKitchen />
                        <Box
                            style={{
                                maxHeight: 650,
                                minHeight: 650,
                                overflow: 'auto',
                                paddingTop: '20px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                            }}
                            className="wrapperBoard"
                        >
                            {listWaiter ? (
                                <ListWaiter
                                    listWaiter={listWaiter}
                                    handleWaiterALL={handleWaiterALL}
                                    loadingAllWaiter={loadingAllWaiter}
                                    loadingOneWaiter={loadingOneWaiter}
                                    handleWaiterONE={handleWaiterONE}
                                />
                            ) : (
                                <>
                                    <Iconify
                                        icon={'noto-v1:fork-and-knife-with-plate'}
                                        width="100px"
                                        height={50}
                                        sx={{
                                            position: 'relative',
                                            ml: '41%',
                                            mt: '25%',
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            textAlign: 'center',
                                            fontSize: '20px',
                                            fontWeight: 'bolder',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        Chưa có món nào
                                    </Typography>
                                    <Typography
                                        sx={{
                                            textAlign: 'center',
                                            fontSize: '14px',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        Bếp đang pha chế
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* footer */}
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    height: '30px',
                    pt: '4px',
                    position: 'fixed',
                    backgroundColor: '#793939',
                    bottom: 0,
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Iconify
                        icon={'ic:baseline-phone-callback'}
                        color="white"
                        width={20}
                        height={50}
                        sx={{
                            mr: 1,
                        }}
                    />
                    <Typography sx={{ color: 'white', fontFamily: 'initial', fontSize: 'small' }}>
                        Hỗ trợ: 1900 1009
                    </Typography>
                    <Iconify
                        icon={'mdi:address-marker'}
                        color="white"
                        width={20}
                        height={50}
                        sx={{
                            mr: 1,
                            ml: 5,
                        }}
                    />
                    <Typography sx={{ color: 'white', fontFamily: 'initial', fontSize: 'small' }}>
                        Địa chỉ liên hệ: 28 Nguyễn Tri Phương{' '}
                    </Typography>
                    <Iconify
                        icon={'ion:mail-open-outline'}
                        color="white"
                        width={20}
                        height={50}
                        sx={{
                            mr: 1,
                            ml: 5,
                        }}
                    />
                    <Typography sx={{ color: 'white', fontFamily: 'initial', fontSize: 'small' }}>
                        coffee.legend.hbt@gmail.com
                    </Typography>{' '}
                </Stack>
            </Box>
        </>
    );
}
