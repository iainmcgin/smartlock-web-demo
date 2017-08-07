
function onLoad() {
  if (!isAuthenticated()) {
    goToLogin();
    return;
  }

  setLoading(false);
  document.querySelector('#signout').addEventListener('click', () => {
    smartlock.disableAutoSignIn()
        .then(() => deAuthenticate());
  });
}

window.addEventListener('load', onLoad);