import { Socket } from 'phoenix';
import store from './store';

// create socket with token if authenticated (undefined if not i.e.
// for default channel on page load)
// FIXME change for prod -> "/socket"
let socket = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}});

// error handling
socket.onError(() => console.log("websocket error"));
socket.onClose(() => console.log("websocket closed"));

socket.connect();

// Channels
let channel_default = socket.channel("default:init", {});
let channel_dispo;

// Join default channel on load
channel_default.join()
  .receive("ok", () => console.log("joined default channel"))
  .receive("error", resp => console.log("unable to join default channel", resp));

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

// FIXME should instead join on default channel and register callback
// to join specific Dispo channel on success
export function ch_join_dispo(id, successRedirect) {
  let { session } = store.getState();
  channel_dispo = socket.channel(`dispo:${id}`, session);
  channel_dispo.join()
    .receive("ok", () => {
      console.log("joined dispo channel", id) // TODO massive state update
      successRedirect()
    })
    .receive("error", resp => console.log("unable to join dispo channel", id, resp));
}

export function ch_leave_dispo() {
  channel_dispo.leave()
    .receive("ok", (resp) => {
      channel_dispo = undefined;
    })
    .receive("error", resp => console.log(resp));
}
