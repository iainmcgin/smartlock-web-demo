const clientId =
    '114694971460-q4jm7hi4tj9ph2v1ohlql42oome73suk.apps.googleusercontent.com';

function handleSmartlockResult(credential) {
  if (credential) {
    authenticateWithToken(credential.idToken);
    return true;
  } else {
    setLoading(false);
    return false;
  }
}

function onLoad() {
  if (isAuthenticated()) {
    goToMain();
    return;
  }

  let credentialPromise = smartlock.retrieve({
    supportedAuthMethods: ['https://accounts.google.com'],
    supportedIdTokenProviders:
        [{uri: 'https://accounts.google.com', clientId: clientId}]
  });

  credentialPromise.then(handleSmartlockResult)
      .then((complete) => {
        if (!complete) {
          return smartlock
              .hint({
                supportedAuthMethods: ['https://accounts.google.com'],
                supportedIdTokenProviders:
                    [{uri: 'https://accounts.google.com', clientId: clientId}]
              })
              .then(handleSmartlockResult);
        }
        return true;
      })
      .catch((err) => {
        console.log('retrieve request failed :(');
        retrieveResolve();
      });
}

window.addEventListener('load', onLoad);