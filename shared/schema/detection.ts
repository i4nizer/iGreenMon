import { z } from "zod";

//

type DetectionBox = {
    x: number
    y: number
    w: number
    h: number
}

type DetectionBBox = {
    box: DetectionBox
    class: string
    confidence: number
}

//

const DetectionSchema = z.object({
    id: z.number().int(),
    box: z.object({
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
    }),
    class: z.string().min(1),
    confidence: z.number(),
	captureId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const DetectionCreateSchema = DetectionSchema.pick({
    box: true,
    class: true,
    confidence: true,
    captureId: true,
})

//

type Detection = z.infer<typeof DetectionSchema>
type DetectionCreate = z.infer<typeof DetectionCreateSchema>

//

export {
    DetectionSchema,
    DetectionCreateSchema,
}

export type {
    Detection,
    DetectionBox,
    DetectionBBox,
    DetectionCreate,
}