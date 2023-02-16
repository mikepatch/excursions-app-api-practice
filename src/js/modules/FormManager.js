import Utilities from "./Utilities";

class FormManager {
    constructor(rootElement, fields) {
        this.formElement = rootElement;
        this.fields = fields;
        this.errorsArray = [];
        this.utilities = new Utilities();
    }

    validate() {
        this._removeFormErrors();
        this._validateFields();

        if (this.utilities.isEmpty(this.errorsArray)) return true;
        else return false;
    }

    showFormErrors() {
        this._removeFormErrors();
        this.errorsArray.forEach(error => {
            const { inputEl, errorMessage } = error;

            this._renderInputError(inputEl);
            this._renderErrorMessage(inputEl, errorMessage);
        })
    }

    clearInputValues() {
        const inputElements = this._findInputElements(this.formElement);

        inputElements.forEach(inputElement => {
            if (inputElement.type !== 'submit') {
                if (this.utilities.hasClass(this.formElement, 'excursions__form')) {
                    this._clearExcursionInputs(inputElement);
                } else {
                    this._clearOrderInputs(inputElement)
                }
            }
        })
    }

    _validateFields() {
        this.fields.forEach(field => {
            const { name, label, errorMessage, required = false, pattern } = field;

            const inputEl = this.formElement.elements[name];
            const inputElValue = inputEl.value;

            if (required) {
                if (this.utilities.isEmpty(inputElValue)) {
                    this.errorsArray.push({ inputEl, errorMessage: `Dane w polu ${label} są wymagane.` });
                }
            }

            if (this.utilities.isNotEmpty(inputElValue) && pattern) {
                if (this._isNotValidPattern(pattern, inputElValue)) {
                    this.errorsArray.push({ inputEl, errorMessage })
                }
            }
        });
    }

    _isNotValidPattern(pattern, inputValue) {
        const reg = new RegExp(pattern);
        if (!reg.test(inputValue)) return true
        else return false
    }

    _renderInputError(inputEl) {
        inputEl.classList.add('input--error');
    }

    _renderErrorMessage(inputEl, errorMessage) {
        const formField = inputEl.parentElement;
        const errorMessageElement = this.utilities.createELement('small', 'form__field-error');

        errorMessageElement.innerText = errorMessage;

        formField.appendChild(errorMessageElement);
    }

    _removeFormErrors() {
        const inputs = this._findInputElements(this.formElement);

        inputs.forEach(input => {
            if (this.utilities.hasClass(input, 'input--error')) {
                const formField = input.parentElement;
                const errorMessageElement = formField.lastElementChild;

                input.classList.remove('input--error');
                errorMessageElement.remove();
            }
        })
    }

    _clearExcursionInputs(inputElement) {
        const minusButton = inputElement.previousElementSibling;

        if (minusButton && minusButton.type === 'button') {
            minusButton.classList.add('minusBtn--disabled');
        }
        inputElement.value = '0';
    }

    _clearOrderInputs(inputElement) {
        inputElement.value = '';
    }

    _findInputElements(formElement) {
        return [...formElement.elements];
    }
}

export default FormManager;