# Repro — `forcePrefix` opt-out missing on `Link` / `useRouter`

Minimal reproduction:
**`forcePrefix` is exposed on `redirect()` (since 4.1.0) but not on `Link` or
`useRouter`. With `output: 'export'` + `localePrefix: 'as-needed'`, switching
to the default locale via `Link`/`useRouter` produces a prefixed URL that
does not exist in the export, with no userland opt-out.**

## Versions

- `next` 16.2.6
- `next-intl` 4.12.0
- `react` 19.2.0

## Setup

```bash
npm install
npm run build   # next build → static export to ./out
npm run dev     # or: serve the build locally to see the 404
```

## Project structure

Static routes only — no `[locale]` segment, no middleware:

```
src/app/
  (en)/
    layout.tsx          # <html lang="en">, setRequestLocale('en')
    page.tsx            # /            (en home)
    about/page.tsx      # /about       (en about)
  (sv-se)/
    layout.tsx          # <html lang="sv-se">, setRequestLocale('sv-se')
    sv-se/
      page.tsx          # /sv-se       (sv-se home)
      about/page.tsx    # /sv-se/about (sv-se about)
```

`next-intl` config:

```ts
// src/i18n/routing.ts
defineRouting({
  locales: ['en', 'sv-se'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeCookie: false
});
```

```js
// next.config.js
{ output: 'export' }
```

## What the static export emits

`next.config.js` uses `trailingSlash: true` (GitHub Pages friendly), so:

```
out/
  index.html                 ← /         (en)
  about/index.html           ← /about    (en)
  sv-se/index.html           ← /sv-se
  sv-se/about/index.html     ← /sv-se/about
```

There is **no** `out/en/about/index.html`. With `localePrefix: 'as-needed'`
the default-locale routes live at the unprefixed paths, and the project is
deliberately authored that way (no `[locale]` segment, no middleware to
rewrite `/about` → `/en/about`).

## The bug

`src/components/LocaleSwitcher.tsx` does the obvious thing:

```tsx
<Link href={pathname} locale={locale}>{t(locale)}</Link>
router.push(pathname, {locale});
```

On `out/sv-se/about/index.html`, the rendered hrefs are:

```bash
$ grep -oE 'href="[^"]*"' out/sv-se/about/index.html | sort -u
href="/en/about/"      ← EN switcher — does not exist in the export → 404
href="/sv-se/"
href="/sv-se/about/"
```

Expected `href="/about/"`. The same shows on `out/about/index.html`, where the
EN self-link is `href="/en/about/"` instead of `href="/about/"`.

A live demo is deployed to GitHub Pages via the workflow in
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml); click the
"English" locale link on the Swedish about page and you'll get a Pages 404.

## Root cause

`<Link locale="...">` and `useRouter().push/replace/prefetch` force
`forcePrefix: true` internally whenever `locale` is set, with no way to
override from userland. `redirect()` exposes `forcePrefix` since 4.1.0
(PR #1865); the navigation APIs do not.

## Why the existing guidance doesn't cover this case

Prior discussion (#1791) recommended dropping the `locale` prop and letting
middleware rewrite `/en/...` → `/...` while keeping the locale cookie in sync.
That doesn't apply here:

- `output: 'export'` — no middleware runs.
- The prefixed default-locale path (`/en/about`) is not in the export at all.
- `localeCookie: false` — there is no cookie to defeat.

So the forced prefix has no upside in this configuration; it only breaks
locale-switch navigation.

## Proposed fix

Mirror the `redirect()` change for `Link` and
`useRouter().push/replace/prefetch` — accept an opt-in `forcePrefix` so
`<Link href="/about" locale="en" forcePrefix={false}>` renders
`<a href="/about">`.
