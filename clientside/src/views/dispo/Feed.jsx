import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Card, Image, Tab, Navbar, ButtonGroup, Col, Row, ListGroup, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import PostFooter from '../../components/PostFooter';
import store from '../../store';
import { api_media_path } from '../../api';
import { convertDateTime } from '../../util';
import { ch_post_comment, ch_post_reaction } from '../../socket';


function PostComments({postId, comments}) {
  return (
    <div id={`#comms-${postId}`} className="pb-2">
      <h5
        className="px-3 py-1 mb-2 fw-light bg-light border-top">
        Comments
      </h5>
      {comments.map((comm, i) => (
        <Row key={`comm-${postId}-${i}`} className="border-0 mt-0 mx-3 mb-1">
          <Col className="ps-0 pe-1" xs="2">
            <h6 className="mb-0 text-wrap">{comm.username}</h6>
            <h6>
              <small className="very-small fw-light">{convertDateTime(comm.inserted_at)}</small>
            </h6>
          </Col>
          <Col className="py-0 px-0 text-wrap text-break">
            {comm.body}
          </Col>
        </Row>
      ))}
    </div>
  );
}

function Feed({feed, comments, dispatch}) {

  // console.log("Feed has", feed)

  let { dispoId } = useParams();

  return (
    <Col>
      {Object.keys(feed).reverse().map((post_id) =>
        <Row key={`post-${post_id}`} className="mx-0 mb-4 rounded border-primary border-bottom border-1 border-top-0 rounded-bottom shadow-sm">
          <Card className="rounded p-0 border-bottom-0">
            <Link to={`/dispo/${dispoId}/post/${post_id}`} className="text-reset text-decoration-none">
              <Row className="align-items-center px-3">
                <Col>
                  <h3 className="fw-lighter">{feed[post_id].user?.name}</h3>
                </Col>
                <Col xs="auto">
                  <p className="fw-lighter fs-6 m-0">{convertDateTime(feed[post_id].inserted_at)}
                  </p>
                </Col>
              </Row>
              {feed[post_id].media_hash &&
                <Row className="mx-0">
                  <Image fluid className="px-0" src={api_media_path(feed[post_id].media_hash)} />
                </Row>}
              <Card.Body className="text-wrap text-break">{feed[post_id].body}</Card.Body>
            </Link>
            <PostFooter postId={post_id} />
            {comments[post_id] &&
              <PostComments postId={post_id} comments={comments[post_id]} />}
          </Card>
        </Row>)}
    </Col>
  );
}

function state_to_props({feed, comments}) {
  return {feed, comments};
}

export default connect(state_to_props)(Feed);
