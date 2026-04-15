# School LockDown System

A deployable React app based on the provided UI mockups.

## Included screens and interactions

- Login screen
- Dashboard
- Add Alerts modal
- Manage Alerts modal
- Modify Buildings modal
- Schedule page
- Settings page
- Event Logs page
- Modify Doors page
- Campus Map modal with zoom controls
- Lockdown confirmation flow that updates alerts, buildings, logs, and door counts

## Run locally

```bash
npm install
npm run dev
```

## Build locally

```bash
npm install
npm run build
```

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this project.
3. Push to the `main` branch.
4. In GitHub, open **Settings > Pages**.
5. Under **Build and deployment**, choose **GitHub Actions**.
6. The included workflow at `.github/workflows/deploy.yml` will build and publish the site.
7. After the workflow completes, GitHub will provide a public Pages URL.

The workflow automatically sets the Vite base path to the repository name so it works on GitHub Pages without manual edits.

## Notes

- This is a front-end prototype with mocked data and state.
- No real authentication or backend is included.
- Images are packaged locally in `public/`.
