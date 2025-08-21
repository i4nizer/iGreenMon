import { z } from "zod";

//

const OutputSchema = z.object({
    id: z.number().int(),
	name: z.string().min(1),
	icon: z.string(),
	unit: z.string(),
	pinId: z.number().int(),
	sensorId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const OutputCreateSchema = OutputSchema.pick({
    name: true,
    icon: true,
    unit: true,
    pinId: true,
    sensorId: true,
})

const OutputUpdateSchema = OutputSchema.pick({
	id: true,
	name: true,
	icon: true,
	unit: true,
	pinId: true,
})

//

type Output = z.infer<typeof OutputSchema>
type OutputCreate = z.infer<typeof OutputCreateSchema>
type OutputUpdate = z.infer<typeof OutputUpdateSchema>

//

export { OutputSchema, OutputCreateSchema, OutputUpdateSchema }

export type { Output, OutputCreate, OutputUpdate }
