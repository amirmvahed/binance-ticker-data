export type Ticker = {
    s: string; // Symbol
    c: string; // Last price
    P: string; // Price change percent
}

export type MessageListener = (data: Ticker[]) => void
