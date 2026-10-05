import fs from 'node:fs'
import path from 'node:path'

// GitHub Pages serves 404.html for unknown paths; a copy of index.html lets deep links reach the SPA router
const dist = path.join(import.meta.dirname, '../docs/dist')
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
