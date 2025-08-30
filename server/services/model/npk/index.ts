import * as tf from "@tensorflow/tfjs-node"
import { postprocess, preprocess } from "./util"
import { DetectionBBox } from "~~/shared/schema/detection"

//

let model: tf.GraphModel | undefined

//

const load = async (): Promise<tf.GraphModel> => {
	if (model) return model
	const prefix = `file://${process.cwd()}/storage/model/npk/model.json`
	model = await tf.loadGraphModel(prefix)
	return model
}

const predict = async (
	image: string | ArrayBuffer | SharedArrayBuffer,
	minIoU: number = 0.5,
	minScore: number = 0.7,
	maxBoxCount: number = 100
): Promise<SafeResult<DetectionBBox[]>> => {
	try {
		model ??= await load()

		const prediction = tf.tidy(() => {
			const imageTensor = preprocess(image)
			return model!.execute(imageTensor) as
				| tf.Tensor
				| tf.Tensor[]
		})

		const bboxes = await postprocess(
			prediction,
			minIoU,
			minScore,
			maxBoxCount
		)

		if (Array.isArray(prediction)) prediction.forEach((p) => p.dispose())
		else prediction.dispose()

		return { success: true, data: bboxes }
	} catch (error) {
		return { success: false, error: error as string }
	}
}

const unload = () => {
	if (!model) return
	model.dispose()
	model = undefined
}

//

export { load, unload, predict }
