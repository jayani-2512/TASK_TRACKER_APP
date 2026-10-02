# TaskFlow

A small task tracker built with plain HTML, CSS and JavaScript. No build step, no dependencies. Tasks are saved in the browser's localStorage.

## Files

- `index.html` page structure
- `style.css` styling, including dark mode
- `app.js` app logic

## Run locally

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy to Vercel

### Option A: via GitHub (recommended)

1. Put these files in a new GitHub repository and push.
2. Go to vercel.com, sign in with GitHub, and click **Add New → Project**.
3. Import the repository.
4. Leave Framework Preset as **Other**. Leave Build Command and Output Directory empty.
5. Click **Deploy**. You get a live `*.vercel.app` URL in about 30 seconds.

Every `git push` to the main branch redeploys automatically.

### Option B: via CLI

```
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Run these from the folder containing `index.html`.
