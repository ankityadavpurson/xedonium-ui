import { copyFileSync, mkdirSync } from 'node:fs'

mkdirSync('dist', { recursive: true })
copyFileSync('src/styles.css', 'dist/styles.css')
copyFileSync('src/tailwind-v4.css', 'dist/tailwind-v4.css')
