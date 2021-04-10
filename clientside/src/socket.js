import { Socket, Presence } from 'phoenix';
import store from './store';

// create socket with token if authenticated (undefined if not i.e.
// for default channel on page load)
// FIXME change for prod -> "/socket"
let socket;
let channel_dispo;
let presence;

let MSG = {
  dispo_dead: "The Dispo has died",
  left: "Left Dispo"
}

// Channel state callbacks

function ticker_dispatch(resp) {
  store.dispatch({ type: "ticker/add", data: resp.data })
}

function error_dispatch(msg) {
  store.dispatch({ type: "error/one", data: msg });
}

function show_dispatch(resp) {
  let show = {}
  show[resp.data.id] = resp.data;
  console.log("Got full post to show", show)
  store.dispatch({ type: "feed/addone", data: show });
  // store.dispatch({ type: "show/set", data: resp.data });
}

function newposts_dispatch(resp) {
  if (resp.one) {
    console.log("Got one new post", resp)
    store.dispatch({ type: "feed/addone", data: resp.one });
  } else {
    console.log("Got many new posts", resp)
    store.dispatch({ type: "feed/addmany", data: resp.many });
  }
}

function newcomments_dispatch(resp) {
  if (resp.one) {
    console.log("Got one new comment", resp)
    store.dispatch({ type: "comments/addone", data: resp.one });
  } else {
    console.log("Got many new comments", resp)
    store.dispatch({ type: "comments/addmany", data: resp.many });
  }
}

function newreactions_dispatch(resp) {
  if (resp.one) {
    if (resp.created) {
      console.log("Got one new reaction", resp)
      store.dispatch({ type: "reactions/addone", data: resp.one });
    } else {
      console.log("Got one updated reaction", resp)
      store.dispatch({ type: "reactions/updateone", data: resp.one });
    }
  } else {
    console.log("Got many new reactions", resp)
    store.dispatch({ type: "reactions/addmany", data: resp.many });
  }
}

function popular_dispatch(resp) {
  console.log("Got new popular posts", resp)
  store.dispatch({ type: "popular/set", data: resp.data });
}

function handle_death(resp) {
  console.log("Got death message", resp)
  store.dispatch({ type: "flags/setone", data: {dispo_dead: true} });
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

function presence_dispatch(presence) {
  console.log("Got presences", presence);
  let presences = {};
  presence.list((username, {metas: [first, ...others]}) => {
    presences[username] = {online_at: first.online_at};
  });
  store.dispatch({ type: "presences/set", data: presences });
}


// Channels
// let channel_default = socket.channel("default:init", {});

// Join default channel on load
// channel_default.join()
//   .receive("ok", () => console.log("joined default channel"))
//   .receive("error", resp => console.log("unable to join default channel", resp));

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
      presence = undefined;
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
  presence = new Presence(channel_dispo);
  presence.onSync(() => presence_dispatch(presence));
  presence.onLeave((username, curr, leftPres) => {
    if (curr.metas.length === 0) {
      // there is a meta for every device a user is online
      // here check if they've fully exited
      // TODO ch_user_away()
    }
  });
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
      channel_dispo.on("new_post_comments", newcomments_dispatch);
      channel_dispo.on("new_post_reactions", newreactions_dispatch);
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

export function ch_load_reactions(success = () => {}) {
  channel_dispo.push("recent_reactions", {})
    .receive("ok", resp => {
      newreactions_dispatch(resp);
      success();
    })
    .receive("error", resp => {
      console.error("unable to load reactions", resp)
    });
}

export function ch_load_comments(success = () => {}) {
  channel_dispo.push("recent_comments", {})
    .receive("ok", resp => {
      newcomments_dispatch(resp);
      success();
    })
    .receive("error", resp => {
      console.error("unable to load comments", resp)
    });
}

export function ch_load_posts(success = () => {}) {
  channel_dispo.push("recent_posts", {})
    .receive("ok", resp => {
      newposts_dispatch(resp);
      success();
    })
    .receive("error", resp => {
      console.error("unable to load posts", resp)
    });
}

export function ch_fetch_posts(post_ids, callback) {
  channel_dispo.push("fetch_posts", post_ids)
    .receive("ok", resp => {
      callback(resp);
    })
    .receive("error", resp => {
      console.error("unable to fetch posts", resp)
    })
}

export function ch_load_post(params, success = () => {}) {
  channel_dispo.push("fetch_post", params)
    .receive("ok", resp => {
      show_dispatch(resp);
    })
    .receive("error", resp => {
      console.error("unable to fetch post", resp)
    })
}

export function ch_load_page() {
  ch_load_posts();
  ch_load_comments();
  ch_load_reactions();
}

export function ch_load_popular(success = () => {}) {
  channel_dispo.push("popular_posts", {})
    .receive("ok", resp => {
      // sorts [[post_id, num_interactions], ...] by descending popularity
      let desc_popularity = (a, b) => b[1] - a[1]
      let popular_posts = Object.entries(resp.data).sort(desc_popularity);
      let popular_post_ids = popular_posts.reduce((acc, e) => acc.concat(e[0]), []);
      ch_fetch_posts(popular_post_ids, popular_dispatch);
      // success();
    })
    .receive("error", resp => {
      console.error("unable to load popular posts", resp)
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

export function ch_post_reaction(params, success = () => {}) {
  channel_dispo.push("post_reaction", params)
    .receive("ok", resp => {
      success();
    })
    .receive("error", resp => {
      console.error("unable to post reaction", resp)
    });
}
