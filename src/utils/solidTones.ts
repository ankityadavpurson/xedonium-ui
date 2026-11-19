import type { Tone } from '../types'

/** Opaque background and text classes per tone, shared by `Toast` and the `solid` variant of `Alert`. */
const SOLID_TONES: Record<Tone, string> = {
	success: 'bg-emerald-700 text-white',
	danger: 'bg-red-700 text-white',
	warning: 'bg-amber-400 text-black',
	info: 'bg-sky-700 text-white',
}

export default SOLID_TONES
