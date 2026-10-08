import { Carousel, Image } from 'xedonium'

// Inline SVGs keep the demo offline; use your own photo URLs in real life
const scene = (top, bottom, shapes) =>
	'data:image/svg+xml,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/>${shapes}</svg>`
	)

const photos = [
	{
		title: 'Mountains at dawn',
		src: scene(
			'#bfdbfe',
			'#eff6ff',
			'<circle cx="610" cy="130" r="52" fill="#fde68a"/><path d="M0 450V300l170-150 150 130 130-90 180 170v140z" fill="#1d4ed8"/><path d="M0 450V360l210-110 170 100 190-80 230 90v90z" fill="#1e3a8a"/>'
		),
	},
	{
		title: 'Calm sea',
		src: scene(
			'#93c5fd',
			'#1d4ed8',
			'<circle cx="200" cy="120" r="46" fill="#fef9c3"/><path d="M0 300q100-30 200 0t200 0 200 0 200 0v150H0z" fill="#2563eb"/><path d="M0 360q100-30 200 0t200 0 200 0 200 0v90H0z" fill="#1e40af"/>'
		),
	},
	{
		title: 'Night sky',
		src: scene(
			'#1e3a8a',
			'#0f172a',
			'<circle cx="640" cy="110" r="40" fill="#e0f2fe"/><g fill="#bfdbfe"><circle cx="120" cy="80" r="3"/><circle cx="300" cy="140" r="2"/><circle cx="430" cy="60" r="3"/><circle cx="520" cy="190" r="2"/><circle cx="720" cy="250" r="3"/><circle cx="200" cy="260" r="2"/></g><path d="M0 450V360l140-60 120 50 160-80 180 90 200-40v130z" fill="#0b1220"/>'
		),
	},
]

export default function Demo() {
	return (
		<Carousel label="Photo gallery" className="max-w-xl">
			{photos.map(photo => (
				<figure key={photo.title} className="relative m-0">
					<Image src={photo.src} alt={photo.title} ratio="video" />
					<figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-2 text-sm font-semibold text-white">
						{photo.title}
					</figcaption>
				</figure>
			))}
		</Carousel>
	)
}
