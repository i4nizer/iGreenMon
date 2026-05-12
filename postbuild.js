import fs from "fs/promises"
import path from "path"

//

const cwd = process.cwd()
const COL = 100

//

/** Format bytes to human readable size. */
const fmtSize = (bytes) => {
	if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MB"
	return (bytes / 1024).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kB"
}

/** Log with ℹ prefix and right-aligned timestamp. */
const log = (msg = "") => {
	const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
	const line = `${msg}`
	console.info(line + " ".repeat(Math.max(1, COL - line.length - time.length)) + time)
}

/** Copy files recursively. Returns { files, size }. */
const copy = async (from, to) => {
	await fs.mkdir(to, { recursive: true })
	const dir = await fs.readdir(from)
	let files = 0, size = 0

	for (const file of dir) {
		const sfile = path.join(from, file)
		const dfile = path.join(to, file)
		const stat = await fs.stat(sfile)

		if (stat.isDirectory()) {
			const sub = await copy(sfile, dfile)
			files += sub.files
			size += sub.size
		} else {
			await fs.copyFile(sfile, dfile)
			files++
			size += stat.size
		}
	}

	return { files, size }
}

//

log("Postbuild — copying modules to build output...")
log()

// --- Copy @tensorflow/tfjs-node
const tsrc = `${cwd}/node_modules/@tensorflow/tfjs-node`
const tdest = `${cwd}/.output/server/node_modules/@tensorflow/tfjs-node`
log("copying @tensorflow/tfjs-node...")

await fs.rm(tdest, { recursive: true, force: true })
const tstat = await copy(tsrc, tdest)
log(`✓ ${tstat.files} files copied (${fmtSize(tstat.size)})`)
log()

// --- Copy cloudflared/bin
const csrc = `${cwd}/node_modules/cloudflared/bin`
const cdest = `${cwd}/.output/server/node_modules/cloudflared/bin`
log("copying cloudflared/bin...")

await fs.rm(cdest, { recursive: true, force: true })
const cstat = await copy(csrc, cdest)
log(`✓ ${cstat.files} files copied (${fmtSize(cstat.size)})`)
log()

log(`✓ postbuild complete — ${tstat.files + cstat.files} files (${fmtSize(tstat.size + cstat.size)})`)

//
