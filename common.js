function createCookie(name, value, days) {
  let expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, '', -1);
}

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
  console.log('deauthenticated');
  goToLogin();
}

function setLoading(loading) {
  let classToRemove = loading ? 'loaded' : 'not-loaded';
  let classToAdd = loading ? 'not-loaded' : 'loaded';

  document.querySelectorAll('.' + classToRemove).forEach((el) => {
    el.classList.remove(classToRemove);
    el.classList.add(classToAdd);
  });
}

function goToLogin() {
  console.log('nav to login');
  window.location = '/login.html';
}

function goToMain() {
  console.log('nav to mail');
  window.location = '/index.html';
}