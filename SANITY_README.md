# Sanity CMS Integration

This project has been updated to use Sanity CMS as a Headless CMS for website content (Homepage, About, Contact, Footer, Navbar, Policies, Blog).
The existing Express backend remains untouched and continues to manage Authentication, Products, Orders, Categories, Coupons, Payments, and the Admin Dashboard.

## Architecture

```
React (Frontend)
    │
    ├─► Sanity Content Lake (For Website Content)
    │
    └─► Express API (For Products, Orders, Auth, etc)
          │
          ▼
       MongoDB
```

## How to Start Sanity Studio locally

1. Open a new terminal.
2. Navigate to the `cms` folder:
   ```bash
   cd cms
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the Sanity Studio dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3334`. You can log in using your Sanity credentials to manage the website content.

## How Editors Can Change Content

Once logged into the Sanity Studio (`http://localhost:3334`), editors will see a dashboard with all the content types (Homepage, About Page, Blog Posts, Navbar, etc.).

1. Click on the document you want to edit (e.g., "Homepage").
2. The form will show all editable fields (Hero image, headings, SEO settings, etc.).
3. After making changes, click the **"Publish"** button in the bottom right corner.
4. The React frontend will immediately reflect the changes on the live website (no code deployment required).

## How to Deploy Sanity

When you are ready to deploy the Studio so editors can access it online without running it locally:

1. Inside the `cms` folder, run:
   ```bash
   npm run deploy
   ```
2. Sanity will prompt you to choose a hostname (e.g., `vogue-cms.sanity.studio`).
3. Your editors can now access the CMS at `https://vogue-cms.sanity.studio` from anywhere.

## Connecting to Production

The frontend uses environment variables to connect to Sanity. 

In your `client/.env` file:
```
VITE_SANITY_PROJECT_ID=2tou8b90
VITE_SANITY_DATASET=production
```

When you deploy your React app (e.g., to Vercel or Netlify), simply add these same variables to your deployment environment settings. Sanity's content lake is already hosted in the cloud, so your production app will automatically fetch the live data!

**Note:** Ensure your production domain is added to the Sanity project's CORS origins. You can do this via the Sanity CLI (`sanity cors add https://yourdomain.com`) or from the Sanity manage dashboard (manage.sanity.io).
