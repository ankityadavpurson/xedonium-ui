import { Divider, Flex, Stack } from 'xedonium'

export default function Demo() {
	return (
		<Stack gap={4}>
			<Divider />
			<Divider label="or" />
			<Flex className="h-8" align="center">
				<span>Left</span>
				<Divider orientation="vertical" />
				<span>Right</span>
			</Flex>
		</Stack>
	)
}
