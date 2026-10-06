import { useState } from 'react'
import { Chip } from 'xedonium'

export default function Demo() {
	const [filter, setFilter] = useState('all')
	const [tags, setTags] = useState(['react', 'tailwind', 'vite'])
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap gap-2">
				{['all', 'open', 'closed'].map(name => (
					<Chip key={name} selected={filter === name} onClick={() => setFilter(name)}>
						{name}
					</Chip>
				))}
			</div>
			<div className="flex flex-wrap gap-2">
				{tags.map(tag => (
					<Chip key={tag} onRemove={() => setTags(tags.filter(t => t !== tag))}>
						{tag}
					</Chip>
				))}
			</div>
		</div>
	)
}
