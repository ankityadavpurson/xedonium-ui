// Renders docs/public/favicon.svg into the raster icons search engines and phones expect:
//   favicon-48x48.png, favicon-192x192.png  (Google wants a square icon whose size is a multiple of 48px)
//   apple-touch-icon.png                    (180px on a solid background, because iOS fills transparency with black)
//   favicon.ico                             (16, 32 and 48px; the fallback every crawler requests at /favicon.ico)
// Run after changing the SVG: node scripts/generate-favicons.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.join(import.meta.dirname, '../docs/public')
const svg = fs.readFileSync(path.join(publicDir, 'favicon.svg'))
const SVG_SIZE = 64

// Rasterize at the target size (a high density keeps the edges sharp instead of scaling a small bitmap up)
const render = (size, { background, padding = 0 } = {}) => {
	const inner = Math.round(size - padding * 2)
	const icon = sharp(svg, { density: (72 * inner) / SVG_SIZE }).resize(inner, inner)
	if (!background) return icon.png({ compressionLevel: 9 }).toBuffer()
	return icon
		.png()
		.toBuffer()
		.then(buffer =>
			sharp({ create: { width: size, height: size, channels: 4, background } })
				.composite([{ input: buffer, left: padding, top: padding }])
				.png({ compressionLevel: 9 })
				.toBuffer()
		)
}

// An .ico file is a small header plus one entry per image; modern formats allow PNG data inside
const ico = images => {
	const header = Buffer.alloc(6)
	header.writeUInt16LE(1, 2) // type: icon
	header.writeUInt16LE(images.length, 4)
	let offset = 6 + images.length * 16
	const entries = images.map(({ size, data }) => {
		const entry = Buffer.alloc(16)
		entry.writeUInt8(size, 0) // width
		entry.writeUInt8(size, 1) // height
		entry.writeUInt16LE(1, 4) // color planes
		entry.writeUInt16LE(32, 6) // bits per pixel
		entry.writeUInt32LE(data.length, 8)
		entry.writeUInt32LE(offset, 12)
		offset += data.length
		return entry
	})
	return Buffer.concat([header, ...entries, ...images.map(image => image.data)])
}

const write = (name, data) => {
	fs.writeFileSync(path.join(publicDir, name), data)
	console.log(`${name}  ${data.length} bytes`)
}

write('favicon-48x48.png', await render(48))
write('favicon-192x192.png', await render(192))
write('apple-touch-icon.png', await render(180, { background: '#efeff0', padding: 20 }))
write('favicon.ico', ico(await Promise.all([16, 32, 48].map(async size => ({ size, data: await render(size) })))))
