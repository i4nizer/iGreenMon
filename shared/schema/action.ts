import { z } from "zod"

//

const ActionStatus = [
	"Inactive",
	"Delayed",
	"Active",
	"Discarded",
	"Interrupted",
	"Timeout",
] as const
type ActionStatus = (typeof ActionStatus)[number]

//

const ActionSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	value: z.number(),
	delay: z.number(),
	timeout: z.number(),
	duration: z.number(),
	priority: z.number(),
	status: z.enum(ActionStatus),
	inputId: z.number().int(),
	scheduleId: z.number().int().optional(),
	thresholdId: z.number().int().optional(),
	greenhouseId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ActionCreateSchema = ActionSchema.pick({
	name: true,
	value: true,
	delay: true,
	timeout: true,
	duration: true,
	priority: true,
	inputId: true,
	scheduleId: true,
	thresholdId: true,
	greenhouseId: true,
})

const ActionUpdateSchema = ActionSchema.pick({
	id: true,
	name: true,
	value: true,
	delay: true,
	timeout: true,
	duration: true,
	priority: true,
	inputId: true,
	scheduleId: true,
	thresholdId: true,
})

//

type Action = z.infer<typeof ActionSchema>
type ActionCreate = z.infer<typeof ActionCreateSchema>
type ActionUpdate = z.infer<typeof ActionUpdateSchema>

//

export {
	ActionStatus,
	ActionSchema,
	ActionCreateSchema,
	ActionUpdateSchema,
}

export type {
	Action,
	ActionCreate,
	ActionUpdate,
}