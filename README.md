# HappyFox Connector Logo Generator

An internal engineering utility to generate production-ready integration/connector logos for HappyFox integration cards. It ensures all output logos comply with deterministic Figma rules, handles background removal, and exports optimized SVG files.

## 🚀 What It Does

The HappyFox Integration Card Specification requires logos in two sizes:
1. **Large Logo (`150×150` Viewport)**: Used on integration listing and detail cards. Safe area is `112×112` with a `19px` outer padding.
2. **Small Logo (`56×56` Viewport)**: Used for mini logo badges. Safe area is `48×48` with a `4px` outer padding.

This tool simplifies the process by performing the following operations fully in-browser:
- **Automatic Background Removal**: Uses canvas analysis to detect solid background colors (e.g. white/light grey) and make them transparent.
- **Canvas-based Content Bounds Detection**: Trims arbitrary outer padding to isolate the actual logo artwork boundaries.
- **Deterministic Aspect Ratio Fitting**: Scales the cropped artwork to fit perfectly inside the designated Figma safe areas (`112×112` for large, `48×48` for small) while preserving the original aspect ratio.
- **Centering & Alignment**: Automatically centers the scaled artwork horizontally and vertically.
- **Interactive Specs Preview**: Renders overlay guidelines representing the Figma viewports and safe areas to verify compliance visually.
- **ZIP Export**: Bundles the generated `150x150` and `56x56` SVG assets into a single ZIP file named using standard HappyFox slug formats.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React (icons), Motion (animations), JSZip (exporting).
- **Build System**: Vite 6.
- **Development Web Server**: Express with Vite dev middleware for single-command hosting.

---

## 💻 Local Development

### Prerequisites

- **Node.js**: Version 18 or newer (v20+ recommended).
- **npm**: Standard Node package manager.

### Running the App

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables (Optional)**:
   Copy `.env.example` to `.env` (or `.env.local` for local overrides):
   ```bash
   cp .env.example .env
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will run locally and be accessible at:
   - Default: `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

4. **Build for production**:
   ```bash
   npm run build
   ```
   This will bundle the React app inside the `dist` folder and transpile `server.ts` into a production-ready Node script (`dist/server.cjs`).

5. **Start production server locally**:
   ```bash
   npm run start
   ```

---

## 📦 Production Deployment & Hosting

The app is fully client-side and optimized for deployment.

### Deploying to Vercel (Recommended)

Since the core logo processing is handled entirely client-side, this project can be hosted as a **Static Project** on Vercel:

1. Connect your GitHub/GitLab repository to Vercel.
2. Configure the project settings on Vercel:
   - **Framework Preset**: `Vite` (or `Other` / No Preset).
   - **Build Command**: `vite build` (or `npm run build` if you want the Express script built).
   - **Output Directory**: `dist`
3. Click **Deploy**. Vercel will host the frontend statically on their CDN.

---

## ⚠️ Important Guidelines

### 🔄 Logo Update Versioning
When updating an existing connector logo, **do not reuse the exact same file name** (e.g. `iru-logo.svg`). Reusing the same name leads to browser and CDN caching issues where users continue to see the old cached logo.
Instead, use versioning:
- **Example**: If `iru-logo.svg` already exists in production, name the new update `iru-logo-v1.svg`.
