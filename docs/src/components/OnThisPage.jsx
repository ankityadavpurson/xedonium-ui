import { useCallback, useEffect, useState } from 'react'
import exampleTitles from '../playground/exampleTitles'

const slugOf = text =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '') || 'section'

// Headings, the named tables of a props section, bold lead-ins of a Markdown paragraph ("**Branched timeline.** ...") and the examples
const collect = (root, names = []) => {
	const found = []
	const used = new Set()
	let examples = 0
	root.querySelectorAll('h2, h3[id], p > strong:first-child, [data-demo]').forEach(node => {
		let el = node
		let text = node.textContent.trim().replace(/[.:]$/, '')
		if (node.matches('[data-demo]')) {
			el = node.parentElement
			text = names[examples] ?? 'Example'
			examples++
		} else if (node.tagName === 'STRONG') {
			// named examples already say what the text above them introduces
			if (names.length || node.parentElement.firstChild !== node) return
			el = node.parentElement
		} else if (node.closest('[data-demo]')) return
		// the first props table is the component's own: "Props" already stands for it
		else if (node.tagName === 'H3' && node.parentElement.parentElement.querySelector('h3[id]') === node) return
		if (!text || (node.tagName === 'STRONG' && text.length > 60)) return
		if (!el.id) {
			let id = slugOf(text)
			for (let n = 2; used.has(id) || document.getElementById(id); n++) id = `${slugOf(text)}-${n}`
			el.id = id
			el.classList.add('scroll-mt-4')
		}
		used.add(el.id)
		found.push({ id: el.id, text, sub: node.tagName === 'H3' })
	})
	return found
}

/**
 * "On this page" contents for the docs: a list beside the content on wide screens, a column of ticks that opens a panel
 * on hover or focus below that. `rootRef` is the content it reads; `watch` (the route) rescans after navigation.
 */
const OnThisPage = ({ rootRef, watch }) => {
	const [entries, setEntries] = useState([])
	const [active, setActive] = useState('')

	useEffect(() => {
		const root = rootRef.current
		if (!root) return undefined
		let timer = 0
		const scan = () => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				// a component page names its examples (playground/exampleTitles.js)
				const [, , category, slug] = watch.split('/')
				const next = collect(root, exampleTitles[`${category}/${slug}`])
				setEntries(prev =>
					prev.length === next.length &&
					prev.every((entry, i) => entry.id === next[i].id && entry.text === next[i].text)
						? prev
						: next
				)
			}, 50)
		}
		scan()
		// pages and their examples load lazily
		const observer = new MutationObserver(scan)
		observer.observe(root, { childList: true, subtree: true })
		return () => {
			observer.disconnect()
			clearTimeout(timer)
		}
	}, [rootRef, watch])

	useEffect(() => {
		const scroller = rootRef.current?.closest('main')
		if (!scroller || entries.length === 0) return undefined
		const update = () => {
			const top = scroller.getBoundingClientRect().top + 24
			let current = entries[0].id
			for (const entry of entries) {
				const el = document.getElementById(entry.id)
				if (el && el.getBoundingClientRect().top <= top) current = entry.id
			}
			setActive(current)
		}
		update()
		scroller.addEventListener('scroll', update, { passive: true })
		return () => scroller.removeEventListener('scroll', update)
	}, [rootRef, entries])

	const go = useCallback(id => {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}, [])

	if (entries.length < 2) return null

	const list = (
		<ul className="m-0 flex list-none flex-col p-0">
			{entries.map(entry => (
				<li key={entry.id}>
					<button
						type="button"
						onClick={() => go(entry.id)}
						aria-current={entry.id === active ? 'location' : undefined}
						className={`-ml-px block w-full border-l py-1 ${entry.sub ? 'pl-6' : 'pl-3'} pr-2 text-left text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-app-strong ${
							entry.id === active
								? 'border-app-strong font-semibold text-app-text'
								: 'border-app-border text-app-muted hover:border-app-soft hover:text-app-text'
						}`}
					>
						{entry.text}
					</button>
				</li>
			))}
		</ul>
	)

	return (
		<aside aria-label="On this page" className="relative hidden w-0 shrink-0 min-[900px]:block xl:w-52">
			<div className="sticky top-0 max-h-[calc(100vh-6rem)] overflow-y-auto xl:max-h-[calc(100vh-4rem)]">
				<div className="hidden xl:block">
					<p className="m-0 mb-2 text-[10px] font-semibold uppercase tracking-widest text-app-muted">Contents</p>
					{list}
				</div>
				<div tabIndex={0} className="group absolute left-1 top-0 w-3 outline-none xl:hidden">
					<div className="flex flex-col items-end gap-2 py-2">
						{entries.map(entry => (
							<span
								key={entry.id}
								className={`h-0.5 ${entry.id === active ? 'w-3 bg-app-text' : 'w-2 bg-app-border'}`}
							/>
						))}
					</div>
					<div className="invisible absolute right-4 top-0 z-10 w-56 border border-app-border bg-app-card p-3 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
						<p className="m-0 mb-2 text-[10px] font-semibold uppercase tracking-widest text-app-muted">Contents</p>
						{list}
					</div>
				</div>
			</div>
		</aside>
	)
}

export default OnThisPage
