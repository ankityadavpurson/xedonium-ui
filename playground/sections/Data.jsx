import { useState } from 'react'
import {
	AreaChart,
	Avatar,
	BarChart,
	Calendar,
	Card,
	Carousel,
	DataGrid,
	LineChart,
	List,
	Pagination,
	PieChart,
	SortableList,
	Table,
	Tree,
	VirtualList,
} from '../../src'
import { Section, months, people, series } from './shared'

const columns = [
	{ key: 'name', header: 'Name', sortable: true },
	{ key: 'role', header: 'Role', sortable: true },
	{ key: 'score', header: 'Score', sortable: true, align: 'right' },
]

const Data = () => {
	const [page, setPage] = useState(3)
	const [selected, setSelected] = useState([])
	const [order, setOrder] = useState([1, 2, 3, 4].map(n => ({ key: n, label: `Item ${n}` })))
	const [node, setNode] = useState('src')
	const [date, setDate] = useState(new Date())

	return (
		<div className="flex flex-col gap-4">
			<Section title="Charts" className="items-stretch">
				<Card title="Line" className="min-w-0 flex-1 basis-80">
					<LineChart labels={months} series={series} height={220} />
				</Card>
				<Card title="Area" className="min-w-0 flex-1 basis-80">
					<AreaChart labels={months} series={series} height={220} />
				</Card>
				<Card title="Bar" className="min-w-0 flex-1 basis-80">
					<BarChart labels={months} series={series} height={220} />
				</Card>
				<Card title="Stacked" className="min-w-0 flex-1 basis-80">
					<BarChart labels={months} series={series} height={220} stacked />
				</Card>
				<Card title="Pie" className="min-w-0 flex-1 basis-60">
					<PieChart
						data={[
							{ label: 'A', value: 40 },
							{ label: 'B', value: 25 },
							{ label: 'C', value: 20 },
							{ label: 'D', value: 15 },
						]}
					/>
				</Card>
				<Card title="Donut" className="min-w-0 flex-1 basis-60">
					<PieChart
						donut
						center="100"
						data={[
							{ label: 'Up', value: 90 },
							{ label: 'Down', value: 10 },
						]}
					/>
				</Card>
			</Section>
			<Section title="Table / DataGrid" className="flex-col items-stretch">
				<Table columns={columns} rows={people.slice(0, 4)} caption="Simple table" />
				<DataGrid
					columns={columns}
					rows={people}
					pageSize={5}
					searchable
					selectable
					selected={selected}
					onSelectionChange={setSelected}
					caption="Data grid"
				/>
			</Section>
			<Section title="Lists" className="items-start">
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
			</Section>
			<Section title="Pagination / Calendar / Carousel" className="items-start">
				<Pagination page={page} pageCount={12} onChange={setPage} />
				<Calendar value={date} onChange={setDate} />
				<div className="w-80">
					<Carousel>
						{['One', 'Two', 'Three'].map(t => (
							<div key={t} className="flex h-40 items-center justify-center bg-app-bg text-lg font-semibold">
								Slide {t}
							</div>
						))}
					</Carousel>
				</div>
			</Section>
		</div>
	)
}

export default Data
