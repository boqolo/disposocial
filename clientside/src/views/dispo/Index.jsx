import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import store from '../../store';
import DispoHeader from "../../components/DispoHeader.jsx";
import Default from '../404';
import New from './New';
import Dispo from './Dispo';

function Root() {
  let { session } = store.getState();
  let localStorage = window.localStorage;
  let dispo_id = localStorage.getItem('dispo_id');
  let history = useHistory();

  let body;
  if (session?.token && session?.username && dispo_id) {
    body =
      <div>
        {history.push(`/dispo/${dispo_id}`)}
      </div>;
  } else if (session?.token) {
    body =
      <div>
        {history.push("/dispo/new")}
      </div>;
  } else {
    body =
      <div>
        {history.push("/register")}
      </div>;
  }

  return (<div>{body}</div>);
}

function Index({session, dispatch}) {

  let { path, url } = useRouteMatch();

  console.log('Got dispo path', path);
  console.log("Dispo Index session is", session);

  return (
    <Switch>
      <Route exact path={path}>
        <Root />
      </Route>
      <Route path={`${path}/new`}>
        <New />
      </Route>
      <Route path={`${path}/:dispoId`}>
        <Dispo />
      </Route>
      <Route path="*">
        <Default />
      </Route>
    </Switch>
  );

}

function state_to_props({session}) {
  return {session};
}

export default connect(state_to_props)(Index);
