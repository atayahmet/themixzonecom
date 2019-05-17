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
  request.open('POST', baseUrl+'?'+toQueryString(e.data.args), true);
  request.send();
  request.onload = function () {
    postMessage(e.data);
  };
};
