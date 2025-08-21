import { z } from "zod";

//

const SensorReadPhase = ["Off", "Before", "During", "After"] as const
type SensorReadPhase = (typeof SensorReadPhase)[number]

//

const SensorSchema = z.object({
    id: z.number().int(),
	name: z.string(),
	description: z.string(),
	interval: z.number().int(),
	lastread: z.number().int(),
	readphase: z.enum(SensorReadPhase),
	disabled: z.boolean(),
	esp32Id: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const SensorCreateSchema = SensorSchema.pick({
    name: true,
    description: true,
    interval: true,
    disabled: true,
    esp32Id: true,
})

const SensorUpdateSchema = SensorSchema.pick({
    id: true,
    name: true,
    description: true,
    interval: true,
    disabled: true,
})

//

type Sensor = z.infer<typeof SensorSchema>
type SensorCreate = z.infer<typeof SensorCreateSchema>
type SensorUpdate = z.infer<typeof SensorUpdateSchema>

//

export {
    SensorReadPhase,
    SensorSchema,
    SensorCreateSchema,
    SensorUpdateSchema,
}

export type {
    Sensor,
    SensorCreate,
    SensorUpdate,
}