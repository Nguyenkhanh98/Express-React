import Routers from './routes';
import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();


function App() {
  return (
    <BrowserRouter
      forceRefresh={false}
      basename="/"
      history={history}
    >
      <Routers />
    </BrowserRouter>
  );
}

export default App;
