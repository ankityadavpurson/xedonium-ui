import { useEffect, useState } from 'react'
import { version as bundled } from './version'

const URL = 'https://registry.npmjs.org/xedonium/latest'
const KEY = 'xedonium-docs-latest-version'
const SEMVER = /^\d+\.\d+\.\d+/

let pending // one request shared by every component on the page

const readCache = () => {
	try {
		return sessionStorage.getItem(KEY)
	} catch {
		return null
	}
}

const fetchLatest = () => {
	pending ??= fetch(URL)
		.then(res => (res.ok ? res.json() : null))
		.then(data => {
			const latest = data?.version
			if (typeof latest !== 'string' || !SEMVER.test(latest)) return null
			try {
				sessionStorage.setItem(KEY, latest)
			} catch {
				// storage unavailable; the next page load simply asks again
			}
			return latest
		})
		.catch(() => null)
	return pending
}

/**
 * The newest published version of xedonium. Starts with the version bundled at build time
 * (the docs build runs before the release bump, so it can be one behind) and swaps in the
 * npm registry's `latest` once it loads. Offline or blocked requests keep the bundled value.
 */
export const useLatestVersion = () => {
	const [version, setVersion] = useState(() => readCache() ?? bundled)

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
