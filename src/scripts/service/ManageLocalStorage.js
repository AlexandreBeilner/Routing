export class ManageLocalStorage {
    /**
     *
     * @param {"save" | "get" | "delete"} action
     * @param {"routeID" | "isRunning"} item
     * @param value
     */
    static manage(action, item, value = '') {
        if (action === 'save') {
            localStorage.setItem(item, value);
            return;
        }
        if (action === 'get') {
            return localStorage.getItem(item);
        }
        localStorage.removeItem(item);
    }
}