import { ButtonComponent } from "./scripts/Components/ButtonComponent";
import {InputComponent} from "./scripts/Components/InputComponent";
import {TipComponent} from "./scripts/Components/TipComponent";
import {DarkBackground} from "./scripts/Components/DarkBackground";
import {Spinner} from "./scripts/Components/Spinner";

export const components = {
    button: new ButtonComponent(),
    input: new InputComponent(),
    tip: new TipComponent(),
    darkBackground: new DarkBackground(),
    alert: null,
    spinner: new Spinner()
}

/**
 * @typedef {Object} Utils
 * @property {Map} map - Instance of the Map class
 * @property {boolean} hasGeolocation - Has user geolocation
 * @property {Object} userPosition - User's geolocation
 * @property {number} userPosition.latitude - Latitude of the user's position
 * @property {number} userPosition.longitude - Longitude of the user's position
 */

/** @type {Utils} */
export const utils = {
    userPosition: {
        latitude: 0,
        longitude: 0
    },
    map: null,
    hasGeolocation: false
};

/**
 *
 * @typedef {Object} Route
 * @property {boolean} createRouteIsActive - Flag mode is active
 * @property {array} coordinates - Route coordinates
 */

/**
 *
 * @type {Route}
 */
export const route = {
    createRouteIsActive: false,
    coordinates: []
};


/**
 *
 * @typedef {Object} Menus
 * @property {BottomSheetMenu} bottomSheetMenu - instance of BottomSheet menu
 * @property {CreateRoutesMenu} createRoutesMenu - instance of CreateRoutesMenu menu
 */

/**
 *
 * @type {Menus}
 */
export const menus = {}

/**
 *
 * @typedef {Object} UserConfig
 * @property {string} iduser
 * @property {string} isdriver
 * @property {string} name
 * @property {string} surname
 * @property {string} userimage
 */

/**
 *
 * @type {UserConfig}
 */
export const userConfig = {}