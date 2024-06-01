const SERVER_API = 'http://localhost:25001';
const BASE_SERVER_API = `${SERVER_API}/api`;
const BASE_OI_API = `${BASE_SERVER_API}/order-items`;

export const LOGIN_API_URL = `${BASE_SERVER_API}/auth/login`;
export const SOCKET_SERVER = 'http://localhost:25002';

export const CashierURL = {
    PRODUCT_API_URL: `${BASE_SERVER_API}/cashier/products`,

    TABLE_API_URL: `${BASE_SERVER_API}/tables`,

    CATEGORY_API_URL: `${BASE_SERVER_API}/categories`,

    ORDER_API_URL: `${BASE_SERVER_API}/orders/create-with-order-item`,

    ORDERGET_API_URL: `${BASE_SERVER_API}/order-items/cashier?orderId=`,

    PAY_API_URL: `${BASE_SERVER_API}/orders/pay/`,
};

export const KitchenURL = {
    LISTITEMS_API_URL: `${BASE_OI_API}/kitchen/get-by-status-cooking`,

    LISTTABLESITEMSCOOKING_API_URL: `${BASE_OI_API}/kitchen/get-by-status-cooking-group-table`,

    LISTWAITER_API_URL: `${BASE_OI_API}/kitchen/get-by-status-waiter`,

    COOKINGALLBYPRODUCT_API_URL: `${BASE_OI_API}/kitchen/change-status-cooking-to-waiter-to-product-all?`,

    COOKINGONEBYPRODUCT_API_URL: `${BASE_OI_API}/kitchen/change-status-cooking-to-waiter-to-product?`,

    COOKINGALLBYTABLE_API_URL: `${BASE_OI_API}/kitchen/change-status-cooking-to-waiter-to-table-all?`,

    COOKINGALLBYPRODUCTTABLE_API_URL: `${BASE_OI_API}/kitchen/change-status-cooking-to-waiter-to-product-of-table?`,

    COOKINGONEBYPRODUCTTABLE_API_URL: `${BASE_OI_API}/kitchen/change-status-cooking-to-waiter-to-table?orderItemId=`,

    WAITERALL_API_URL: `${BASE_OI_API}/kitchen/change-status-waiter-to-delivery-to-product-of-table?`,

    WAITERONE_API_URL: `${BASE_OI_API}/kitchen/change-status-waiter-to-delivery-to-table?orderItemId=`,

    RemoveOrderItem_API_URL: `${BASE_OI_API}/delete/`,

    RemoveOrder_API_URL: `${BASE_SERVER_API}/orders/delete/`,
};
