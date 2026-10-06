import { Accordion } from 'xedonium'

export default function Demo() {
	return (
		<Accordion
			className="max-w-md"
			defaultValue={['a']}
			items={[
				{ key: 'a', title: 'What is it?', content: 'A set of minimal, theme-aware components.' },
				{ key: 'b', title: 'Can several be open?', content: 'Yes, pass the multiple prop.' },
				{ key: 'c', title: 'Disabled', content: 'Hidden', disabled: true },
			]}
		/>
	)
}
