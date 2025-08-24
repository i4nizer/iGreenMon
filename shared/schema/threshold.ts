import { z } from "zod";

//

const ThresholdOperator = ["Any", "All"] as const
type ThresholdOperator = (typeof ThresholdOperator)[number]

//

const ThresholdSchema = z.object({
    id: z.number().int(),
	name: z.string().min(1),
	operator: z.enum(ThresholdOperator),
	activated: z.boolean(),
	disabled: z.boolean(),
	greenhouseId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ThresholdCreateSchema = ThresholdSchema.pick({
    name: true,
    operator: true,
    disabled: true,
    greenhouseId: true,
})

const ThresholdUpdateSchema = ThresholdSchema.pick({
    id: true,
    operator: true,
    disabled: true,
    name: true,
})

//

type Threshold = z.infer<typeof ThresholdSchema>
type ThresholdCreate = z.infer<typeof ThresholdCreateSchema>
type ThresholdUpdate = z.infer<typeof ThresholdUpdateSchema>

//

export {
    ThresholdOperator,
    ThresholdSchema,
    ThresholdCreateSchema,
    ThresholdUpdateSchema,
}

export type { Threshold, ThresholdCreate, ThresholdUpdate }