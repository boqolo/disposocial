import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams, useLocation } from 'react-router-dom';
import { Tabs, Form, Tab, ListGroup, Navbar, Col, Row, Container, Button, Modal, Jumbotron } from 'react-bootstrap';
import store from '../store';
import { ch_post_post, ch_leave_dispo, ch_load_page } from '../socket';
import { reset_dispo_state, convertDateTime, ms_to_min_s, clear_errors } from '../util';

function DispoInfo({curr_dispo, dispatch}) {

  let history = useHistory();

  function handle_leave() {
    ch_leave_dispo();
    clear_errors(dispatch);
    reset_dispo_state(dispatch);
    dispatch({ type: "success/one", data: "Left Dispo" });
    history.replace("/discover");
  }

  return (
    <Jumbotron
      className="rounded p-3 border-end border-bottom border-4 shadow-sm">
      <h2 className="fw-lighter text-wrap text-break">
        {curr_dispo.name}
      </h2>
      <p>{`Created ${convertDateTime(curr_dispo.created)}`}</p>
      <p>
        <strong>
          {`Expiring ${convertDateTime(curr_dispo.death)}`}
        </strong>
      </p>
      {curr_dispo.time_remaining &&
        <p className="bg-warning p-1 rounded text-center text-wrap">{`~${ms_to_min_s(curr_dispo.time_remaining)} min left`}
        </p>}
      <p>{`Based in ${curr_dispo.location?.locality}, ${curr_dispo.location?.region} near ${curr_dispo.location?.street}`}</p>
      <p>
        <small className="text-muted text-wrap">
          {`lat: ${curr_dispo.latitude}`}
        </small>
      </p>
      <p>
        <small className="text-muted text-wrap">
          {`lng: ${curr_dispo.longitude}`}
        </small>
      </p>
      <div className="d-flex justify-content-center">
        <Button
          size="lg"
          className="fw-lighter"
          onClick={handle_leave}
          variant="danger">
          {"Leave"}
        </Button>
      </div>
    </Jumbotron>
  );
}

function state_to_props({curr_dispo}) {
  return {curr_dispo};
}

export default connect(state_to_props)(DispoInfo);
