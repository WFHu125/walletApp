/**
 * Created by Administrator on 2017/8/25.
 */
const config = {
  request_url: 'http://jd.fuxids.com/fuxi-api/key-service',
  base_url: 'http://jd.fuxids.com/fuxi-api/jd-service',
  img_url: 'http://jd.fuxids.com/upload?h=400&w=500&type=2'
};

const headers = function (token) {
  var hea = {
    'headers': {
      'Content-Type': 'application/json',
      'token': token
    }
  };
  return hea;
};

const unHeaders = {
  'headers': {
    'Content-Type': 'application/json'
  }
};

const splitStr = function (str) {
  str = str.replace('?', '&').replace('?', '&');
  if (str === null || str.length <= 0) {
    return;
  }
  var keyMap = {};
  str = str.split('&');
  for (var x = 0; x < str.length; x++) {
    var val = str[x].split('=');
    keyMap[val[0]] = val[1];
  }
  return keyMap;
};

const isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; // android终端
const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

export {config, headers, unHeaders, isAndroid, isiOS, splitStr};
