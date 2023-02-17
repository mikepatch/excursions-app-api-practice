class Excursions {
    constructor(rootElement, utilities, excursionsAPI) {
        this.rootElement = rootElement;
        this.excursionListElement = this.rootElement.querySelector('.panel__excursions');
        this.excursionsAPI = excursionsAPI;
        this.utilities = utilities;
    }

    load() {
        this.excursionsAPI.loadExcursionData()
            .then(excursionsArray => this._renderExcursionsList(excursionsArray))
            .catch(error => console.error(error));
    }

    _renderExcursionsList(excursionsArray) {
        this._clearExcursionsList();

        excursionsArray.forEach(excursionData => {
            const excursionItem = this._createExcursionItem(excursionData);
            this.excursionListElement.appendChild(excursionItem);
        })
    }

    _clearExcursionsList() {
        const excursionListElements = [...this.excursionListElement.children];

        excursionListElements.forEach(excursionItem => {
            const isNotPrototype = !excursionItem.classList.contains('excursions__item--prototype');

            if (isNotPrototype) {
                excursionItem.remove();
            }
        })
    }

    _createExcursionItem(excursionData) {
        const { id, title, description, adultPrice, childPrice } = excursionData;
        const newExcursionItem = this.utilities.clonePrototype(this._findExcursionPrototype());
        const adultPriceElement = newExcursionItem.querySelector('.excursions__adult-price');
        const childPriceElement = newExcursionItem.querySelector('.excursions__child-price');
        const titleElement = newExcursionItem.querySelector('.excursions__title');
        const descriptionElement = newExcursionItem.querySelector('.excursions__description');

        const infoElementsArr = [
            { element: titleElement, text: title },
            { element: descriptionElement, text: description },
            { element: adultPriceElement, text: adultPrice },
            { element: childPriceElement, text: childPrice },
        ];

        this._setInfoElementsContent(infoElementsArr);
        this._setExcursionItemDataset(newExcursionItem, id);

        return newExcursionItem;
    }

    _findExcursionPrototype() {
        return document.querySelector('.excursions__item--prototype');
    }

    _setExcursionItemDataset(excursionItem, id) {
        excursionItem.setAttribute('data-excursion-ID', id);
    }

    _setInfoElementsContent(infoElementsArray) {
        infoElementsArray.forEach(infoElement => {
            const { element, text } = infoElement;

            element.innerText = text;
        });
    }
}

export default Excursions;