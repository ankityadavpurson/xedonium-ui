import { useEffect, useState } from 'react'
import { Backdrop, Button, Loader, Menu } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const [loading, setLoading] = useState(false)
	const pick = name => () => {
		setLast(name)
		if (name === 'Save') setLoading(true)
	}

	useEffect(() => {
		if (!loading) return undefined
		const timer = setTimeout(() => setLoading(false), 1500)
		return () => clearTimeout(timer)
	}, [loading])

	return (
		<div className="flex flex-col items-start gap-3">
			<div className="flex flex-wrap items-center gap-3">
				<Menu
					label="File"
					trigger="File"
					items={[
						{ key: 'new', label: 'New', shortcut: 'Ctrl+N', onClick: pick('New') },
						{
							key: 'recent',
							label: 'Open recent',
							children: [
								{ key: 'a', label: 'Report.md', onClick: pick('Report.md') },
								{
									key: 'older',
									label: 'Older',
									children: [{ key: 'b', label: 'Notes 2023.md', onClick: pick('Notes 2023.md') }],
								},
							],
						},
						{ key: 'save', label: 'Save (shows a backdrop)', onClick: pick('Save') },
						{ key: 'd', divider: true },
						{ key: 'quit', label: 'Quit', tone: 'danger', onClick: pick('Quit') },
					]}
				/>
				<Button variant="secondary" onClick={() => setLoading(true)}>
					Show backdrop
				</Button>
			</div>
			<p className="m-0 text-xs text-app-muted">Last action: {last}</p>
			<Backdrop open={loading}>
				<div className="bg-app-card p-6">
					<Loader variant="inline" label="Saving…" />
				</div>
			</Backdrop>
		</div>
	)
}
