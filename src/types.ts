import type { ComponentPropsWithoutRef, ComponentType, ElementType, ReactNode } from 'react'

/** The three sizes most components share. */
export type Size = 'sm' | 'md' | 'lg'

/** Props every icon takes. */
export interface IconProps {
	/** Size and color classes; icons follow the text color. */
	className?: string
}

/** Resolved color theme. */
export type Theme = 'light' | 'dark'

/** What the user picked: a fixed theme, or `system` to follow the device. */
export type ThemeMode = Theme | 'system'

/** Where an overlay sits on screen (Toast). */
export type ScreenPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'middle-left'
	| 'middle-center'
	| 'middle-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'

/** Spacing steps (Tailwind) accepted by Flex, Stack and Grid. */
export type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8

/** Tone of an alert, toast or similar message. */
export type Tone = 'info' | 'success' | 'warning' | 'danger'

/** `as` plus the native props of the default element, for components that can render another tag. */
export type AsProps<Own, Default extends ElementType = 'div'> = Own & {
	as?: ElementType
} & Omit<ComponentPropsWithoutRef<Default>, keyof Own | 'as'>

/** An option of Select, MultiSelect and SearchSelect. */
export interface SelectOption {
	value: string
	label: ReactNode
	disabled?: boolean
}

/** Where a floating panel sits next to its trigger; `auto` picks the side with room. */
export type Placement =
	| 'auto'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end'

/** Props for components that render a router link: pass `linkComponent={Link} linkProp="to"` for react-router. */
export interface LinkOptions {
	linkComponent?: ElementType | ComponentType<never>
	linkProp?: string
}
