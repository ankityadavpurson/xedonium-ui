import { Avatar, Flex } from 'xedonium'

export default function Demo() {
	return (
		<Flex align="center">
			<Avatar name="Kevin Minion" size="sm" />
			<Avatar name="Kevin Minion" />
			<Avatar name="Kevin Minion" size="lg" />
			<Avatar src="/missing.png" name="Stuart Minion" />
			<Avatar name="Kevin Minion" shape="rounded" />
			<Avatar name="Kevin Minion" shape="square" />
		</Flex>
	)
}
