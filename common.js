////////////////////////////////////////////////////////////////////////////////
// cookie utils
////////////////////////////////////////////////////////////////////////////////

function createCookie(name, value, days) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, '', -1);
}

////////////////////////////////////////////////////////////////////////////////
// authentication cookie state management
////////////////////////////////////////////////////////////////////////////////

function isAuthenticated() {
  return readCookie('id') !== null;
}

function authenticateWithToken(idToken) {
  let claims = JSON.parse(atob(idToken.split('.')[1]));
  console.log('claims: ', claims);

  createCookie('id', claims.sub);
  console.log('authenticated with token');
  goToMain();
}

function authenticateWithEmail(email) {
  createCookie('id', email);
  console.log('authenticated with email');
  goToMain();
}

function deAuthenticate() {
  eraseCookie('id');
  goToLogin();
}

////////////////////////////////////////////////////////////////////////////////
// loading utils
////////////////////////////////////////////////////////////////////////////////

function setLoading(loading) {
  let classToRemove = loading ? 'loaded' : 'not-loaded';
  let classToAdd = loading ? 'not-loaded' : 'loaded';

  document.querySelectorAll('.' + classToRemove).forEach((el) => {
    el.classList.remove(classToRemove);
    el.classList.add(classToAdd);
  });
}

////////////////////////////////////////////////////////////////////////////////
// navigation
////////////////////////////////////////////////////////////////////////////////

function goToLogin() {
  console.log('nav to login');
  window.location = '/login.html';
}

function goToMain() {
  console.log('nav to mail');
  window.location = '/index.html';
}

////////////////////////////////////////////////////////////////////////////////
// workaround: explicitly specify smartlock frame URL until final production
// push occurs
////////////////////////////////////////////////////////////////////////////////

window.onSmartLockLoad = () => {
  openyolo.setProviderUrlBase('https://smartlock.google.com/iframe/request');
};