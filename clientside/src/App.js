import React from 'react';
import logo from './logo.svg';
import { Switch, Route } from 'react-router-dom';
import {
  Counter
} from './features/counter/Counter';
import IndexHeader from "./components/IndexHeader.jsx";
import DispoHeader from "./components/DispoHeader.jsx";
import FourOFour from "./components/404.jsx";
// import './App.css';

function App() {
  return (
    <div class="container">
      <Switch>
        <Route path="/" exact>
          <IndexHeader />
          <h1>Disposocial</h1>
          <h1><small>A disposable social network</small></h1>
        </Route>
        <Route path="/discover">
          <IndexHeader />
          <h1>{"TODO: use location to find local dispos and list them"}</h1>
        </Route>
        <Route path="/dispo">
          <DispoHeader />
        </Route>
        <Route path="*">
          <FourOFour />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
