import { Avatar, List } from 'xedonium'

export default function Demo() {
	return (
		<List
			items={[
				{
					key: 'a',
					leading: <Avatar name="Ada Lovelace" />,
					primary: 'Ada Lovelace',
					secondary: 'Admin',
					trailing: 'Online',
				},
				{ key: 'b', leading: <Avatar name="Linus T" />, primary: 'Linus T', secondary: 'Editor', onClick: () => {} },
			]}
		/>
	)
}
