import { z } from "zod"
import {
	GreenhouseCreateSchema,
	GreenhouseSchema,
	GreenhouseUpdateSchema,
} from "~~/shared/schema/greenhouse"

//

type Greenhouse = z.infer<typeof GreenhouseSchema>
type GreenhouseCreate = z.infer<typeof GreenhouseCreateSchema>
type GreenhouseUpdate = z.infer<typeof GreenhouseUpdateSchema>

//

export type {
	Greenhouse,
	GreenhouseCreate,
	GreenhouseUpdate,
}
