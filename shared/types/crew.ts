import type { z } from "zod"
import type { CrewSchema } from "#shared/schema/crew"

//

type Crew = z.infer<typeof CrewSchema>
type CrewGet = Crew & {
	user: { name: string }
	greenhouse: { name: string }
}

//

export type { Crew, CrewGet }