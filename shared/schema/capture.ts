import { z } from "zod";

//

const CaptureSchema = z.object({
    id: z.number().int(),
	filename: z.string().min(1),
	esp32CamId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const CaptureCreateSchema = CaptureSchema.pick({
    filename: true,
    esp32CamId: true,
})

//

type Capture = z.infer<typeof CaptureSchema>
type CaptureCreate = z.infer<typeof CaptureCreateSchema>

//

export {
    CaptureSchema,
    CaptureCreateSchema,
}

export type {
    Capture,
    CaptureCreate,
}