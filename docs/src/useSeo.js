import { useEffect } from 'react'
import { seoFor } from './seo'

// Finds the head element or adds it, so the static tags in index.html and the ones set here never double up
const headTag = (selector, tag, attributes) => {
	let element = document.head.querySelector(selector)
	if (!element) {
		element = document.createElement(tag)
		Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
		document.head.appendChild(element)
	}
	return element
}

/** Keeps the description, canonical URL, og:url and robots meta in step with the current route. */
const useSeo = pathname => {
	useEffect(() => {
		const { description, canonical, indexable } = seoFor(pathname)
		headTag('meta[name="description"]', 'meta', { name: 'description' }).setAttribute('content', description)
		headTag('meta[property="og:description"]', 'meta', { property: 'og:description' }).setAttribute(
			'content',
			description
		)
		headTag('meta[name="twitter:description"]', 'meta', { name: 'twitter:description' }).setAttribute(
			'content',
			description
		)

		const robots = document.head.querySelector('meta[name="robots"]')
		if (indexable) robots?.remove()
		else headTag('meta[name="robots"]', 'meta', { name: 'robots' }).setAttribute('content', 'noindex')

		const link = document.head.querySelector('link[rel="canonical"]')
		if (canonical) {
			headTag('link[rel="canonical"]', 'link', { rel: 'canonical' }).setAttribute('href', canonical)
			headTag('meta[property="og:url"]', 'meta', { property: 'og:url' }).setAttribute('content', canonical)
		} else link?.remove()
	}, [pathname])
}

export default useSeo
