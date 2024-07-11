import React from 'react';
import TickerTable from './components/TickerTable';
import './App.css'

const App: React.FC = () => {
    return (
        <div>
            <h1 className={'header'}>Binance Ticker Data</h1>
            <TickerTable/>
        </div>
    );
};

export default App;
