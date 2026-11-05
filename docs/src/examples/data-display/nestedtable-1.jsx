import { NestedTable } from 'xedonium'

export default function Demo() {
	return (
		<NestedTable
			caption="Villains and Minions"
			defaultExpanded={['gru']}
			columns={[
				{ key: 'name', header: 'Name' },
				{ key: 'role', header: 'Role' },
			]}
			rows={[
				{
					id: 'gru',
					name: 'Gru',
					role: 'Villain',
					children: [
						{ id: 'kevin', name: 'Kevin', role: 'Minion' },
						{ id: 'stuart', name: 'Stuart', role: 'Minion' },
					],
				},
			]}
		/>
	)
}
