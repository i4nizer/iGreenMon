import { z } from "zod";

//

const ReadingSchema = z.object({
    id: z.number().int(),
	name: z.string().min(1),
	icon: z.string(),
	unit: z.string(),
	value: z.number(),
	outputId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ReadingCreateSchema = ReadingSchema.pick({
    name: true,
    icon: true,
    unit: true,
    value: true,
    outputId: true,
})

//

type Reading = z.infer<typeof ReadingSchema>
type ReadingCreate = z.infer<typeof ReadingCreateSchema>

//

export {
    ReadingSchema,
    ReadingCreateSchema,
}

export type {
    Reading,
    ReadingCreate,
}