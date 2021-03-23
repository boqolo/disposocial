import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Index from "./views/Index.jsx";
import About from "./views/About.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Discover from "./views/Discover.jsx";
import Dispo from "./views/Dispo.jsx";
import Default from "./views/404.jsx";

function App() {

  return (
    <Container className="bg-light shadow-light rounded">
      <Switch>
        <Route path="/" exact>
          <Index />
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
          <Dispo />
        </Route>
        <Route path="*">
          <Default />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;