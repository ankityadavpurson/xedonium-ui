import { AccordionSection } from 'xedonium'

// A single section, for pages that put other content between sections
export default function Demo() {
	return (
		<div className="flex max-w-md flex-col gap-3">
			<AccordionSection title="Account" defaultOpen>
				Name, email and password.
			</AccordionSection>
			<p className="m-0 text-sm text-app-muted">Any other content can sit between the sections.</p>
			<AccordionSection title="Notifications">Choose what you get emailed about.</AccordionSection>
		</div>
	)
}
