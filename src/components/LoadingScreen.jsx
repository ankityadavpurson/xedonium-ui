import Loader from './Loader'
import PageLayout from './PageLayout'

/** Full-page centered loader. Takes the same `variant`, `size`, `label`, `description`, `icon` and `iconMotion` as Loader (default: the fan). */
const LoadingScreen = ({ variant = 'fan', size = 'md', label = 'Loading', description, icon, iconMotion }) => (
	<PageLayout maxWidth="max-w-sm" centerContent>
		<Loader variant={variant} size={size} label={label} description={description} icon={icon} iconMotion={iconMotion} />
	</PageLayout>
)

export default LoadingScreen
