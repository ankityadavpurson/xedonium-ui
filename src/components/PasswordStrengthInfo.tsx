import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import CheckIcon from './icons/Check'

export interface PasswordRule {
	/** Identifies the rule (default: its position). */
	key?: string
	/** What the password must do, e.g. "At least 8 characters". */
	label: ReactNode
	/** `true` when the password satisfies the rule. */
	test: (password: string) => boolean
	/** `false` makes it a recommendation: it counts towards the strength but a failure does not make `valid` false (default `true`). */
	required?: boolean
}

export interface PasswordStrengthResult {
	/** How many rules the password meets. */
	score: number
	/** How many rules there are. */
	total: number
	/** Index into `labels` (0 = weakest), or -1 for an empty password. */
	level: number
	/** The strength label ("Strong"), or the empty text while there is no password. */
	label: string
	/** Every required rule is met. */
	valid: boolean
	/** Whether each rule is met, in rule order. */
	met: boolean[]
}

export interface PasswordStrengthInfoProps {
	password: string
	/** Replace the built-in rules with your own. */
	rules?: PasswordRule[]
	/** Add rules after the built-in ones (ignored when `rules` is given). */
	extraRules?: PasswordRule[]
	/** Minimum length of the built-in length rule (default `8`). */
	minLength?: number
	/** Show the strength label and bar (default `true`). */
	showStrength?: boolean
	/** Show the checklist of rules (default `true`). */
	showRequirements?: boolean
	/** Strength names from weakest to strongest (default: Very weak, Weak, Fair, Good, Strong). */
	labels?: string[]
	/** Tailwind background classes for the bar, one per label. */
	colors?: string[]
	/** Text shown while the password is empty. */
	emptyLabel?: string
	/** Called when the result changes: use `valid` to enable a submit button. It keeps reporting while the info is hidden. */
	onResult?: (result: PasswordStrengthResult) => void
	/**
	 * `always` (the default) shows it all the time; `focus` shows it only while the password field has focus (or
	 * something inside the same group does, see `focusTarget`). Keyboard users get it too: it opens on Tab.
	 */
	showOn?: 'always' | 'focus'
	/**
	 * With `showOn="focus"`: what has to hold focus for the info to show. An element, a ref to one, or an element id
	 * (the password input's, say). By default it is the parent element of the info, so put the input and the info
	 * together in a wrapper of their own.
	 */
	focusTarget?: HTMLElement | RefObject<HTMLElement | null> | string | null
	className?: string
}

/** Ready-made rules, to mix with your own: `rules={[passwordRules.minLength(12), passwordRules.digit, myRule]}`. */
export const passwordRules = {
	minLength: (length = 8): PasswordRule => ({
		key: 'min-length',
		label: `At least ${length} characters`,
		test: password => password.length >= length,
	}),
	uppercase: { key: 'uppercase', label: 'An uppercase letter', test: password => /\p{Lu}/u.test(password) },
	lowercase: { key: 'lowercase', label: 'A lowercase letter', test: password => /\p{Ll}/u.test(password) },
	digit: { key: 'digit', label: 'A number', test: password => /\d/.test(password) },
	special: { key: 'special', label: 'A special character', test: password => /[^\p{L}\p{N}]/u.test(password) },
	noSpaces: { key: 'no-spaces', label: 'No spaces', test: password => !/\s/.test(password) },
	/** The password must not contain any of these words (case-insensitive), e.g. the user's name. */
	notContaining: (words: string[], label: ReactNode = 'Not based on your details'): PasswordRule => ({
		key: 'not-containing',
		label,
		test: password => {
			const lower = password.toLowerCase()
			return words.every(word => !word.trim() || !lower.includes(word.trim().toLowerCase()))
		},
	}),
} satisfies Record<string, PasswordRule | ((...args: never[]) => PasswordRule)>

/** The rules used when you pass none: length, uppercase, lowercase, number and special character. */
export const defaultPasswordRules = (minLength = 8): PasswordRule[] => [
	passwordRules.minLength(minLength),
	passwordRules.uppercase,
	passwordRules.lowercase,
	passwordRules.digit,
	passwordRules.special,
]

/** True while focus is inside `element`; the element is looked up each time the effect runs. */
const useFocusWithin = (enabled: boolean, find: () => HTMLElement | null | undefined) => {
	const [within, setWithin] = useState(false)
	const lookup = useRef(find)
	lookup.current = find

	useEffect(() => {
		if (!enabled) return undefined
		const element = lookup.current()
		if (!element) return undefined
		const onIn = () => setWithin(true)
		const onOut = (event: FocusEvent) => setWithin(element.contains(event.relatedTarget as Node | null))
		element.addEventListener('focusin', onIn)
		element.addEventListener('focusout', onOut)
		setWithin(element.contains(document.activeElement))
		return () => {
			element.removeEventListener('focusin', onIn)
			element.removeEventListener('focusout', onOut)
			setWithin(false)
		}
	}, [enabled])

	return within
}

const LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
const COLORS = ['bg-red-600', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-600', 'bg-emerald-600']

/**
 * Password strength meter with a checklist of rules. The built-in rules are length, uppercase, lowercase, number and
 * special character; replace them with `rules`, or append to them with `extraRules` (a rule is `{ label, test(password),
 * required? }`, and `passwordRules` has ready-made ones). The strength is how many rules are met, spread over `labels`.
 * `onResult` reports the score and `valid` (every required rule met) so a form can enable its submit button.
 * `showOn="focus"` shows it only while the password field has focus. Pair it with PasswordInput.
 */
const PasswordStrengthInfo = ({
	password,
	rules,
	extraRules,
	minLength = 8,
	showStrength = true,
	showRequirements = true,
	labels = LABELS,
	colors = COLORS,
	emptyLabel = 'Enter a password',
	onResult,
	showOn = 'always',
	focusTarget,
	className = '',
}: PasswordStrengthInfoProps) => {
	const root = useRef<HTMLDivElement>(null)
	const focused = useFocusWithin(showOn === 'focus', () => {
		if (typeof focusTarget === 'string') return document.getElementById(focusTarget)
		if (!focusTarget) return root.current?.parentElement
		return focusTarget instanceof HTMLElement ? focusTarget : (focusTarget as RefObject<HTMLElement | null>).current
	})
	const shown = showOn === 'always' || focused

	const all = rules ?? [...defaultPasswordRules(minLength), ...(extraRules ?? [])]
	const met = all.map(rule => rule.test(password))
	const score = met.filter(Boolean).length
	const total = all.length
	const level =
		!password || score === 0
			? password
				? 0
				: -1
			: Math.min(labels.length - 1, Math.ceil((score / total) * labels.length) - 1)
	const label = level < 0 ? emptyLabel : (labels[level] ?? '')
	const valid = all.every((rule, index) => rule.required === false || met[index])
	const color = colors[Math.max(level, 0)] ?? colors[colors.length - 1]

	useEffect(() => {
		onResult?.({ score, total, level, label, valid, met })
		// report when the outcome changes, not on every render (`met` is a new array each time)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [score, total, level, valid, met.join(), onResult])

	return (
		<div
			ref={root}
			hidden={!shown}
			className={`${shown ? 'flex' : 'hidden'} flex-col gap-2 text-sm text-app-text ${className}`}
		>
			{showStrength && (
				<>
					<div className="flex items-center justify-between gap-2">
						<span className="text-app-muted">Password strength</span>
						<span aria-live="polite" className="font-medium">
							{label}
						</span>
					</div>
					<div
						className="flex gap-1"
						role="meter"
						aria-label="Password strength"
						aria-valuemin={0}
						aria-valuemax={total}
						aria-valuenow={score}
						aria-valuetext={label}
					>
						{all.map((rule, index) => (
							<span
								key={rule.key ?? index}
								aria-hidden="true"
								className={`h-1.5 flex-1 ${met[index] && password ? color : 'bg-app-border'}`}
							/>
						))}
					</div>
				</>
			)}
			{showRequirements && (
				<ul className="m-0 grid list-none gap-1 p-0 text-xs text-app-muted sm:grid-cols-2">
					{all.map((rule, index) => (
						<li key={rule.key ?? index} className="flex items-center gap-2">
							<span
								aria-hidden="true"
								className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center ${
									met[index] ? 'text-emerald-600 dark:text-emerald-400' : 'text-app-border'
								}`}
							>
								{met[index] ? <CheckIcon className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 bg-current" />}
							</span>
							<span className={met[index] ? 'text-app-text' : undefined}>
								{rule.label}
								{rule.required === false && <span className="ml-1 text-app-muted">(recommended)</span>}
							</span>
							<span className="sr-only">{met[index] ? 'met' : 'not met'}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default PasswordStrengthInfo
