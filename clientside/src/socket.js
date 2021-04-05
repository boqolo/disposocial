import { Socket } from 'phoenix';
import store from './store';

// create socket with token if authenticated (undefined if not i.e.
// for default channel on page load)
// FIXME change for prod -> "/socket"
let socket;
let channel_dispo;

let MSG = {
  dispo_dead: "The Dispo has expired",
  left: "Left Dispo"
}

// Channel state callbacks

function ticker_dispatch(resp) {
  store.dispatch({ type: "ticker/add", data: resp.data })
}

function error_dispatch(msg) {
  store.dispatch({ type: "error/one", data: msg });
}

function newposts_dispatch(resp) {
  if (resp.one) {
    console.log("Got one new post")
    store.dispatch({ type: "feed/addone", data: resp.one });
  } else {
    console.log("Got many new posts")
    store.dispatch({ type: "feed/addmany", data: resp.many });
  }
}

function newcomments_dispatch(resp) {
  console.log("Got one new comment", resp)
  store.dispatch({ type: "comments/one", data: resp });
}

function handle_death(resp) {
  console.log("Got death message", resp)
  store.dispatch({ type: "flags/dispo_dead", data: true });
  store.dispatch({ type: "success/one", data: MSG.dispo_dead });
}

function dispo_meta_dispatch(resp) {
  console.log("received dispo meta", resp)
  store.dispatch({ type: "curr_dispo/set", data: resp.data });
}

function direct_msg_dispatch(resp) {
  // TODO
}

function info_dispatch(resp) {
  console.log("Got info", resp)
  store.dispatch({ type: "info/add", data: resp.data })
}

function remind_dispatch(resp) {
  console.log("Got reminder", resp)
  store.dispatch({ type: "curr_dispo/setremind", data: resp.data });
}


// Channels
// let channel_default = socket.channel("default:init", {});

// Join default channel on load
// channel_default.join()
//   .receive("ok", () => console.log("joined default channel"))
//   .receive("error", resp => console.log("unable to join default channel", resp));

// Register user
// export function ch_register({form_params, dispatch}) {
//   channel_default.push("register", form_params)
//     .receive("ok", () => {
//       console.log("register success!");
//       // TODO clear form, set user data?, set auth, redirect to discover,
//       dispatch({ type: "acct_form/set", data: {} });
//
//     }) // TODO dispatch user info to store?
//     .receive("error", resp => {
//       console.log("unable to register user", resp);
//       dispatch({ type: "error/one", data: [resp] });
//     });
// }

function init_sock(token) {
  let sock = new Socket("//localhost:4000/socket", {params: {token: token}});

  // setup error handling
  sock.onError(() => console.error("websocket error"));
  sock.onClose(() => console.error("websocket closed"));

  sock.connect();

  return sock;
}

export function ch_leave_dispo() {
  channel_dispo?.leave()
    .receive("ok", (resp) => {
      socket = undefined;
      channel_dispo = undefined;
    })
    .receive("error", resp => console.error(resp));
}

// FIXME should instead join on default channel and register callback
// to join specific Dispo channel on success
export function ch_join_dispo(id, successRedirect, dispo_auth = {}) {
  let { session } = store.getState();
  socket = init_sock(session.token);
  console.log("Init sock", socket)
  let params = {...session, ...dispo_auth};
  channel_dispo = socket.channel(`dispo:${id}`, params);
  console.log("Init channel", channel_dispo)
  channel_dispo.join()
    .receive("ok", () => {
      console.log("joined dispo channel", id)

      // Setup channel callbacks
      channel_dispo.on("dispo_meta", dispo_meta_dispatch);
      channel_dispo.on("doormat", ticker_dispatch);
      channel_dispo.on("info", info_dispatch);
      channel_dispo.on("remind", remind_dispatch);
      channel_dispo.on("new_posts", newposts_dispatch);
      channel_dispo.on("new_comments", newcomments_dispatch);
      channel_dispo.on("direct_msg", direct_msg_dispatch);
      channel_dispo.on("angel_of_death", handle_death);
      successRedirect()
    })
    .receive("error", resp => {
      console.error("unable to join dispo channel", id, resp);
      error_dispatch(resp);
      ch_leave_dispo();
    });
}

export function ch_post_post(params, success) {
  channel_dispo.push("post_post", params)
    .receive("ok", resp => {
      success();
    })
    .receive("error", resp => {
      console.error("unable to post", resp)
    });
}

export function ch_post_comment(params, success) {
  channel_dispo.push("post_comment", params)
    .receive("ok", resp => {
      success();
    })
    .receive("error", resp => {
      console.error("unable to post comment", resp)
    });
}
