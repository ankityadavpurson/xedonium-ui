import Loader from './Loader'
import PageLayout from './PageLayout'

/** Full-page centered loader. Takes the same `variant`, `size`, `label` and `description` as Loader (default: the fan). */
const LoadingScreen = ({ variant = 'fan', size = 'md', label = 'Loading', description }) => (
	<PageLayout maxWidth="max-w-sm" centerContent>
		<Loader variant={variant} size={size} label={label} description={description} />
	</PageLayout>
)

export default LoadingScreen
