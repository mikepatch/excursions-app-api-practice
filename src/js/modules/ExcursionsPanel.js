class ExcursionsPanel {
    constructor(api) {
        this.api = api;
        this.excursionsListEl = document.querySelector('.panel__excursions');
    }

    init() {
        this.loadApiData();
        this._initEvents();
    }

    loadApiData() {
        this.api.loadData()
            .then(data => {
                this.insertApiData(data)
            })
            .catch(err => console.error(err));
    }

    insertApiData(excursions) {
        excursions.forEach(excursionData => {
            const ulElement = this._findListRoot();
            const liElement = this._cloneELement(this._findExcursionPrototype())

            this._insertDataToLiElement(liElement, excursionData);

            ulElement.appendChild(liElement);
        })
    }

    _insertDataToLiElement(liElement, excursionData) {
        const { id, title, description, adultPrice, childPrice } = excursionData;

        const [headerEl, formEl] = liElement.children;
        const [titleEl, descriptionEl] = headerEl.children;
        const [adultInputEl, childInputEl] = formEl.elements;
        const [adultPriceEl, childPriceEl] =
            [adultInputEl.previousElementSibling, childInputEl.previousElementSibling];
        const infoElementsArr = [
            { element: titleEl, text: title },
            { element: descriptionEl, text: description },
            { element: adultPriceEl, text: adultPrice },
            { element: childPriceEl, text: childPrice },
        ];

        this._setElementDataset(liElement, ['excursion-ID', id]);
        this._setInfoElementsInnerText(infoElementsArr);
    }

    _initEvents() {
        this.excursionsListEl.addEventListener('submit', e => this._handleExcursionFormSubmit(e))
    }

    _handleExcursionFormSubmit(e) {
        e.preventDefault();

        const formEl = e.target;
        const [adultInput, childInput] = formEl.elements;

    }

    _validateInputsData(formEl, errors) {
        // const fields = [
        //     { name: 'name', label: 'Imię i nazwisko', required: true, pattern: '^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ ,.\'-]+$', },
        //     { name: 'email', label: 'Email', required: true, pattern: '^[a-zA-Z0-9.!#$%&\' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$', }
        // ];
        fields.forEach((field) => {
            const { name, label, required = false, pattern } = field;

            const inputValue = formEl.elements[name].value;

            if (required) {
                if (inputValue.length === 0) {
                    errors.push(`Dane w polu ${label} są wymagane.`);
                }
            }

            if (inputValue.length > 0 && pattern) {
                const reg = new RegExp(pattern);

                if (!reg.test(inputValue)) {
                    errors.push(`Dane w polu ${label} są niepoprawne.`);
                }
            }
        });
    }

    _setElementDataset(element, [datasetName, datasetValue]) {
        element.setAttribute(`data-${datasetName}`, datasetValue);
    }

    _setInfoElementsInnerText(infoElementsArr) {
        infoElementsArr.forEach(infoElement => {
            const { element, text } = infoElement;

            element.innerText = text;
        });
    }

    _findListRoot() {
        return document.querySelector('.panel__excursions')
    }

    _findExcursionPrototype() {
        return document.querySelector('.excursions__item--prototype');
    }

    _findSummaryPrototype() {
        return document.querySelector('.summary__item--prototype');
    }

    _createElement(element, className) {
        const newElement = document.createElement(element);

        newElement.classList.add(className);

        return newElement;
    }

    _cloneELement(prototype) {
        const newEl = prototype.cloneNode(true);

        this._removePrototypeClass(newEl);
        return newEl;
    }

    _clearElement(element) {
        element.innerHTML = '';
    }

    _removePrototypeClass(element) {
        element.classList.forEach(className => {

            if (className.includes('prototype')) {
                element.classList.remove(className);
            }
        })
    }
}

export default ExcursionsPanel;