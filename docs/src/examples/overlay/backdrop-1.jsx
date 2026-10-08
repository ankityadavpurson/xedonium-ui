import { useEffect, useState } from 'react'
import { Backdrop, Button, Loader } from 'xedonium'

export default function Demo() {
	const [loading, setLoading] = useState(false)
	const [preview, setPreview] = useState(false)

	// Pretend the work takes two seconds
	useEffect(() => {
		if (!loading) return undefined
		const timer = setTimeout(() => setLoading(false), 2000)
		return () => clearTimeout(timer)
	}, [loading])

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Button onClick={() => setLoading(true)}>Save with a spinner</Button>
			<Button variant="secondary" onClick={() => setPreview(true)}>
				Preview (click away to close)
			</Button>
			<Backdrop open={loading}>
				<div className="bg-app-card p-6">
					<Loader variant="inline" label="Saving…" />
				</div>
			</Backdrop>
			<Backdrop open={preview} onClose={() => setPreview(false)}>
				<div className="border border-app-border bg-app-card p-6 text-sm text-app-text">
					Click outside this box, or press Escape, to close.
				</div>
			</Backdrop>
		</div>
	)
}
