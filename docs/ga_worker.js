const baseUrl = 'https://www.google-analytics.com/collect';
const toQueryString = (params) => {
  return Object.keys(params).reduce((result, param) => {
    result.push(`${param}=${params[param]}`);
    return result;
  }, []).join('&');
}

onmessage = (e) => {
  console.log('workerx', e.data.args);
  var request = new XMLHttpRequest();
  request.open('POST', baseUrl, true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(toQueryString(e.data.args));
  request.onload = function () {
    //postMessage(xhr.responseText);
    postMessage(e.data);
  };
};
