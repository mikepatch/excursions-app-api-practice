class FormButtons {
    constructor(rootElement) {
        this.rootElement = rootElement
    }

    initEvents() {
        this.rootElement.addEventListener(
            'click',
            event => this._handleButtons(event)
        );
    }

    _handleButtons(event) {
        const targetElement = event.target;
        const buttonElement = targetElement.parentElement;
        const inputContainer = targetElement.closest('.excursions__field-input-container');

        if (inputContainer) {
            const minusButtonElement = inputContainer.querySelector('.minusBtn');
            const inputElement = inputContainer.querySelector('.excursions__field-input');
            const inputValue = Number(inputElement.value);

            const isMinusButton = buttonElement.classList.contains('minusBtn');
            const isPlusButton = buttonElement.classList.contains('plusBtn');

            if (isMinusButton) {
                if (inputElement.value > 0) {
                    inputElement.value = this._decrement(inputValue);
                }
            } else if (isPlusButton) {
                inputElement.value = this._increment(inputValue);
            }

            this._changeButtonColor(minusButtonElement, inputElement);
        }
    }

    _changeButtonColor(minusButtonElement, inputElement) {
        if (inputElement.value < 1) {
            minusButtonElement.classList.add('minusBtn--disabled');
        } else {
            minusButtonElement.classList.remove('minusBtn--disabled');
        }
    }

    _increment(number) {
        return number + 1;
    }

    _decrement(number) {
        return number - 1;
    }
}

export default FormButtons;