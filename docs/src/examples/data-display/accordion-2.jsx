import { Accordion } from 'xedonium'

export default function Demo() {
	return (
		<Accordion
			className="max-w-md"
			gap="md"
			multiple
			defaultValue={['a']}
			items={[
				{ key: 'a', title: 'Shipping', content: 'Orders leave the warehouse within two days.' },
				{ key: 'b', title: 'Returns', content: 'Send anything back within thirty days.' },
				{ key: 'c', title: 'Support', content: 'We answer every message.' },
			]}
		/>
	)
}
