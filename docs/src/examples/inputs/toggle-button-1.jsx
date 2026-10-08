import { useState } from 'react'
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	ItalicIcon,
	PinIcon,
	ToggleButton,
	ToggleButtonGroup,
	UnderlineIcon,
} from 'xedonium'

export default function Demo() {
	const [bookmarked, setBookmarked] = useState(false)
	const [formats, setFormats] = useState(['bold'])
	const [align, setAlign] = useState('left')

	return (
		<div className="flex flex-col items-start gap-6">
			<ToggleButton selected={bookmarked} onChange={setBookmarked}>
				<PinIcon />
				{bookmarked ? 'Pinned' : 'Pin'}
			</ToggleButton>
			<ToggleButtonGroup aria-label="Text formatting" value={formats} onChange={setFormats}>
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
			<ToggleButtonGroup exclusive aria-label="Text alignment" value={align} onChange={setAlign}>
				<ToggleButton value="left" aria-label="Left">
					<AlignLeftIcon />
				</ToggleButton>
				<ToggleButton value="center" aria-label="Center">
					<AlignCenterIcon />
				</ToggleButton>
				<ToggleButton value="right" aria-label="Right">
					<AlignRightIcon />
				</ToggleButton>
				<ToggleButton value="justify" aria-label="Justify" disabled>
					<AlignJustifyIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<p className="m-0 text-xs text-app-muted">
				{formats.join(', ') || 'no formatting'}; aligned {align ?? 'nowhere'}
			</p>
		</div>
	)
}
