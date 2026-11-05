import { useState } from 'react'
import { Alert, Button, Stack } from 'xedonium'

const TONES = [
	{ tone: 'info', variant: 'secondary', title: 'Bello!', text: 'A Minion has something to tell you.' },
	{ tone: 'success', variant: 'success', title: 'Banana secured', text: 'The bananas are safe in the vault.' },
	{ tone: 'warning', variant: 'warning', title: 'Careful', text: 'Gru will not like this.' },
	{ tone: 'danger', variant: 'danger', title: 'Oh no', text: 'Could not reach the lair.' },
]

export default function Demo() {
	const [shown, setShown] = useState(['info'])
	const toggle = tone => setShown(list => (list.includes(tone) ? list.filter(t => t !== tone) : [...list, tone]))

	return (
		<Stack gap={4}>
			<div className="flex flex-wrap gap-2">
				{TONES.map(({ tone, variant }) => (
					<Button key={tone} variant={variant} onClick={() => toggle(tone)}>
						{shown.includes(tone) ? 'Hide' : 'Show'} {tone}
					</Button>
				))}
			</div>
			{TONES.filter(({ tone }) => shown.includes(tone)).map(({ tone, title, text }) => (
				<Alert key={tone} tone={tone} title={title} onClose={() => toggle(tone)}>
					{text}
				</Alert>
			))}
		</Stack>
	)
}
