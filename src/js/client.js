import './../css/reset.css';
import './../css/client.css';

import ExcursionsAPI from './modules/ExcursionsAPI';
import ClientPanel from './modules/ClientPanel';
import Utilities from './modules/Utilities';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const utilities = new Utilities();
    const api = new ExcursionsAPI();
    const clientPanel = new ClientPanel(utilities, api);

    clientPanel.init();
}