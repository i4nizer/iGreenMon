import * as tf from "@tensorflow/tfjs-node"
import * as fs from "fs"
import { DetectionBBox } from "#shared/schema/detection"
import { NPKModelClass, NPKModelInputSize } from "#shared/types/model/npk"

//

const preprocess = (
	image: string | ArrayBuffer | SharedArrayBuffer
): tf.Tensor4D => {
	return tf.tidy(() => {
		const isPath = typeof image == "string"
        const imageBuffer = isPath
            ? fs.readFileSync(image)
            : Buffer.from(image)
            
        const decoded = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D
		return decoded
			.resizeBilinear(NPKModelInputSize as [number, number])
			.toFloat()
			.div(255.0)
			.expandDims(0) as tf.Tensor4D
	})
}

const extract = (
	vector: tf.Tensor
): [tf.Tensor, tf.Tensor, tf.Tensor, tf.Tensor, tf.Tensor, tf.Tensor] => {
	return tf.tidy(() => {
		const cx = vector.slice([0, 0], [-1, 1]).squeeze()
		const cy = vector.slice([0, 1], [-1, 1]).squeeze()
		const w = vector.slice([0, 2], [-1, 1]).squeeze()
		const h = vector.slice([0, 3], [-1, 1]).squeeze()

		const classes = vector.slice([0, 4], [-1, -1])
		const indices = classes.argMax(1)
		const objectness = classes.max(1)

		return [cx, cy, w, h, indices, objectness]
	})
}

const corners = (
	cx: tf.Tensor,
	cy: tf.Tensor,
	w: tf.Tensor,
	h: tf.Tensor
): [tf.Tensor, tf.Tensor, tf.Tensor, tf.Tensor] => {
	return tf.tidy(() => {
		const two = tf.scalar(2)
		const halfW = w.div(two)
		const halfH = h.div(two)

		const x1 = cx.sub(halfW)
		const y1 = cy.sub(halfH)
		const x2 = cx.add(halfW)
		const y2 = cy.add(halfH)

		return [x1, y1, x2, y2]
	})
}

const nms = async (
	boxes: tf.Tensor2D,
	scores: tf.Tensor1D,
	minIoU: number,
	minScore: number,
	maxBoxCount: number
): Promise<tf.Tensor1D> => {
	return await tf.image.nonMaxSuppressionAsync(
		boxes,
		scores,
		maxBoxCount,
		minIoU,
		minScore
	)
}

const arrify = async (...tensors: tf.Tensor[]): Promise<unknown[]> => {
	return await Promise.all(tensors.map((t) => t.array()))
}

const mapclass = (
	nmsi: number[],
	boxes: number[][],
	scores: number[],
	indices: number[]
): DetectionBBox[] => {
	const result: DetectionBBox[] = []

	for (const i of nmsi) {
		const box = {
			x: boxes[i][0] / NPKModelInputSize[0],
			y: boxes[i][1] / NPKModelInputSize[0],
			w: boxes[i][2] / NPKModelInputSize[0],
			h: boxes[i][3] / NPKModelInputSize[0],
		}

        result.push({
            box,
            class: NPKModelClass[indices[i]],
            confidence: scores[i],
        })
	}

	return result
}

const postprocess = async (
	prediction: tf.Tensor | tf.Tensor[],
	minIoU = 0.5,
	minScore = 0.4,
	maxBoxCount = 100
): Promise<DetectionBBox[]> => {
	const [boxes, cornerBoxes, objectness, indices] = tf.tidy(() => {
		const raw = (Array.isArray(prediction) ? prediction[0] : prediction)
			.squeeze([0])
			.transpose()

		const [cx, cy, w, h, indices, objectness] = extract(raw)
		const [x1, y1, x2, y2] = corners(cx, cy, w, h)

		const boxes = tf.stack([x1, y1, w, h], 1)
		const cornerBoxes = tf.stack([x1, y1, x2, y2], 1)

		return [boxes, cornerBoxes, objectness, indices]
	})

	const nmsi = await nms(
		cornerBoxes as tf.Tensor2D,
		objectness as tf.Tensor1D,
		minIoU,
		minScore,
		maxBoxCount
	)

	const [nmsiArr, boxesArr, objectnessArr, indicesArr] = await arrify(
		nmsi,
		boxes,
		objectness,
		indices
	)

	tf.dispose([nmsi, cornerBoxes, boxes, objectness, indices])

	return mapclass(
		nmsiArr as number[],
		boxesArr as number[][],
		objectnessArr as number[],
		indicesArr as number[]
	)
}

//

export { preprocess, postprocess }
