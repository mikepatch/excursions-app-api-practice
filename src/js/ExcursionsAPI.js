class ExcursionsAPI {
    constructor() {
        this.rootUrl = 'http://localhost:3000';
    }

    loadData() {
        const options = {
            method: 'GET'
        }
        return this._fetch(options, '/excursions');
    }

    addData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }

        return this._fetch(options, '/orders');
    }

    _fetch(options, additionalPath = '') {
        const url = this.rootUrl + additionalPath;

        return fetch(url, options)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                }

                return Promise.reject(resp);
            })
    }
}

export default ExcursionsAPI;