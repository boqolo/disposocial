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
