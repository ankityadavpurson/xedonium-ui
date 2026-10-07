import type { IconProps } from '../../types'

import SquareCheckIcon from './SquareCheck'

// Same drawing as SquareCheckIcon under the name CheckSquareIcon (the name next to CheckCircleIcon)
const CheckSquareIcon = (props: IconProps) => <SquareCheckIcon {...props} />

export default CheckSquareIcon
