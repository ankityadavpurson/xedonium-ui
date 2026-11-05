import { Button, Card } from 'xedonium'

export default function Demo() {
	return (
		<Card
			title="Gru's lair"
			subtitle="Under a suburban house"
			actions={<Button variant="secondary">Edit</Button>}
			footer="Updated 2 min ago"
		>
			Secure, 3 of 3 freeze rays charged.
		</Card>
	)
}
