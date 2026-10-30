// Server entry for the build-time prerender (see ../prerender.mjs): renders a docs route to an HTML string.
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { ThemeProvider } from 'xedonium'
import App from './App'
import { seoPages } from './seo'

/** Every indexable route: { path, title, description }. */
export const routes = () => seoPages()

/** The markup of one route, once every lazy page and example in it has loaded. */
export const render = url =>
	new Promise((resolve, reject) => {
		let html = ''
		const sink = new Writable({
			write(chunk, _encoding, done) {
				html += chunk.toString()
				done()
			},
		})
		sink.on('finish', () => resolve(html))
		const { pipe } = renderToPipeableStream(
			<ThemeProvider storageKey="xedonium-docs-theme" favicon allowSystem>
				<StaticRouter location={url}>
					<App />
				</StaticRouter>
			</ThemeProvider>,
			{
				onAllReady: () => pipe(sink),
				onShellError: reject,
				onError: error => console.warn(`[prerender] ${url}: ${error?.message ?? error}`),
			}
		)
	})
