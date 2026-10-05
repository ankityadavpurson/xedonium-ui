import { Flex, Skeleton } from 'xedonium'

export default function Demo() {
	return (
		<Flex gap={4} align="start">
			<Skeleton circle className="h-10 w-10" />
			<div className="flex-1">
				<Skeleton lines={3} />
			</div>
		</Flex>
	)
}
