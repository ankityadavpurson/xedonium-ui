import type { IconProps } from '../../types'

import FullscreenExitIcon from './FullscreenExit'

// Same drawing as FullscreenExitIcon under the name MinimizeIcon
const MinimizeIcon = (props: IconProps) => <FullscreenExitIcon {...props} />

export default MinimizeIcon
