Use this prompt to ask an AI assistant to add a new incident card.

---

Add a new incident card to the Cyprus Cats static website.

Requirements:
1. Edit `incidents.json`.
2. Keep the site single-page and do not change the general layout.
3. Create one new incident object.
4. Remove personal data from the source text:
   - remove full names of private individuals unless explicitly allowed,
   - remove phone numbers,
   - remove exact private home addresses,
   - keep only city / district / approximate location.
5. Fill these fields:
   - `id`
   - `city`
   - `district`
   - `type` = `shooting`, `poisoning`, or `other`
   - `status` = `reported`, `pending`, or `confirmed`
   - `date`
   - `lat`, `lng` using approximate coordinates
   - `approximate` = true if exact location should not be shown
   - `title.ru`, `title.en`, `title.el`
   - `summary.ru`, `summary.en`, `summary.el`
   - `description.ru`, `description.en`, `description.el`
   - `images` array
6. If I provide image file names, add them as relative paths like:
   - `incidents/<incident-id>/c1_1.jpg`
7. Keep Russian as the source/original text version. English and Greek should be translations.
8. Do not invent facts that are not in the source text. If something is uncertain, write it neutrally.
9. Keep the tone factual and suitable for public reporting.

Source incident text:

[PASTE INCIDENT TEXT HERE]

Optional image files:

[PASTE IMAGE FILE NAMES HERE]

---
