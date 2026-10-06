import { Avatar, Divider, Progress, Skeleton } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Avatar name="Ada Lovelace" size="sm" />
			<Avatar name="Linus Torvalds" />
			<Avatar name="Grace Hopper" size="lg" />
			<Avatar src="https://i.pravatar.cc/120?img=12" name="Ada Lovelace" />
			<Avatar href="#profile" name="Linus Torvalds" />
			<div className="w-56">
				<Progress value={62} label="Upload" showValue />
			</div>
			<div className="w-56">
				<Progress label="Working" />
			</div>
			<Progress variant="circular" value={62} showValue label="Circular" />
			<div className="w-56">
				<Skeleton lines={3} />
			</div>
			<Skeleton circle className="h-10 w-10" />
			<div className="w-full">
				<Divider label="or" />
			</div>
		</div>
	)
}
