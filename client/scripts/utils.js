'use strict';

function encodeJSON(json) {
  if (!json) {
    return undefined;
  }
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

function request(reqType, url, params, onSuccess) {
  const req = new XMLHttpRequest();
  const encodedParams = encodeJSON(params);
  // Create the callback:
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200 && onSuccess) {
      onSuccess(req);
    }
  };
  req.open(reqType, url, true);
  if (reqType === 'POST') {
    // Send the proper header information along with the request
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  }
  req.send(encodedParams);
}

module.exports = {
  request,
};
