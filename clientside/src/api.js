import store from './store.js';
import { capitalize } from './util';

let ERROR = {
  failed: "Fatal error. Request failed",
  unauthorized: "You aren't logged in"
};

function api_base(path) {
  return `http://localhost:4000/api/v1${path}`;
}

function clear_errors() {
  store.dispatch({ type: "error/set", data: [] });
}

function parse_errors(resp_errors) {
  // combine errors array for resp.errors keys
  let errors = Object.keys(resp_errors).reduce((acc, field) => {
    return acc.concat(capitalize(`${field} ${resp_errors[field]}`));
  }, []);
  console.log(resp_errors)
  return errors;
}

async function api_get(path, body = {}) {
  let state = store.getState();
  let token = state?.session?.token;
  let opts = {
    ...body,
    headers: {
      'x-auth': token
    }
  };
  console.log("GET at", api_base(path));
  let resp = await fetch(api_base(path), opts);
  let data = await resp.json();
  console.log("GET response", JSON.stringify(data, null, 2));
  return data;
}

// Based on Nat Tuck lecture code here:
// https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0319/photo-blog-spa/web-ui/src/api.js
async function api_post(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  let req = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data),
  };
  console.log("POST with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  let resp_data = await resp.json();
  console.log("POST response", JSON.stringify(resp_data, null, 2));
  return resp_data;
}

async function api_patch(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  let req = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data),
  };
  console.log("PATCH at", api_base(path), "with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  let resp_data = await resp.json();
  console.log("PATCH response", JSON.stringify(resp_data, null, 2));
  return resp_data;
}

async function api_delete(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  let req = {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data),
  };
  console.log("DELETE at", api_base(path), "with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  console.log("DELETE response", JSON.stringify(resp, null, 2));
  if (resp.ok) {
    return "success";
  } else {
    return resp;
  }
}

export function api_auth({email, password}, success = () => {}) {
  // post at session endpoint, dispatch set/session, redirect?
  api_post("/session", {email: email, password: password})
    .then(data => {
      console.log("AUTH response", JSON.stringify(data, null, 2));
      let error_resp = data["error"];
      if (error_resp) {
        store.dispatch({ type: "error/one", data: error_resp});
      } else {
        let sess = {...data};
        delete sess['time'];
        store.dispatch({ type: "session/set", data: sess });
        store.dispatch({ type: "success/one", data: "Logged in" });
        // store session in browser local storage
        let localStorage = window.localStorage;
        localStorage.setItem('token', data.token);
        localStorage.setItem('time', data.time);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);

        clear_errors();
        success();
      }
    })
    .catch(err => {
      console.error("AUTH failed", err);
      store.dispatch({ type: "error/one", data: ERROR.failed });
    });
}

export async function api_upload_media(params) {
  // referencing: https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0323/photo-blog-spa/web-ui/src/api.js
  let { session } = store.getState();
  let token = session?.token;

  let data = new FormData();
  data.append("media[file]", params.file);

  let opts = {
    method: "POST",
    body: data,
    headers: {
      'x-auth': token
    }
  };

  let resp = await fetch(api_base("/upload"), opts)
  return await resp.json();
}

export function api_create_acct(params, success) {
  // create acct, then api_auth
  api_post("/users", {user: params})
    .then(resp => {
      let error_resp = resp["error"];
      if (error_resp) {
        store.dispatch({ type: "error/set", data: parse_errors(resp["error"]) });
      } else {
        store.dispatch({ type: "success/set", data: ["Registered successfully"] })
        clear_errors();
        api_auth(params, success);
      }
    })
    .catch(err => {
      console.error("POST create user failed", err);
      store.dispatch({ type: "errors/one", data: ERROR.failed });
    });
}

export function api_fetch_local_dispos(params) {
  api_post("/dispos/near", params)
    .then(resp => {
      let error_resp = resp["error"];
      if (error_resp) {
        store.dispatch({ type: "error/set", data: parse_errors(error_resp) });
      } else {
        store.dispatch({ type: "local_dispos/set", data: resp["data"] });
      }
    })
    .catch(err => {
      console.error("FETCH local dispos failed");
      store.dispatch({ type: "error/one", data: ERROR.failed });
    });
}

export function api_create_dispo(params, success) {
  // create acct, then api_auth
  api_post("/dispos", {dispo: params})
    .then(resp => {
      let error_resp = resp["error"];
      if (error_resp) {
        store.dispatch({ type: "error/set", data: parse_errors(resp["error"]) });
      } else {
        store.dispatch({ type: "curr_dispo/set", data: resp["data"] });
        // TODO set curr dispo id in local storage
        success(resp["data"]["id"]);
        clear_errors();
      }
    })
    .catch(err => {
      console.error("POST create dispo failed", err);
      store.dispatch({ type: "errors/one", data: ERROR.failed });
    });
}
