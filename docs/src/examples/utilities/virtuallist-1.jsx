import { VirtualList } from 'xedonium'

export default function Demo() {
	return (
		<VirtualList
			label="Ten thousand bananas"
			items={Array.from({ length: 10000 }, (_, i) => `Banana ${i + 1}`)}
			itemHeight={36}
			height={216}
			renderItem={item => item}
		/>
	)
}
