import { useState, type ReactNode } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import ChevronLeftIcon from './icons/ChevronLeft'
import ChevronRightIcon from './icons/ChevronRight'
import ChevronsLeftIcon from './icons/ChevronsLeft'
import ChevronsRightIcon from './icons/ChevronsRight'

export interface TransferItem {
	key: string
	label: ReactNode
	/** A disabled item stays where it is and cannot be ticked or moved. */
	disabled?: boolean
}

export interface TransferListProps {
	/** Every item, in the order they appear in whichever list they are in. */
	items: TransferItem[]
	/** Keys of the items in the right-hand list (controlled). */
	value?: string[]
	/** Initial keys of the right-hand list when uncontrolled. */
	defaultValue?: string[]
	/** Receives the keys now in the right-hand list. */
	onChange?: (keys: string[]) => void
	/** Headings of the two lists. */
	titles?: [string, string]
	/** Height of each list in px. */
	height?: number
	/** Accessible name of the whole control. */
	label?: string
	className?: string
}

interface ColumnProps {
	title: string
	items: TransferItem[]
	checked: string[]
	onToggle: (key: string) => void
	onToggleAll: (all: boolean) => void
	height: number
}

const Column = ({ title, items, checked, onToggle, onToggleAll, height }: ColumnProps) => {
	const movable = items.filter(item => !item.disabled)
	const ticked = movable.filter(item => checked.includes(item.key)).length
	const all = movable.length > 0 && ticked === movable.length

	return (
		<div className="flex min-w-0 flex-1 flex-col border border-app-border bg-app-card">
			<div className="flex items-center gap-3 border-b border-app-border px-3 py-3">
				<Checkbox
					aria-label={`Select all in ${title}`}
					checked={all}
					indeterminate={ticked > 0 && !all}
					disabled={movable.length === 0}
					onChange={onToggleAll}
				/>
				<div className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-widest text-app-text">
					{title}
				</div>
				<div className="shrink-0 text-xs text-app-muted">
					{ticked}/{items.length} selected
				</div>
			</div>
			<ul
				role="listbox"
				aria-multiselectable="true"
				aria-label={title}
				style={{ height }}
				className="m-0 list-none overflow-y-auto p-0"
			>
				{items.length === 0 && <li className="px-3 py-4 text-center text-xs text-app-muted">Nothing here</li>}
				{items.map(item => (
					<li key={item.key} role="option" aria-selected={checked.includes(item.key)} className="px-3 py-0.5">
						<Checkbox
							label={item.label}
							checked={checked.includes(item.key)}
							disabled={item.disabled}
							onChange={() => onToggle(item.key)}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

/**
 * Two lists with checkboxes and buttons to move items between them: pick what to include, what to enable, who to
 * invite. `items` is everything; `value` holds the keys that are in the right-hand list (`defaultValue` starts it
 * uncontrolled) and `onChange` receives the new keys. Tick items, then use the arrows to move the ticked ones, or the
 * double arrows to move everything that can move. Disabled items stay put.
 */
const TransferList = ({
	items,
	value,
	defaultValue = [],
	onChange,
	titles = ['Choices', 'Chosen'],
	height = 220,
	label = 'Transfer list',
	className = '',
}: TransferListProps) => {
	const [inner, setInner] = useState<string[]>(defaultValue)
	const [checked, setChecked] = useState<string[]>([])
	const right = value ?? inner

	const leftItems = items.filter(item => !right.includes(item.key))
	const rightItems = items.filter(item => right.includes(item.key))
	const leftChecked = leftItems.filter(item => checked.includes(item.key) && !item.disabled)
	const rightChecked = rightItems.filter(item => checked.includes(item.key) && !item.disabled)

	const setRight = (keys: string[]) => {
		// keep the original order of `items`, whatever order the keys arrive in
		const ordered = items.filter(item => keys.includes(item.key)).map(item => item.key)
		if (value === undefined) setInner(ordered)
		onChange?.(ordered)
	}
	const toggle = (key: string) => setChecked(c => (c.includes(key) ? c.filter(k => k !== key) : [...c, key]))
	const toggleAll = (list: TransferItem[]) => (all: boolean) => {
		const keys = list.filter(item => !item.disabled).map(item => item.key)
		setChecked(c => (all ? [...new Set([...c, ...keys])] : c.filter(k => !keys.includes(k))))
	}
	const move = (moving: TransferItem[], toRight: boolean) => {
		const keys = moving.map(item => item.key)
		setRight(toRight ? [...right, ...keys] : right.filter(k => !keys.includes(k)))
		setChecked(c => c.filter(k => !keys.includes(k)))
	}
	const movable = (list: TransferItem[]) => list.filter(item => !item.disabled)

	return (
		<div
			role="group"
			aria-label={label}
			className={`flex flex-col items-stretch gap-3 sm:flex-row sm:items-center ${className}`}
		>
			<Column
				title={titles[0]}
				items={leftItems}
				checked={checked}
				onToggle={toggle}
				onToggleAll={toggleAll(leftItems)}
				height={height}
			/>
			<div className="flex shrink-0 flex-row justify-center gap-2 sm:flex-col">
				<Button
					variant="secondary"
					aria-label="Move all to the right"
					tooltip="Move all to the right"
					tooltipPlacement="top"
					disabled={movable(leftItems).length === 0}
					onClick={() => move(movable(leftItems), true)}
				>
					<ChevronsRightIcon />
				</Button>
				<Button
					variant="secondary"
					aria-label="Move selected to the right"
					tooltip="Move selected to the right"
					tooltipPlacement="top"
					disabled={leftChecked.length === 0}
					onClick={() => move(leftChecked, true)}
				>
					<ChevronRightIcon />
				</Button>
				<Button
					variant="secondary"
					aria-label="Move selected to the left"
					tooltip="Move selected to the left"
					tooltipPlacement="top"
					disabled={rightChecked.length === 0}
					onClick={() => move(rightChecked, false)}
				>
					<ChevronLeftIcon />
				</Button>
				<Button
					variant="secondary"
					aria-label="Move all to the left"
					tooltip="Move all to the left"
					tooltipPlacement="top"
					disabled={movable(rightItems).length === 0}
					onClick={() => move(movable(rightItems), false)}
				>
					<ChevronsLeftIcon />
				</Button>
			</div>
			<Column
				title={titles[1]}
				items={rightItems}
				checked={checked}
				onToggle={toggle}
				onToggleAll={toggleAll(rightItems)}
				height={height}
			/>
		</div>
	)
}

export default TransferList
