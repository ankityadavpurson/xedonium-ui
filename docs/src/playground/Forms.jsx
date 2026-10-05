import { useState } from 'react'
import {
	Checkbox,
	DatePicker,
	DateRangePicker,
	Field,
	FileUpload,
	Input,
	RadioGroup,
	Select,
	Slider,
	Switch,
	TimePicker,
} from 'xedonium'
import { Section } from './shared'

const Forms = () => {
	const [name, setName] = useState('')
	const [input, setInput] = useState('')
	const [select, setSelect] = useState('')
	const [checked, setChecked] = useState(true)
	const [mixed, setMixed] = useState(false)
	const [on, setOn] = useState(true)
	const [radio, setRadio] = useState('b')
	const [slider, setSlider] = useState(40)
	const [date, setDate] = useState(null)
	const [range, setRange] = useState({ start: null, end: null })
	const [time, setTime] = useState('09:30')
	const [files, setFiles] = useState([])

	return (
		<div className="flex flex-col gap-4">
			<Section title="Text inputs" className="items-start">
				<div className="w-64">
					<Field
						label="Name"
						value={name}
						onChange={setName}
						placeholder="Type here"
						error={name === 'x' ? 'Too short' : ''}
					/>
				</div>
				<div className="w-64">
					<Input value={input} onChange={setInput} placeholder="Bare input" />
				</div>
				<div className="w-64">
					<Input value="Invalid" onChange={() => {}} invalid />
				</div>
				<div className="w-64">
					<Select
						label="Role"
						value={select}
						onChange={setSelect}
						placeholder="Choose…"
						options={[
							{ value: 'a', label: 'Admin' },
							{ value: 'e', label: 'Editor' },
							{ value: 'v', label: 'Viewer', disabled: true },
						]}
					/>
				</div>
			</Section>
			<Section title="Toggles" className="items-start gap-6">
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
					<Slider label="Volume" value={slider} onChange={setSlider} />
				</div>
			</Section>
			<Section title="Date and time" className="items-start">
				<div className="w-56">
					<DatePicker label="Date" value={date} onChange={setDate} />
				</div>
				<div className="w-72">
					<DateRangePicker label="Range" value={range} onChange={setRange} />
				</div>
				<div className="w-40">
					<TimePicker label="Time" value={time} onChange={setTime} />
				</div>
			</Section>
			<Section title="File upload" className="flex-col items-stretch">
				<FileUpload multiple onChange={setFiles} />
				<span className="text-xs text-app-muted">{files.length} file(s) picked</span>
			</Section>
		</div>
	)
}

export default Forms
