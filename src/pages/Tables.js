import { Helmet } from 'react-helmet-async';
import jwtDecode from 'jwt-decode';

// router
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Container, Typography, Paper, Stack, Divider, TextField } from '@mui/material';

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import cookies from 'react-cookies';

import { LoadingButton } from '@mui/lab';

// Toast
import { toast } from 'react-toastify';

// SweetAlert
import Swal from 'sweetalert2';
import '../layouts/sweetalert.css';

import socketIOClient from 'socket.io-client';
import { SOCKET_SERVER } from '../services/common';

// sections
import { AppTablesList, AppSearchCategory } from '../sections/@dashboard/app';

import CashierService from '../services/cashierService';

import Loading from '../components/Loading/Loading';

import ProductList from '../sections/@dashboard/products/ProductList';

import AppOrderDetail from '../sections/@dashboard/app/AppOrderDetail';
import Iconify from '../components/iconify/Iconify';
import AppSearchProduct from '../sections/@dashboard/app/AppSearchProduct';
import Helper from '../helper/Helper';
import { EnumStatus } from '../utils/EnumStatus';
import { OrderItemStatus } from '../utils/OrderItemStatus';

import Bill from '../sections/@dashboard/bill/Bill';

// Menu bar
import MenuBar from '../sections/@dashboard/app/MenuBar';

// ----------------------------------------------------------------------

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #d8d8df',
    borderRadius: '12px',
    boxShadow: 24,
    p: 3,
};

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

const URL = SOCKET_SERVER;

let socket;
let clientId = null;
let idStaff;
let staffName;
let accessToken;
let ts;

const convertProduct = (products) => {
    for (let i = 0; i < products.length; i += 1) {
        const size = products[i].sizes;
        const tamp = Object.values(size);
        products[i].sizes = tamp;
    }
    return products;
};

export default function Tables() {
    const theme = useTheme();

    const [state, setState] = useState({
        loading: false,
        tables: [],
        products: [],
        productsList: [],
        productsListCurrent: [],
        productCurrent: {},
        sizesCurrent: [],
        priceCurrent: '',
        note: '',
        totalItem: 0,
        erroMessage: '',
        categories: [],
        quantity: 1,
        indexSizeCurrent: 0,
        orders: null,
        indexEditOrderItem: -1,
        loadingOrder: false,
        openBill: false,
        listOrderItems: [],
        totalBill: 0,
        tableCurrent: {},
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
        console.log(accessToken, 'access token');
        try {
            const token = jwtDecode(accessToken);
            console.log(token, 'token');
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

        let resTables = null;
        let resCategories = null;
        let productsData = null;
        try {
            axios.defaults.headers.common.Authorization = accessToken;
            resTables = await CashierService.getTables();

            const resProducts = await CashierService.getProducts();
            productsData = await convertProduct(resProducts.data);

            resCategories = await CashierService.getCategories();
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
        const data = resCategories.data;
        data.unshift({ title: 'Tất cả', id: 0 });
        setState({
            ...state,
            loading: false,
            tables: resTables.data,
            products: productsData,
            productsList: productsData,
            productsListCurrent: productsData,
            categories: data,
            indexCategory: 0,
        });
    }
    // Khởi tạo dữ liệu
    useEffect(() => {
        try {
            getData();
        } catch (error) {
            setState({
                ...state,
                erroMessage: error.message,
            });
        }
    }, []);

    const [checkMenu, setCheckMenu] = useState(false);
    const [keyword, setKeyword] = useState('');

    const toggleMenu = (value) => {
        setState({
            ...state,
            loading: true,
        });
        if (value.status === 'Trống') {
            value.status = 'Mở';
            CashierService.changeStatusTable(value.id, value);
        }
        setState({
            ...state,
            loading: false,
        });
        setCheckMenu(!checkMenu);
    };

    // Xem danh mục orders của bàn
    const updateTable = async (value) => {
        setState({
            ...state,
            loading: true,
        });
        const result = localStorage.getItem(`tableId${value.id}`);

        let ordersCurrent;
        if (result) {
            ordersCurrent = JSON.parse(result);
            if (ordersCurrent.orderId) {
                try {
                    const listItems = await CashierService.getOrderTable(ordersCurrent.orderId);

                    ordersCurrent.orderItems = listItems.data;
                    setState({
                        ...state,
                        loading: false,
                        orders: ordersCurrent,
                        tableCurrent: value,
                    });
                    setCheckMenu(!checkMenu);
                } catch (error) {
                    toast.error('Không thể lấy dữ liệu của bàn');
                    setState({
                        ...state,
                        loading: false,
                    });
                }
            } else {
                setState({
                    ...state,
                    loading: false,
                    orders: ordersCurrent,
                });
                setCheckMenu(!checkMenu);
            }
        } else {
            try {
                const result = await CashierService.getOrderTableWithTableId(value.id);
                const orderRes = result.data;
                const newOrders = {
                    orderId: orderRes.orderId,
                    tableId: value.id,
                    tableName: value.name,
                    staffId: orderRes.staffId,
                    orderItems: orderRes.orderItems,
                    totalAmount: orderRes.totalAmount,
                    numberOfNewOrerItem: 0,
                };
                localStorage.setItem(`tableId${value.id}`, JSON.stringify(newOrders));
                setState({
                    ...state,
                    loading: false,
                    orders: newOrders,
                    tableCurrent: value,
                });
                setCheckMenu(!checkMenu);
            } catch (error) {
                toast.error('Không thể lấy dữ liệu của bàn');
                setState({
                    ...state,
                    loading: false,
                });
            }
        }
    };

    if (!clientId) {
        socket = socketIOClient(URL);
        socket.emit('create-room', 'Legend');

        socket.on('server-connection', (socketId) => {
            clientId = socketId;
        });
    }

    const {
        tables,
        loading,
        products,
        productsList,
        categories,
        indexCategory,
        productsListCurrent,
        indexSizeCurrent,
        productCurrent,
        sizesCurrent,
        priceCurrent,
        quantity,
        note,
        totalItem,
        orders,
        indexEditOrderItem,
        loadingOrder,
        numberOfNewOrerItem,
        openBill,
        listOrderItems,
        totalBill,
        tableCurrent,
    } = state;

    const [orderValue, setOrderValue] = useState({
        tableId: null,
    });
    socket.removeAllListeners();

    socket.on('get-order-update', (obj) => {
        if (ts !== obj.ts) {
            ts = obj.ts;
            const ordersCurrent = JSON.parse(localStorage.getItem(`tableId${obj.idTable}`));
            const listOrderNewItems = ordersCurrent.orderItems.filter(
                (item) => item.orderItemStatus === OrderItemStatus.NEW.status
            );
            const list = listOrderNewItems.concat(obj.listItems);
            ordersCurrent.orderItems = list;
            localStorage.setItem(`tableId${obj.idTable}`, JSON.stringify(ordersCurrent));

            setOrderValue(ordersCurrent);
        }
    });
    useEffect(() => {
        if (orders && orderValue && orders.tableId === orderValue.tableId) {
            setState({
                ...state,
                orders: orderValue,
            });
        }
    }, [orderValue]);
    socket.on('get-order-all-by-product', (obj) => {
        let orderChange;
        if (ts !== obj.ts) {
            ts = obj.ts;
            const listOrders = obj.listChangeOrder;

            listOrders.forEach(async (element) => {
                const ordersCurrent = JSON.parse(localStorage.getItem(`tableId${element[0].tableId}`));
                const listOrderNewItems = ordersCurrent.orderItems.filter(
                    (item) => item.orderItemStatus === OrderItemStatus.NEW.status
                );
                const list = listOrderNewItems.concat(element);
                ordersCurrent.orderItems = list;
                localStorage.setItem(`tableId${element[0].tableId}`, JSON.stringify(ordersCurrent));

                setOrderValue(ordersCurrent);
            });
        }
    });
    socket.on('get-order-one-by-product', (obj) => {
        let orderChange;
        if (ts !== obj.ts) {
            ts = obj.ts;
            const ordersChange = obj.ordersChange;
            const ordersCurrent = JSON.parse(localStorage.getItem(`tableId${ordersChange[0].tableId}`));
            const listOrderNewItems = ordersCurrent.orderItems.filter(
                (item) => item.orderItemStatus === OrderItemStatus.NEW.status
            );
            const list = listOrderNewItems.concat(ordersChange);
            ordersCurrent.orderItems = list;
            localStorage.setItem(`tableId${ordersChange[0].tableId}`, JSON.stringify(ordersCurrent));
            setOrderValue(ordersCurrent);
        }
    });

    // Mở bàn
    const openTable = async (value) => {
        setState({
            ...state,
            loading: true,
        });

        const opentable = {
            id: value.id,
            name: value.name,
            status: EnumStatus.OPEN.status,
        };
        try {
            const result = await CashierService.changeStatusTable(value.id, opentable);
            value.status = result.data.status;
            value.statusValue = result.data.statusValue;
        } catch (error) {
            toast.error('Lỗi hệ thống, không thể cập nhật trạng thái bàn!');
            setState({
                ...state,
                loading: false,
            });
            return;
        }
        const newOrders = {
            orderId: null,
            tableId: value.id,
            tableName: value.name,
            staffId: idStaff,
            orderItems: [],
            totalAmount: 0,
            numberOfNewOrerItem: 0,
        };
        toast.info(`${value.name} được kích hoạt, vui lòng chọn món!`);
        localStorage.setItem(`tableId${value.id}`, JSON.stringify(newOrders));
        setState({
            ...state,
            loading: false,
            orders: newOrders,
            tableCurrent: value,
        });
        setCheckMenu(!checkMenu);
    };
    // Hủy bàn
    const closeTable = async (value) => {
        setState({
            ...state,
            loading: true,
        });

        const closetable = {
            id: value.id,
            name: value.name,
            status: EnumStatus.EMPTY.status,
        };
        try {
            const result = await CashierService.changeStatusTable(value.id, closetable);
            value.status = result.data.status;
            value.statusValue = result.data.statusValue;
        } catch (error) {
            toast.error('Lỗi hệ thống, không thể cập nhật trạng thái bàn!');
            setState({
                ...state,
                loading: false,
            });
            return;
        }

        toast.success(`${value.name} hủy thành công`);
        localStorage.removeItem(`tableId${value.id}`);
        setState({
            ...state,
            loading: false,
            orders: null,
        });
    };

    // Chuyển qua menu đặt món
    const showMenu = () => {
        setCheckMenu(!checkMenu);
    };

    // Tìm kiếm sản phẩm
    const handleSearch = async (e) => {
        setKeyword(e.target.value);
        setState({
            ...state,
            products: e.target.value
                ? productsListCurrent.filter((item) => item.title.toUpperCase().includes(e.target.value.toUpperCase()))
                : productsListCurrent,
        });
    };

    // Tìm sản phẩm theo danh mục
    const handleChangeCategory = (e) => {
        const list =
            e.target.value !== 0 ? productsList.filter((item) => item.categoryId === e.target.value) : productsList;
        const listSearch = keyword
            ? list.filter((item) => item.name.toUpperCase().includes(keyword.toUpperCase()))
            : list;
        setState({
            ...state,
            indexCategory: e.target.value,
            productsListCurrent: list,
            products: listSearch,
        });
    };

    // Xóa ô tìm kiếm
    const handleDeleteSearch = () => {
        setKeyword('');
        setState({
            ...state,
            products: productsListCurrent,
        });
    };

    // modal
    const [open, setOpen] = useState(false);

    const findProductById = (id) => {
        for (let i = 0; i < productsList.length; i += 1) {
            if (productsList[i].id === id) {
                return productsList[i];
            }
        }
        return null;
    };
    // Hiện modal chọn món
    const handleOpen = (idProduct) => {
        setOpen(true);
        const product = findProductById(idProduct);
        setState({
            ...state,
            productCurrent: product,
            sizesCurrent: product.sizes,
            priceCurrent: product.sizes[0].price,
            quantity: 1,
            note: '',
            totalItem: product.sizes[0].price,
        });
    };
    // Hiện modal chỉnh sửa món đã chọn
    const handleOpenEditModal = async (orderItem, index) => {
        const product = await findProductById(orderItem.productId);
        let indexSize;
        for (let i = 0; i < product.sizes.length; i += 1) {
            if (orderItem.size === product.sizes[i].name) {
                indexSize = i;
                break;
            }
        }
        setState({
            ...state,
            productCurrent: product,
            sizesCurrent: product.sizes,
            priceCurrent: +orderItem.price,
            quantity: +orderItem.quantity,
            note: orderItem.note,
            totalItem: +orderItem.amount,
            indexSizeCurrent: indexSize,
            indexEditOrderItem: index,
        });
        setOpen(true);
    };
    // Ẩn modal chọn món
    const handleClose = () => {
        setOpen(false);
        setState({
            ...state,
            indexSizeCurrent: 0,
            indexEditOrderItem: -1,
        });
    };

    // Tăng, giảm số lượng modal chọn món
    const handleDecreaseQuantity = () => {
        setState({
            ...state,
            quantity: +quantity - 1,
            totalItem: +totalItem - +priceCurrent,
        });
    };

    const handleIncreaseQuantity = () => {
        setState({
            ...state,
            quantity: +quantity + 1,
            totalItem: +totalItem + +priceCurrent,
        });
    };

    const handleChangeQuantity = (e) => {
        if (Number(e.target.value) >= 1 && Number(e.target.value) <= 100) {
            const newTotalItem = e.target.value * priceCurrent;
            setState({
                ...state,
                quantity: Number(e.target.value),
                totalItem: newTotalItem,
            });
        }
    };
    // Thay đổi size ở modal chọn món
    const handlechangeSize = (value) => {
        const newTotalItem = +sizesCurrent[value].price * quantity;
        setState({
            ...state,
            indexSizeCurrent: value,
            priceCurrent: +sizesCurrent[value].price,
            totalItem: newTotalItem,
        });
    };
    // Kiểm tra sản phẩm đã tồn tại trong order
    const checkOrderItem = (orderItem) => {
        for (let i = 0; i < orders.orderItems.length; i += 1) {
            if (
                orders.orderItems[i].productId === orderItem.productId &&
                orders.orderItems[i].orderItemStatus === orderItem.orderItemStatus &&
                orders.orderItems[i].size === orderItem.size
            ) {
                return i;
            }
        }
        return -1;
    };
    // Thêm sản phẩm vào orders
    const handleOrderProduct = async () => {
        if (indexEditOrderItem >= 0) {
            const orderItem = {
                size: sizesCurrent[indexSizeCurrent].name,
                price: sizesCurrent[indexSizeCurrent].price,
                quantity: +state.quantity,
                amount: +totalItem,
                note: state.note,
                productId: productCurrent.id,
                productName: productCurrent.title,
                productPhoto: productCurrent.photo,
                tableId: orders.tableId,
                orderItemStatus: OrderItemStatus.NEW.status,
            };

            const newOrders = orders;

            const checkItem = checkOrderItem(orderItem);

            newOrders.totalAmount -= orders.orderItems[indexEditOrderItem].amount;
            newOrders.numberOfNewOrerItem -= orders.orderItems[indexEditOrderItem].quantity;
            if (checkItem === indexEditOrderItem || checkItem < 0) {
                newOrders.orderItems[indexEditOrderItem] = orderItem;
            } else {
                newOrders.orderItems[checkItem].quantity += +quantity;
                newOrders.orderItems[checkItem].amount += +totalItem;
                newOrders.orderItems[checkItem].note += orderItem.note;
                newOrders.orderItems.splice(indexEditOrderItem, 1);
            }

            newOrders.totalAmount += orderItem.amount;
            newOrders.numberOfNewOrerItem -= orderItem.quantity;
            localStorage.setItem(`tableId${newOrders.tableId}`, JSON.stringify(newOrders));
            setState({
                ...state,
                orders: newOrders,
                indexEditOrderItem: -1,
            });
            handleClose();
        } else {
            const orderItem = {
                productId: productCurrent.id,
                productName: productCurrent.title,
                productPhoto: productCurrent.photo,
                size: sizesCurrent[indexSizeCurrent].name,
                price: +sizesCurrent[indexSizeCurrent].price,
                quantity: state.quantity,
                amount: +totalItem,
                note: state.note,
                tableId: orders.tableId,
                orderItemStatus: OrderItemStatus.NEW.status,
            };

            const newOrders = orders;

            const checkItem = checkOrderItem(orderItem);
            if (checkItem < 0) {
                newOrders.orderItems.push(orderItem);
            } else {
                newOrders.orderItems[checkItem].quantity += quantity;
                newOrders.orderItems[checkItem].amount += +totalItem;
                newOrders.orderItems[checkItem].note += orderItem.note;
            }

            newOrders.totalAmount += orderItem.amount;
            newOrders.numberOfNewOrerItem += orderItem.quantity;

            localStorage.setItem(`tableId${newOrders.tableId}`, JSON.stringify(newOrders));

            setState({
                ...state,
                orders: newOrders,
            });
            handleClose();
        }
    };
    // Xóa sản phẩm khỏi orders
    const handleDeleteOrderItem = (index) => {
        const newOrders = orders;
        newOrders.totalAmount -= newOrders.orderItems[index].amount;

        newOrders.orderItems.splice(index, 1);
        localStorage.setItem(`tableId${newOrders.tableId}`, JSON.stringify(newOrders));
        setState({
            ...state,
            orders: newOrders,
        });
    };
    // Tăng giảm số lượng sản phẩm của order-item
    const handleChangeOrderItems = (index, orderItem) => {
        const newOrderItems = orders.orderItems;
        let newTotalAmount = +orders.totalAmount - +orderItem.amount;

        orderItem.amount = +orderItem.quantity * +orderItem.price;
        newTotalAmount += +orderItem.amount;
        newOrderItems[index] = orderItem;

        const newOrders = orders;
        newOrders.orderItem = newOrderItems;
        newOrders.totalAmount = newTotalAmount;
        localStorage.setItem(`tableId${newOrders.tableId}`, JSON.stringify(newOrders));

        setState({
            ...state,
            orders: newOrders,
        });
    };

    // Nhập bếp
    const convertOrderItems = () => {
        const orderRequest = {
            orderId: orders.orderId,
            staffId: +orders.staffId,
            tableId: orders.tableId,
            orderItems: [],
        };
        const listOrderItems = orders.orderItems.filter((item) => item.orderItemStatus === OrderItemStatus.NEW.status);

        listOrderItems.map((item) => {
            const orderItem = {
                id: null,
                size: item.size,
                price: +item.price,
                quantity: item.quantity,
                quantityDelivery: 0,
                amount: +item.amount,
                note: item.note,
                productId: item.productId,
                tableId: item.tableId,
                orderItemStatus: '',
                orderId: null,
            };
            orderRequest.orderItems.push(orderItem);
            return orderItem;
        });
        return orderRequest;
    };

    const handleNotifyOrder = async () => {
        if (orders === null) {
            toast.info('Vui lòng chọn bàn');
            return;
        }
        const orderRequest = convertOrderItems();
        if (orderRequest.orderItems.length === 0) {
            toast.info('Không có sản phẩm mới gọi!');
            return;
        }

        setState({
            ...state,
            loadingOrder: true,
        });
        // try {
        //     const result = await CashierService.setOrder(orderRequest);
        //     const newOrders = result.data;

        //     localStorage.setItem(`tableId${newOrders.tableId}`, JSON.stringify(newOrders));
        //     toast.success('Bếp đã nhận được thông báo!');
        //     setState({
        //         ...state,
        //         orders: result.data,
        //         loadingOrder: false,
        //     });
        // } catch (error) {
        //     toast.error('Thao tác không thành công, lỗi hệ thống!');
        // }
        console.log(accessToken, 'accessToken');
        console.log(orderRequest, 'orderRequest');
        socket.emit('order-product', accessToken, orderRequest);
        socket.on('order-product-success', (obj) => {
            const newOrder = obj.data;
            newOrder.tableName = orders.tableName;
            localStorage.setItem(`tableId${obj.data.tableId}`, JSON.stringify(newOrder));
            toast.success('Bếp đã nhận được thông báo!');
            setState({
                ...state,
                orders: newOrder,
                loadingOrder: false,
            });
        });
        socket.on('order-product-error', (error) => {
            toast.error(error);
            setState({
                ...state,
                loadingOrder: false,
            });
        });
    };

    // Modal thanh toán
    const handleOpenBill = async () => {
        if (orders === null) {
            toast.error('Vui lòng chọn bàn!');
            return;
        }
        if (orders.orderItems.length === 0) {
            toast.error('Vui lòng chọn món trước!');
            return;
        }
        let checkItemCooking = false;
        let checkDeliveryItem = false;
        orders.orderItems.forEach((item) => {
            if (item.orderItemStatus === OrderItemStatus.WAITER.status) {
                checkDeliveryItem = true;
                return;
            }
            if (
                item.orderItemStatus === OrderItemStatus.COOKING.status ||
                item.orderItemStatus === OrderItemStatus.NEW.status
            ) {
                checkItemCooking = true;
            }
        });
        if (checkDeliveryItem) {
            toast.error('Bàn chưa phục vụ xong, không thể thanh toán!');
            return;
        }

        const list = orders.orderItems.filter((item) => {
            return (
                item.orderItemStatus !== OrderItemStatus.COOKING.status &&
                item.orderItemStatus !== OrderItemStatus.NEW.status
            );
        });

        if (list.length === 0) {
            toast.error('Bàn chưa phục vụ xong, không thể thanh toán!');
            return;
        }
        if (checkItemCooking) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    title: 'titleDeleteItem',
                },
            });

            swalWithBootstrapButtons
                .fire({
                    title: 'Bàn còn sản phẩm đang chờ làm, nếu thanh toán thì sẽ hủy món',
                    showCancelButton: true,
                    confirmButtonText: 'Vẫn thanh toán',
                    cancelButtonText: `Hủy bỏ`,
                })
                .then((result) => {
                    let sumBill = 0;
                    for (let i = 0; i < list.length; i += 1) {
                        sumBill += list[i].amount;
                    }

                    if (result.isConfirmed) {
                        setState({
                            ...state,
                            openBill: true,
                            listOrderItems: list,
                            totalBill: sumBill,
                        });
                    }
                });
        } else {
            setState({
                ...state,
                openBill: true,
                listOrderItems: orders.orderItems,
                totalBill: orders.totalAmount,
            });
        }
    };
    const handleCloseBill = () => {
        setState({
            ...state,
            openBill: false,
        });
    };
    const handlePayMoneyToClose = (idTable) => {
        const newListTables = [...tables];
        for (let i = 0; i < newListTables.length; i += 1) {
            if (newListTables[i].id === idTable) {
                newListTables[i].status = EnumStatus.EMPTY.status;
                newListTables[i].statusValue = EnumStatus.EMPTY.statusValue;
                break;
            }
        }
        localStorage.removeItem(`tableId${idTable}`);
        setState({
            ...state,
            tables: newListTables,
            orders: null,
            openBill: false,
        });
    };

    return (
        <>
            <Helmet>
                <title> Coffee Legend | Thu ngân</title>
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
                    <Grid item xs={7} md={7} lg={7}>
                        {checkMenu ? (
                            <Button
                                variant="contained"
                                onClick={showMenu}
                                sx={{
                                    position: 'relative',
                                    mt: '4px',
                                    ml: '9px',
                                    borderRadius: '15px 15px 0 0',
                                    backgroundColor: '#cd6868',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#F9FAFB',
                                        color: '#713737',
                                    },
                                }}
                            >
                                <Iconify icon={'ic:twotone-restaurant-menu'} width={20} height={50} sx={{ mr: 1 }} />
                                Phòng bàn
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{
                                    position: 'relative',
                                    mt: '4px',
                                    ml: '9px',
                                    borderRadius: '15px 15px 0 0',
                                    backgroundColor: '#F9FAFB',
                                    color: '#713737',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#F9FAFB',
                                    },
                                }}
                            >
                                <Iconify
                                    icon={'ic:twotone-restaurant-menu'}
                                    color="#713737"
                                    width={20}
                                    height={50}
                                    sx={{ mr: 1 }}
                                />
                                Phòng bàn
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
                                <Iconify
                                    icon={'ic:baseline-menu-book'}
                                    width={20}
                                    height={50}
                                    sx={{
                                        mr: 1,
                                    }}
                                />
                                Thực đơn
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={showMenu}
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
                                <Iconify
                                    icon={'ic:baseline-menu-book'}
                                    width={20}
                                    height={50}
                                    sx={{
                                        mr: 1,
                                    }}
                                />
                                Thực đơn
                            </Button>
                        )}

                        <Box
                            style={{
                                maxHeight: 650,
                                minHeight: 650,
                                // overflow: 'auto',
                                padding: '10px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                            }}
                            className="wrapperBoard"
                        >
                            {checkMenu ? (
                                <>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ width: '100%' }}
                                    >
                                        <AppSearchProduct
                                            keyword={keyword}
                                            onFilterName={handleSearch}
                                            onDeleteSearch={handleDeleteSearch}
                                        />
                                        <AppSearchCategory
                                            indexCategory={indexCategory}
                                            options={categories}
                                            onSort={handleChangeCategory}
                                        />
                                    </Stack>
                                    <Box
                                        style={{
                                            maxHeight: 580,
                                            minHeight: 580,
                                            overflow: 'auto',
                                            backgroundColor: '#F9FAFB',
                                            borderRadius: '12px',
                                        }}
                                        className="wrapperBoard"
                                    >
                                        <ProductList
                                            products={products}
                                            onOrder={(idProduct) => {
                                                handleOpen(idProduct);
                                            }}
                                        />
                                        {products.length <= 0 && (
                                            <Paper
                                                sx={{
                                                    textAlign: 'center',
                                                    mt: 3,
                                                }}
                                            >
                                                <Typography variant="h6" paragraph>
                                                    Không tìm thấy
                                                </Typography>

                                                <Typography variant="body2">
                                                    Không có kết quả cho &nbsp;
                                                    <strong>&quot;{keyword}&quot;</strong>
                                                    .
                                                    <br /> Vui lòng kiểm tra lại từ khóa.
                                                </Typography>
                                            </Paper>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <AppTablesList
                                    onClick={(value) => {
                                        toggleMenu(value);
                                    }}
                                    openTable={openTable}
                                    updateTable={updateTable}
                                    closeTable={closeTable}
                                    title="DANH SÁCH"
                                    list={tables}
                                    style={{
                                        maxHeight: 620,
                                        minHeight: 620,
                                        overflow: 'auto',
                                        marginTop: '5px',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: '12px',
                                    }}
                                    className="wrapperBoard"
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={5} md={5} lg={5}>
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
                            <Iconify
                                icon={'ic:round-table-restaurant'}
                                width={20}
                                height={50}
                                sx={{
                                    mr: 1,
                                }}
                            />
                            {orders ? orders.tableName : 'Bàn'}
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
                        <MenuBar />
                        <Box
                            style={{
                                maxHeight: 650,
                                minHeight: 650,
                                padding: '10px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                            }}
                            className="wrapperBoard"
                        >
                            <Button
                                sx={{
                                    color: 'gray',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    ml: '94%',
                                    mb: '2px',
                                    borderRadius: '50%',
                                    maxWidth: '35px',
                                    minWidth: '35px',
                                    maxHeight: '35px',
                                    minHeight: '35px',
                                    border: 'none',
                                    // position: 'absolute',
                                    backgroundColor: '#0008100a',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: '#ff563014',
                                        border: 'none',
                                    },
                                }}
                            >
                                <Iconify icon="carbon:overflow-menu-vertical" />
                            </Button>
                            <Box
                                style={{
                                    maxHeight: 500,
                                    minHeight: 500,
                                    overflow: 'auto',
                                    padding: 4,
                                    // backgroundColor: '#F9FAFB',
                                    backgroundColor: '#0008100a',
                                    borderRadius: '12px',
                                }}
                                className="wrapperBoard"
                            >
                                {!orders ? (
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
                                            Vui lòng chọn món trong thực đơn
                                        </Typography>
                                    </>
                                ) : orders.orderItems.length !== 0 ? (
                                    <AppOrderDetail
                                        orders={orders}
                                        handleOpenEditModal={handleOpenEditModal}
                                        handleChangeOrderItems={handleChangeOrderItems}
                                        handleDeleteOrderItem={handleDeleteOrderItem}
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
                                            Vui lòng chọn món trong thực đơn
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ padding: '2px 10px', m: '5px 2px' }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#252a2b',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    TỔNG TIỀN
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'red',
                                        fontWeight: 700,
                                        fontSize: '18px',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    {orders
                                        ? Helper.formatCurrencyToVND(orders.totalAmount)
                                        : Helper.formatCurrencyToVND(0)}
                                </Typography>
                            </Stack>
                            <Button
                                variant="contained"
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#28B44F',
                                    border: '1px solid #28B44F',
                                    width: '48%',
                                    // mt: 2,
                                    mr: '4%',
                                    fontSize: '20px',
                                    fontFamily: 'serif',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: '#d0181b',
                                    },
                                }}
                                onClick={handleOpenBill}
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
                            </Button>

                            <LoadingButton
                                loading={loadingOrder}
                                variant="contained"
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#0066CC',
                                    border: '1px solid #0066CC',
                                    width: '48%',
                                    fontSize: '20px',
                                    fontFamily: 'serif',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: '#d0181b',
                                    },
                                    // cursor: 'not-allowed',
                                    cursor: 'pointer',
                                }}
                                onClick={handleNotifyOrder}
                            >
                                <Iconify
                                    icon={'ep:dish'}
                                    width="25px"
                                    height={50}
                                    sx={{
                                        mr: 1,
                                    }}
                                />
                                Nhập bếp
                            </LoadingButton>
                        </Box>

                        {Boolean(orders === {}) && (
                            <AppOrderDetail
                                orders={orders}
                                handleChangeOrderItems={handleChangeOrderItems}
                                handleDeleteOrderItem={handleDeleteOrderItem}
                            />
                        )}
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

            {/* Modal order */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                    disableAutoFocus
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <Iconify
                                icon={'material-symbols:close'}
                                position="absolute"
                                top="-10px"
                                right="-10px"
                                bgcolor="white"
                                color="#5A5A72"
                                borderRadius="50%"
                                border="1px solid #d8d8df"
                                width={36}
                                padding={0.6}
                                cursor="pointer"
                                boxShadow="rgba(0, 0, 0, 0.2) 0px 2px 12px 0px"
                                sx={{
                                    '&:hover': {
                                        color: '#131318',
                                        bgcolor: '#EBEBEF',
                                        border: '1px solid #B9B9c6',
                                    },
                                }}
                                onClick={handleClose}
                            />
                            <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                sx={{
                                    color: '#53382c',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bolder',
                                    fontFamily: 'fontkhachhang',
                                }}
                            >
                                {productCurrent.title}
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={5} md={5} lg={5}>
                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                        <StyledProductImg alt={productCurrent.title} src={productCurrent.photo} />
                                    </Box>
                                    <Stack direction="row" alignItems="center" justifyContent="center">
                                        <Typography
                                            variant="transition-modal-description"
                                            sx={{
                                                mr: 3,
                                                fontSize: '14px',
                                                color: '#333333',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            TỔNG CỘNG:
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: '#b22830',
                                                fontWeight: 700,
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            {Helper.formatCurrencyToVND(totalItem)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={7} md={7} lg={7} sx={{ textAlign: 'justify' }}>
                                    <Typography
                                        variant="transition-modal-description"
                                        sx={{
                                            fontSize: '14px',
                                            color: '#53382c',
                                            fontWeight: 'normal',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {productCurrent.description}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {sizesCurrent.length > 1 && (
                                        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                                            <Typography
                                                variant="transition-modal-description"
                                                sx={{
                                                    mr: 2,
                                                    fontSize: '14px',
                                                    color: '#333333',
                                                    fontWeight: 'normal',
                                                }}
                                            >
                                                Size:
                                            </Typography>

                                            {sizesCurrent.map((item, index) =>
                                                index === indexSizeCurrent ? (
                                                    <Typography
                                                        key={index}
                                                        sx={{
                                                            mr: 2,
                                                            display: 'block',
                                                            padding: '5px 10px',
                                                            border: '1px solid #b22830',
                                                            color: '#b22830',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        key={index}
                                                        sx={{
                                                            mr: 2,
                                                            display: 'block',
                                                            padding: '5px 10px',
                                                            border: '1px solid #c3c3c3',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                color: '#b22830',
                                                                border: '1px solid #b22830',
                                                            },
                                                        }}
                                                        onClick={() => {
                                                            handlechangeSize(index);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                )
                                            )}
                                        </Stack>
                                    )}
                                    {sizesCurrent !== [] && (
                                        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                                            <Typography
                                                variant="transition-modal-description"
                                                sx={{
                                                    mr: 1,
                                                    fontSize: '14px',
                                                    color: '#333333',
                                                    fontWeight: 'normal',
                                                }}
                                            >
                                                Giá:
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: '#53382c',
                                                    fontWeight: 700,
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                {Helper.formatCurrencyToVND(priceCurrent)}
                                            </Typography>
                                        </Stack>
                                    )}
                                    <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography
                                            variant="transition-modal-description"
                                            sx={{
                                                mr: 1,
                                                fontSize: '14px',
                                                color: '#333333',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            Số lượng:
                                        </Typography>

                                        <TextField
                                            inputProps={{ pattern: '^[0-9]+$' }}
                                            value={quantity}
                                            size="small"
                                            sx={{
                                                ml: 2,
                                                input: {
                                                    color: '#53382c',
                                                    fontWeight: 700,
                                                    fontFamily: 'sans-serif',
                                                    textAlign: 'center',
                                                    width: '150px',
                                                },
                                            }}
                                            onChange={handleChangeQuantity}
                                        />
                                        {quantity <= 1 ? (
                                            <Button
                                                disabled
                                                sx={{
                                                    color: '#f42525',
                                                    cursor: 'pointer',
                                                    ml: 12,
                                                    borderRadius: '50%',
                                                    maxWidth: '30px',
                                                    minWidth: '35px',
                                                    maxHeight: '30px',
                                                    minHeight: '35px',
                                                    border: 'none',
                                                    fontWeight: '20px',
                                                    position: 'absolute',
                                                    '&:hover': {
                                                        backgroundColor: '#ff563014',
                                                        border: 'none',
                                                    },
                                                }}
                                                onClick={handleDecreaseQuantity}
                                            >
                                                <Iconify icon="ic:outline-minus" />
                                            </Button>
                                        ) : (
                                            <Button
                                                sx={{
                                                    color: '#f42525',
                                                    cursor: 'pointer',
                                                    ml: 12,
                                                    borderRadius: '50%',
                                                    maxWidth: '30px',
                                                    minWidth: '35px',
                                                    maxHeight: '30px',
                                                    minHeight: '35px',
                                                    border: 'none',
                                                    fontWeight: '20px',
                                                    position: 'absolute',
                                                    '&:hover': {
                                                        backgroundColor: '#ff563014',
                                                        border: 'none',
                                                    },
                                                }}
                                                onClick={handleDecreaseQuantity}
                                            >
                                                <Iconify icon="ic:outline-minus" />
                                            </Button>
                                        )}

                                        {quantity < 100 ? (
                                            <Button
                                                sx={{
                                                    color: '#0dbd16',
                                                    cursor: 'pointer',
                                                    ml: 28,
                                                    borderRadius: '50%',
                                                    maxWidth: '30px',
                                                    minWidth: '35px',
                                                    maxHeight: '30px',
                                                    minHeight: '35px',
                                                    border: 'none',
                                                    position: 'absolute',
                                                    '&:hover': {
                                                        backgroundColor: '##cedfcf',
                                                        border: 'none',
                                                    },
                                                }}
                                                onClick={handleIncreaseQuantity}
                                            >
                                                <Iconify icon="ic:baseline-plus" />
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled
                                                sx={{
                                                    color: '#0dbd16',
                                                    cursor: 'pointer',
                                                    ml: 28,
                                                    borderRadius: '50%',
                                                    maxWidth: '30px',
                                                    minWidth: '35px',
                                                    maxHeight: '30px',
                                                    minHeight: '35px',
                                                    border: 'none',
                                                    position: 'absolute',
                                                }}
                                                onClick={handleIncreaseQuantity}
                                            >
                                                <Iconify icon="ic:baseline-plus" />
                                            </Button>
                                        )}
                                    </Stack>

                                    <TextField
                                        id="standard-basic"
                                        label="Ghi chú"
                                        variant="standard"
                                        value={note}
                                        sx={{
                                            input: {
                                                fontFamily: 'sans-serif',
                                                width: '400px',
                                            },
                                        }}
                                        onChange={(e) => {
                                            setState({ ...state, note: e.target.value });
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            color: 'white',
                                            backgroundColor: '#d0181b',
                                            border: '1px solid #d0181b',
                                            mt: 2,
                                            ml: '36%',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#d0181b',
                                            },
                                        }}
                                        onClick={handleOrderProduct}
                                    >
                                        Đặt món ngay
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* Bill thanh toán */}
            <Bill
                handlePayMoneyToClose={handlePayMoneyToClose}
                orders={orders}
                totalBill={totalBill}
                listOrderItems={listOrderItems}
                openBill={openBill}
                handleCloseBill={handleCloseBill}
                tableCurrent={tableCurrent}
            />
        </>
    );
}
