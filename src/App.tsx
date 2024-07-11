import React from 'react';
import TickerTable from './components/TickerTable';

const App: React.FC = () => {
    return (
        <div>
            <h1 style={{textAlign: 'center', color: 'white', margin: '10px 0'}}>Binance Ticker Data</h1>
            <TickerTable/>
        </div>
    );
};

export default App;
