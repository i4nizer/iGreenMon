import { z } from "zod";

//

const ActuatorSchema = z.object({
    id: z.number().int(),
	name: z.string(),
	description: z.string(),
	disabled: z.boolean(),
	esp32Id: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ActuatorCreateSchema = ActuatorSchema.pick({
    name: true,
    description: true,
    disabled: true,
    esp32Id: true,
})

const ActuatorUpdateSchema = ActuatorSchema.pick({
    id: true,
    name: true,
    description: true,
    disabled: true,
})

//

type Actuator = z.infer<typeof ActuatorSchema>
type ActuatorCreate = z.infer<typeof ActuatorCreateSchema>
type ActuatorUpdate = z.infer<typeof ActuatorUpdateSchema>

//

export {
    ActuatorSchema,
    ActuatorCreateSchema,
    ActuatorUpdateSchema,
}

export type {
    Actuator,
    ActuatorCreate,
    ActuatorUpdate,
}