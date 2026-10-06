import { useState } from 'react'
import { Checkbox, RadioGroup, Slider, Switch } from 'xedonium'

export default function Demo() {
	const [checked, setChecked] = useState(true)
	const [mixed, setMixed] = useState(false)
	const [on, setOn] = useState(true)
	const [radio, setRadio] = useState('b')
	const [volume, setVolume] = useState(40)

	return (
		<div className="flex flex-wrap items-start gap-6">
			<Checkbox label="Checked" checked={checked} onChange={setChecked} />
			<Checkbox label="Indeterminate" checked={mixed} indeterminate onChange={setMixed} />
			<Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
			<Switch label="Switch" checked={on} onChange={setOn} />
			<Switch label="Disabled" checked={false} onChange={() => {}} disabled />
			<RadioGroup
				label="Pick one"
				name="pg"
				value={radio}
				onChange={setRadio}
				options={[
					{ value: 'a', label: 'A' },
					{ value: 'b', label: 'B' },
					{ value: 'c', label: 'C', disabled: true },
				]}
			/>
			<div className="w-56">
				<Slider label="Volume" value={volume} onChange={setVolume} />
			</div>
		</div>
	)
}
