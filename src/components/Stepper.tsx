import type { ReactNode } from 'react'
import CheckIcon from './icons/Check'

export interface Step {
	label: string
	description?: ReactNode
}

export interface StepperProps {
	steps: Step[]
	/** 0-based active step; earlier ones are done. */
	current?: number
	className?: string
}

/** Step progress. steps: [{ label, description? }]; `current` is the 0-based active step (earlier ones are done). */
const Stepper = ({ steps, current = 0, className = '' }: StepperProps) => (
	<ol className={`m-0 flex list-none flex-col gap-4 p-0 sm:flex-row sm:gap-0 ${className}`}>
		{steps.map((step, index) => {
			const done = index < current
			const active = index === current
			return (
				<li
					key={step.label}
					aria-current={active ? 'step' : undefined}
					className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-2"
				>
					<div className="flex items-center sm:w-full">
						<span
							className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-semibold ${
								done
									? 'border-app-strong bg-app-strong text-app-bg'
									: active
										? 'border-app-strong text-app-text'
										: 'border-app-border text-app-muted'
							}`}
						>
							{done ? <CheckIcon className="h-4 w-4" /> : index + 1}
						</span>
						{index < steps.length - 1 && (
							<span
								aria-hidden="true"
								className={`ml-2 hidden h-px flex-1 sm:block ${done ? 'bg-app-strong' : 'bg-app-border'}`}
							/>
						)}
					</div>
					<div className="pr-2">
						<div
							className={`text-xs font-semibold uppercase tracking-widest ${active || done ? 'text-app-text' : 'text-app-muted'}`}
						>
							{step.label}
						</div>
						{step.description && <div className="mt-0.5 text-xs text-app-muted">{step.description}</div>}
					</div>
				</li>
			)
		})}
	</ol>
)

export default Stepper
