import Excursions from "./Excursions";
import FormManager from "./FormManager";

class AdminPanel {
    constructor(utilities, api) {
        this.utilities = utilities;
        this.API = api;
        this.rootElement = document.querySelector('.panel');
        this.excursions = new Excursions(this.rootElement, this.utilities, this.API);
    }

    init() {
        this._loadExcursions();
        this._initEvents();
    }

    _loadExcursions() {
        this.excursions.load();
    }

    _initEvents() {
        this.rootElement.addEventListener('click', event => this._updateExcursion(event));
        this.rootElement.addEventListener('click', event => this._removeExcursion(event));
        this.rootElement.addEventListener('click', event => this._addExcursion(event));
    }

    _updateExcursion(event) {
        event.preventDefault();

        const targetElement = event.target;
        const isUpdateButton = targetElement.classList.contains('excursions__field-input--update')

        if (isUpdateButton) {
            const formElement = targetElement.closest('form')
            const excursionRootElement = targetElement.closest('.excursions__item');
            const titleElement = this.utilities.findChildElement(excursionRootElement, '.excursions__title');
            const descriptionElement = titleElement.nextElementSibling;
            const adultPriceElement = this.utilities.findChildElement(formElement, '.excursions__adult-price');
            const childPriceElement = this.utilities.findChildElement(formElement, '.excursions__child-price');

            const excursionElementsList = [
                titleElement, descriptionElement, adultPriceElement, childPriceElement
            ];
            const isEditable = excursionElementsList.every(
                element => element.isContentEditable
            );

            if (isEditable) {
                const id = excursionRootElement.dataset.excursionId;
                const updatedData = this._createUpdatedDataObject(excursionElementsList);

                this.API.updateExcursionData(id, updatedData)
                    .then((resp) => {
                        if (resp) {
                            alert('Zapisano zmiany! :)');
                        }
                    })
                    .catch(err => {
                        alert(`Nie udało się zapisać zmian :(\n Komunikat błędu: ${err.statusText}`);
                        console.error(err);
                    })
                    .finally(() => {
                        targetElement.innerText = 'Edytuj';

                        excursionElementsList.forEach(
                            element => {
                                element.contentEditable = false;
                                element.classList.remove('element--edit');
                            }
                        )
                    });
            } else {
                targetElement.innerText = 'Zapisz';

                excursionElementsList.forEach(
                    element => {
                        element.contentEditable = true;
                        element.classList.add('element--edit');
                    }
                );
            }
        }
    }

    _createUpdatedDataObject(excursionElementsList) {
        const [titleElement, descriptionElement, adultPriceElement, childPriceElement] = excursionElementsList;
        const data = {
            title: titleElement.innerText,
            description: descriptionElement.innerText,
            adultPrice: adultPriceElement.innerText,
            childPrice: childPriceElement.innerText,
        }

        return data;
    }

    _removeExcursion(event) {
        event.preventDefault();

        const targetElement = event.target;
        const isRemoveButton = targetElement.classList.contains('excursions__field-input--remove')

        if (isRemoveButton) {
            if (confirm('Na pewno chcesz usunąć element?')) {
                const excursionRootElement = targetElement.closest('.excursions__item');
                const elementToRemoveID = excursionRootElement.dataset.excursionId;

                this.API.removeExcursionData(elementToRemoveID)
                    .then((resp) => {
                        if (resp) {
                            alert('Usunąłeś wycieczkę! :)');
                        }
                    })
                    .catch(err => {
                        alert(`Nie udało się usunąć wycieczki :(\n Komunikat błędu: ${err.statusText}`);
                        console.error(err);
                    })
                    .finally(() => {
                        this.excursions.load()
                    });
            } else {
                return;
            }
        }
    }

    _addExcursion(event) {
        event.preventDefault();

        const targetElement = event.target;
        const isFormSubmitElement = targetElement.classList.contains('order__field-submit');

        if (isFormSubmitElement) {
            const formElement = targetElement.closest('.form');
            const fields = [
                { name: 'title', label: 'Nazwa', errorMessage: 'Wprowadź poprawną nazwę wycieczki.', required: true, pattern: '^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ ,.\'-]+$', },
                { name: 'description', label: 'Opis', errorMessage: 'Wprowadź poprawny opis wycieczki.', required: true, pattern: '', },
                { name: 'adultPrice', label: 'Cena dorosły', errorMessage: 'Wprowadź poprawną cenę.', required: true, pattern: '(^[0-9]+[0-9]{0,}$)', },
                { name: 'childPrice', label: 'Cena dziecko', errorMessage: 'Wprowadź poprawną cenę.', required: true, pattern: '(^[0-9]+[0-9]{0,}$)', },
            ];

            const formManager = new FormManager(formElement, fields);
            const areFieldsCorrect = formManager.validate();

            if (areFieldsCorrect) {
                const newExcursionData = this._createNewExcursionDataObject(formElement);

                this.API.addExcursionData(newExcursionData)
                    .then((resp) => {
                        if (resp) {
                            alert('Pomyślnie dodałeś wycieczkę! :)');
                        }
                    })
                    .catch(err => {
                        alert(`Coś poszło nie tak :(\n Komunikat błędu: ${err.statusText}`);
                        console.error(err);
                    })
                    .finally(() => {
                        this.excursions.load();
                    });

                formManager.clearInputValues();
            } else {
                formManager.showFormErrors();
            }
        }
    }

    _createNewExcursionDataObject(formElement) {
        const { title, description, adultPrice, childPrice } = formElement.elements;
        const data = {
            title: title.value,
            description: description.value,
            adultPrice: adultPrice.value,
            childPrice: childPrice.value,
        };

        return data;
    }

    _findExcursionsListElement() {
        return document.querySelector('.panel__excursions');
    }

    _findFormElement() {
        return document.querySelector('.form');
    }
}

export default AdminPanel;