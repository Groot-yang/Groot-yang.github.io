# Personal website content

The primary pages use `_layouts/profile.html` and `assets/css/profile.css`, independently of the legacy Academic Pages archive styles.

| Page | English | Chinese |
| --- | --- | --- |
| About | `/` | `/zh/` |
| Research | `/publications/` | `/zh/publications/` |
| CV | `/cv/` | `/zh/cv/` |
| Talks | `/talks/` | `/zh/talks/` |

- Edit `_data/profile.yml` for biography, education, research, publications, projects, patents, and academic service. It uses JSON syntax, which is valid YAML. `en` and `zh` values contain the two language versions.
- Edit `_data/profile_ui.yml` for navigation and interface labels.
- Publication groups are `journal`, `review`, `working`, and `conference`. Homepage cards are ordered by `highlights`, with `selected` kept in sync for the selected paper records. Author-role labels are separate from review status.
- Publication titles remain in their original language. The 2027 journal issue year follows the supplied CV and is explicitly annotated. Review stages are a snapshot of the supplied CV, not automatically updated.
- Both language versions are static, with matching canonical and hreflang links. Navigation does not require JavaScript. JavaScript only enables the CV print action; printed CVs include the publication list.
- The legacy `_publications` URLs remain available. If an existing paper changes status or title, also update its legacy record.

Build with the repository's existing Jekyll workflow (`bundle exec jekyll build`). No new production dependencies are required.

Local validation: all eight primary routes were rendered with LiquidJS and checked in headless Edge at 320, 390, 768, and 1440 px, including language switching, internal links, publication counts, no-JavaScript navigation, and print styles. A native Jekyll build was not run because Ruby/Bundler is unavailable in the editing environment.

Design: a restrained personal website with a small portrait, a concise introduction, research summaries, and links to publication and talk pages. Full academic records live on separate pages. Keep the white background and avoid decorative cards or promotional headlines. Only the current affiliation is stored in the public profile and education data. Do not restore previous education or visiting affiliations. Do not include advisor names or supervision relationships in biographies or education entries; publication author lists remain accurate. The alternate CV route redirects to `/cv/`.

Typography uses self-hosted Source Serif 4 and a Noto Serif CJK subset for headings, with Source Sans 3 for body text. See `assets/fonts/README.md` for licenses and subset maintenance. Research navigation and sections list under-review manuscripts first in both languages.

Each representative paper has a real photograph selected for its study context, stored alongside its paper ID in `profile.yml` (`highlights.image`, localized `image_alt`, and `image_credit`). The same mapping is used for homepage highlights and the publication list. Research directions remain text-only. Photos are contextual stock photography, not photographs of the researcher’s own systems, participants, or experimental results. Source links and licenses are recorded in [photo credits](assets/images/PHOTO_CREDITS.md). Keep the compact 4:3 thumbnails and local image files; do not replace them with generated illustrations.

Homepage highlights and research thumbnails prioritize the two manuscripts at UTD journals (Management Science and MIS Quarterly), followed by the three ICIS papers. Keep manuscript revision stages visible and preserve the under-review section first. Other publications remain in the full text list. Papers on the same topic reuse the same photograph.
