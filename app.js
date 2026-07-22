(function () {
  'use strict';

  var APK_HREF = '/opsradio.apk';
  var AMAZON_HREF = 'https://www.amazon.co.uk/dp/B0H2C1WWG3';
  var MS_HREF = 'https://apps.microsoft.com/detail/9p791g2vfx64';
  var APK_VERSION = 'v1.0.18';
  var APK_SIZE = '6.8 MB';

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
    return '<div class="cta-store">' +
      '<a class="btn btn-primary btn-download" href="' + APK_HREF +
      '" download="opsradio.apk">' + iconSVG('i-download') +
      'Download APK</a>' +
      '<p class="cta-cap">Android 7+ · ' + APK_SIZE + '</p>' +
    '</div>';
  }

  function amazonButton() {
    return '<div class="cta-store">' +
      '<a class="btn btn-amazon btn-download" href="' + AMAZON_HREF +
      '" target="_blank" rel="noopener">' + iconSVG('i-amazon') +
      'Get it on Amazon Appstore</a>' +
      '<p class="cta-cap">Android &amp; Fire tablets</p>' +
    '</div>';
  }

  function microsoftButton() {
    return '<div class="cta-store">' +
      '<a class="btn btn-microsoft btn-download" href="' + MS_HREF +
      '" target="_blank" rel="noopener">' + iconSVG('i-microsoft') +
      'Get it on Microsoft Store</a>' +
      '<p class="cta-cap">Xbox · PC · Mobile · Laptop · HoloLens</p>' +
    '</div>';
  }

  function storeStack() {
    return '<div class="cta-stack">' +
      apkButton() + amazonButton() + microsoftButton() + '</div>';
  }

  if (cta) {
    if (isAndroid) {
      cta.dataset.state = 'android';
      cta.innerHTML = storeStack();
    } else if (isIOS) {
      cta.dataset.state = 'ios';
      cta.innerHTML =
        '<div class="cta-message">' +
          '<p><strong>OPS Radio isn’t on iOS yet.</strong></p>' +
          '<p>Today it’s available on Android, Windows and Xbox.</p>' +
        '</div>';
    } else {
      cta.dataset.state = 'desktop';
      cta.innerHTML = storeStack() +
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
