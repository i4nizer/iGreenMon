import z from "zod";
import { ScheduleSchema } from "~~/shared/schema/schedule";

//

// --- Schedule Schema
const ScheduleItemSchema = ScheduleSchema.pick({
    id: true,
    name: true,
    days: true,
    times: true,
    disabled: true,
    greenhouseId: true,
})

type ScheduleItem = z.infer<typeof ScheduleItemSchema>

// --- Schedule Events
type ScheduleEventListener = (pid: string, schedule: ScheduleItem) => any

//

export { ScheduleItemSchema }

export type { ScheduleItem, ScheduleEventListener }
