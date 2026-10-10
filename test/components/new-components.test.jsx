import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import FileExplorer from '../../src/components/FileExplorer'
import LogViewer from '../../src/components/LogViewer'
import Modal from '../../src/components/Modal'
import NestedTable from '../../src/components/NestedTable'
import NetworkConnection from '../../src/components/NetworkConnection'
import NotificationCenter from '../../src/components/NotificationCenter'
import PasswordStrengthInfo, { defaultPasswordRules, passwordRules } from '../../src/components/PasswordStrengthInfo'
import { describeNode, languageOf, readableSize, sortNodes } from '../../src/utils/files'
import { entryFromRecord, formatLogTime, parseLogFile, toLogLevel } from '../../src/utils/logs'

describe('NestedTable', () => {
	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'role', header: 'Role', align: 'right' },
	]
	const tree = [
		{
			id: 'eng',
			name: 'Engineering',
			role: 'Department',
			children: [
				{ id: 'ada', name: 'Ada', role: 'Engineer' },
				{ id: 'team', name: 'Platform', role: 'Team', children: [{ id: 'grace', name: 'Grace', role: 'Lead' }] },
			],
		},
		{ id: 'ops', name: 'Operations', role: 'Department' },
	]

	it('expands nested children rows and collapses them again', () => {
		render(<NestedTable columns={columns} rows={tree} />)
		expect(screen.queryByText('Ada')).toBeNull()
		const toggle = screen.getByRole('button', { name: 'Expand eng' })
		expect(toggle).toHaveAttribute('aria-expanded', 'false')
		fireEvent.click(toggle)
		expect(screen.getByText('Ada')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Collapse eng' })).toHaveAttribute('aria-expanded', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'Expand team' }))
		expect(screen.getByText('Grace')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Collapse eng' }))
		expect(screen.queryByText('Ada')).toBeNull()
		expect(screen.queryByRole('button', { name: 'Expand ops' })).toBeNull()
	})

	it('indents each level and aligns cells', () => {
		render(<NestedTable columns={columns} rows={tree} defaultExpanded={['eng', 'team']} />)
		const indent = text => screen.getByText(text).closest('span').style.paddingLeft
		expect(indent('Engineering')).toBe('0rem')
		expect(indent('Ada')).toBe('1.25rem')
		expect(indent('Grace')).toBe('2.5rem')
		expect(screen.getByText('Lead')).toHaveClass('text-right')
	})

	it('shows a details panel from renderDetails, for every row unless canExpand says otherwise', () => {
		render(
			<NestedTable
				columns={columns}
				rows={tree.map(row => ({ id: row.id, name: row.name, role: row.role }))}
				renderDetails={row => <p>Details of {row.name}</p>}
				canExpand={row => row.id !== 'ops'}
			/>
		)
		expect(screen.queryByRole('button', { name: 'Expand ops' })).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Expand eng' }))
		const details = screen.getByText('Details of Engineering')
		expect(details.closest('td')).toHaveAttribute('colspan', '2')
		expect(screen.getByRole('button', { name: 'Collapse eng' })).toHaveAttribute(
			'aria-controls',
			details.closest('tr').id
		)
		fireEvent.click(screen.getByRole('button', { name: 'Collapse eng' }))
		expect(screen.queryByText('Details of Engineering')).toBeNull()
	})

	it('can show details and nested rows together, and nest another table in the details', () => {
		render(
			<NestedTable
				columns={columns}
				rows={tree}
				defaultExpanded={['eng']}
				renderDetails={row => (
					<NestedTable
						nested
						caption={`${row.name} items`}
						columns={[{ key: 'k', header: 'Item' }]}
						rows={[{ id: 'x', k: 'inner' }]}
					/>
				)}
			/>
		)
		expect(screen.getByText('inner')).toBeInTheDocument()
		expect(screen.getByText('Ada')).toBeInTheDocument()
		const inner = screen.getByRole('table', { name: 'Engineering items' })
		expect(inner.parentElement).not.toHaveClass('border')
	})

	it('keeps one row open at a time with exclusive, per level', () => {
		render(<NestedTable columns={columns} rows={tree} exclusive renderDetails={row => <p>More about {row.name}</p>} />)
		fireEvent.click(screen.getByRole('button', { name: 'Expand eng' }))
		fireEvent.click(screen.getByRole('button', { name: 'Expand team' }))
		expect(screen.getByText('More about Platform')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Expand ada' }))
		expect(screen.queryByText('More about Platform')).toBeNull()
		expect(screen.getByText('More about Ada')).toBeInTheDocument()
		expect(screen.getByText('More about Engineering')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Expand ops' }))
		expect(screen.queryByText('More about Engineering')).toBeNull()
		expect(screen.getByText('More about Operations')).toBeInTheDocument()
	})

	it('calls onExpand when a row opens (not when it closes) and shows a spinner for loading rows', () => {
		const onExpand = vi.fn()
		const { rerender } = render(
			<NestedTable columns={columns} rows={tree} renderDetails={() => 'loaded'} onExpand={onExpand} />
		)
		fireEvent.click(screen.getByRole('button', { name: 'Expand ops' }))
		expect(onExpand).toHaveBeenCalledWith(expect.objectContaining({ id: 'ops' }))
		fireEvent.click(screen.getByRole('button', { name: 'Collapse ops' }))
		expect(onExpand).toHaveBeenCalledTimes(1)
		rerender(<NestedTable columns={columns} rows={tree} renderDetails={() => 'loaded'} loadingKeys={['eng']} />)
		const loading = screen.getByRole('button', { name: 'Expand eng' })
		expect(loading).toBeDisabled()
		expect(loading.querySelector('svg.animate-spin')).toBeInTheDocument()
	})

	it('is controlled by expanded and reports changes', () => {
		const onExpandedChange = vi.fn()
		render(<NestedTable columns={columns} rows={tree} expanded={['eng']} onExpandedChange={onExpandedChange} />)
		expect(screen.getByText('Ada')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Collapse eng' }))
		expect(onExpandedChange).toHaveBeenLastCalledWith([])
		expect(screen.getByText('Ada')).toBeInTheDocument()
	})

	it('puts the expand button and row actions in a last column with expandPosition="end"', () => {
		const onEdit = vi.fn()
		render(
			<NestedTable
				columns={columns}
				rows={tree}
				expandPosition="end"
				actionsHeader="Actions"
				rowKey={row => `row-${row.id}`}
				rowLabel={row => row.name}
				rowActions={(row, open) => (
					<button type="button" onClick={() => onEdit(row.id, open)}>
						Edit {row.name}
					</button>
				)}
			/>
		)
		expect(screen.getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Name', 'Role', 'Actions'])
		fireEvent.click(screen.getByRole('button', { name: 'Edit Engineering' }))
		expect(onEdit).toHaveBeenLastCalledWith('eng', false)
		fireEvent.click(screen.getByRole('button', { name: 'Expand Engineering' }))
		fireEvent.click(screen.getByRole('button', { name: 'Edit Engineering' }))
		expect(onEdit).toHaveBeenLastCalledWith('eng', true)
		expect(screen.getByText('Ada')).toBeInTheDocument()
		expect(screen.getAllByRole('row')).toHaveLength(5)
	})

	it('shows the empty message across the table, and a caption for screen readers', () => {
		render(<NestedTable columns={columns} rows={[]} empty="Nothing here" caption="People" />)
		expect(screen.getByText('Nothing here')).toHaveAttribute('colspan', '2')
		expect(screen.getByText('People')).toHaveClass('sr-only')
	})
})

describe('PasswordStrengthInfo', () => {
	it('evaluates the built-in rules and labels the strength', () => {
		const { rerender } = render(<PasswordStrengthInfo password="" />)
		expect(screen.getByText('Enter a password')).toBeInTheDocument()
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0')
		rerender(<PasswordStrengthInfo password="abc" />)
		expect(screen.getByText('Very weak')).toBeInTheDocument()
		rerender(<PasswordStrengthInfo password="abcD" />)
		expect(screen.getByText('Weak')).toBeInTheDocument()
		rerender(<PasswordStrengthInfo password="abcD1234" />)
		expect(screen.getByText('Good')).toBeInTheDocument()
		rerender(<PasswordStrengthInfo password="GoodPass1!" />)
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '5')
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuemax', '5')
		expect(screen.getByText('Strong')).toBeInTheDocument()
	})

	it('announces which requirements are met', () => {
		render(<PasswordStrengthInfo password="abcdefgh" />)
		const items = screen.getAllByRole('listitem')
		expect(items).toHaveLength(5)
		expect(items[0]).toHaveTextContent('At least 8 characters')
		expect(within(items[0]).getByText('met')).toBeInTheDocument()
		expect(within(items[1]).getByText('not met')).toBeInTheDocument()
	})

	it('follows minLength, and hides the strength or the checklist on request', () => {
		const { rerender } = render(<PasswordStrengthInfo password="abc" minLength={12} />)
		expect(screen.getByText('At least 12 characters')).toBeInTheDocument()
		rerender(<PasswordStrengthInfo password="abc" showRequirements={false} />)
		expect(screen.queryByRole('listitem')).toBeNull()
		expect(screen.getByRole('meter')).toBeInTheDocument()
		rerender(<PasswordStrengthInfo password="abc" showStrength={false} />)
		expect(screen.queryByRole('meter')).toBeNull()
		expect(screen.getAllByRole('listitem')).toHaveLength(5)
	})

	it('replaces the built-in rules with custom rules', () => {
		render(
			<PasswordStrengthInfo
				password="hello world"
				rules={[
					{ label: 'No spaces', test: password => !password.includes(' ') },
					{ key: 'hello', label: 'Mentions hello', test: password => password.includes('hello') },
				]}
			/>
		)
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
		expect(screen.queryByText('A number')).toBeNull()
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuemax', '2')
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '1')
		expect(screen.getByText('Fair')).toBeInTheDocument()
	})

	it('adds extra rules after the built-in ones', () => {
		render(
			<PasswordStrengthInfo
				password="GoodPass1!"
				extraRules={[{ label: 'Not "password"', test: p => !/password/i.test(p) }]}
			/>
		)
		expect(screen.getAllByRole('listitem')).toHaveLength(6)
		expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '6')
	})

	it('reports the result, where recommended rules do not block validity', () => {
		const onResult = vi.fn()
		const rules = [passwordRules.minLength(6), { label: 'A symbol', test: p => /[!?]/.test(p), required: false }]
		const { rerender } = render(<PasswordStrengthInfo password="abc" rules={rules} onResult={onResult} />)
		expect(onResult).toHaveBeenLastCalledWith(
			expect.objectContaining({ score: 0, total: 2, valid: false, level: 0, met: [false, false] })
		)
		rerender(<PasswordStrengthInfo password="abcdef" rules={rules} onResult={onResult} />)
		expect(onResult).toHaveBeenLastCalledWith(expect.objectContaining({ score: 1, valid: true, label: 'Fair' }))
		expect(screen.getByText('(recommended)')).toBeInTheDocument()
		const calls = onResult.mock.calls.length
		rerender(<PasswordStrengthInfo password="abcdef" rules={rules} onResult={onResult} />)
		expect(onResult).toHaveBeenCalledTimes(calls)
		rerender(<PasswordStrengthInfo password="" rules={rules} onResult={onResult} />)
		expect(onResult).toHaveBeenLastCalledWith(expect.objectContaining({ level: -1, label: 'Enter a password' }))
	})

	it('takes its own strength labels, colors and empty text', () => {
		const { container, rerender } = render(
			<PasswordStrengthInfo
				password=""
				emptyLabel="Type something"
				labels={['Bad', 'Okay', 'Great']}
				colors={['bg-a', 'bg-b', 'bg-c']}
			/>
		)
		expect(screen.getByText('Type something')).toBeInTheDocument()
		rerender(
			<PasswordStrengthInfo password="Abcdefg1!" labels={['Bad', 'Okay', 'Great']} colors={['bg-a', 'bg-b', 'bg-c']} />
		)
		expect(screen.getByText('Great')).toBeInTheDocument()
		expect(container.querySelector('.bg-c')).toBeInTheDocument()
	})

	it('has ready-made rules', () => {
		expect(defaultPasswordRules(10)[0].label).toBe('At least 10 characters')
		expect(passwordRules.minLength().test('1234567')).toBe(false)
		expect(passwordRules.minLength().test('12345678')).toBe(true)
		expect(passwordRules.uppercase.test('aÄ')).toBe(true)
		expect(passwordRules.lowercase.test('AB')).toBe(false)
		expect(passwordRules.digit.test('a1')).toBe(true)
		expect(passwordRules.special.test('abc1')).toBe(false)
		expect(passwordRules.special.test('ab c')).toBe(true)
		expect(passwordRules.noSpaces.test('a b')).toBe(false)
		const personal = passwordRules.notContaining(['Ada', ' ', 'Smith'], 'Not your name')
		expect(personal.label).toBe('Not your name')
		expect(personal.test('xxADAxx')).toBe(false)
		expect(personal.test('s3cret')).toBe(true)
		expect(passwordRules.notContaining([]).label).toBe('Not based on your details')
	})
})

describe('logs utils', () => {
	it('formats times as HH:mm:ss.SSS and leaves other text alone', () => {
		expect(formatLogTime(new Date(2024, 0, 2, 3, 4, 5, 6))).toBe('03:04:05.006')
		expect(formatLogTime(new Date(2024, 0, 2, 13, 4, 5, 678).getTime())).toBe('13:04:05.678')
		expect(formatLogTime('not a date')).toBe('not a date')
		expect(formatLogTime(undefined)).toBe('')
	})

	it('maps logger level names to the four levels', () => {
		expect(['debug', 'INFO', 'warn', 'error'].map(toLogLevel)).toEqual(['debug', 'info', 'warn', 'error'])
		expect(
			['warning', 'fatal', 'critical', 'err', 'verbose', 'silly', 'trace', 'odd', undefined].map(toLogLevel)
		).toEqual(['warn', 'error', 'error', 'error', 'debug', 'debug', 'debug', 'info', 'info'])
	})

	it('builds an entry from a structured record, moving a stack out of the details', () => {
		expect(entryFromRecord({ level: 'error', message: 'boom', timestamp: 't', source: 'api', code: 7 }, 1)).toEqual({
			id: 1,
			level: 'error',
			message: 'boom',
			timestamp: 't',
			source: 'api',
			data: { code: 7 },
			stack: undefined,
		})
		expect(
			entryFromRecord(
				{ logType: 'warning', message: 'm', time: 5, label: 'db', data: { url: '/x', stack: 'Error\n  at a' } },
				2
			)
		).toMatchObject({
			level: 'warn',
			timestamp: 5,
			source: 'db',
			data: { url: '/x' },
			stack: 'Error\n  at a',
		})
		expect(entryFromRecord({ message: 'm', stack: 'S' }, 3)).toMatchObject({ stack: 'S', data: undefined })
		expect(entryFromRecord({ message: 'm', data: { stack: 'only' } }, 4)).toMatchObject({
			stack: 'only',
			data: undefined,
		})
		expect(entryFromRecord({ message: 'm', errorData: 'text' }, 5).data).toBe('text')
		expect(entryFromRecord({}, 6)).toMatchObject({ message: '', level: 'info', source: undefined })
	})

	it('parses a log file: JSON lines become entries, runs of other lines become one block', () => {
		const file = [
			'{"level":"info","message":"started","timestamp":"2024-01-01T00:00:00Z","port":3000}',
			'',
			'Error: connection lost',
			'    at connect (db.js:1:1)',
			'    at run (db.js:2:2)',
			'',
			'{"level":"warn","message":"slow"}',
			'plain console text',
			'{not json}',
			'{"no":"message"}',
		].join('\r\n')
		const entries = parseLogFile(file)
		expect(entries.map(e => [e.level, e.source ?? null])).toEqual([
			['info', null],
			['error', 'console'],
			['warn', null],
			['info', 'console'],
		])
		expect(entries[0]).toMatchObject({ id: 'log-0', message: 'started', data: { port: 3000 } })
		expect(entries[1].message).toBe('Error: connection lost\n    at connect (db.js:1:1)\n    at run (db.js:2:2)')
		expect(entries[3].message).toBe('plain console text\n{not json}\n{"no":"message"}')
		expect(parseLogFile('')).toEqual([])
		expect(parseLogFile('\n\n')).toEqual([])
	})
})

describe('LogViewer', () => {
	const logs = [
		{ id: 1, level: 'info', message: 'Started worker', timestamp: '2024-01-01T10:00:00.123', source: 'queue' },
		{ id: 2, level: 'error', message: 'Worker failed', source: 'queue' },
		{ id: 3, level: 'warn', message: 'Slow query' },
		{ id: 4, level: 'info', message: 'Idle' },
	]

	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	const type = (value, name = 'Search logs') => {
		fireEvent.change(screen.getByRole('searchbox', { name }), { target: { value } })
		act(() => vi.advanceTimersByTime(300))
	}

	it('filters logs by search (after a short pause) and highlights the match', () => {
		render(<LogViewer logs={logs} />)
		fireEvent.change(screen.getByRole('searchbox', { name: 'Search logs' }), { target: { value: 'failed' } })
		expect(screen.getByText('Started worker')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(300))
		expect(screen.queryByText('Started worker')).toBeNull()
		expect(screen.getByText('failed').tagName).toBe('MARK')
		type('QUEUE')
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
		type('nothing like this')
		expect(screen.getByText('No entries match')).toBeInTheDocument()
	})

	it('filters by level with counts, only for levels that exist', () => {
		render(<LogViewer logs={logs} />)
		expect(screen.getByRole('button', { name: 'All (4)' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.queryByRole('button', { name: /Debug/ })).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Errors (1)' }))
		expect(screen.getAllByRole('listitem')).toHaveLength(1)
		expect(screen.getByText('Worker failed')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Info (2)' }))
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
		fireEvent.click(screen.getByRole('button', { name: 'Info (2)' }))
		expect(screen.getAllByRole('listitem')).toHaveLength(4)
	})

	it('shows the time, level and source of an entry, and marks errors', () => {
		render(<LogViewer logs={logs} />)
		const first = screen.getAllByRole('listitem')[0]
		expect(within(first).getByText('10:00:00.123')).toBeInTheDocument()
		expect(within(first).getByText('info')).toBeInTheDocument()
		expect(within(first).getByText('[queue]')).toBeInTheDocument()
		expect(screen.getAllByRole('listitem')[1]).toHaveClass('bg-red-500/10')
		expect(screen.getAllByRole('listitem')[1]).toHaveAttribute('data-level', 'error')
	})

	it('shows empty states, and names the log area', () => {
		const { rerender } = render(<LogViewer logs={[]} emptyText="Waiting for the server…" label="Server log" />)
		expect(screen.getByText('Waiting for the server…')).toBeInTheDocument()
		expect(screen.getByRole('log', { name: 'Server log' })).toBeInTheDocument()
		rerender(<LogViewer logs={[]} />)
		expect(screen.getByText('No logs yet')).toBeInTheDocument()
	})

	it('shows long details and stack traces cut, with Show all', () => {
		const long = 'x'.repeat(1000)
		const lines = Array.from({ length: 14 }, (_, i) => `    at frame${i} (file.js:${i}:1)`)
		render(
			<LogViewer
				logs={[
					{ id: 'a', level: 'info', message: 'payload', data: { long } },
					{ id: 'b', level: 'error', message: 'crash\nsecond line', stack: ['Error: crash', ...lines].join('\n') },
					{ id: 'c', level: 'info', message: 'text', data: 'plain text details' },
				]}
			/>
		)
		expect(screen.getByText('plain text details')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: /Show all \(1,0\d\d characters\)/ }))
		expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Show less' }))
		expect(screen.getByRole('button', { name: /Show all \(1,0\d\d characters\)/ })).toBeInTheDocument()
		expect(screen.getByText('second line')).toBeInTheDocument()
		expect(screen.queryByText(/frame13/)).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: /Show all \(\d+ more lines\)/ }))
		expect(screen.getByText(/frame13/)).toBeInTheDocument()
		expect(screen.getByText(/frame0/).closest('div')).toHaveClass('opacity-60')
		fireEvent.click(screen.getByRole('button', { name: 'Show less' }))
		expect(screen.queryByText(/frame13/)).toBeNull()
	})

	it('keeps the newest entry in view, pauses when the reader scrolls up, and jumps back', () => {
		const onAutoScrollChange = vi.fn()
		const { rerender } = render(<LogViewer logs={logs} onAutoScrollChange={onAutoScrollChange} />)
		const area = screen.getByRole('log')
		Object.defineProperty(area, 'scrollHeight', { configurable: true, value: 1000 })
		Object.defineProperty(area, 'clientHeight', { configurable: true, value: 200 })
		rerender(
			<LogViewer
				logs={[...logs, { id: 5, level: 'info', message: 'newest' }]}
				onAutoScrollChange={onAutoScrollChange}
			/>
		)
		expect(area.scrollTop).toBe(1000)
		expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull()
		area.scrollTop = 100
		fireEvent.scroll(area)
		expect(onAutoScrollChange).toHaveBeenLastCalledWith(false)
		rerender(
			<LogViewer
				logs={[...logs, { id: 5, level: 'info', message: 'newest' }, { id: 6, level: 'info', message: 'later' }]}
				onAutoScrollChange={onAutoScrollChange}
			/>
		)
		expect(area.scrollTop).toBe(100)
		fireEvent.click(screen.getByRole('button', { name: 'Jump to latest' }))
		expect(onAutoScrollChange).toHaveBeenLastCalledWith(true)
		expect(area.scrollTop).toBe(1000)
		expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull()
		area.scrollTop = 790
		fireEvent.scroll(area)
		expect(onAutoScrollChange).toHaveBeenCalledTimes(2)
	})

	it('does not follow or offer to jump when autoScroll is off, and starts following when turned on', () => {
		const { rerender } = render(<LogViewer logs={logs} autoScroll={false} />)
		const area = screen.getByRole('log')
		Object.defineProperty(area, 'scrollHeight', { configurable: true, value: 1000 })
		Object.defineProperty(area, 'clientHeight', { configurable: true, value: 200 })
		area.scrollTop = 50
		fireEvent.scroll(area)
		expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull()
		expect(area.scrollTop).toBe(50)
		rerender(<LogViewer logs={logs} autoScroll />)
		expect(area.scrollTop).toBe(1000)
	})

	it('goes full screen, leaves with Escape or the backdrop, and locks page scroll meanwhile', () => {
		const { container } = render(<LogViewer logs={logs} maxHeight={120} />)
		expect(document.body.style.overflow).toBe('')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		expect(container.querySelector('section')).toHaveClass('fixed', 'inset-0')
		expect(document.body.style.overflow).toBe('hidden')
		expect(screen.getByRole('log').style.maxHeight).toBe('')
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(container.querySelector('section')).not.toHaveClass('fixed')
		expect(document.body.style.overflow).toBe('')
		expect(screen.getByRole('log').style.maxHeight).toBe('120px')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		fireEvent.click(container.querySelector('[aria-hidden="true"].fixed'))
		expect(container.querySelector('section')).not.toHaveClass('fixed')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		fireEvent.click(screen.getByRole('button', { name: 'Exit full screen' }))
		expect(container.querySelector('section')).not.toHaveClass('fixed')
	})

	it('has optional toolbar parts: custom slots, Clear, and no full screen button', () => {
		const onClear = vi.fn()
		const { rerender } = render(
			<LogViewer
				logs={logs}
				onClear={onClear}
				fullScreenButton={false}
				toolbarStart={<b>Start</b>}
				toolbarEnd={<i>End</i>}
			/>
		)
		expect(screen.getByText('Start')).toBeInTheDocument()
		expect(screen.getByText('End')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Full screen' })).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
		expect(onClear).toHaveBeenCalled()
		rerender(<LogViewer logs={[]} onClear={onClear} />)
		expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
	})

	it('sizes the text and the area, and can be a dark console', () => {
		const { rerender } = render(<LogViewer logs={logs} fontSize={16} height={200} />)
		const area = screen.getByRole('log')
		expect(area.style.fontSize).toBe('16px')
		expect(area.style.height).toBe('200px')
		expect(area.style.maxHeight).toBe('')
		expect(area).toHaveClass('bg-app-card')
		rerender(<LogViewer logs={logs} appearance="dark" />)
		expect(area.style.maxHeight).toBe('24rem')
		expect(area.className).toContain('bg-[#1b1b1f]')
		expect(screen.getAllByText('info')[0]).toHaveClass('text-yellow-300')
	})
})

describe('FileExplorer', () => {
	const nodes = [
		{ id: 'readme', name: 'README.md', type: 'file', size: 2048, modified: '2024-03-05T12:00:00' },
		{
			id: 'src',
			name: 'src',
			type: 'folder',
			size: 5000,
			children: [
				{ id: 'app', name: 'App.tsx', type: 'file', size: 1200 },
				{
					id: 'ui',
					name: 'ui',
					type: 'folder',
					children: [{ id: 'button', name: 'Button.tsx', type: 'file', size: 300 }],
				},
				{ id: 'a1', name: 'a1.ts', type: 'file' },
				{ id: 'a10', name: 'a10.ts', type: 'file' },
				{ id: 'a2', name: 'a2.ts', type: 'file' },
			],
		},
		{ id: 'docs', name: 'docs', type: 'folder', itemCount: 12 },
		{ id: 'empty', name: 'empty', type: 'folder', children: [] },
	]
	const names = () => screen.getAllByRole('listitem').map(li => li.querySelector('.font-medium').textContent)

	it('lists the root entries as cards, folders first, with sizes and item counts', () => {
		render(<FileExplorer nodes={nodes} />)
		expect(names()).toEqual(['docs', 'empty', 'src', 'README.md'])
		expect(screen.getByRole('button', { name: /^src/ })).toHaveTextContent('5 items · 4.9 KB')
		expect(screen.getByRole('button', { name: /^docs/ })).toHaveTextContent('12 items')
		expect(screen.getByRole('button', { name: /^empty/ })).toHaveTextContent('0 items')
		expect(screen.getByRole('button', { name: /^README/ })).toHaveTextContent('2.0 KB')
		expect(screen.getByText('3 folders, 1 file')).toBeInTheDocument()
	})

	it('opens folders with a click, shows the path, and goes back with the breadcrumbs or Up', () => {
		const onPathChange = vi.fn()
		render(<FileExplorer nodes={nodes} onPathChange={onPathChange} />)
		fireEvent.click(screen.getByRole('button', { name: /^src/ }))
		expect(onPathChange).toHaveBeenLastCalledWith(['src'], expect.objectContaining({ id: 'src' }))
		expect(names()).toEqual(['ui', 'a1.ts', 'a2.ts', 'a10.ts', 'App.tsx'])
		const path = screen.getByRole('navigation', { name: 'Folder path' })
		expect(within(path).getByText('src')).toHaveAttribute('aria-current', 'page')
		fireEvent.click(screen.getByRole('button', { name: /^ui/ }))
		expect(onPathChange).toHaveBeenLastCalledWith(['src', 'ui'], expect.objectContaining({ id: 'ui' }))
		expect(names()).toEqual(['Button.tsx'])
		fireEvent.click(screen.getByRole('button', { name: 'Up one level' }))
		expect(onPathChange).toHaveBeenLastCalledWith(['src'], expect.objectContaining({ id: 'src' }))
		fireEvent.click(within(path).getByRole('button', { name: 'Root' }))
		expect(onPathChange).toHaveBeenLastCalledWith([], undefined)
		expect(screen.queryByRole('button', { name: 'Up one level' })).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: /^src/ }))
		fireEvent.click(screen.getByRole('button', { name: /^ui/ }))
		fireEvent.click(within(path).getByRole('button', { name: 'src' }))
		expect(names()).toContain('App.tsx')
	})

	it('selects a file with a click, and highlights the selected one', () => {
		const onSelect = vi.fn()
		render(<FileExplorer nodes={nodes} onSelect={onSelect} selected="readme" />)
		expect(screen.getByRole('button', { name: /^README/ })).toHaveClass('border-app-strong')
		fireEvent.click(screen.getByRole('button', { name: /^README/ }))
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'readme' }))
	})

	it('filters by name and says when nothing matches or a folder is empty', () => {
		render(<FileExplorer nodes={nodes} defaultPath={['src']} emptyText="Nothing in this folder." />)
		fireEvent.change(screen.getByRole('searchbox', { name: 'Filter files' }), { target: { value: 'APP' } })
		expect(names()).toEqual(['App.tsx'])
		fireEvent.change(screen.getByRole('searchbox', { name: 'Filter files' }), { target: { value: 'zzz' } })
		expect(screen.getByText('No file or folder matches.')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Root' }))
		expect(screen.getByRole('searchbox', { name: 'Filter files' })).toHaveValue('')
		fireEvent.click(screen.getByRole('button', { name: /^empty/ }))
		expect(screen.getByText('Nothing in this folder.')).toBeInTheDocument()
	})

	it('is controlled by path, and a path that does not exist falls back to the reachable folder', () => {
		const onPathChange = vi.fn()
		const { rerender } = render(<FileExplorer nodes={nodes} path={['src']} onPathChange={onPathChange} />)
		fireEvent.click(screen.getByRole('button', { name: /^ui/ }))
		expect(onPathChange).toHaveBeenLastCalledWith(['src', 'ui'], expect.anything())
		expect(names()).toContain('App.tsx')
		rerender(<FileExplorer nodes={nodes} path={['src', 'gone', 'deeper']} />)
		expect(names()).toContain('App.tsx')
		rerender(<FileExplorer nodes={nodes} path={['readme']} />)
		expect(names()).toContain('README.md')
	})

	it('switches between grid, list and tree', () => {
		const onViewChange = vi.fn()
		const onSelect = vi.fn()
		render(<FileExplorer nodes={nodes} onViewChange={onViewChange} onSelect={onSelect} defaultExpanded={['src']} />)
		fireEvent.click(screen.getByRole('button', { name: 'List view' }))
		expect(onViewChange).toHaveBeenLastCalledWith('list')
		expect(screen.getByRole('table', { name: 'Files and folders' })).toBeInTheDocument()
		expect(screen.getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Name', 'Modified', 'Items', 'Size'])
		const readmeRow = screen.getByRole('button', { name: 'README.md' }).closest('tr')
		expect(within(readmeRow).getByText('2.0 KB')).toBeInTheDocument()
		expect(within(readmeRow).getByText(/2024/)).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'src' }))
		expect(screen.getByRole('button', { name: 'App.tsx' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Tree view' }))
		expect(onViewChange).toHaveBeenLastCalledWith('tree')
		expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument()
		expect(screen.queryByRole('searchbox')).toBeNull()
		expect(screen.getByText('4 entries at the top')).toBeInTheDocument()
		fireEvent.click(screen.getByText('App.tsx'))
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'app' }))
		onSelect.mockClear()
		fireEvent.click(screen.getByText('ui'))
		expect(onSelect).not.toHaveBeenCalled()
		fireEvent.click(screen.getByRole('button', { name: 'Grid view' }))
		expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
	})

	it('can be controlled by view, limited to some layouts, and hides the switch with one', () => {
		const { rerender } = render(<FileExplorer nodes={nodes} view="tree" views={['tree', 'grid']} />)
		expect(screen.getByRole('tree')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'List view' })).toBeNull()
		rerender(<FileExplorer nodes={nodes} view="grid" views={['grid']} />)
		expect(screen.queryByRole('group', { name: 'Layout' })).toBeNull()
		expect(screen.queryByRole('tree')).toBeNull()
	})

	it('has a reload button, a loading state that blocks opening, and a toolbar slot', () => {
		const onRefresh = vi.fn()
		const onSelect = vi.fn()
		const { rerender } = render(
			<FileExplorer nodes={nodes} onRefresh={onRefresh} onSelect={onSelect} toolbarEnd={<i>Extra</i>} />
		)
		expect(screen.getByText('Extra')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Reload' }))
		expect(onRefresh).toHaveBeenCalled()
		rerender(<FileExplorer nodes={nodes} onRefresh={onRefresh} onSelect={onSelect} loading />)
		expect(screen.getByRole('status')).toHaveTextContent('Loading')
		expect(screen.getByRole('button', { name: 'Reload' })).toBeDisabled()
		expect(screen.getByRole('region', { name: 'Files' })).toHaveAttribute('aria-busy', 'true')
		expect(screen.queryByRole('listitem')).toBeNull()
	})

	it('ignores clicks while loading in the list view', () => {
		const onSelect = vi.fn()
		render(<FileExplorer nodes={nodes} view="list" loading onSelect={onSelect} />)
		expect(onSelect).not.toHaveBeenCalled()
	})

	it('describes folders and sizes for any entry', () => {
		expect(describeNode({ type: 'file', name: 'a', size: 1536 })).toBe('1.5 KB')
		expect(describeNode({ type: 'folder', name: 'a', children: [{}] })).toBe('1 item')
		expect(describeNode({ type: 'folder', name: 'a', itemCount: 3, size: 10 })).toBe('3 items · 10 B')
		expect(readableSize(undefined)).toBe('0 B')
		expect(readableSize(0)).toBe('0 B')
		expect(readableSize(1023)).toBe('1023 B')
		expect(readableSize(1024 ** 3 * 2.5)).toBe('2.5 GB')
		expect(readableSize(1024 ** 6)).toBe('1048576.0 TB')
		expect(languageOf('App.TSX')).toBe('tsx')
		expect(languageOf('Makefile')).toBeUndefined()
		expect(languageOf('.env')).toBeUndefined()
		expect(languageOf('trailing.')).toBeUndefined()
		expect(
			sortNodes([
				{ name: 'b', type: 'file' },
				{ name: 'z', type: 'folder' },
				{ name: 'a', type: 'file' },
			]).map(n => n.name)
		).toEqual(['z', 'a', 'b'])
	})
})

describe('NetworkConnection', () => {
	const setOnline = value => Object.defineProperty(window.navigator, 'onLine', { configurable: true, value })
	afterEach(() => {
		setOnline(true)
		delete window.navigator.connection
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('shows the status you set, with details, latency and a retry action', () => {
		const onRetry = vi.fn()
		const { rerender } = render(
			<NetworkConnection status="connected" name="API" details="api.example.com" latency={42} />
		)
		expect(screen.getByText('API')).toBeInTheDocument()
		expect(screen.getByRole('status')).toHaveTextContent('Connected')
		expect(screen.getByText('api.example.com')).toBeInTheDocument()
		expect(screen.getByText('42 ms')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
		rerender(<NetworkConnection status="disconnected" onRetry={onRetry} latency={42} />)
		expect(screen.queryByText('42 ms')).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
		expect(onRetry).toHaveBeenCalledOnce()
		rerender(<NetworkConnection status="error" onRetry={onRetry} labels={{ error: 'Server down' }} />)
		expect(screen.getByText('Server down')).toBeInTheDocument()
		rerender(<NetworkConnection status="connecting" onRetry={onRetry} />)
		expect(screen.getByRole('status')).toHaveTextContent('Connecting')
		expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
	})

	it('detects online and offline from the browser, and reacts to the events', () => {
		render(<NetworkConnection />)
		expect(screen.getByRole('status')).toHaveTextContent('Online')
		act(() => {
			setOnline(false)
			window.dispatchEvent(new Event('offline'))
		})
		expect(screen.getByRole('status')).toHaveTextContent('Offline')
		act(() => {
			setOnline(true)
			window.dispatchEvent(new Event('online'))
		})
		expect(screen.getByRole('status')).toHaveTextContent('Online')
	})

	it('starts offline when the browser says so, and a Retry button checks again', () => {
		setOnline(false)
		const onRetry = vi.fn()
		render(<NetworkConnection onRetry={onRetry} />)
		expect(screen.getByRole('status')).toHaveTextContent('Offline')
		fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
		expect(onRetry).toHaveBeenCalled()
	})

	it('tells a network without internet from a working one with a probe URL', async () => {
		const fetchMock = vi.fn().mockRejectedValueOnce(new Error('no route')).mockResolvedValue({})
		vi.stubGlobal('fetch', fetchMock)
		const onStatusChange = vi.fn()
		render(<NetworkConnection probeUrl="https://example.test/ping" onStatusChange={onStatusChange} />)
		expect(await screen.findByText('Connected, no internet access')).toBeInTheDocument()
		expect(fetchMock).toHaveBeenCalledWith(
			'https://example.test/ping',
			expect.objectContaining({ method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
		)
		expect(onStatusChange).toHaveBeenLastCalledWith('error', expect.objectContaining({ online: true }))
		fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
		expect(await screen.findByText('Online')).toBeInTheDocument()
		expect(screen.getByText(/\d+ ms/)).toBeInTheDocument()
		expect(onStatusChange).toHaveBeenLastCalledWith('connected', expect.anything())
		vi.unstubAllGlobals()
	})

	it('shows what the browser reports about the connection', () => {
		window.navigator.connection = {
			effectiveType: '4g',
			downlink: 10,
			rtt: 50,
			saveData: true,
			addEventListener: () => {},
			removeEventListener: () => {},
		}
		render(<NetworkConnection showConnectionInfo />)
		expect(screen.getByText('4g · 10 Mbps · 50 ms RTT · Data saver on')).toBeInTheDocument()
	})

	it('shows a badge, with the latency while connected', () => {
		const { rerender } = render(<NetworkConnection status="connected" variant="badge" latency={20} />)
		expect(screen.getByRole('status')).toHaveTextContent('Connected')
		expect(screen.getByText('20 ms')).toBeInTheDocument()
		rerender(<NetworkConnection status="error" variant="badge" />)
		expect(screen.getByRole('status')).toHaveTextContent('Connection error')
	})

	it('shows a banner only while something is wrong', () => {
		const { rerender, container } = render(<NetworkConnection status="connected" variant="banner" />)
		expect(screen.queryByRole('alert')).toBeNull()
		expect(container.querySelector('.sr-only')).toHaveTextContent('Connected')
		rerender(<NetworkConnection status="disconnected" variant="banner" onRetry={() => {}} />)
		expect(screen.getByRole('alert')).toHaveTextContent('You are offline')
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
		rerender(<NetworkConnection status="error" variant="banner" details="Check your router." />)
		expect(screen.getByRole('alert')).toHaveTextContent('Check your router.')
		rerender(<NetworkConnection status="connecting" variant="banner" />)
		expect(screen.getByRole('alert')).toHaveTextContent('Checking your connection')
		rerender(<NetworkConnection status="connected" variant="banner" alwaysShow />)
		expect(screen.getByRole('status')).toHaveTextContent('You are back online')
	})

	it('does not report the status it starts with, only changes', () => {
		const onStatusChange = vi.fn()
		const { rerender } = render(<NetworkConnection status="connected" onStatusChange={onStatusChange} />)
		expect(onStatusChange).not.toHaveBeenCalled()
		rerender(<NetworkConnection status="disconnected" onStatusChange={onStatusChange} />)
		expect(onStatusChange).toHaveBeenCalledWith('disconnected', undefined)
	})
})

describe('NotificationCenter view all', () => {
	const items = Array.from({ length: 5 }, (_, i) => ({ id: i, title: `Item ${i}` }))
	const open = () => fireEvent.click(screen.getByRole('button', { name: /Notifications/ }))

	it('closes the dropdown and calls onViewAll', () => {
		const onViewAll = vi.fn()
		render(<NotificationCenter notifications={items.slice(0, 1)} onViewAll={onViewAll} />)
		open()
		fireEvent.click(screen.getByRole('button', { name: 'View all' }))
		expect(onViewAll).toHaveBeenCalledOnce()
		expect(screen.queryByRole('dialog', { name: 'Notifications' })).toBeNull()
	})

	it('shows "View all" as a footer, with a custom label', () => {
		render(<NotificationCenter notifications={items.slice(0, 2)} onViewAll={() => {}} viewAllLabel="See everything" />)
		open()
		const dialog = screen.getByRole('dialog')
		const footer = within(dialog).getByRole('button', { name: 'See everything' })
		expect(footer.parentElement).toHaveClass('border-t')
		expect(dialog.lastElementChild).toBe(footer.parentElement)
	})

	it('shows only the newest maxItems and says how many there are in total', () => {
		render(<NotificationCenter notifications={items} maxItems={2} onViewAll={() => {}} />)
		open()
		expect(screen.getByText('Item 0')).toBeInTheDocument()
		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.queryByText('Item 2')).toBeNull()
		expect(screen.getByRole('button', { name: 'View all (5)' })).toBeInTheDocument()
	})

	it('shows the plain label when everything fits, and can be empty', () => {
		const { rerender } = render(<NotificationCenter notifications={items} maxItems={10} onViewAll={() => {}} />)
		open()
		expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument()
		rerender(<NotificationCenter notifications={items} maxItems={0} onViewAll={() => {}} />)
		expect(screen.queryByText('Item 0')).toBeNull()
		rerender(<NotificationCenter notifications={[]} onViewAll={() => {}} />)
		expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument()
	})

	it('can link to the page, through a router link component', () => {
		const Router = ({ to, children, ...rest }) => (
			<a data-router href={`#${to}`} {...rest}>
				{children}
			</a>
		)
		render(
			<NotificationCenter notifications={items} viewAllHref="/notifications" linkComponent={Router} linkProp="to" />
		)
		open()
		const link = screen.getByRole('link', { name: 'View all' })
		expect(link).toHaveAttribute('data-router')
		expect(link).toHaveAttribute('href', '#/notifications')
		fireEvent.click(link)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('has no footer without an action', () => {
		render(<NotificationCenter notifications={items} />)
		open()
		expect(screen.queryByRole('button', { name: /View all/ })).toBeNull()
		expect(screen.queryByRole('link', { name: /View all/ })).toBeNull()
	})
})

describe('Modal full screen', () => {
	afterEach(() => {
		document.body.style.overflow = ''
	})

	it('fills the viewport at every size', () => {
		render(<Modal open onClose={() => {}} title="Full-screen dialog" fullScreen />)
		const dialog = screen.getByRole('dialog')
		expect(dialog).toHaveClass('h-[100dvh]', 'max-w-none', 'border-0')
		expect(dialog.className).toContain('pb-[env(safe-area-inset-bottom)]')
		expect(dialog.parentElement).toHaveClass('px-0')
		expect(document.body.style.overflow).toBe('hidden')
	})

	it('keeps the normal size without fullScreen, and does not lock the page', () => {
		render(<Modal open onClose={() => {}} title="Normal" />)
		expect(screen.getByRole('dialog')).toHaveClass('max-h-[90vh]', 'border')
		expect(document.body.style.overflow).toBe('')
		expect(screen.queryByRole('button', { name: /full screen/i })).toBeNull()
	})

	it('has a header button that switches between the dialog and full screen', () => {
		const onFullScreenChange = vi.fn()
		const { unmount } = render(
			<Modal open onClose={() => {}} title="T" fullScreenToggle onFullScreenChange={onFullScreenChange} />
		)
		expect(screen.getByRole('dialog')).not.toHaveClass('h-[100dvh]')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		expect(onFullScreenChange).toHaveBeenLastCalledWith(true)
		expect(screen.getByRole('dialog')).toHaveClass('h-[100dvh]')
		expect(document.body.style.overflow).toBe('hidden')
		fireEvent.click(screen.getByRole('button', { name: 'Exit full screen' }))
		expect(onFullScreenChange).toHaveBeenLastCalledWith(false)
		expect(screen.getByRole('dialog')).not.toHaveClass('h-[100dvh]')
		expect(document.body.style.overflow).toBe('')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		unmount()
		expect(document.body.style.overflow).toBe('')
	})

	it('can start full screen, and be controlled', () => {
		const onFullScreenChange = vi.fn()
		const { rerender } = render(<Modal open onClose={() => {}} title="T" fullScreenToggle defaultFullScreen />)
		expect(screen.getByRole('dialog')).toHaveClass('h-[100dvh]')
		rerender(
			<Modal
				open
				onClose={() => {}}
				title="T"
				fullScreenToggle
				fullScreen={false}
				onFullScreenChange={onFullScreenChange}
			/>
		)
		expect(screen.getByRole('dialog')).not.toHaveClass('h-[100dvh]')
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		expect(onFullScreenChange).toHaveBeenLastCalledWith(true)
		expect(screen.getByRole('dialog')).not.toHaveClass('h-[100dvh]')
	})

	it('works from a parent that owns the state', () => {
		const Parent = () => {
			const [full, setFull] = useState(false)
			return <Modal open onClose={() => {}} title="T" fullScreenToggle fullScreen={full} onFullScreenChange={setFull} />
		}
		render(<Parent />)
		fireEvent.click(screen.getByRole('button', { name: 'Full screen' }))
		expect(screen.getByRole('dialog')).toHaveClass('h-[100dvh]')
		expect(screen.getByRole('button', { name: 'Exit full screen' })).toBeInTheDocument()
	})
})
