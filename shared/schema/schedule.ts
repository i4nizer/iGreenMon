import { z } from "zod"

//

type Hours =
	| "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09"
	| "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19"
	| "20" | "21" | "22" | "23";

type Minutes =
	| "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09"
	| "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19"
	| "20" | "21" | "22" | "23" | "24" | "25" | "26" | "27" | "28" | "29"
	| "30" | "31" | "32" | "33" | "34" | "35" | "36" | "37" | "38" | "39"
	| "40" | "41" | "42" | "43" | "44" | "45" | "46" | "47" | "48" | "49"
	| "50" | "51" | "52" | "53" | "54" | "55" | "56" | "57" | "58" | "59";

type ScheduleTime = `${Hours}:${Minutes}`

const ScheduleTimeSchema = z
	.string()
	.regex(
		/^([01]\d|2[0-3]):([0-5]\d)$/,
		"Invalid time format (must be HH:MM, 00:00–23:59)"
	) as z.ZodType<ScheduleTime, any, string>

//

const ScheduleSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1),
	days: z.array(z.number()),
	times: z.array(ScheduleTimeSchema),
	disabled: z.boolean(),
	activated: z.boolean(),
	greenhouseId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const ScheduleCreateSchema = ScheduleSchema.pick({
	name: true,
	days: true,
	times: true,
	disabled: true,
	greenhouseId: true,
})

const ScheduleUpdateSchema = ScheduleSchema.pick({
	id: true,
	name: true,
	days: true,
	times: true,
	disabled: true,
})

//

type Schedule = z.infer<typeof ScheduleSchema>
type ScheduleCreate = z.infer<typeof ScheduleCreateSchema>
type ScheduleUpdate = z.infer<typeof ScheduleUpdateSchema>

//

export { ScheduleSchema, ScheduleCreateSchema, ScheduleUpdateSchema }

export type { Schedule, ScheduleCreate, ScheduleUpdate, ScheduleTime }
