


export function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let i in cookies) {
    let arr = cookies[i].split("=");
    if (name == arr[0]) {
      return unescape(arr[1]);
    }
  }
  return null;
}


export function setCookie(name, value, expires=9999999, path='/', domain) {
  document.cookie = name + "=" + value + ((expires)
    ? "; expires=" + getExpires(expires)
    : "") + ((path)
    ? "; path=" + path
    : "") + ((domain)
    ? "; domain=" + domain
    : "");

  function getExpires(hours) {
    let date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date.toGMTString();
  }
}






/**
 * if the binding value is equal to oldeValue
 */
export function notChanged (binding) {
  if (binding.oldValue !== undefined) {
    if (typeof binding.value === 'object') {
      return deepEqual(binding.value, binding.oldValue)
    } else {
      return binding.value === binding.oldValue
    }
  } else {
    return false
  }
}

/**
 * if the binding value is empty
 */
export function isEmpty (binding) {
  return binding.value === '' || binding.value === undefined || binding.value === null
}


export function isString (value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

export function getLocationHref () {
  if (typeof document === 'undefined' || document.location == null) return '';

  return document.location.href;
}

export function noop () { }



export function oneOf (one, all) {
  for (let i in all) {
    if (one === all[i]) {
      return true;
    }
  }
  return false;
}



export function setFlag (key, value) {
  window._tryCatch =    window._tryCatch || {};
    window._tryCatch[key] = value;
}

export function getFlag (key) {
    window._tryCatch =    window._tryCatch || {};
  return    window._tryCatch[key];
}
