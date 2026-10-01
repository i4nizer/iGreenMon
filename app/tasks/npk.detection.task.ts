import type { Accelerator } from "@litertjs/core"
import * as Comlink from "comlink"
import litertPipelineNPK from "./litert.pipeline.npk"
import type { NPKDetector } from "./litert.pipeline.npk"

//

// --- Config
let detector: NPKDetector | undefined = undefined
let classLabels: readonly string[] = []

// --- Functions
const load = async (url: string, wasmUrl: string, labels: string[], accelerator?: Accelerator) => {
	classLabels = labels

	const alpha = performance.now()
	detector = await litertPipelineNPK.load(url, wasmUrl, accelerator)
	const omega = performance.now()

	const backend = litertPipelineNPK.backend(detector)
	console.info(`NPK model loaded on ${backend} in ${(omega - alpha).toFixed(2)}ms.`)

	return { accelerator: backend, imageSize: detector.imageSize }
}

const warmup = async () => {
	if (!detector) throw new Error(`NPK model not initialized yet.`)
	await litertPipelineNPK.warmup(detector)
}

const predict = async (image: ImageBitmap, minIoU?: number, minScore?: number, maxBoxCount?: number) => {
	if (!detector) throw new Error(`NPK model not initialized yet.`)

	try {
		return await litertPipelineNPK.predict(detector, image, classLabels, minIoU, minScore, maxBoxCount)
	} finally {
		image.close()
	}
}

const dispose = async () => {
	if (detector) litertPipelineNPK.dispose(detector)
	detector = undefined
}

//

Comlink.expose({ load, warmup, predict, dispose })
