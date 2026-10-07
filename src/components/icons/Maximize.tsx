import type { IconProps } from '../../types'

import FullscreenIcon from './Fullscreen'

// Same drawing as FullscreenIcon under the name MaximizeIcon
const MaximizeIcon = (props: IconProps) => <FullscreenIcon {...props} />

export default MaximizeIcon
