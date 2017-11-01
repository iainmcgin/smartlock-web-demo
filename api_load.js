// hello developers! You can change the location that the client library
// is loaded from by changing the 'clientUrl' value in localStorage:
// localStorage.setItem('clientUrl', 'https://alt.location.com/path/to/js');

var script = document.createElement('script');
script.src = localStorage.getItem('clientUrl') || 'https://smartlock.google.com/client';
document.querySelector('head').appendChild(script);
