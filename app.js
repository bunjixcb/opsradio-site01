(function () {
  'use strict';

  var APK_HREF = '/opsradio.apk';
  var APK_VERSION = 'v1.0';
  var APK_SIZE = '20.6 MB';

  // TODO: replace with the real public TestFlight link from App Store Connect
  var TESTFLIGHT_URL = 'https://testflight.apple.com/join/REPLACE_ME';

  var ua = navigator.userAgent || '';
  var isAndroid = /android/i.test(ua);
  var isIOS = /iphone|ipad|ipod/i.test(ua) ||
              (/Mac/.test(ua) && 'ontouchend' in document);
  var isDesktop = !isAndroid && !isIOS;

  var cta = document.getElementById('cta');
  var qrCard = document.getElementById('qr-card');

  function downloadIconSVG() {
    return '<svg class="btn-icon" aria-hidden="true">' +
           '<use href="#i-download"></use></svg>';
  }

  if (cta) {
    if (isAndroid) {
      cta.dataset.state = 'android';
      cta.innerHTML =
        '<a class="btn btn-primary btn-download" href="' + APK_HREF +
        '" download="opsradio.apk">' + downloadIconSVG() +
        'Download APK</a>';
    } else if (isIOS) {
      cta.dataset.state = 'ios';
      cta.innerHTML =
        '<a class="btn btn-primary btn-download" href="' + TESTFLIGHT_URL +
        '" target="_blank" rel="noopener">' + downloadIconSVG() +
        'Join TestFlight Beta</a>' +
        '<p class="cta-message" style="margin-top:12px">' +
          'OPS Radio for iOS is in public beta via Apple TestFlight.' +
        '</p>';

      var heading = document.querySelector('.apk-card-title h2');
      if (heading) heading.textContent = 'OPS Radio for iOS';
      var meta = document.querySelector('.apk-card-title .meta-list');
      if (meta) meta.innerHTML =
        '<li>Version 1.0</li><li>iOS 16+</li><li>TestFlight</li>';
      var badge = document.querySelector('.apk-badge-icon use');
      if (badge) badge.setAttribute('href', '#i-apple');
    } else {
      cta.dataset.state = 'desktop';
      cta.innerHTML =
        '<a class="btn btn-primary btn-download" href="' + APK_HREF +
        '" download="opsradio.apk">' + downloadIconSVG() +
        'Download APK</a>' +
        '<p class="cta-message" style="margin-top:12px">' +
          'Or scan the QR code to install on your phone.' +
        '</p>';
    }
  }

  // Show the QR card only on desktop (saves vertical space on phones)
  if (qrCard && isDesktop) {
    qrCard.hidden = false;
  }

  // Optional: auto-close other troubleshooting items so it behaves
  // as a true accordion. Native <details> alone allows multiple open.
  var tsItems = document.querySelectorAll('.ts-item');
  tsItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        tsItems.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
})();
