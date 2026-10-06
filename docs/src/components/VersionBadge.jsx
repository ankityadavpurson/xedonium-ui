import { useLatestVersion } from '../useLatestVersion'

/** Small "v0.2.0" tag that links to the package on npm. `className` adjusts spacing where it is placed. */
const VersionBadge = ({ className = '' }) => {
	const version = useLatestVersion()
	return (
		<a
			href={`https://www.npmjs.com/package/xedonium/v/${version}`}
			target="_blank"
			rel="noreferrer"
			aria-label={`Version ${version} on npm`}
			className={`border border-app-border bg-app-card px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-app-muted transition hover:border-app-strong hover:text-app-text ${className}`}
		>
			v{version}
		</a>
	)
}

export default VersionBadge
