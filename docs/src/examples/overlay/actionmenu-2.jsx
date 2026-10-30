import { ActionMenu, SettingsIcon, Trash2Icon } from 'xedonium'

// Stands in for a router link (react-router: linkComponent={Link} linkProp="to")
const RouterLink = ({ to, children, ...rest }) => (
	<a href={`#${to}`} data-router-link {...rest}>
		{children}
	</a>
)

export default function Demo() {
	return (
		<ActionMenu
			label="Navigate"
			trigger="Navigate"
			linkComponent={RouterLink}
			linkProp="to"
			items={[
				{ key: 'apps', label: 'Apps', icon: <SettingsIcon />, href: '/apps' },
				{
					key: 'docs',
					label: 'Documentation',
					href: 'https://github.com/ankityadavpurson/xedonium-ui',
					target: '_blank',
				},
				{
					key: 'billing',
					label: 'Billing',
					description: 'Not available on this plan',
					href: '/billing',
					disabled: true,
				},
				{ key: 'delete', label: 'Delete', icon: <Trash2Icon />, tone: 'danger', onClick: () => {} },
			]}
		/>
	)
}
