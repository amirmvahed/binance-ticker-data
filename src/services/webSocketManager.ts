import {MessageListener, Ticker} from '../types'

export class WebSocketManager {
    private static instance: WebSocketManager | null = null;
    private static connectionLimit: number = 1;
    private static activeConnections: number = 0;

    private socket: WebSocket | null = null;
    private idCounter: number = 1;
    private messageListener: MessageListener | null = null


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

        this.socket.onmessage = (event) => {
            const data: Ticker[] = JSON.parse(event.data)
            if (this.messageListener) {
                this.messageListener(data)
            }
        }

    }

    public static getInstance(url: string): WebSocketManager {
        if (!WebSocketManager.instance) {
            if (WebSocketManager.activeConnections < WebSocketManager.connectionLimit) {
                WebSocketManager.instance = new WebSocketManager(url)
                WebSocketManager.activeConnections++
            } else {
                throw new Error("WebSocket connection limit reached")
            }
        }
        return WebSocketManager.instance
    }

    private waitForOpenConnection(): Promise<void> {
        if (!this.socket) {
            this.connect();
        }

        return new Promise((resolve, reject) => {
            const handleOpen = () => {
                cleanup();
                resolve();
            };

            const handleError = () => {
                cleanup();
                reject(new Error("WebSocket error occurred"));
            };

            const handleClose = () => {
                cleanup();
                reject(new Error("WebSocket connection closed"));
            };

            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error("WebSocket connection timeout"));
            }, 10000); // 10 seconds timeout

            const cleanup = () => {
                clearTimeout(timeout);
                this.socket!.removeEventListener('open', handleOpen);
                this.socket!.removeEventListener('error', handleError);
                this.socket!.removeEventListener('close', handleClose);
            };

            if (this.socket!.readyState === WebSocket.OPEN) {
                resolve();
            } else if (this.socket!.readyState === WebSocket.CLOSED || this.socket!.readyState === WebSocket.CLOSING) {
                cleanup();
                reject(new Error("WebSocket connection is closed"));
            } else {
                this.socket!.addEventListener('open', handleOpen);
                this.socket!.addEventListener('error', handleError);
                this.socket!.addEventListener('close', handleClose);
            }
        });
    }

    public async triggerSubscription(streamName: string, triggerKey: 'SUBSCRIBE' | 'UNSUBSCRIBE') {
        await this.waitForOpenConnection()
        const message = {
            method: triggerKey,
            params: [streamName],
            id: this.idCounter++
        }

        this.socket?.send(JSON.stringify(message))
    }

    public setMessageListener(listener: MessageListener) {
        this.messageListener = listener
    }

    public removeMessageListener() {
        this.messageListener = null
    }

}
