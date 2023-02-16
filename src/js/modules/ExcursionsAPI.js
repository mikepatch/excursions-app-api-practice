import 'whatwg-fetch';


class ExcursionsAPI {
    constructor() {
        this.rootUrl = 'http://localhost:3000';
    }

    loadExcursionData() {
        const options = {
            method: 'GET'
        }
        return this._fetch(options, '/excursions');
    }

    addExcursionData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }

        return this._fetch(options, '/excursions');
    }

    addOrderData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }

        return this._fetch(options, '/orders');
    }

    removeExcursionData(id) {
        const options = { method: 'DELETE' };

        return this._fetch(options, `/excursions/${id}`);
    }

    updateExcursionData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' }
        };

        return this._fetch(options, `/excursions/${id}`)
    }

    _fetch(options, additionalPath = '') {
        const url = this.rootUrl + additionalPath;

        return window.fetch(url, options)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                }

                return Promise.reject(resp);
            })
    }
}

export default ExcursionsAPI;