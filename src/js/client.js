import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import ExcursionsPanel from './modules/ExcursionsPanel';

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('client');

    const api = new ExcursionsAPI();
    const excursionsPanel = new ExcursionsPanel(api)

    excursionsPanel.init()
}




