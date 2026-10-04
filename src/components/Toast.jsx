// Always rendered so the live region exists before a message arrives; screen readers only announce changes.
const Toast = props => {
	const { toast } = props
	return (
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			className="fixed bottom-5 right-5 z-[var(--xd-z-toast,90)]"
		>
			{toast && (
				<div
					className={`max-w-sm px-4 py-3 text-sm font-semibold shadow-xl ${toast.type === 'error' ? 'bg-red-700 text-white' : 'bg-emerald-700 text-white'}`}
				>
					{toast.msg}
					{toast.link && (
						<>
							{' '}
							<a href={toast.link.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
								{toast.link.label}
							</a>
						</>
					)}
				</div>
			)}
		</div>
	)
}

export default Toast
