import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams, useLocation } from 'react-router-dom';
import { Tabs, Form, Tab, ListGroup, Image, Navbar, Col, Row, Container, Button, Modal, Card, Jumbotron } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import DispoInfo from '../../components/DispoInfo';
import PostFooter from '../../components/PostFooter';
import store from '../../store';
import { ch_load_post, ch_post_post, ch_leave_dispo, ch_load_page } from '../../socket';
import { reset_dispo_state, convertDateTime, ms_to_min_s, clear_errors } from '../../util';

function Post({show, feed, comments, dispatch}) {

  let { dispoId, postId } = useParams();

  console.log("feed has post", feed[postId])
  console.log("show has post", show);

  function format_reactions(reaction_count) {
    let { likes, dislikes } = reaction_count;
    if (likes || dislikes) {
      return `+${likes}, -${Math.abs(dislikes)}`
    } else {
      return "0, 0";
    }
  }

  // fetch full post
  React.useEffect(() => {
    if (!show.id || show.id != postId) {
      let params = {
        post_id: parseInt(postId)
      }
      ch_load_post(params);
    }
    return () => dispatch({type: "show/set", data: {} });
  }, []);

  // refresh post if updates
  React.useEffect(() => {
    // TODO join
    let show = {...feed[postId]};
    show["comments"] = comments[postId];
    dispatch({ type: "show/set", data: show });
  }, [feed, comments]);

  return (
    <div className="mb-5">
      <DispoHeader />
      <Row>
        <Col>
          <Jumbotron>
            {show.media_hash &&
              <div className="w-50 h-50 mx-auto shadow-sm">
                <Image
                  fluid
                  src={`http://localhost:4000/api/v1/uploads/${show.media_hash}`} />
              </div>}
            <div className="p-3 fw-light">
              {show.body}
            </div>
            <Row className="px-3">
              <Col className="d-flex justify-content-end align-items-end">
                <span className="fw-light">
                  {convertDateTime(show.inserted_at)}
                </span>
              </Col>
              <Col xs="auto" className="border-bottom border-primary">
                <div className="display-6">{show.user?.name}</div>
              </Col>
              <PostFooter postId={postId} />
            </Row>
            <div className="pb-2">
              <h5
                className="px-3 py-1 mb-2 fw-light bg-light">
                Comments
              </h5>
              {show.comments?.map((comm, i) => (
                <Row key={`post-comm-${comm.id}`} className="border-0 mt-0 mx-3 mb-1">
                  <Col className="ps-0 pe-1" xs="2">
                    <h6 className="mb-0 text-wrap">{comm.username}</h6>
                    <h6>
                      <small className="very-small fw-light">{convertDateTime(comm.inserted_at)}</small>
                    </h6>
                  </Col>
                  <Col className="py-0 px-0 text-wrap text-break">{comm.body}</Col>
                </Row>
              ))}
            </div>

          </Jumbotron>
        </Col>
      </Row>
    </div>
  );
}

function state_to_props({show, feed, comments}) {
  return {show, feed, comments};
}

export default connect(state_to_props)(Post);
