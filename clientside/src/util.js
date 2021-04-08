// source: metro4 utility function
Date.prototype.addHours=function(e){
  return this.setTime(this.getTime()+60*e*60*1e3), this
}

export function capitalize(str) {
  return str.length > 0 && str.replace(/^\w/, str[0].toUpperCase());
}

export function remove_at(arr, i) {
  let temp = [...arr];
  temp.splice(i, 1);
  return temp;
}

export function ms_to_min_s(ms) {
  // FIXME not accurate
  return Math.floor(ms / 60000)
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
  let login_time = localStorage.getItem('time');
  let user_id = localStorage.getItem('user_id');
  let username = localStorage.getItem('username');
  let not_expired = new Date() < new Date(login_time).addHours(23);
  if (token && not_expired && user_id && username) {
    let session = {
      token: token,
      user_id: user_id,
      username: username
    };
    console.log("Have session!")
    store.dispatch({ type: "session/set", data: session });
  }
}

export function getMyLocation(dispatch) {
  let geo = navigator.geolocation;
  let opts = {
    enableHighAccuracy: true,
    timeout: 7000 // time after which it will error if info not received
  };

  // this handler can be registered when the position is
  // retrieved and have access to do things with the coords
  let success = (geoPosn) => {
    let crd = geoPosn.coords;
    // crd.latitude, crd.longitude, crd.accuracy
    let fetched_location = {lat: crd.latitude, lng: crd.longitude}
    dispatch({ type: "location/set", data: fetched_location });
  };

  let error = (err) => {
    dispatch({ type: "errors/one", data: "Couldn't detect your location" });
  };

  // Locate me
  geo.getCurrentPosition(success, error, opts);

  // TODO future functionality. live read location and then unregister
  // let watcher_id = geo.watchPosition(success, error, opts)
  // would need effect clean up to cancel
  // return {geo, watcher_id};
}

export function clear_errors(dispatch) {
  dispatch({ type: "error/set", data: [] });
}

export function clear_messages(dispatch) {
  clear_errors(dispatch);
  dispatch({ type: "success/set", data: [] });
  dispatch({ type: "info/set", data: [] });
}

export function reset_dispo_state(dispatch) {
  dispatch({ type: "feed/set", data: [] });
  dispatch({ type: "comments/set", data: {} });
  dispatch({ type: "popular/set", data: [] });
  dispatch({ type: "likes/set", data: [] });
  dispatch({ type: "tags/set", data: [] });
  dispatch({ type: "show/set", data: {} });
  dispatch({ type: "info/set", data: [] });
  dispatch({ type: "ticker/set", data: [] });
  dispatch({ type: "curr_dispo/set", data: {} });
  dispatch({ type: "local_dispos/set", data: [] });
  dispatch({ type: "flags/setone", data: {dispo_dead: undefined} });
}
