# School Lockdown System (Local Host Package)

This package is prepared for local hosting with Vite.

## Run locally

1. Open a terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Build for local production use

```bash
npm run build
npm run preview
```

## Replace your old version with this one

If you already have an older project folder:

1. Back up your old folder.
2. Delete these old items from that project:
   - `src/`
   - `public/`
   - `package.json`
   - `index.html`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
3. Copy the files from this package into the project folder.
4. Run:
   ```bash
   npm install
   npm run dev
   ```

## Map asset

The campus map is included as a local file in:

- `public/campus-map.png`

That means it should work when hosted locally without relying on the canvas preview.
