import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import PageHeader from "../../components/PageHeader.jsx";

function New({session, dispatch}) {

  let { path, url } = useRouteMatch();
  let history = useHistory();

  return (
    <div>
      <PageHeader />
      <h1>New</h1>
    </div>
  );

}

function state_to_props({session}) {
  return {session};
}

export default connect(state_to_props)(New);
