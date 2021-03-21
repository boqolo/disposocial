import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from "./views/Index.jsx";
import About from "./views/About.jsx";
import Discover from "./views/Discover.jsx";
import Dispo from "./views/Dispo.jsx";
import Default from "./views/404.jsx";

function App() {
  return (
    <div class="container">
      <Switch>
        <Route path="/" exact>
          <Index />
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
    </div>
  );
}

export default App;
