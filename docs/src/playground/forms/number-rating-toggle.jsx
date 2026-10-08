import { useState } from 'react'
import {
	AlignCenterIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	ItalicIcon,
	NumberField,
	PinIcon,
	Rating,
	ToggleButton,
	ToggleButtonGroup,
	UnderlineIcon,
} from 'xedonium'

export default function Demo() {
	const [guests, setGuests] = useState(2)
	const [stars, setStars] = useState(3.5)
	const [formats, setFormats] = useState(['bold'])
	const [align, setAlign] = useState('left')
	const [pinned, setPinned] = useState(false)

	return (
		<div className="grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
			<NumberField label="Guests" value={guests} onChange={setGuests} min={1} max={10} helperText="Between 1 and 10" />
			<div className="flex flex-col gap-1">
				<span className="text-xs font-semibold uppercase tracking-widest text-app-muted">Rating</span>
				<Rating label="Rating" value={stars} onChange={setStars} precision={0.5} size="lg" />
				<span className="text-xs text-app-muted">{stars} of 5</span>
			</div>
			<ToggleButtonGroup aria-label="Formatting" value={formats} onChange={setFormats}>
				<ToggleButton value="bold" aria-label="Bold">
					<BoldIcon />
				</ToggleButton>
				<ToggleButton value="italic" aria-label="Italic">
					<ItalicIcon />
				</ToggleButton>
				<ToggleButton value="underline" aria-label="Underline">
					<UnderlineIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<ToggleButtonGroup exclusive aria-label="Alignment" value={align} onChange={setAlign}>
				<ToggleButton value="left" aria-label="Left">
					<AlignLeftIcon />
				</ToggleButton>
				<ToggleButton value="center" aria-label="Center">
					<AlignCenterIcon />
				</ToggleButton>
				<ToggleButton value="right" aria-label="Right">
					<AlignRightIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<div>
				<ToggleButton selected={pinned} onChange={setPinned}>
					<PinIcon />
					{pinned ? 'Pinned' : 'Pin'}
				</ToggleButton>
			</div>
		</div>
	)
}
