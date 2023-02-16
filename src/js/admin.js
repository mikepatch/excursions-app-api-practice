import './../css/admin.css';

import ExcursionsAPI from './modules/ExcursionsAPI';
import AdminPanel from './modules/AdminPanel';
import Utilities from './modules/Utilities';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const utilities = new Utilities();
    const api = new ExcursionsAPI();
    const adminPanel = new AdminPanel(utilities, api);

    adminPanel.init();
}