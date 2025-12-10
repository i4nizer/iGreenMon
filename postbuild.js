import fs from "fs/promises"
import path from "path"

//

/** Utility to copy files recursively. */
const copy = async (from, to) => {
    await fs.mkdir(to, { recursive: true })
    const dir = await fs.readdir(from)

	for (const file of dir) {
		const sfile = path.join(from, file)
		const dfile = path.join(to, file)
		const stat = await fs.stat(sfile)

		if (stat.isDirectory()) await copy(sfile, dfile)
		else await fs.copyFile(sfile, dfile)
	}

	console.info(`${from}\n\t=> ${to}.`)
}

// --- Copy @tensorflow/tfjs-node
const cwd = process.cwd()
const tsrc = `${cwd}/node_modules/@tensorflow/tfjs-node`
const tdest = `${cwd}.output/server/node_modules/@tensorflow/tfjs-node`
await fs.rm(tdest, { recursive: true, force: true })
await copy(tsrc, tdest)

// --- Copy cloudflared/bin
const csrc = `${cwd}/node_modules/cloudflared/bin`
const cdest = `${cwd}.output/server/node_modules/cloudflared/bin`
await fs.rm(cdest, { recursive: true, force: true })
await copy(csrc, cdest)

//
