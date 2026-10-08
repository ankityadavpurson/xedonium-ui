import { ButtonLink, ExternalLinkIcon } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<ButtonLink href="#docs">Docs</ButtonLink>
			<ButtonLink href="#github" variant="secondary">
				GitHub
				<ExternalLinkIcon />
			</ButtonLink>
			<ButtonLink href="#off" variant="danger" disabled>
				Disabled
			</ButtonLink>
		</div>
	)
}
