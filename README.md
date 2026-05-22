# opsradio.app

Static landing page for the OPS Radio Android app, hosted on Cloudflare Pages.

## Layout

```
opsradio-site/
├── index.html      # landing page (hero, APK card, features, install steps, FAQ)
├── styles.css      # styles, OPS palette + glass cards + soundwave mesh
├── app.js          # platform detection, QR show/hide, accordion behaviour
├── _headers        # Cloudflare Pages headers (APK MIME type, security)
├── logo.png        # app icon (256×256, ~87 KB)
├── qr.png          # pre-generated QR code → opsradio.app
└── opsradio.apk    # signed release APK served as the download
```

## Page structure

The page renders five visual zones (matches the brand brief):

1. **Hero** — logo + tagline + platform line + primary "Get the app" + secondary "How to install"
2. **Download card** — premium glass card with a devices badge, version pill,
   trust line, and a shine sweep every 8 s. Offers three download targets: the
   direct signed APK, the [Amazon Appstore](https://www.amazon.co.uk/dp/B0H2C1WWG3)
   listing (`AMAZON_HREF`), and the [Microsoft Store](https://apps.microsoft.com/detail/9p791g2vfx64)
   listing (`MS_HREF`, with a Xbox/PC/Mobile/Laptop/HoloLens caption) — both
   constants in `app.js`. On desktop, a QR card sits beside it.
3. **Features** — 6-card grid (Live Radio, Floating Player, Artist Discovery,
   Playlist Sync, Low Data Playback, Future Ready)
4. **Install options** — 3 channel cards (Microsoft Store, Amazon Appstore,
   Direct APK), each with its own install path
5. **Troubleshooting** — 5-item native `<details>` accordion (one-open at a time
   via app.js), scoped to the direct-APK sideload route

A faint soundwave mesh drifts behind everything (CSS-only, ~6% opacity) and
respects `prefers-reduced-motion`.

## Regenerating the QR code

If the URL ever changes:

```powershell
python -c "import qrcode; from qrcode.constants import ERROR_CORRECT_M; qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=10, border=3); qr.add_data('https://download.opsradio.app/'); qr.make(fit=True); qr.make_image(fill_color='#0B1538', back_color='#FFFFFF').convert('RGB').save('qr.png', optimize=True)"
```

(Requires `pip install --user qrcode[pil]` once.)

After regenerating, bump the `?v=` query on the `qr.png` reference in
`index.html` (e.g. `/qr.png?v=2` → `?v=3`). Cloudflare edge-caches the
image by path, so without a new query string visitors keep seeing the
old QR even after the deploy.

## Local preview

Open `index.html` in a browser. For a real localhost (so the JS download
attribute behaves correctly), serve the folder over HTTP, e.g.:

```powershell
# from this folder
python -m http.server 8080
# then open http://localhost:8080
```

## Updating the APK after a new release build

After a `Build → Generate Signed Bundle / APK → APK (release)` in Android Studio:

```powershell
Copy-Item -Path "C:\Users\bunji\StudioProjects\OPSRadio\app\release\app-release.apk" `
          -Destination "C:\Users\bunji\StudioProjects\opsradio-site\opsradio.apk" -Force
```

Then update the version + size strings in two places:
- `index.html` — the `<noscript>` button and the `.meta` paragraph.
- `app.js` — the `apkLabel` constant.

(These can be auto-derived later from `output-metadata.json` if it becomes a chore.)

## Deploy to Cloudflare Pages

The simplest path, since opsradio.app DNS already lives on Cloudflare:

1. Push this folder to a new GitHub repo (e.g. `opsradio-site`).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
3. Select the repo. Build command: *(leave empty)*. Build output: `/` (root).
4. After the first deploy succeeds, **Custom domains** → **Set up a custom
   domain** → `opsradio.app`. Cloudflare creates the CNAME automatically
   because the zone is already on Cloudflare.

Alternative: direct upload via Wrangler (no GitHub):

```powershell
npm install -g wrangler
wrangler pages deploy . --project-name opsradio-site
```

## Notes

- Cloudflare Pages free tier file limit is 25 MB per file. The APK is
  ~20.6 MB, so it fits. If a future build exceeds 25 MB, move the APK to
  R2 and rewrite the download link.
- The `_headers` file sets `Content-Type: application/vnd.android.package-archive`
  so older Android browsers correctly recognise the APK on download.
- `Cache-Control: max-age=300` keeps the APK fresh enough that publishing
  a new build appears for users within 5 minutes.
