import React from "react";
import { Switch, Route, useRouteMatch, useHistory, useParams, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { remove_at } from '../util';
import HeaderAlert from './Alert';

function Header({session, error, info, success, dispatch}) {

  // TODO display errors
  let { path, url } = useRouteMatch();
  let history = useHistory();

  let localStorage = window.localStorage;
  console.log("Page header has session", JSON.stringify(session, null, 2));

  function handle_logout() {
    dispatch({ type: "session/set", data: {} });
    dispatch({ type: "success/one", data: "Logged out" });
    let localStorage = window.localStorage;
    localStorage.clear();
    history.replace("/");
  }


    return (
      <div>
        <Container className="bg-primary">
          <Navbar bg="light" className="bd-blue-100" variant="light" className="p-3">
            <Navbar.Brand>
              <Link to="/" className="text-decoration-none">
                <h5 className="display-5 fw-lighter">Disposocial</h5>
              </Link>
            </Navbar.Brand>
          <Navbar.Text>{"disposable social media"}</Navbar.Text>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={path} className="mr-auto">
              <Link className="text-decoration-none text-muted mx-3" to="/discover">Discover</Link>
              {session?.user_id ?
                <Link className="text-decoration-none text-muted mx-3" to="/dispo/new">Create</Link> :
                <div>
                  <Link className="text-decoration-none text-muted mx-3" to="/login">{"Log in"}</Link>
                  <Link className="text-decoration-none text-muted mx-3" to="/register">{"Register"}</Link>
                </div>}
            </Nav>
            {session?.username &&
              <Row xs="auto">
                <h4 className="mx-2">{session?.username}</h4>
                <Button onClick={handle_logout} variant="light" className="text-dark" size="sm">{"Log out"}</Button>
              </Row>}
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Col className="mt-1 mx-auto w-75">
        {success.length > 0 && success.map((msg, i) =>
          <HeaderAlert key={`succ-${i}`} i={i} msg={msg} success={success} group="success" />)}
        {info.length > 0 && info.map((msg, i) =>
          <HeaderAlert key={`info-${i}`} i={i} msg={msg} info={info} group="info" />)}
        {error.length > 0 && error.map((msg, i) =>
          <HeaderAlert key={`error-${i}`} i={i} msg={msg} error={error} group="error" />)}
      </Col>
    </div>
  );
}

function state_to_props({session, info, error, success}) {
  return {session, info, error, success};
}

// Remember, you get `dispatch` for free as a prop when you do this
export default connect(state_to_props)(Header);
