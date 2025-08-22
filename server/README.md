# PDF Export Server (Puppeteer)

## Run locally

```bash
cd server
npm i
npm start
```

- Default client origin: http://localhost:5173
- API endpoint: POST http://localhost:3000/api/export/pdf

## How it works
- Server launches headless Chromium, opens your front-end `/print` page
- Waits for fonts to load and `print` media CSS to apply
- Renders A4 PDF with background

## Env
- `CLIENT_ORIGIN` (default http://localhost:5173)
- `PRINT_URL` (default `${CLIENT_ORIGIN}/print`)

## Request payload
```json
{
  "filename": "简历.pdf",
  "query": { "rid": "<optional saved resume id>" },
  "snapshot": {
    "resumeData": { /* optional */ },
    "selectedTemplate": "modern",
    "templateSettings": { },
    "globalSettings": { }
  }
}
```

If `snapshot` is present, the server injects it into `localStorage` before visiting `/print`.

