import { Socket } from 'phoenix';
import store from './store';

// create socket with token if authenticated (undefined if not i.e.
// for default channel on page load)
// FIXME change for prod -> "/socket"
let socket;
let channel_dispo;



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
  let sock = new Socket("ws://localhost:4000/socket", {params: {token: token}});

  // setup error handling
  sock.onError(() => console.error("websocket error"));
  sock.onClose(() => console.error("websocket closed"));

  sock.connect();

  return sock;
}

// FIXME should instead join on default channel and register callback
// to join specific Dispo channel on success
export function ch_join_dispo(id, successRedirect) {
  let { session } = store.getState();
  socket = init_sock(session.token);
  console.log("Init sock", socket)
  channel_dispo = socket.channel(`dispo:${id}`, session);
  console.log("Init channel", channel_dispo)
  channel_dispo.join()
    .receive("ok", () => {
      console.log("joined dispo channel", id)
      successRedirect()
    })
    .receive("error", resp => {
      console.error("unable to join dispo channel", id, resp);
      socket = undefined;
      channel_dispo = undefined;
    });
}

export function ch_post_post(params) {
  channel_dispo.push("post_post", params)
    .receive("ok", resp => {
      store.dispatch({ type: "success/one", data: "Posted!" });
    })
    .receive("error", resp => {
      console.error("unable to post")
    });
}

export function ch_leave_dispo() {
  channel_dispo?.leave()
    .receive("ok", (resp) => {
      socket = undefined;
      channel_dispo = undefined;
      store.dispatch({ type: "success/one", data: "Left Dispo" });
    })
    .receive("error", resp => console.error(resp));
}
