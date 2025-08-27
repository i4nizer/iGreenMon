import { z } from "zod"

//

const InputType = ["Boolean", "Number"] as const
type InputType = (typeof InputType)[number]

//

const InputSchema = z.object({
    id: z.number().int(),
	name: z.string(),
	icon: z.string(),
	type: z.enum(InputType),
	flag: z.number(),
	status: z.number(),
	pinId: z.number().int(),
	actuatorId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const InputCreateSchema = InputSchema.pick({
    name: true,
    icon: true,
    type: true,
    pinId: true,
    actuatorId: true,
})

const InputUpdateSchema = InputSchema.pick({
    id: true,
    name: true,
    icon: true,
    type: true,
    flag: true,
    pinId: true,
})

//

type Input = z.infer<typeof InputSchema>
type InputCreate = z.infer<typeof InputCreateSchema>
type InputUpdate = z.infer<typeof InputUpdateSchema>

//

export {
    InputType,
    InputSchema,
    InputCreateSchema,
    InputUpdateSchema,
}

export type {
    Input,
    InputCreate,
    InputUpdate,
}