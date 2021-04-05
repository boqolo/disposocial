import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Card, Tab, Navbar, Col, Row, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { convertDateTime } from '../../util';

function Feed({feed, dispatch}) {

  console.log("FEED has", feed)

  return (
    <Col>
      {feed.map((post, i) =>
        <Row key={`post-${i}`}>
          <Card className="rounded">
            <Row className="align-items-center">
              <Col><h3 className="fw-lighter">{post.username}</h3></Col>
              <Col xs="auto"><p className="fw-lighter">{convertDateTime(post.inserted_at)}</p></Col>
            </Row>
            <Card.Body className="text-wrap text-break">{post.body}</Card.Body>
          </Card>
        </Row>)}
    </Col>
  );
}

function state_to_props({feed}) {
  return {feed};
}

export default connect(state_to_props)(Feed);
