# Website fonts

Self-hosted fonts, all under the SIL Open Font License 1.1. No Google Fonts requests are made by visitors.

- Source Sans 3 Regular and Semibold: https://github.com/adobe-fonts/source-sans/tree/release/WOFF2/TTF
- Source Serif 4 Regular: https://github.com/adobe-fonts/source-serif/tree/release/WOFF2/TTF
- Academic Serif SC: renamed character subset of Noto Serif CJK SC Regular, https://github.com/notofonts/noto-cjk/tree/main/Serif/OTF/SimplifiedChinese

Licenses are stored beside the font files. The CJK subset covers the non-ASCII characters in the profile data at the time of this update. If new Chinese headings are introduced, regenerate the subset from the upstream font; absent glyphs fall back to the platform serif font. Body Chinese uses the platform sans-serif font.

Typography: body 18px on desktop, 16px on mobile; publication titles 18px / 16px; major section headings 26px / 24px. Headings use Source Serif 4 and Academic Serif SC; body and interface text use Source Sans 3 with Chinese system fallbacks.

Spacing: body and biography line-height 1.55, publication titles 1.4, publication metadata 1.45. Paragraph gaps are 10px; publication entries are separated by 20px.
