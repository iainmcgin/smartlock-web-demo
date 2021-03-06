// The Rateflicks Google client ID, from the Google developer console
const clientId =
    '114694971460-q4jm7hi4tj9ph2v1ohlql42oome73suk.apps.googleusercontent.com';

// The parameters used for hint and retrieve requests. Essentially, we are
// asking for a Google account, and providing the information necessary to
// source an ID token which is correctly scoped to this application.
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
  if (isAuthenticated()) {
    goToMain();
    return;
  }
}

function tryAuth() {
  // attempt to retrieve an existing account.
  smartlock.retrieve(credentialOptions)
      .then(handleSmartlockResult)
      .catch((smartLockError) => {
        switch (smartLockError.type) {
          case 'noCredentialsAvailable':
            console.log('No existing credentials - will try hint retrieval');
            return false;
          case 'userCanceled':
            console.log('User canceled retrieve - will try manual auth');
            return true;
          default:
            return true;
        }
      })
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
        console.log('hint request failed', err);
      });
}

window.onSmartLockLoad = tryAuth;
window.addEventListener('load', onLoad);