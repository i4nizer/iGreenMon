import { z } from "zod"

//

const HookType = ["Before", "During", "After"] as const
type HookType = (typeof HookType)[number]

//

const HookSchema = z.object({
    id: z.number().int(),
	type: z.enum(HookType),
	actionId: z.number().int(),
	sensorId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const HookCreateSchema = HookSchema.pick({
    type: true,
    actionId: true,
    sensorId: true,
})

const HookUpdateSchema = HookSchema.pick({
    id: true,
    type: true,
    actionId: true,
})

//

type Hook = z.infer<typeof HookSchema>
type HookCreate = z.infer<typeof HookCreateSchema>
type HookUpdate = z.infer<typeof HookUpdateSchema>

//

export {
    HookType,
    HookSchema,
    HookCreateSchema,
    HookUpdateSchema,
}

export type {
    Hook,
    HookCreate,
    HookUpdate,
}