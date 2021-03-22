import store from './store.js';

function api_base(path) {
  return `http://localhost:4000/api/v1${path}`;
}

async function api_get(path) {
  console.log("GET at", api_base(path));
  let resp = await fetch(api_base(path), {});
  let data = await resp.json();
  console.log("GET response", JSON.stringify(data, null, 2));
  return data;
}

// Based on Nat Tuck lecture code here:
// https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0319/photo-blog-spa/web-ui/src/api.js
async function api_post(path, data) {
  req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  console.log("POST with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  let data = await resp.json();
  console.log("POST response", JSON.stringify(data, null, 2));
  return data;
}

export function api_create_acct({username, email, passcode}) {
  // create acct, then api_auth
  api_post()
}

export function api_auth(username, passcode) {
  // post at session endpoint, dispatch set/session, redirect?
  api_post("/session", {username, passcode})
    .then(data => {
      console.log("AUTH response", JSON.stringify(data, null, 2));
      // TODO dispatch with session info
    })
    .catch(err => console.error("AUTH failed", err));
}
