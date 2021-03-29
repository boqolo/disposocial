import React from "react";
import { Switch, Route, useRouteMatch, useParams, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Alert, Col } from "react-bootstrap";
import { connect } from 'react-redux';

function Header({session, error, success, dispatch}) {

  // TODO display errors
  let { path, url } = useRouteMatch();

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
                <Link className="text-decoration-none text-muted mx-3" to="/dispos/new">Create</Link> :
                <div>
                  <Link className="text-decoration-none text-muted mx-3" to="/login">{"Log in"}</Link>
                  <Link className="text-decoration-none text-muted mx-3" to="/register">{"Register"}</Link>
                </div>}
            </Nav>
            {session?.username &&
              <h4 className="mx-2">{session?.username}</h4>}
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Col className="mt-3 mx-auto w-75">
        {success.length > 0 && success.map((msg, i) =>
          <Alert className="mb-2" key={`succ-${i}`} variant="success">{msg}</Alert>)}
        {error.length > 0 && error.map((msg, i) =>
          <Alert className="mb-2" key={`err-${i}`} variant="danger">{msg}</Alert>)}
      </Col>
    </div>
  );
}

function state_to_props({session, error, success}) {
  return {session, error, success};
}

// Remember, you get `dispatch` for free as a prop when you do this
export default connect(state_to_props)(Header);
