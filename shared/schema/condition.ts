import { z } from "zod"

//

const ConditionType = ["Equal", "Above", "Below"] as const
type ConditionType = (typeof ConditionType)[number]

//

const ConditionSchema = z.object({
	id: z.number().int(),
	type: z.enum(ConditionType),
	value: z.number(),
	satisfied: z.boolean(),
	outputId: z.number().int(),
	thresholdId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ConditionCreateSchema = ConditionSchema.pick({
    type: true,
    value: true,
    outputId: true,
    thresholdId: true,
})

const ConditionUpdateSchema = ConditionSchema.pick({
    id: true,
    type: true,
    value: true,
    outputId: true,
})

//

type Condition = z.infer<typeof ConditionSchema>
type ConditionCreate = z.infer<typeof ConditionCreateSchema>
type ConditionUpdate = z.infer<typeof ConditionUpdateSchema>

//

export {
    ConditionType,
    ConditionSchema,
    ConditionCreateSchema,
    ConditionUpdateSchema,
}

export type {
    Condition,
    ConditionCreate,
    ConditionUpdate,
}
