import type { Accelerator } from "@litertjs/core"
import * as Comlink from "comlink"
import type { DetectionBBox } from "~~/shared/schema/detection"
import { NPKModelClass } from "~~/shared/types/model/npk"

//

type NPKDetectionWorkerExpose = {
	load: (
		url: string,
		wasmUrl: string,
		labels: string[],
		accelerator?: Accelerator
	) => Promise<{ accelerator: Accelerator; imageSize: number }>
	warmup: () => Promise<void>
	dispose: () => Promise<void>
	predict: (
		image: ImageBitmap,
		minIoU?: number,
		minScore?: number,
		maxBoxCount?: number
	) => Promise<DetectionBBox[]>
}

//

/** Runs the NPK deficiency model in the browser through LiteRT on a web worker. */
export const useNPKDetection = () => {
	//

	const path = ref("")
	const wasm = ref("/litert/")
	const size = ref(0)
	const loaded = ref(false)
	const accelerator = ref<Accelerator>()

	let model: Comlink.Remote<NPKDetectionWorkerExpose> | undefined
	let worker: Worker | undefined

	//

	const dispose = async () => {
		try {
			if (model) await model.dispose()
		} finally {
			worker?.terminate()
			model = undefined
			worker = undefined
			loaded.value = false
			accelerator.value = undefined
			size.value = 0
		}
	}

	const load = async (url = "/model/npk/n320.tflite", wasmUrl = "/litert/") => {
		await dispose()

		path.value = url
		wasm.value = wasmUrl
		worker = new Worker(new URL("../../tasks/npk.detection.task.ts", import.meta.url), { type: "module" })
		model = Comlink.wrap<NPKDetectionWorkerExpose>(worker)

		try {
			// The frame size comes from the model itself, so exports can change freely.
			const details = await model.load(url, toRaw(wasm.value), [...NPKModelClass])
			accelerator.value = details.accelerator
			size.value = details.imageSize
			loaded.value = true
		} catch (error) {
			worker.terminate()
			worker = undefined
			model = undefined
			throw error
		}
	}

	const warmup = async () => {
		if (!model) throw new Error("NPK model is not initialized yet.")
		await model.warmup()
	}

	const predict = async (image: ImageBitmap, minIoU = 0.5, minScore = 0.7, maxBoxCount = 100) => {
		if (!model) throw new Error("NPK model is not initialized yet.")
		return await model.predict(Comlink.transfer(image, [image]), minIoU, minScore, maxBoxCount)
	}

	//

	return {
		accelerator,
		loaded,
		path,
		size,
		wasm,
		dispose,
		load,
		predict,
		warmup,
	}
}
