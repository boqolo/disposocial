import React from 'react';
import { Switch, Route } from 'react-router-dom';
import store from './store';
import { Container } from 'react-bootstrap';
import Home from "./views/Home.jsx";
import About from "./views/About.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Discover from "./views/Discover.jsx";
import DispoView from "./views/dispo/Index.jsx";
import Default from "./views/404.jsx";

function App() {

  return (
    <Container className="bg-light">
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/discover">
          <Discover />
        </Route>
        <Route path="/dispo">
          <DispoView />
        </Route>
        <Route path="*">
          <Default />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
