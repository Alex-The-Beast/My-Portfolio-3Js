
# My-Portfolio-3Js

React + Vite portfolio with Notion-backed learning updates.

## Content Architecture

The site now follows this flow:

Notion CMS -> Cloudflare Pages Function `/api/updates` -> Cloudflare KV `CONTENT_CACHE` -> React + Vite on Cloudflare Pages -> users.

`src/data/learningUpdates.js` remains as a static fallback and can still be refreshed with `npm run sync:notion`, but the live site reads from `/api/updates` first.

## Cloudflare Setup

1. Create a Notion internal integration and share the updates database with it.
2. Add these Cloudflare Pages environment variables:
   - `NOTION_TOKEN`
   - `NOTION_DATA_SOURCE_ID` or `NOTION_DATABASE_ID`
   - optional property mappings from `.env.example`
   - `CONTENT_CACHE_TTL_SECONDS`, defaults to `300`
3. Create a Cloudflare KV namespace and bind it to the Pages project with the variable name `CONTENT_CACHE`.
4. Build command: `npm run build`
5. Build output directory: `dist`

You can configure the KV binding from the Cloudflare dashboard under Workers & Pages -> your Pages project -> Settings -> Bindings, or paste the namespace IDs into `wrangler.toml`.

## Local Development

Run the Vite frontend:

```bash
npm run dev
```

To test the Pages Function locally, build first and run Wrangler with a local KV binding:

```bash
npm run build
npx wrangler pages dev dist --kv CONTENT_CACHE
```
