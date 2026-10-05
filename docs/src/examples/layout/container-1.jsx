import { Container } from 'xedonium'

export default function Demo() {
	return (
		<Container maxWidth="max-w-sm" className="border border-app-border py-4">
			Content stays centered and never wider than max-w-sm.
		</Container>
	)
}
