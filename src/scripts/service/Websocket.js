import { io } from "socket.io-client";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {RunningScreen} from "../Screens/RunningScreen";
import {components} from "../../Globals";

export class WebSocketClient {
    constructor(userId) {
        this.socket = io("http://localhost:3000", {
            transports: ['websocket'],
            query: { userId }
        });

        this.socket.on("connect", () => {
            console.log("Conectado ao servidor com ID:", this.socket.id);
            this.onConnect();
        });

        this.socket.on("disconnect", () => {
            console.log("Desconectado do servidor");
            this.onDisconnect();
        });

        this.socket.on("message", (data) => {
            console.log("Mensagem recebida:", data);
            this.onMessageReceived(data);
        });

        this.socket.on("customEvent", (data) => {
            console.log("Evento personalizado recebido:", data);
            this.onCustomEvent(data);
        });

        this.socket.on("messageFromServer", (data) => {
            this.onReceiveMessageFromServer(JSON.parse(data));
        });
    }

    onReceiveMessageFromServer(data) {
        const actionsType = {
            startRide: async () => {
                await FacDriveFunctions.startRideScreen(document.getElementById('map-container'));
            },
            endRideCanceled: () => {
                RunningScreen.exit();
                components.alert.init(data.text, 'error');
            },
            endRideSuccess: () => {
                RunningScreen.exit();
                components.alert.init(data.text, 'success');
            }
        }

        actionsType[data.type] && actionsType[data.type]();
    }

    /**
     *
     * @param {Object} data
     * @param {string} data.routeID
     * @param {string} data.driverID
     * @param {Object} data.message
     * @param {string} data.message.title
     * @param {string} data.message.text
     */
    rideManager(data) {
        this.socket.emit("rideManager", JSON.stringify(data));
    }

    /**
     *
     * @param {Object} data
     * @param {string} data.driverID
     * @param {Object} data.message
     * @param {string} data.message.title
     * @param {string} data.message.text
     */
    chooseRoute(data) {
        this.socket.emit('chooseRoute', JSON.stringify(data));
    }

    onConnect() {
        console.log("Conectado ao WebSocket");
    }

    onDisconnect() {
        console.log("Desconectado do WebSocket");
    }
}
