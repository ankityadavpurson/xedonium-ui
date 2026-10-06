// Each deploy renames every hashed chunk, so a tab opened before the latest deploy asks for files that no longer
// exist. Reloading once picks up the new index.html; the sessionStorage flag stops a reload loop if the cause is
// something else (e.g. a real network outage).
const KEY = 'xedonium-docs-chunk-reload'
const STALE =
	/Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i

export const isStaleChunkError = error => STALE.test(String(error?.message ?? error))

/** Reloads the page once for a stale-chunk error. Returns true when a reload was started. */
export const reloadOnStaleChunk = error => {
	if (!isStaleChunkError(error)) return false
	try {
		if (sessionStorage.getItem(KEY)) return false
		sessionStorage.setItem(KEY, '1')
	} catch {
		return false
	}
	window.location.reload()
	return true
}

/** Clears the guard once the page has loaded fine, so the next deploy can trigger a reload again. */
export const clearChunkReloadGuard = () => {
	try {
		sessionStorage.removeItem(KEY)
	} catch {
		// storage unavailable; nothing to clear
	}
}
