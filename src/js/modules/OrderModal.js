import Utilities from "./Utilities";

class OrderModal {
    constructor() {
        this.utilities = new Utilities();
    }

    render(orderInfo) {
        const modal = this._createModalElement('order-modal', orderInfo);

        document.body.appendChild(modal);
        
        this._initModalEvents(modal);
    }

    _createModalElement(className, orderInfo) {
        const { customerName, email, totalPrice, orderItems } = orderInfo;
        const modalRootElement = this.utilities.createELement('aside', className);
        const modalChildElement = this.utilities.createELement('section', `${className}__container`);
        const modalListElement = this.utilities.createELement('ul', `${className}__list`);
        const closeButtonElement = this.utilities.createELement('button', `${className}__close-button`);

        modalChildElement.innerHTML = `
                                <h2 class="${className}__title">${customerName}, dziękujemy za złożenie zamówienia!</h2>
                                <p class="${className}__content">Przyjęliśmy Twoje zamówienie do realizacji. Szczegóły płatności wyślemy na wskazany adres email: ${email}</p>
                                <summary class="${className}__total-price">Łączna kwota do zapłaty: ${totalPrice} PLN</summary>
                                `;

        orderItems.forEach(item => {
            const { title, adultsNumber, childrenNumber, totalPrice } = item;
            const listItem = this.utilities.createELement('li', `${className}__list-item`);

            listItem.innerHTML = `<strong>${title}</strong> – liczba dorosłych: ${adultsNumber}, liczba dzieci: ${childrenNumber}. Razem: ${totalPrice} PLN`;

            modalListElement.appendChild(listItem);
        });
        closeButtonElement.innerText = 'Kontynuuj zakupy';

        modalRootElement.appendChild(modalChildElement);
        modalChildElement.appendChild(modalListElement);
        modalChildElement.appendChild(closeButtonElement);

        return modalRootElement;
    }

    _initModalEvents(modal) {
        modal.addEventListener('click', event => this._closeModal(event));
    }

    _closeModal(event) {
        const targetElement = event.target;
        const isCloseButton = targetElement.classList.contains('order-modal__close-button');

        if (isCloseButton) {
            const modalChildElement = targetElement.parentElement;
            const modalRootElement = modalChildElement.parentElement;

            modalRootElement.remove();
        }
    }
}

export default OrderModal;