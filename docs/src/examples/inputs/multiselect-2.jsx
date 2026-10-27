import { useState } from 'react'
import { MultiSelect } from 'xedonium'

// Free-form tags: type and press Enter or a comma; the suggestions are only suggestions
export default function Demo() {
	const [tags, setTags] = useState(['react'])
	return (
		<div className="max-w-sm">
			<MultiSelect
				label="Technologies"
				creatable
				value={tags}
				onChange={setTags}
				placeholder="Type and press Enter…"
				options={[
					{ value: 'react', label: 'React' },
					{ value: 'vue', label: 'Vue' },
					{ value: 'svelte', label: 'Svelte' },
				]}
			/>
		</div>
	)
}
