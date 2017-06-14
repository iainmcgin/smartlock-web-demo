// The Rateflicks Google client ID, from the developer console
const clientId =
    '114694971460-q4jm7hi4tj9ph2v1ohlql42oome73suk.apps.googleusercontent.com';

// The paramters used for hint and retrieve requests. In short, we are asking
// for Google accounts only, and providing the information necessary to source
// an ID token.
const credentialOptions = {
  supportedAuthMethods: ['https://accounts.google.com'],
  supportedIdTokenProviders:
      [{uri: 'https://accounts.google.com', clientId: clientId}]
};

// processes a retrieve / hint response, and returns true if the response
// results in a successful sign-in.
function handleSmartlockResult(credential) {
  if (credential) {
    authenticateWithToken(credential.idToken);
    return true;
  } else {
    return false;
  }
}

function onLoad() {
  window.setTimeout(tryAuth, 1000);
}

function tryAuth() {
  if (isAuthenticated()) {
    goToMain();
    return;
  }

  // attempt to retrieve an existing account.
  smartlock.retrieve(credentialOptions)
      .then(handleSmartlockResult)
      .then((complete) => {
        if (!complete) {
          // we were unable to retrieve an existing credential, so ask for
          // a credential hint instead.
          setLoading(false);
          return smartlock.hint(credentialOptions).then(handleSmartlockResult);
        }
        return true;
      })
      .catch((err) => {
        console.log('retrieve request failed :(');
        handleSmartlockResult(null);
      });
}

window.addEventListener('load', onLoad);