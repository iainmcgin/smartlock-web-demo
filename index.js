
function onLoad() {
  if (!isAuthenticated()) {
    goToLogin();
    return;
  }

  setLoading(false);
  document.querySelector('#signout').addEventListener('click', deAuthenticate);
}

window.addEventListener('load', onLoad);