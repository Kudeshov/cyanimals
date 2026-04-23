# Cyprus Cats — static site package

## What is included
- `index.html` — single-page site
- `incidents.json` — all incident cards are stored here
- `assets/css/styles.css` — styles
- `assets/js/app.js` — language switching, maps, rendering, form submit
- `incidents/<incident-id>/` — optional folders for incident photos
- `PROMPT_TEMPLATE.md` — prompt for adding a new card with AI help

## Language behavior
The site automatically selects language based on browser settings:
- `ru*` -> Russian
- `en*` -> English
- `el*` -> Greek
- fallback -> Russian

The visitor can switch language manually. The choice is saved in `localStorage`.

## How to connect Web3Forms
1. Create a key in Web3Forms.
2. Open `index.html`.
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key.
4. Upload the whole folder to hosting.

## How to add a new incident manually
1. Copy an existing object in `incidents.json`.
2. Change these fields:
   - `id`
   - `city`
   - `district`
   - `type` (`shooting`, `poisoning`, `other`)
   - `status` (`reported`, `pending`, `confirmed`)
   - `date`
   - `lat`, `lng`
   - `title.ru`, `title.en`, `title.el`
   - `summary.ru`, `summary.en`, `summary.el`
   - `description.ru`, `description.en`, `description.el`
3. If there are photos, create a folder like:
   - `incidents/new-incident-id/`
4. Put image files there, for example:
   - `incidents/new-incident-id/c1_1.jpg`
   - `incidents/new-incident-id/c1_2.jpg`
5. Add paths to the `images` array:
   - `"images": ["incidents/new-incident-id/c1_1.jpg", "incidents/new-incident-id/c1_2.jpg"]`

## Personal data rule
Do not publish:
- full private addresses
- phone numbers
- names of private individuals unless you have permission and legal grounds

Use approximate map coordinates when needed.
