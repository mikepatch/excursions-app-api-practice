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
        const [titleElement] = formElement.previousElementSibling.children;
        const [adultsFieldElement, childrenFieldElement] = formElement.children;
        const [adultsLabelElement] = adultsFieldElement.children;
        const [adultsPriceInfoElement] = adultsLabelElement.children;
        const [adultsPriceElement] = adultsPriceInfoElement.children;
        const [childrenLabelElement] = childrenFieldElement.children;
        const [childrenPriceInfoElement] = childrenLabelElement.children;
        const [childrenPriceElement] = childrenPriceInfoElement.children;
        const { adultsNumber, childrenNumber } = formElement.elements;

        let basketItem = {};

        if (this._areAdultsAndChildrenNumberCorrect(adultsNumber.value, childrenNumber.value)) {
            basketItem = {
                title: titleElement.innerText,
                adultsPrice: adultsPriceElement.innerText,
                childrenPrice: childrenPriceElement.innerText,
                adultsNumber: adultsNumber.value,
                childrenNumber: childrenNumber.value,
                totalPrice: (adultsPriceElement.innerText * adultsNumber.value) + (childrenPriceElement.innerText * childrenNumber.value),
            }

            return basketItem;
        }
    }

    _areAdultsAndChildrenNumberCorrect(adultNumber, childNumber) {
        if ((!isNaN(adultNumber) && !isNaN(childNumber))
            && (adultNumber.length !== 0 || childNumber.length !== 0)
            && (adultNumber >= 0 && childNumber >= 0)
            && (adultNumber > 0 || childNumber > 0)) {

            return true;
        } else {
            return alert('Podaj liczbę dorosłych, lub/oraz dzieci.');
        }
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
        const newBasketItem = this.utilities.clonePrototype(this._findSummaryPrototype());
        const { title, adultsPrice, childrenPrice, adultsNumber, childrenNumber, totalPrice } = basketItem;
        const [summaryHeaderElement, pricesElement] = newBasketItem.children;
        const [titleElement, totalPriceElement, removeButtonElement] = summaryHeaderElement.children;

        titleElement.innerText = title;

        totalPriceElement.innerText = totalPrice + ' PLN';
        pricesElement.innerText = this._getAdultsAndChildrenNumber({ adultsNumber, adultsPrice, childrenNumber, childrenPrice });

        return newBasketItem;
    }

    _getAdultsAndChildrenNumber(...tickets) {
        let innerText = '';

        const isAdultAndChild = (adultNumber, childNumber) => (adultNumber > 0 && childNumber > 0);
        const isChild = (childNumber) => childNumber > 0;

        tickets.forEach(ticket => {
            const { adultsNumber, adultsPrice, childrenNumber, childrenPrice } = ticket;

            if (isAdultAndChild(adultsNumber, childrenNumber)) {
                innerText = `dorośli: ${adultsNumber} x ${adultsPrice} PLN, dzieci: ${childrenNumber} x ${childrenPrice} PLN`;
            }
            else if (isChild(childrenNumber)) {
                innerText = `dzieci: ${childrenNumber} x ${childrenPrice} PLN`;
            }
            else {
                innerText = `dorośli: ${adultsNumber} x ${adultsPrice} PLN`;
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