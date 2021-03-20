import { Socket } from 'phoenix';

// create socket with token if authenticated (undefined if not i.e.
// for default channel on page load)
let socket = new Socket("/socket", {params: {token: window.userToken}});

// error handling
socket.onError(() => console.log("websocket error"));
socket.onClose(() => console.log("websocket closed"));

socket.connect();

// Channels
let channel_default = socket.channel("default", {});
let channel_dispo = null;

channel_default.join()
  .receive("ok", () => console.log("joined default channel"))
  .receive("error", resp => console.log("unable to join default channel", resp));

export function ch_join_dispo(id) {
  channel_dispo = socket.channel(`dispo:${id}`, {});
  channel_dispo.join()
    .receive("ok", () => console.log("joined dispo channel", id)) // TODO massive state update
    .receive("error", resp => console.log("unable to join dispo channel", id, resp));
}

