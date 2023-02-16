class Utilities {

    createELement(element, className) {
        const newElement = document.createElement(element);
        newElement.classList.add(className);

        return newElement;
    }

    findChildElement(parentEl, childEl) {
        return parentEl.querySelector(childEl);
    }

    clearArray(array) {
        array.length = 0;
    }

    pushToArray(array, content) {
        array.push(content);
    }

    isEmpty(element) {
        if (element.length === 0) return true
        else return false
    }

    isNotEmpty(element) {
        if (element.length > 0) return true
        else return false
    }

    hasClass(element, className) {
        if (element.classList.contains(className)) return true;
        else return false;
    }

    clonePrototype(prototype) {
        const newEl = prototype.cloneNode(true);

        this._removePrototypeClass(newEl);
        return newEl;
    }

    _removePrototypeClass(element) {
        element.classList.forEach(className => {

            if (className.includes('prototype')) {
                element.classList.remove(className);
            }
        })
    }
}

export default Utilities;