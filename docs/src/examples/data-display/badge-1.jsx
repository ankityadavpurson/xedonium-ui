import { useState } from 'react'
import { Avatar, Badge, Button } from 'xedonium'

const Mail = () => (
	<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
		/>
	</svg>
)

export default function Demo() {
	const [count, setCount] = useState(1)
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center gap-6">
				<Badge badgeContent={4}>
					<Mail />
				</Badge>
				<Badge badgeContent={120} color="danger">
					<Mail />
				</Badge>
				<Badge badgeContent={0} showZero color="secondary">
					<Mail />
				</Badge>
				<Badge variant="dot" color="success">
					<Mail />
				</Badge>
				<Badge badgeContent="new" color="info" anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
					<Mail />
				</Badge>
				<Badge variant="dot" color="warning" overlap="circular">
					<Avatar name="Ada Lovelace" />
				</Badge>
			</div>
			<div className="flex items-center gap-3">
				<Badge badgeContent={count} color="danger">
					<Button variant="secondary" onClick={() => setCount(c => c + 1)}>
						Notify
					</Button>
				</Badge>
				<Button variant="secondary" onClick={() => setCount(0)}>
					Reset
				</Button>
			</div>
		</div>
	)
}
