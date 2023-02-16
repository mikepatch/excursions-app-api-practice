import OrderModal from "./OrderModal";

class Order {
    constructor(basket, api) {
        this.basket = basket;
        this.API = api;
    }

    processOrder(name, email) {
        const orderDetails = this._createOrderDetailsObject(name, email)

        this._sendOrderDetailsToAPI(orderDetails);
        this._renderSuccessModal(orderDetails);
    }

    _createOrderDetailsObject(name, email) {
        const orderDetails = {
            customerName: name.value,
            email: email.value,
            totalPrice: this.basket.getTotalPrice(),
            orderItems: this.basket.getItems(),
            timestamp: new Date().toLocaleString("pl-PL"),
        };

        return orderDetails;
    }

    _sendOrderDetailsToAPI(orderDetails) {
        this.API.addOrderData(orderDetails);
    }

    _renderSuccessModal(orderDetails) {
        new OrderModal().render(orderDetails);
    }
}

export default Order;