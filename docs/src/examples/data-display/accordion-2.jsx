import { Accordion } from 'xedonium'

export default function Demo() {
	return (
		<Accordion
			className="max-w-md"
			gap="md"
			multiple
			defaultValue={['a']}
			items={[
				{ key: 'a', title: 'Bananas', content: 'Fresh bunches reach the lair within two days.' },
				{ key: 'b', title: 'Returns', content: 'Send any green banana back within thirty days.' },
				{ key: 'c', title: 'Support', content: 'A Minion answers every message. Bello!' },
			]}
		/>
	)
}
