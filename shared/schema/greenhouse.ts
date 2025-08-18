import { z } from "zod"

//

const GreenhouseSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1).max(255),
	description: z.string().max(500).default(""),
	userId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const GreenhouseCreateSchema = GreenhouseSchema.pick({
	name: true,
	description: true
})

const GreenhouseUpdateSchema = GreenhouseSchema.pick({
	id: true,
	name: true,
	description: true,
})

//

type Greenhouse = z.infer<typeof GreenhouseSchema>
type GreenhouseCreate = z.infer<typeof GreenhouseCreateSchema>
type GreenhouseUpdate = z.infer<typeof GreenhouseUpdateSchema>

//

export {
	GreenhouseSchema,
	GreenhouseCreateSchema,
	GreenhouseUpdateSchema,
}

export type {
	Greenhouse,
	GreenhouseCreate,
	GreenhouseUpdate,
}