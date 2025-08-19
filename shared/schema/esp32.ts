import { z } from "zod";

//

const Esp32Schema = z.object({
    id: z.number(),
	name: z.string(),
	description: z.string(),
	tokenId: z.number(),
	greenhouseId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const Esp32CreateSchema = Esp32Schema.pick({
    name: true,
    description: true,
    greenhouseId: true,
})

const Esp32UpdateSchema = Esp32Schema.pick({
    id: true,
    name: true,
    description: true,
})

//

type Esp32 = z.infer<typeof Esp32Schema>
type Esp32Create = z.infer<typeof Esp32CreateSchema>
type Esp32Update = z.infer<typeof Esp32UpdateSchema>

//

export { Esp32Schema, Esp32CreateSchema, Esp32UpdateSchema }

export type { Esp32, Esp32Create, Esp32Update }