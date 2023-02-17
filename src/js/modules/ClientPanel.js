import Basket from "./Basket";
import Excursions from "./Excursions";
import FormButtons from "./FormButtons";
import FormManager from "./FormManager";
import Order from "./Order";

class ClientPanel {
    constructor(utilities, excursionsAPI) {
        this.utilities = utilities;
        this.API = excursionsAPI;
        this.rootElement = document.querySelector('.panel');
        this.basket = new Basket();
    }

    init() {
        this._loadExcursions();
        this._initEvents();
        this.basket.init();
    }

    _loadExcursions() {
        const excursions = new Excursions(this.rootElement, this.utilities, this.API);

        excursions.load();
    }

    _initEvents() {
        const [excursionList, orderPanel] = this.rootElement.children;

        new FormButtons(excursionList).initEvents();

        excursionList.addEventListener(
            'submit',
            event => this._handleExcursionFormSubmit(event)
        );
        orderPanel.addEventListener(
            'submit',
            event => this._handleOrderFormSubmit(event)
        );
    }

    _handleExcursionFormSubmit(event) {
        event.preventDefault();

        const formElement = event.target;
        const fields = [
            { name: 'adultsQuantity', errorMessage: 'Wprowadź poprawną liczbę dorosłych.', required: false, pattern: '(^[0-9]+[0-9]{0,}$)', },
            { name: 'childrenQuantity', errorMessage: 'Wprowadź poprawną liczbę dzieci.', required: false, pattern: '(^[0-9]+[0-9]{0,}$)', }
        ];
        const formManager = new FormManager(formElement, fields);
        const areFieldsCorrect = formManager.validate();

        if (areFieldsCorrect) {
            this.basket.addItem(formElement);
            this.basket.init()
            formManager.clearInputValues();
        } else {
            formManager.showFormErrors();
        }
    }

    _handleOrderFormSubmit(event) {
        event.preventDefault();

        const formElement = event.target;
        const fields = [
            { name: 'name', label: 'Imię i nazwisko', errorMessage: 'Wprowadź poprawne imię i nazwisko.', required: true, pattern: '^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ ,.\'-]+$', },
            { name: 'email', label: 'E-mail', errorMessage: 'Wprowadź poprawny adres e-mail.', required: true, pattern: '^[a-zA-Z0-9.!#$%&\' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$', }
        ];

        const formManager = new FormManager(formElement, fields);
        const areFieldsCorrect = formManager.validate();

        const basket = this.basket.getItems();

        if (this.utilities.isNotEmpty(basket)) {
            if (areFieldsCorrect) {
                const order = new Order(this.basket, this.API);
                const { name, email } = formElement;

                order.processOrder(name, email);

                this.basket.clearBasketArray();
                formManager.clearInputValues();
            } else {
                formManager.showFormErrors();
            }
        } else {
            return alert('Koszyk jest pusty!');
        }
    }
}

export default ClientPanel;