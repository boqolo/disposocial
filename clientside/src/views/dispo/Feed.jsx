import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Card, Tab, Navbar, Col, Row, ListGroup, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { convertDateTime } from '../../util';
import { ch_post_comment } from '../../socket';


function PostComments({postId, comments}) {
  return (
    <div id={`#comms-${postId}`}>
      <h5 className="px-3 my-1 fw-lighter">Comments</h5>
      {comments.map((comm, i) => (
        <Row key={`comm-${postId}-${i}`} className="border-0 mt-0 mx-3">
          <Col className="p-0" xs="2"><h6>{comm.username}</h6></Col>
          <Col className="py-0 px-2 text-wrap text-break">{comm.body}</Col>
          <Col className="p-0 fw-lighter" xs="auto">{convertDateTime(comm.inserted_at)}</Col>
        </Row>
      ))}
    </div>
  );
}

function PostFooterComp({postId, flags, dispatch}) {

  console.log("Post footer post", postId)

  function set_commenting(post_id) {
    dispatch({ type: "flags/setone", data: {post_comment_id: post_id} });
  }

  function cancel_commenting() {
    dispatch({ type: "flags/setone", data: {post_comment_id: undefined} });
  }

  function post_comment(ev, post_id) {
    ev.preventDefault();
    let params = {
      post_id: post_id,
      body: ev.target[0].value.trim()
    }
    let successCallback = (resp) => {
      cancel_commenting();
    };
    ch_post_comment(params, successCallback);
  }

  let body;
  if (flags.post_comment_id == postId) {
    body = (
      <Form inline className="w-100 p-1" onSubmit={ev => post_comment(ev, postId)}>
        <Form.Row className="d-flex align-items-center">
          <Col className="w-100 p-0">
            <Form.Control type="text"
              size="sm" placeholder="Comment" /></Col>
            <Col xs="auto" className="ps-2">
            <Button
              type="submit"
              variant="primary"
              size="sm">
              Post
            </Button>
            <Button className="ms-2" variant="outline-secondary" size="sm" onClick={cancel_commenting}>
              Cancel
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  } else {
    body = (
      <div className="p-1">
        <Link to={"#"} className="me-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {}}>
            Full Post
          </Button>
        </Link>
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => set_commenting(postId)}>
          {"Comment"}
        </Button>
      </div>
    );
  }

  return (
    <Card.Footer className="py-0 px-2 h-0 border-primary border-bottom border-2 border-top-0 rounded">
      {body}
    </Card.Footer>
  );
}

let PostFooter = connect(({flags}) => { return {flags} })(PostFooterComp);

function Feed({feed, comments, dispatch}) {

  console.log("Feed has", feed)

  let desc = (x, y) => x > y ? x : y;

  return (
    <Col>
      {Object.keys(feed).sort(desc).map((post_id) =>
        <Row key={`post-${post_id}`} className="mx-0 mb-4 shadow-sm rounded">
          <Card className="rounded p-0">
            <Row className="align-items-center px-3">
              <Col><h3 className="fw-lighter">{feed[post_id].username}</h3></Col>
              <Col xs="auto">
                <p className="fw-lighter fs-6 m-0">{convertDateTime(feed[post_id].inserted_at)}
                </p>
                <blockquote className="text-muted m-0">{"Reaction count"}</blockquote>
              </Col>
            </Row>
            <Card.Body className="text-wrap text-break">{feed[post_id].body}</Card.Body>
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
