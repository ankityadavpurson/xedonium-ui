import { Avatar, Flex } from 'xedonium'

const PersonIcon = () => (
	<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
		<circle cx="12" cy="8" r="4" />
		<path strokeLinecap="round" d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
	</svg>
)

export default function Demo() {
	return (
		<Flex align="center" wrap gap={4}>
			{/* any image URL */}
			<Avatar src="https://i.pravatar.cc/120?img=12" name="Ada Lovelace" size="lg" />
			{/* your own content instead of initials */}
			<Avatar name="Guest" size="lg">
				<PersonIcon />
			</Avatar>
			{/* a link to a profile, here opening in a new tab */}
			<Avatar
				href="https://github.com/ankityadavpurson"
				target="_blank"
				rel="noreferrer"
				name="Ankit on GitHub"
				src="https://github.com/ankityadavpurson.png"
				size="lg"
			/>
			{/* a link whose image failed to load falls back to initials */}
			<Avatar href="#profile" src="/missing.png" name="Linus Torvalds" size="lg" />
		</Flex>
	)
}
