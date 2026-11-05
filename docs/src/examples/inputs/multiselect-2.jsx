import { useState } from 'react'
import { MultiSelect } from 'xedonium'

// Free-form tags: type and press Enter or a comma; the suggestions are only suggestions
export default function Demo() {
	const [tags, setTags] = useState(['cavendish'])
	return (
		<div className="max-w-sm">
			<MultiSelect
				label="Banana types"
				creatable
				value={tags}
				onChange={setTags}
				placeholder="Type and press Enter…"
				options={[
					{ value: 'cavendish', label: 'Cavendish' },
					{ value: 'plantain', label: 'Plantain' },
					{ value: 'red', label: 'Red banana' },
				]}
			/>
		</div>
	)
}
