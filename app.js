(function () {
  'use strict';

  var APK_HREF = '/opsradio.apk';
  var AMAZON_HREF = 'https://www.amazon.co.uk/dp/B0H2C1WWG3';
  var APK_VERSION = 'v1.0';
  var APK_SIZE = '20.6 MB';

  var ua = navigator.userAgent || '';
  var isAndroid = /android/i.test(ua);
  var isIOS = /iphone|ipad|ipod/i.test(ua) ||
              (/Mac/.test(ua) && 'ontouchend' in document);
  var isDesktop = !isAndroid && !isIOS;

  var cta = document.getElementById('cta');
  var qrCard = document.getElementById('qr-card');

  function iconSVG(id) {
    return '<svg class="btn-icon" aria-hidden="true">' +
           '<use href="#' + id + '"></use></svg>';
  }

  function apkButton() {
    return '<a class="btn btn-primary btn-download" href="' + APK_HREF +
           '" download="opsradio.apk">' + iconSVG('i-download') +
           'Download APK</a>';
  }

  function amazonButton() {
    return '<a class="btn btn-amazon btn-download" href="' + AMAZON_HREF +
           '" target="_blank" rel="noopener">' + iconSVG('i-amazon') +
           'Get it on Amazon Appstore</a>';
  }

  if (cta) {
    if (isAndroid) {
      cta.dataset.state = 'android';
      cta.innerHTML =
        '<div class="cta-stack">' + apkButton() + amazonButton() + '</div>';
    } else if (isIOS) {
      cta.dataset.state = 'ios';
      cta.innerHTML =
        '<div class="cta-message">' +
          '<p><strong>OPS Radio is Android-only right now.</strong></p>' +
          '<p>iOS support isn’t available yet.</p>' +
        '</div>';
    } else {
      cta.dataset.state = 'desktop';
      cta.innerHTML =
        '<div class="cta-stack">' + apkButton() + amazonButton() + '</div>' +
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
