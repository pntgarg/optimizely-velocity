# optimizely-velocity

A Next.js frontend for Optimizely CMS (SaaS). Content types are defined in code, synced to the CMS with the Optimizely CLI, and loaded from Optimizely Graph by URL.

The public route currently prints the Graph content for that URL as JSON. React components for each type live beside their models and are registered for rendering and preview.

## Requirements

- Node.js `22.12` or `24`
- npm
- An Optimizely CMS instance with Content Graph enabled

## Project setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in `.env`. The values come from the CMS admin site.

| Variable | Where to find it |
| --- | --- |
| `OPTIMIZELY_CMS_URL` | The CMS instance URL, for example `https://your-instance.cms.optimizely.com/` |
| `OPTIMIZELY_GRAPH_SINGLE_KEY` | **Settings → API Keys**. This key is used by the running site to read Graph. |
| `OPTIMIZELY_CMS_CLIENT_ID` | **Settings → API Keys → Create API key**. Used by `npm run config:push`. |
| `OPTIMIZELY_CMS_CLIENT_SECRET` | Shown once when that API key is created. |
| `APPLICATION_HOST` | The public URL of this frontend, with `https` and no trailing slash. For local development that is `https://localhost:3000`. |
| `OPTIMIZELY_GRAPH_GATEWAY` | Optional. Defaults to `https://cg.optimizely.com/content/v2`. |

`APPLICATION_HOST` must match the host stored on published content (`_metadata.url.base`). A page published under a different host will not be found, and `/` returns 404.

### 3. Give the CLI API key permission to create content

`npm run config:push` creates the optimizely-velocity application and a Home start page. The CMS client needs **Create** on the content root.

1. Open **Settings → Set Access Rights**.
2. Select the root.
3. Turn on **Apply settings for all subitems**.
4. Add the API key and grant full access, including **Create**.
5. Save.

### 4. Sync content types to the CMS

```bash
npm run config:push
```

This reads `optimizely.config.mjs` and every `components/**/model.ts` file, then uploads content types, display templates, the `en` locale, and the `optimizely-velocity` website application. The application host in that file is `localhost:3000`.

The command also tries to create a content item named `home` (`StartPage`) and use it as the application entry point. If that step is forbidden, the types may already be uploaded. Fix the access rights above and run the command again.

### 5. Publish a page in the CMS

Create or open a page in the CMS, set its URL, and publish it. The home page URL should be `/`. Other pages use their URL segment, such as `/about-us`.

Drafts are available through CMS preview. The public site only loads published content.

### 6. Start the site

Port `3000` must be free. The dev script serves HTTPS:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000). The certificate is self-signed, so the browser asks you to continue.

`/` loads the published page whose path is `/` and prints its JSON. A path with no published item returns 404.

CMS preview opens `/preview` with the content key, version, locale, and preview token.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | HTTPS dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run config:push` | Upload models and the optimizely-velocity application to the CMS |
| `npm run deploy` | Deploy the frontend with `optimizely-cms-cli deploy` |

## How a content type is organized

Each CMS type has its own folder. The model is the content type definition. The other file is the React view.

```
components/pages/Standard/model.ts
components/pages/Standard/Standard.tsx
```

`lib/initialization.ts` registers both:

- `initContentTypeRegistry` so Graph queries include the type
- `initReactComponentRegistry` so the SDK can resolve the React component

The registry key must be the CMS content type key. `NewsPage` is registered as `NewsPage2` because that is the key in `components/pages/News/model.ts`.

`optimizely.config.mjs` discovers models from `./components/**/model.ts`. Display templates that still live in `.tsx` files are included by the `**/*.tsx` glob.

Blank Experience and Blank Section do not have a local `model.ts`. Those content types come from `@optimizely/cms-sdk`.

### Add an experience

1. Create `components/pages/LandingPage/model.ts` with `contentType({ key: 'LandingPage', baseType: '_experience', ... })`.
2. Create `components/pages/LandingPage/LandingPage.tsx` and render `content.composition.nodes` with `OptimizelyComposition`.
3. Import the model and the component in `lib/initialization.ts`.
4. Add `LandingPage` to `initContentTypeRegistry`.
5. Add `LandingPage: LandingPageComponent` to `initReactComponentRegistry`.
6. Run `npm run config:push`.
7. In the CMS, create a **Landing Page**, set the URL segment, add sections and blocks, and publish.
8. Open `https://localhost:3000/<url-segment>`.

Pages, sections, and blocks follow the same folder pattern. Use `baseType: '_page'`, `'_section'`, or `'_component'` instead of `'_experience'`.

## What is included

| Area | Types |
| --- | --- |
| Pages | Start Page, Standard Page, Product Page, News Page, Blank Experience |
| Sections | Hero, Blank Section |
| Blocks | Eyebrow, News list, Event cards list |
| Elements | Heading, Rich text, Image, Image card, Video, Button, Horizontal ruler, Teaser card, Event card |

OptiForms is registered only for the types this Graph schema contains: container, text box, text area, submit, condition, and dependency rule. Number, range, URL, choice, selection, and reset are omitted because querying them makes Graph reject the whole page.

## Troubleshooting

**`/` or a known URL returns 404.** The page is unpublished, its URL path does not match the browser path, or `APPLICATION_HOST` does not match the content host. Restart `npm run dev` after changing `.env`.

**`config:push` fails while creating `home`.** The CLI API key does not have **Create** on the content root. See step 3.

**Graph returns unknown `OptiForms*` types.** A page query included a form type that is not in this CMS. Keep the form registration in `lib/initialization.ts` limited to types that exist in Graph.

**`npm run dev` says another Next.js server is already running, or port 3000 is taken.** Stop the other `next dev` process and start again. This app is meant to listen on `https://localhost:3000`.

**The browser warns about the certificate.** That is the local self-signed certificate from `--experimental-https`. Continue to the site.

**Images are missing.** A browser extension can block them. Disable content blockers such as Ghostery and reload.
