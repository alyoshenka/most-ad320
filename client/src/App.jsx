import './App.css';

import TopBar from './components/TopBar/TopBar'
import CardProvider from './components/CardProvider/CardProvider'
import CardNav from './components/CardNav/CardNav'
import React from 'react';

function App() {
    return (
        <React.Fragment>
            <TopBar />
            <div className="container">

                <CardProvider />
                <CardNav />
            </div>
        </React.Fragment>
    );
}

export default App;