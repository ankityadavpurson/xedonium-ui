import { useState } from 'react'
import { ContextMenu, CopyIcon, FileIcon, LinkIcon, Trash2Icon } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const pick = name => () => setLast(name)

	return (
		<div className="flex flex-col gap-2">
			<ContextMenu
				label="Item actions"
				items={[
					{ key: 'open', label: 'Open', icon: <FileIcon />, onClick: pick('Open') },
					{ key: 'copy', label: 'Copy', icon: <CopyIcon />, shortcut: 'Ctrl+C', onClick: pick('Copy') },
					{
						key: 'share',
						label: 'Share',
						icon: <LinkIcon />,
						children: [
							{ key: 'link', label: 'Copy link', onClick: pick('Copy link') },
							{ key: 'email', label: 'Email', onClick: pick('Email') },
						],
					},
					{ key: 'd', divider: true },
					{ key: 'del', label: 'Delete', icon: <Trash2Icon />, tone: 'danger', onClick: pick('Delete') },
				]}
			>
				<div className="flex h-32 items-center justify-center border border-dashed border-app-border text-sm text-app-muted">
					Right-click anywhere in this box
				</div>
			</ContextMenu>
			<p className="m-0 text-xs text-app-muted">Last action: {last}</p>
		</div>
	)
}
