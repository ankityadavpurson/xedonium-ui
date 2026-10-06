import { Button, FocusTrap, Portal } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<FocusTrap className="flex gap-2 border border-dashed border-app-border p-3">
				<Button variant="secondary">Tab stays</Button>
				<Button variant="secondary">inside</Button>
			</FocusTrap>
			<Portal>
				<span className="fixed bottom-2 left-2 text-[10px] text-app-muted">portalled to body</span>
			</Portal>
		</div>
	)
}
