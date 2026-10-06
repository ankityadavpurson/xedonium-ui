import { useState } from 'react'
import { SearchSelect } from 'xedonium'

const countries = ['Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan']

export default function Demo() {
	const [country, setCountry] = useState('')
	return (
		<div className="max-w-sm">
			<SearchSelect
				label="Country"
				value={country}
				onChange={setCountry}
				options={countries.map(name => ({ value: name, label: name }))}
			/>
		</div>
	)
}
