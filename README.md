# adityagovindaraj.github.io

Personal website of **Aditya G** — SEBI-Registered Investment Adviser and
Certified Financial Planner in Chennai, India.

Live site: <https://adityagovindaraj.github.io>

## Tech

Hand-authored **static site** (semantic HTML + one CSS design system + a small
vanilla-JS enhancement), served by **GitHub Pages** from the `master` branch.
No build step, no framework, no backend, no external runtime dependencies —
fonts, styles, scripts, and images are all self-hosted.

```
index.html              Home (single-page portfolio)
resume.html             Full résumé
now.html                /now page
books.html              Reading list
media.html              Films & television
advisory/fiduciary.html SEBI advisory & compliance (Investor Charter, disclosures)
404.html                Not-found page
assets/
  css/main.css          Design system (tokens, layout, components)
  js/main.js            Nav, scroll-reveal, active-section (progressive enhancement)
  fonts/                Self-hosted Fraunces + Inter (woff2, latin subset)
  img/aditya.jpg        Portrait
  favicon.svg
robots.txt · sitemap.xml · _config.yml
```

## Local preview

Any static file server works, for example:

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## Deploy (GitHub Pages)

Push to `master`; GitHub Pages serves the site directly.

```bash
git add -A
git commit -m "Redesign: accessible, minimal editorial portfolio"
git push origin master
```

In the repository: **Settings → Pages → Build and deployment → Source:
Deploy from a branch → `master` / `(root)`**.

## Accessibility

Built toward **WCAG 2.2 Level AA**: semantic landmarks, skip link, visible
focus states, keyboard-operable navigation, AA-contrast color tokens (light and
dark), descriptive alt text and link text, and `prefers-reduced-motion` support.
This reflects implemented improvements, not a formal third-party audit.
