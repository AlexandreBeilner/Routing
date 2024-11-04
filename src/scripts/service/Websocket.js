import { io } from "socket.io-client";

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
            console.log("Mensagem direta do servidor recebida:", data);
        });
    }

    sendMessage(message) {
        this.socket.emit("message", JSON.stringify(message));
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
    sendMessageToUser(data) {
        this.socket.emit("sendToUser", JSON.stringify(data));
    }

    // Método para executar quando conectado
    onConnect() {
        console.log("Função onConnect chamada");
    }

    // Método para executar quando desconectado
    onDisconnect() {
        console.log("Função onDisconnect chamada");
    }

    // Método para executar ao receber uma mensagem
    onMessageReceived(data) {
        console.log("Função onMessageReceived chamada com:", data);
    }

    // Método para executar ao receber um evento personalizado
    onCustomEvent(data) {
        console.log("Função onCustomEvent chamada com:", data);
    }
}
