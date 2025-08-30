import type { DetectionBox, DetectionBBox } from "~~/shared/schema/detection"

//

type DetectionBBoxRendererOptions = {
	font?: string
	color?: string
	padding?: {
		x: number
		y: number
	}
	background?: string
}

//

/** Provides utility functions to render bounding box parts into the canvas. */
export const useDetectionBBoxRenderer = () => {
	/** Normalized values from 0-1 converted by ratio based on provided width and height. */
	const denormalize = (
		width: number,
		height: number,
		box: DetectionBox
	) => {
		const x = width * box.x
		const y = height * box.y
		const w = width * box.w
		const h = height * box.h

		return { x, y, w, h }
	}

	/**
	 * Draws the detection box into the canvas.
	 *
	 * @param box Values must be denormalized.
	 */
	const drawBox = (
		ctx: CanvasRenderingContext2D,
		box: DetectionBox,
		color: string,
		thickness: number
	) => {
		const { x, y, w, h } = box

		ctx.strokeStyle = color
		ctx.setLineDash([6, 4])
		ctx.lineWidth = thickness
		ctx.strokeRect(x, y, w, h)
	}

	/** Draws the label with padding into the canvas. */
	const drawLabel = (
		ctx: CanvasRenderingContext2D,
		box: DetectionBox,
		font: string,
		text: string,
		color: string,
		padding: { x: number; y: number },
		background: string
	) => {
		const { x, y, w, h } = box
		const { x: padX, y: padY } = padding

		// --- Measure text for padding
		const {
			width: textWidth,
			actualBoundingBoxAscent,
			actualBoundingBoxDescent,
		} = ctx.measureText(text)
		const textHeight = actualBoundingBoxAscent - actualBoundingBoxDescent

		// --- Apply padding to the text
		const textRect = {
			x: x + padX,
			y: y - textHeight,
			w: textWidth,
			h: textHeight,
		}

		// --- Apply padding to the label box
		const bgRect = {
			x: x,
			y: y - padY * 2 - textHeight,
			w: textWidth + padX * 2,
			h: textHeight + padY * 2,
		}

		// --- Draw background first
		ctx.fillStyle = background
		ctx.fillRect(bgRect.x, bgRect.y, bgRect.w, bgRect.h)

		// --- Overlay with the text
		ctx.fillStyle = color
		ctx.font = font
		ctx.fillText(text, textRect.x, textRect.y)
	}

	/**
	 * Draws the bounding box into the canvas with label.
	 * Internally uses drawBox and drawLabel.
	 *
	 * @param width The canvas' width.
	 * @param height The canvas' height.
	 */
	const drawDetectionBBox = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		detectionBBox: DetectionBBox,
		options?: DetectionBBoxRendererOptions
	) => {
		// --- Destruct and denormalize detection's box
		const { box, confidence } = detectionBBox
		const dbox = denormalize(width, height, box)

		// --- Apply options with fallback
		const font = options?.font ?? "normal normal 12px Roboto"
		const text = `${detectionBBox.class} ${confidence.toFixed(2)}`
		const color = options?.color ?? "white"

		const padding = {
			x: options?.padding ? options?.padding.x : 6,
			y: options?.padding ? options?.padding.y : 6,
		}

		const background = options?.background ?? "brown"

		// --- Draw bounding box then label
		drawBox(ctx, dbox, background, 2)
		drawLabel(ctx, dbox, font, text, background, padding, color)
	}

	const drawDetectionBBoxes = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		detectionBBoxes: DetectionBBox[],
		classColorOptions: ({
			class: string
			color: string
		} & DetectionBBoxRendererOptions)[]
	) => {
		for (const bbox of detectionBBoxes) {
			const cco = classColorOptions.find((c) => c.class == bbox.class)
			drawDetectionBBox(ctx, width, height, bbox, cco)
		}
	}

	// --- expose
	return {
		drawBox,
		drawLabel,
		drawDetectionBBox,
		drawDetectionBBoxes,
	}
}
