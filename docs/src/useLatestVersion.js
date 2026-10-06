import { useEffect, useState } from 'react'
import { version as bundled } from './version'

const URL = 'https://registry.npmjs.org/xedonium/latest'
const SEMVER = /^\d+\.\d+\.\d+/

let pending // one request shared by every component on the page

const fetchLatest = () => {
	pending ??= fetch(URL)
		.then(res => (res.ok ? res.json() : null))
		.then(data => (typeof data?.version === 'string' && SEMVER.test(data.version) ? data.version : null))
		.catch(() => null)
	return pending
}

/**
 * The newest published version of xedonium. Starts with the version bundled at build time
 * (the docs build runs before the release bump, so it can be one behind) and swaps in the
 * npm registry's `latest` once it loads. Offline or blocked requests keep the bundled value.
 */
export const useLatestVersion = () => {
	const [version, setVersion] = useState(bundled)

	useEffect(() => {
		let active = true
		fetchLatest().then(latest => {
			if (active && latest) setVersion(latest)
		})
		return () => {
			active = false
		}
	}, [])

	return version
}
