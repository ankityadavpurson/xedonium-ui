import { Component, useState } from 'react'
import CodeBlock, { CopyButton } from './CodeBlock'

// One broken demo should not take down the whole page
class DemoBoundary extends Component {
	state = { error: null }

	static getDerivedStateFromError(error) {
		return { error }
	}

	render() {
		if (this.state.error) {
			return (
				<p role="alert" data-demo-error className="m-0 text-sm text-red-700 dark:text-red-400">
					This example failed to render: {String(this.state.error.message ?? this.state.error)}
				</p>
			)
		}
		return this.props.children
	}
}

/** Rendered demo on top, with the exact source it was rendered from available below. */
const Example = ({ Demo, source }) => {
	const [open, setOpen] = useState(false)
	return (
		<div className="border border-app-border">
			<div data-demo className="overflow-x-auto bg-app-bg p-3 sm:p-6">
				<DemoBoundary>{Demo ? <Demo /> : <p className="m-0 text-sm">Missing example.</p>}</DemoBoundary>
			</div>
			<div className="flex items-center justify-between gap-2 border-t border-app-border bg-app-card px-3 py-2">
				<button
					type="button"
					aria-expanded={open}
					onClick={() => setOpen(o => !o)}
					className="-my-2 py-3 text-[10px] font-semibold uppercase tracking-widest text-app-muted transition hover:text-app-text sm:py-2"
				>
					{open ? 'Hide code' : 'Show code'}
				</button>
				{!open && source && <CopyButton text={source} />}
			</div>
			{open && source && <CodeBlock code={source} className="border-0 border-t" />}
		</div>
	)
}

export default Example
