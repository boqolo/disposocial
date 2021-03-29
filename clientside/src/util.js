export function capitalize(str) {
  return str.length > 0 && str.replace(/^\w/, str[0].toUpperCase());
}

export function convertDateTime(isoStr) {
  let dopts = {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'America/Chicago',
  };
  let topts = {
    timeStyle: 'short'
  }
  let d = new Date(isoStr)
  return `${d.toLocaleString('en-us', dopts)} @ ${d.toLocaleTimeString('en-us', topts)}`;
}

export function load_session_from_storage(store) {
  console.log("Checking for cookiue in sotrage")
  let localStorage = window.localStorage;
  let token = localStorage.getItem('token');
  let user_id = localStorage.getItem('user_id');
  let username = localStorage.getItem('username');
  if (token && user_id && username) {
    let session = {
      token: token,
      user_id: user_id,
      username: username
    };
    console.log("Have session!")
    store.dispatch({ type: "session/set", data: session });
  }
}
