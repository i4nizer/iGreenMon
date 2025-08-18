import { z } from "zod";

//

const CrewSchema = z.object({
    id: z.number(),
	userId: z.number(),
	greenhouseId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

type Crew = z.infer<typeof CrewSchema>

//

export { CrewSchema }

export type { Crew }