import React from "react";
import { Switch, Route, useRouteMatch, useParams, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Header() {

  // TODO display errors, connect to store
  let { path, url } = useRouteMatch();

  return (
    <Container className="bg-primary">
      <Navbar bg="light" className="bd-blue-100" variant="light" className="p-3">
        <Navbar.Brand href="/">
          <h5 className="display-5 fw-lighter">Disposocial</h5>
        </Navbar.Brand>
        <Navbar.Text>{"disposable social media"}</Navbar.Text>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={path} className="mr-auto">
            <Nav.Link href="/discover">Discover</Nav.Link>
            <Nav.Link href="/login">{"Log in"}</Nav.Link>
            <Nav.Link href="/register">{"Register"}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
    );

  }
