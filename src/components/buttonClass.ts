// Shared styling for Button and ButtonLink
export type ButtonVariant = 'default' | 'secondary' | 'flat' | 'danger' | 'success' | 'warning'

const variantClasses: Record<ButtonVariant, string> = {
	default: 'bg-app-strong text-app-bg border border-app-strong hover:bg-app-text',
	secondary: 'bg-app-bg text-app-text border border-app-border hover:border-app-strong hover:text-app-text',
	flat: 'bg-transparent text-app-text border border-transparent hover:bg-app-card hover:border-app-border',
	danger: 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20',
	success:
		'bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 dark:bg-emerald-500 dark:text-black dark:border-emerald-500 dark:hover:bg-emerald-400 dark:hover:border-emerald-400',
	warning: 'bg-amber-400 text-black border border-amber-400 hover:bg-amber-300 hover:border-amber-300',
}

const buttonClass = (variant: ButtonVariant = 'default', className = '') =>
	`text-xs font-semibold uppercase tracking-widest ${variantClasses[variant]} px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`

export default buttonClass
