import axios from 'axios';
import { KitchenURL } from './common';

class KitchenService {
    static getListItemsCooking() {
        return axios.get(KitchenURL.LISTITEMS_API_URL);
    }

    static getListItemsCookingByTable() {
        return axios.get(KitchenURL.LISTTABLESITEMSCOOKING_API_URL);
    }

    static getListItemsWaiter() {
        return axios.get(KitchenURL.LISTWAITER_API_URL);
    }

    static cookingAllByProduct(productId, size) {
        return axios.post(`${KitchenURL.COOKINGALLBYPRODUCT_API_URL}productId=${productId}&size=${size}`);
    }

    static cookingOneByProduct(productId, size) {
        return axios.post(`${KitchenURL.COOKINGONEBYPRODUCT_API_URL}productId=${productId}&size=${size}`);
    }

    static cookingAllByTable(orderId) {
        return axios.post(`${KitchenURL.COOKINGALLBYTABLE_API_URL}orderId=${orderId}`);
    }

    static cookingAllByProductTable(orderId, productId, size) {
        return axios.post(
            `${KitchenURL.COOKINGALLBYPRODUCTTABLE_API_URL}orderId=${orderId}&productId=${productId}&size=${size}`
        );
    }

    static cookingOneByProductTable(orderItemId) {
        return axios.post(`${KitchenURL.COOKINGONEBYPRODUCTTABLE_API_URL}${orderItemId}`);
    }

    static waiterAll(orderItemId) {
        return axios.post(`${KitchenURL.WAITERALL_API_URL}orderItemId=${orderItemId}`);
    }

    static waiterOne(orderItemId) {
        return axios.post(`${KitchenURL.WAITERONE_API_URL}${orderItemId}`);
    }

    static RemoveOrderItem(orderItemId, quantity) {
        return axios.delete(`${KitchenURL.RemoveOrderItem_API_URL}${orderItemId}/quantity/${quantity}`);
    }

    static RemoveOrder(orderId) {
        return axios.delete(`${KitchenURL.RemoveOrder_API_URL}${orderId}`);
    }
}

export default KitchenService;
