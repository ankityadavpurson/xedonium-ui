import Flex from './Flex'

/** Evenly spaced children, vertical by default. `direction="row"` for a horizontal stack. */
const Stack = ({ direction = 'column', gap = 4, ...rest }) => <Flex direction={direction} gap={gap} {...rest} />

export default Stack
