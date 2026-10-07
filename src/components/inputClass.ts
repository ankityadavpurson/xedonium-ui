// Shared control styling for Input and Select
const inputClass = (invalid = false) =>
	`w-full bg-app-bg border px-3 py-2 text-sm text-app-text placeholder:text-app-muted outline-none transition focus:ring-2 focus:ring-app-strong focus:border-app-strong disabled:cursor-not-allowed disabled:opacity-50 ${
		invalid ? 'border-red-500' : 'border-app-border'
	}`

export default inputClass
