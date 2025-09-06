import z from "zod";
import { ActionSchema, ActionStatus } from "~~/shared/schema/action";

//

const ActionItemSchema = ActionSchema.pick({
    id: true,
    name: true,
    delay: true,
    timeout: true,
    duration: true,
    priority: true,
    status: true,
    inputId: true,
    scheduleId: true,
    thresholdId: true,
    greenhouseId: true,
})

type ActionItem = z.infer<typeof ActionItemSchema>

//

type ActionEventListener = (action: Readonly<ActionItem>) => any

//

export { ActionItemSchema }

export type { ActionItem, ActionEventListener }
