import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/metro4-dist/js/metro.min.js";
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
