import { NestedTable } from 'xedonium'

export default function Demo() {
	return (
		<NestedTable
			caption="Departments and employees"
			defaultExpanded={['engineering']}
			columns={[
				{ key: 'name', header: 'Name' },
				{ key: 'role', header: 'Role' },
			]}
			rows={[
				{
					id: 'engineering',
					name: 'Engineering',
					role: 'Department',
					children: [
						{ id: 'ada', name: 'Ada Lovelace', role: 'Engineer' },
						{ id: 'grace', name: 'Grace Hopper', role: 'Engineer' },
					],
				},
			]}
		/>
	)
}
