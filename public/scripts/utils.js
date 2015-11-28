var lack = lack || {};
lack.biblio = lack.biblio || {};
lack.biblio.utils = lack.biblio.utils || {};

lack.biblio.utils.encodeJSON = function(json) {
  return json ? Object.keys(json).map(function(key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key]);
  }).join('&') : undefined;
};

lack.biblio.utils.request = function(reqType, url, params, onSuccess) {
  var req = new XMLHttpRequest();
  var encodedParams = lack.biblio.utils.encodeJSON(params);
  // Create the callback:
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200 && onSuccess) {
      onSuccess(req);
    }
  }
  req.open(reqType, url, true);
  if (reqType === "POST") {
    //Send the proper header information along with the request
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  req.send(encodedParams);
};
