# Sentence Repair Shop

Fix the broken grammar, save the factory!

## Deployment to GitHub Pages

This project is configured for automated deployment to GitHub Pages via GitHub Actions.

### Setup Instructions

1.  **Repository Settings**:
    *   Go to your GitHub repository **Settings** -> **Pages**.
    *   Under **Build and deployment** > **Source**, select **GitHub Actions**.

2.  **Environment Variables (Secrets)**:
    *   Go to **Settings** -> **Secrets and variables** -> **Actions**.
    *   Click **New repository secret**.
    *   Add `VITE_GEMINI_API_KEY` with your Google Gemini API key.
    *   *Note: Never share this key or commit it directly to the repository.*

3.  **Local Development**:
    *   Install dependencies: `npm install`
    *   Create a `.env.local` file and add your key: `VITE_GEMINI_API_KEY=your_key_here`
    *   Run dev server: `npm run dev`

### Deployment Flow

Every push to the `main` branch will trigger the deployment workflow:
1.  Code is checked out.
2.  Dependencies are installed.
3.  Project is built with `VITE_GEMINI_API_KEY` injected.
4.  `dist/index.html` is copied to `dist/404.html` (to support SPA routing).
5.  Built assets are uploaded to GitHub Pages.

## Troubleshooting

- **White screen on load**: Ensure the `base` path in `vite.config.ts` matches your GitHub repository name (currently set to `/sentence-repair-shop/`).
- **404 on refresh**: The `404.html` workaround handles most cases, but ensure the `base` path is correctly configured.
