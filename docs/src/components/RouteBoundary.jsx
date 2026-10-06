import { Component } from 'react'
import { reloadOnStaleChunk } from '../reloadOnStaleChunk'

// A page chunk that fails to load (usually: the tab predates the latest deploy) reloads the site once;
// anything else gets a message instead of a blank screen. Key it by pathname so navigating away resets it.
class RouteBoundary extends Component {
	state = { error: null }

	static getDerivedStateFromError(error) {
		return { error }
	}

	componentDidCatch(error) {
		reloadOnStaleChunk(error)
	}

	render() {
		if (!this.state.error) return this.props.children
		return (
			<div role="alert" className="py-16 text-center text-sm text-app-text">
				<p className="m-0">This page could not be loaded. The docs may have been updated.</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-3 border border-app-border bg-app-card px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong"
				>
					Reload
				</button>
			</div>
		)
	}
}

export default RouteBoundary
