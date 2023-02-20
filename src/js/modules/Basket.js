import Utilities from "./Utilities";

class Basket {
    constructor() {
        this.utilities = new Utilities();
        this.basketArray = [];
        this.basketElement = document.querySelector('.panel__summary')
    }

    addItem(formElement) {
        const basketItem = this._createBasketItem(formElement)

        if (basketItem) {
            this.basketArray.push(basketItem);
        }
    }

    getItems() {
        return this.basketArray;
    }

    getTotalPrice() {
        return this.basketArray.reduce((reduced, order) => reduced + order.totalPrice, 0);
    }

    clearBasketArray() {
        this.basketArray.length = 0;

        this._render();
    }

    init() {
        this._render();
        this._initEvents();
    }

    _createBasketItem(formElement) {
        const { adultsQuantity, childrenQuantity } = formElement.elements;
        const excursionRootElement = formElement.closest('.excursions__item');
        const titleElement = excursionRootElement.querySelector('.excursions__title');
        const adultPriceElement = excursionRootElement.querySelector('.excursions__adult-price');
        const childPriceElement = excursionRootElement.querySelector('.excursions__child-price');

        let basketItem = {};

        if (this._areTicketsQuantityCorrect(adultsQuantity.value, childrenQuantity.value)) {
            basketItem = {
                title: titleElement.innerText,
                adultsPrice: adultPriceElement.innerText,
                childrenPrice: childPriceElement.innerText,
                adultsQuantity: adultsQuantity.value,
                childrenQuantity: childrenQuantity.value,
                totalPrice: this._sumBasketItemPrice({ adultPriceElement, childPriceElement }, { adultsQuantity, childrenQuantity }),
            }

            return basketItem;
        } else {
            return alert('Podaj liczbę dorosłych, lub/oraz dzieci.');
        }
    }

    _areTicketsQuantityCorrect(...inputValues) {
        return inputValues.some(
            inputValue =>
                !isNaN(inputValue) && inputValue.length !== 0 && inputValue >= 0 && inputValue > 0
        );
    }

    _sumBasketItemPrice(...args) {
        const [priceElements, quantityValues] = args;
        const { adultPriceElement, childPriceElement } = priceElements;
        const { adultsQuantity, childrenQuantity } = quantityValues;

        return (adultPriceElement.innerText * adultsQuantity.value) + (childPriceElement.innerText * childrenQuantity.value);
    }

    _render() {
        this._clearBasketElement();
        this._renderBasketItems();
        this._renderOrderTotalPrice();
        this._showBasketInfo();
    }

    _renderBasketItems() {
        this.basketArray.forEach(basketItem => {
            const newBasketItem = this._createBasketItemElement(basketItem);

            this.basketElement.appendChild(newBasketItem);
        });
    }

    _createBasketItemElement(basketItem) {
        const { title, adultsPrice, childrenPrice, adultsQuantity, childrenQuantity, totalPrice } = basketItem;
        const newBasketItem = this.utilities.clonePrototype(this._findSummaryPrototype());
        const pricesElement = newBasketItem.querySelector('.summary__prices');
        const titleElement = newBasketItem.querySelector('.summary__name');
        const totalPriceElement = newBasketItem.querySelector('.summary__total-price');

        titleElement.innerText = title;
        totalPriceElement.innerText = totalPrice + ' PLN';
        pricesElement.innerText = this._getAdultsAndChildrenQuantity({ adultsQuantity, adultsPrice, childrenQuantity, childrenPrice });

        return newBasketItem;
    }

    _getAdultsAndChildrenQuantity(...tickets) {
        let innerText = '';

        const isAdultAndChild = (adultNumber, childNumber) => (adultNumber > 0 && childNumber > 0);
        const isChild = (childNumber) => childNumber > 0;

        tickets.forEach(ticket => {
            const { adultsQuantity, adultsPrice, childrenQuantity, childrenPrice } = ticket;

            if (isAdultAndChild(adultsQuantity, childrenQuantity)) {
                innerText = `dorośli: ${adultsQuantity} x ${adultsPrice} PLN, dzieci: ${childrenQuantity} x ${childrenPrice} PLN`;
            }
            else if (isChild(childrenQuantity)) {
                innerText = `dzieci: ${childrenQuantity} x ${childrenPrice} PLN`;
            }
            else {
                innerText = `dorośli: ${adultsQuantity} x ${adultsPrice} PLN`;
            }
        });

        return innerText;
    }

    _initEvents() {
        this.basketElement.addEventListener('click', event => this._removeBasketItem(event));
    }

    _removeBasketItem(event) {
        event.preventDefault();

        const buttonElement = event.target;
        const isDeleteButton = buttonElement.classList.contains('summary__btn-remove-icon');

        if (isDeleteButton) {
            const buttonElementIndex = this._getButtonIndexExceptPrototype(buttonElement)

            this.basketArray = this.basketArray.filter((element, index) => index !== buttonElementIndex);
        }

        this._render();
    }

    _getButtonIndexExceptPrototype(buttonElement) {
        const buttonElements = [...this._findRemoveFromBasketButtonElements()];

        return buttonElements.indexOf(buttonElement) - 1;
    }

    _clearBasketElement() {
        const basketItems = [...this.basketElement.children];

        basketItems.forEach(basketItem => {
            const isNotPrototype = !basketItem.classList.contains('summary__item--prototype');

            if (isNotPrototype) {
                basketItem.remove();
            }
        })
    }

    _showBasketInfo() {
        const parentElement = this.basketElement.closest('.panel__form');

        if (this.utilities.isEmpty(this.basketArray)) {
            const basketInfoElement = parentElement.querySelector('.panel__basket-info');

            if (!basketInfoElement) {
                const basketInfoElement = this.utilities.createELement('small', 'panel__basket-info');

                basketInfoElement.innerText = 'Koszyk jest pusty.';

                parentElement.insertBefore(basketInfoElement, this.basketElement)
            }
        } else {
            const basketInfoElement = parentElement.querySelector('.panel__basket-info');

            if (basketInfoElement) {
                basketInfoElement.remove();
            }
        }
    }

    _findRemoveFromBasketButtonElements() {
        return this.basketElement.querySelectorAll('.summary__btn-remove-icon');
    }

    _findSummaryPrototype() {
        return this.basketElement.querySelector('.summary__item--prototype');
    }

    _renderOrderTotalPrice() {
        const totalPriceElement = this._findTotalPriceElement()
        const totalPrice = this.getTotalPrice();

        totalPriceElement.innerText = `Razem: ${totalPrice} PLN`;
    }

    _findTotalPriceElement() {
        return document.querySelector('.order__total-price');
    }
}



export default Basket;