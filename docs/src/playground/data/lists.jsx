import { useState } from 'react'
import { Accordion, Avatar, Badge, Chip, CodeDisplay, List, SortableList, Tree, VirtualList } from 'xedonium'

export default function Demo() {
	const [order, setOrder] = useState([1, 2, 3, 4].map(n => ({ key: n, label: `Item ${n}` })))
	const [node, setNode] = useState('src')

	return (
		<div className="flex flex-wrap items-start gap-3">
			<div className="w-72">
				<List
					items={[
						{ key: 1, primary: 'Ada', secondary: 'Admin', leading: <Avatar name="Ada" size="sm" />, trailing: '12' },
						{
							key: 2,
							primary: 'Linus',
							secondary: 'Editor',
							leading: <Avatar name="Linus" size="sm" />,
							onClick: () => {},
						},
					]}
				/>
			</div>
			<div className="w-56">
				<SortableList
					items={order}
					onChange={setOrder}
					renderItem={item => <span className="text-sm">{item.label}</span>}
				/>
			</div>
			<div className="w-56">
				<VirtualList
					items={Array.from({ length: 5000 }, (_, i) => ({ id: i }))}
					itemHeight={32}
					height={160}
					getKey={item => item.id}
					renderItem={item => <div className="px-3 py-1.5 text-sm">Row {item.id}</div>}
				/>
			</div>
			<div className="w-56">
				<Tree
					selected={node}
					onSelect={setNode}
					defaultExpanded={['src']}
					nodes={[
						{
							key: 'src',
							label: 'src',
							children: [
								{ key: 'a', label: 'App.jsx' },
								{ key: 'b', label: 'main.jsx' },
							],
						},
						{ key: 'pkg', label: 'package.json' },
					]}
				/>
			</div>
			<div className="flex w-72 flex-wrap items-start gap-2">
				<Badge badgeContent={4}>
					<Chip>Inbox</Chip>
				</Badge>
				<Badge variant="dot" color="success">
					<Chip>Online</Chip>
				</Badge>
				<Chip selected onClick={() => {}}>
					Selected
				</Chip>
				<Chip onRemove={() => {}}>Removable</Chip>
			</div>
			<div className="w-72">
				<Accordion
					defaultValue={['a']}
					items={[
						{ key: 'a', title: 'First', content: 'First panel' },
						{ key: 'b', title: 'Second', content: 'Second panel' },
					]}
				/>
			</div>
			<div className="w-72">
				<CodeDisplay code={'const answer = 42\nconsole.log(answer)'} language="js" lineNumbers />
			</div>
		</div>
	)
}
