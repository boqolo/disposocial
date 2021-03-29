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
