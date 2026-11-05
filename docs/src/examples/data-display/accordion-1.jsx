import { Accordion } from 'xedonium'

export default function Demo() {
	return (
		<Accordion
			className="max-w-md"
			defaultValue={['a']}
			items={[
				{ key: 'a', title: 'Who are the Minions?', content: 'Small, yellow, and devoted to bananas.' },
				{ key: 'b', title: 'Can several be open?', content: 'Yes, pass the multiple prop.' },
				{ key: 'c', title: 'Disabled', content: 'Hidden', disabled: true },
			]}
		/>
	)
}
