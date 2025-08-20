import { z } from "zod";

//

const PinType = ["Digital", "Analog"] as const
type PinType = (typeof PinType)[number]
const PinMode = ["Unset", "Input", "Output", "Other"] as const
type PinMode = (typeof PinMode)[number]

//

const PinSchema = z.object({
	id: z.number().int(),
	type: z.enum(PinType),
	mode: z.enum(PinMode),
	number: z.number().int(),
	esp32Id: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const PinCreateSchema = PinSchema.pick({
    type: true,
    mode: true,
    number: true,
    esp32Id: true,
})

const PinUpdateSchema = PinSchema.pick({
	id: true,
	type: true,
	mode: true,
	number: true,
})

//

type Pin = z.infer<typeof PinSchema>
type PinCreate = z.infer<typeof PinCreateSchema>
type PinUpdate = z.infer<typeof PinUpdateSchema>

//

export { PinType, PinMode, PinSchema, PinCreateSchema, PinUpdateSchema }

export type { Pin, PinCreate, PinUpdate }