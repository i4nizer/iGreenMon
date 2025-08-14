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

export { CrewSchema }