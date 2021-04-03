import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Jumbotron, Tab, Navbar, Col, Row, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { convertDateTime } from '../../util';

function Feed({feed, dispatch}) {

  console.log("FEED has", feed)

  return (
    <Col>
      {feed.map((post, i) =>
        <Row key={`post-${i}`}>
          <Jumbotron>
            <h3 className="fw-lighter">{post.username}</h3>
            <p className="fw-lighter">{convertDateTime(post.inserted_at)}</p>
            <p>{post.body}</p>
          </Jumbotron>
        </Row>)}
    </Col>
  );
}

function state_to_props({feed}) {
  return {feed};
}

export default connect(state_to_props)(Feed);
