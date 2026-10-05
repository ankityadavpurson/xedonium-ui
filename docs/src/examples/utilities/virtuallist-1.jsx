import { VirtualList } from 'xedonium'

export default function Demo() {
	return (
		<VirtualList
			label="Ten thousand rows"
			items={Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`)}
			itemHeight={36}
			height={216}
			renderItem={item => item}
		/>
	)
}
