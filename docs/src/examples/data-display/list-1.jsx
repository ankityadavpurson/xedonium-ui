import { Avatar, List } from 'xedonium'

export default function Demo() {
	return (
		<List
			items={[
				{
					key: 'a',
					leading: <Avatar name="Kevin Minion" />,
					primary: 'Kevin',
					secondary: 'Banana boss',
					trailing: 'Awake',
				},
				{
					key: 'b',
					leading: <Avatar name="Stuart Minion" />,
					primary: 'Stuart',
					secondary: 'Goggle polisher',
					onClick: () => {},
				},
			]}
		/>
	)
}
