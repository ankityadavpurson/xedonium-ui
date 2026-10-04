// Borderless icon button used in the Home toolbar; `active` marks a pressed toggle
const toolbarButtonClass = active =>
	`flex h-9 w-9 items-center justify-center border transition hover:bg-app-card/80 ${
		active ? 'border-app-strong bg-app-card/80' : 'border-transparent hover:border-app-border'
	}`

export default toolbarButtonClass
