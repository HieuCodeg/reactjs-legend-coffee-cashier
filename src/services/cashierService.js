import axios from 'axios';
import { CashierURL } from './common';

class CashierService {
    static getTables() {
        return axios.get(CashierURL.TABLE_API_URL);
    }

    static changeStatusTable(id, table) {
        const result = axios.patch(`${CashierURL.TABLE_API_URL}/${id}`, table);
        return result;
    }

    static getCategories() {
        return axios.get(CashierURL.CATEGORY_API_URL);
    }

    static getProducts() {
        return axios.get(CashierURL.PRODUCT_API_URL);
    }

    static setOrder(order) {
        return axios.post(CashierURL.ORDER_API_URL, order);
    }

    static getOrderTable(orderId) {
        return axios.get(`${CashierURL.ORDERGET_API_URL}${orderId}`);
    }

    static getOrderTableWithTableId(tableId) {
        return axios.get(`${CashierURL.TABLE_API_URL}/cashier/${tableId}`);
    }

    static payBill(orderId) {
        return axios.get(`${CashierURL.PAY_API_URL}${orderId}`);
    }
}

export default CashierService;
