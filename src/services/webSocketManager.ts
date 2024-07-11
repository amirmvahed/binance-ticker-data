import {MessageListener, Ticker} from '../types'

export class WebSocketManager {
    private static instance: WebSocketManager | null = null;
    private static connectionLimit: number = 1;
    private static activeConnections: number = 0;

    private socket: WebSocket | null = null;
    private idCounter: number = 1;
    private messageListener: MessageListener;


    private constructor(private url: string) {
        this.connect()
    }

    private connect() {
        this.socket = new WebSocket(this.url)

        this.socket.onopen = () => {
            console.log(
                '%cConnection Baaz Shoood!',
                'color: green; font-family: sans-serif; font-size: 1rem;'
            );
        }

        this.socket.onclose = (event) => {
            console.log(
                '%cVaaay Connection Kooshte Shood!',
                'color: red; font-family: sans-serif; font-size: 1rem;', event.reason
            );

            WebSocketManager.activeConnections = Math.max(WebSocketManager.activeConnections - 1, 0)
            // reconnect after a delay
            setTimeout(() => this.connect(), 5000)
        }

        this.socket.onerror = (error) => {
            console.log(
                '%cConnection Baz Shoood!',
                'color: green; font-family: sans-serif; font-size: 1rem;', error
            );
        }


        this.socket.onmessage = (event) => {
            const data: Ticker[] = JSON.parse(event.data)
            if (this.messageListener) {
                this.messageListener(data)
            }
        }

    }

    public setMessageListener(listener) {
        this.messageListener = listener
    }

    public removeMessageListener(listener) {
        this.messageListener = null
    }

}
