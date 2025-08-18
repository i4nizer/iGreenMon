import type { Crew } from "#shared/schema/crew"

//

type CrewGet = Crew & {
	user: { name: string }
	greenhouse: { name: string }
}

//

export type { CrewGet }