import { useState } from 'react'
import { FileIcon, FolderOpenIcon, LinkIcon, MailIcon, Menu, PrinterIcon, SaveIcon, ShareIcon } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const pick = name => () => setLast(name)

	return (
		<div className="flex flex-col items-start gap-3">
			<Menu
				label="File"
				trigger="File"
				items={[
					{ key: 'new', label: 'New', icon: <FileIcon />, shortcut: 'Ctrl+N', onClick: pick('New') },
					{
						key: 'open',
						label: 'Open recent',
						icon: <FolderOpenIcon />,
						children: [
							{ key: 'r1', label: 'Quarterly report.md', onClick: pick('Quarterly report.md') },
							{ key: 'r2', label: 'Roadmap.md', onClick: pick('Roadmap.md') },
							{ key: 'r3', divider: true },
							{
								key: 'older',
								label: 'Older',
								children: [
									{ key: 'o1', label: 'Notes 2023.md', onClick: pick('Notes 2023.md') },
									{ key: 'o2', label: 'Notes 2022.md', onClick: pick('Notes 2022.md') },
								],
							},
						],
					},
					{ key: 'save', label: 'Save', icon: <SaveIcon />, shortcut: 'Ctrl+S', onClick: pick('Save') },
					{ key: 'd1', divider: true },
					{
						key: 'share',
						label: 'Share',
						icon: <ShareIcon />,
						children: [
							{ key: 'mail', label: 'Email', icon: <MailIcon />, onClick: pick('Email') },
							{ key: 'link', label: 'Copy link', icon: <LinkIcon />, onClick: pick('Copy link') },
						],
					},
					{ key: 'print', label: 'Print', icon: <PrinterIcon />, shortcut: 'Ctrl+P', onClick: pick('Print') },
				]}
			/>
			<p className="m-0 text-xs text-app-muted">
				Last action: {last}. Try the arrow keys: Right opens a submenu, Left closes it.
			</p>
		</div>
	)
}
