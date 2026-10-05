import { Button, Flex, Stack } from 'xedonium'

export default function Demo() {
	return (
		<Stack gap={3}>
			<Flex align="center" justify="between">
				<span>Left</span>
				<Button variant="secondary">Right</Button>
			</Flex>
			<Stack direction="row" gap={2}>
				<Button>One</Button>
				<Button>Two</Button>
			</Stack>
		</Stack>
	)
}
