import { Avatar, Flex } from 'xedonium'

export default function Demo() {
	return (
		<Flex align="center">
			<Avatar name="Ada Lovelace" size="sm" />
			<Avatar name="Ada Lovelace" />
			<Avatar name="Ada Lovelace" size="lg" />
			<Avatar src="/missing.png" name="Fallback User" />
			<Avatar name="Ada Lovelace" shape="rounded" />
			<Avatar name="Ada Lovelace" shape="square" />
		</Flex>
	)
}
