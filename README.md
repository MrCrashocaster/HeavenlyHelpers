# Heavenly Helpers — GitHub Pages edition

The same responsive homepage, now arranged for GitHub Pages. All images and fonts are included. The website uses relative links, so it works at a repository URL such as `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/` and at a custom domain. No repository name needs to be added to the code.

## Publish to GitHub Pages

1. Extract the ZIP, then upload or commit its **contents** to the `main` branch of your GitHub repository. `index.html` should be visible at the top level of the repository, alongside `styles.css`, `script.js`, and the `assets` folder. Upload the extracted files, not the ZIP itself. Include `.github/workflows/deploy-pages.yml` and the `scripts` folder.
2. In the repository, open **Settings → Pages**. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open the **Actions** tab, choose **Deploy Heavenly Helpers**, then select **Run workflow → main → Run workflow**. Future commits to `main` publish automatically.
4. When the deployment completes, open **Settings → Pages** to find your website link.

The workflow installs no packages and needs no custom secrets or Firebase details. It checks the JavaScript, copies only the website and font-license files into `dist`, and publishes that folder. If the first workflow started before Pages was enabled, run it again after step 2.

GitHub hides dot-prefixed folders in some file pickers. If you cannot upload the workflow folder, use GitHub’s **Add file → Create new file**, name it `.github/workflows/deploy-pages.yml`, and copy the contents of the included workflow into it. All other files can be uploaded normally.

If your publishing branch is named something other than `main`, change both branch references in the workflow. GitHub Pages availability depends on your repository visibility and GitHub plan; use a public repository for a GitHub Free project.

Official documentation:

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Open it before publishing

Open `index.html` in your browser. The separate standalone preview from the previous version still shows the same page.

For an optional local server, run `npm run dev` and open `http://localhost:4173`. Node.js 18 or later is required only for the local server and packaging script. No `npm install` is needed.

## What changed

- `index.html` and its assets now sit at the repository root.
- An included GitHub Actions workflow deploys on commits to `main` or a manual run.
- `.nojekyll` keeps the website a plain static site if a branch-based workflow is used later.
- A dependency-free packaging script prepares the `dist` folder.
- Firebase Hosting now uses the same `dist` folder when you decide to use Firebase.

The homepage design, mobile layouts, service selection, FAQs, and animations are unchanged.

## Quote form

The form is in **preview mode**. It does not send or save requests. GitHub Pages hosts the homepage; it does not supply a form-processing backend. No database, email service, analytics, cookies, or local storage is connected.

Later, add a real HTTPS quote endpoint to `site-config.js`. The form will change to “Request My Free Quote.” The endpoint receives a JSON POST containing `name`, `email`, `service`, `details`, and `website` (an empty honeypot field). It must return a successful HTTP status and `{ "ok": true }` only after storing or delivering the request. Failed or unconfirmed responses produce an error message instead of a false success.

If the endpoint is on a different origin, configure CORS for the actual GitHub Pages or custom-domain origin. Validate inputs and protect against spam on the server. Confirm the business’s privacy notice before enabling collection. Do not place private keys or server credentials in website files.

## Firebase later

No Firebase project details have been entered. To deploy this edition later, run from the project folder:

```sh
npm run build
firebase login
firebase deploy --only hosting --project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` when ready. The included `firebase.json` publishes `dist`. The GitHub Actions workflow does not use Firebase.

Firebase documentation: https://firebase.google.com/docs/hosting/quickstart

## Edit the website

| File | What it controls |
| --- | --- |
| `index.html` | Homepage content, services, FAQs, and quote form |
| `styles.css` | Colors, type, layouts, and responsive styles |
| `script.js` | Mobile menu, service selection, form behavior, animations |
| `site-config.js` | Optional future quote endpoint |
| `assets/` | Local logo, photos, fonts, and font notices |
| `.github/workflows/deploy-pages.yml` | GitHub Pages deployment |
| `scripts/build-site.mjs` | Prepares website files in `dist` |
| `firebase.json` | Optional future Firebase Hosting settings |

Edit the root files; `dist` is regenerated by the packaging script. No custom domain has been configured.

## Content and assets

The service categories, descriptions, FAQs, and process are proposed content from the design. Confirm the actual services, service area, contact information, and operating policies before publishing. The photographs are generated decorative imagery, not customer jobs or pictures of the business’s team. No ratings, testimonials, prices, certifications, or insurance claims were invented.

Original Nimbus font files and their licenses are included in `font-source` and `FONT-LICENSES.txt`. The WOFF copies are format conversions, with no glyph changes.

## Verification status

The original homepage was visually checked on desktop, tablet, and phone layouts. This edition was checked for valid JavaScript, complete packaged assets, working local anchor targets, valid workflow structure, and path resolution at both a site root and a repository subpath. It has **not** been deployed to a GitHub repository from this conversation.
