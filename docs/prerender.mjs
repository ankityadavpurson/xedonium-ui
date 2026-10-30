// Runs after the docs build (see the `docs:build` script): renders every docs page to static HTML, so each URL answers
// with its content, title and description before any JavaScript runs (search engines, link previews, slow connections).
// The browser still starts the app on top of it, replacing the markup. Pages are written next to the build as
// <route>.html (the home page as index.html), which Firebase Hosting serves at the clean URL (`cleanUrls` in firebase.json).
// React's production build for the render: no development-only warnings
process.env.NODE_ENV = 'production'

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = import.meta.dirname
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const SITE = 'https://xedonium-ui.web.app'

const { render, routes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
	throw new Error('dist/index.html is already prerendered: run the docs build again (it starts from an empty dist)')
}

const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const setMeta = (html, attribute, name, value) =>
	html.replace(
		new RegExp(String.raw`(<meta\s+${attribute}="${name}"\s+content=")[^"]*(")`),
		(_, a, b) => `${a}${escape(value)}${b}`
	)

const page = ({ path: route, title, description }, markup) => {
	const heading = title ? `${title} · Xedonium` : 'Xedonium'
	const url = SITE + (route === '/' ? '/' : route)
	let html = template.replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
	html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escape(heading)}</title>`)
	html = setMeta(html, 'name', 'description', description)
	html = setMeta(html, 'property', 'og:description', description)
	html = setMeta(html, 'name', 'twitter:description', description)
	html = setMeta(html, 'property', 'og:url', url)
	if (title) {
		html = setMeta(html, 'property', 'og:title', heading)
		html = setMeta(html, 'name', 'twitter:title', heading)
	}
	return html.replace('</head>', () => `\t<link rel="canonical" href="${url}" />\n\t</head>`)
}

const started = Date.now()
const list = routes()
for (const entry of list) {
	const file = entry.path === '/' ? 'index.html' : `${entry.path.slice(1)}.html`
	const target = path.join(dist, file)
	fs.mkdirSync(path.dirname(target), { recursive: true })
	fs.writeFileSync(target, page(entry, await render(entry.path)))
}
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${list.length} pages in ${((Date.now() - started) / 1000).toFixed(1)}s`)
