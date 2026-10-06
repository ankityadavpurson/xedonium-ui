import props from './props'

// Kept apart from content/index.js so the large props tables only ship with the pages that show them
export const propsFor = component => props[component.slug]
