import { useEffect, useLayoutEffect } from 'react'

/** `useLayoutEffect` in the browser and `useEffect` on a server, where React warns that a layout effect does nothing. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
