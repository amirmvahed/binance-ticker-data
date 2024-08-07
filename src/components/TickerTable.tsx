import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {WebSocketManager} from "../services/webSocketManager";
import {Ticker} from "../types";
import {LoadingSpinner} from './LoadingSpinner'

const Container = styled.div`
  border-radius: 8px;
  background-color: #212630;
  color: white;
  padding: 8px;
  max-width: 500px;
  margin: auto;
  height: 90vh;
  overflow-y: auto;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;

  &::-webkit-scrollbar {
    width: 7px;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

const Table = styled.table`
  width: 100%;
`

const Tr = styled.tr`
  &:hover {
    background: #29303d;
    cursor: pointer;
  }
`

const Td = styled.td`
  border: 0;
  padding: 4px 8px;
  font-size: 1.4rem;

  &:nth-child(even) {
    text-align: right;
    width: 40%
  }
`

const Text = styled.span`
  display: inline-block;
  margin: 8px 0;
  color: gray;
  font-size: 1rem;
`

const PriceChange = styled('span')<{ positive: string }>`
  color: ${({positive}) => (positive === 'true' ? 'green' : 'red')};
  margin: 8px 0;
  display: inline-block;
  font-size: 1rem;
`

const TickerTable: React.FC = () => {
    const [tickers, setTickers] = useState<Ticker[]>([])
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const websocketManager = WebSocketManager.getInstance('wss://fstream.binance.com/ws')
        const streamName = '!ticker@arr'

        const handleData = (data: Ticker[]) => {
            if (Array.isArray(data)) {
                setTickers(data)
                setLoading(false)
            }
        }

        websocketManager.setMessageListener(handleData)
        websocketManager.triggerSubscription(streamName, 'SUBSCRIBE')

        // Clean up
        return () => {
            websocketManager.triggerSubscription(streamName, 'UNSUBSCRIBE')
            websocketManager.removeMessageListener()
        }


    }, [])

    return (
        <Container>
            {
                loading ? <LoadingSpinner/> : <Table>
                    <tbody>
                    {
                        tickers.map(ticker => {
                            return (
                                <Tr key={ticker.s}>
                                    <Td>
                                        {ticker.s}
                                        <br/>
                                        <Text>
                                            Perpetual
                                        </Text>
                                    </Td>
                                    <Td>
                                        {ticker.c}
                                        <br/>
                                        <PriceChange positive={String(parseFloat(ticker.P) >= 0)}>
                                            {ticker.P}%
                                        </PriceChange>
                                    </Td>
                                </Tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            }

        </Container>
    );
};

export default TickerTable;
