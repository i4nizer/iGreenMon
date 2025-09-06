import z from "zod"
import { ConditionSchema } from "~~/shared/schema/condition"
import { ThresholdSchema } from "~~/shared/schema/threshold"

//

// --- Threshold
const ThresholdItemSchema = ThresholdSchema.pick({
    id: true,
    name: true,
    operator: true,
    disabled: true,
    activated: true,
})

type ThresholdItem = z.infer<typeof ThresholdItemSchema>

// --- Threshold Event
type ThresholdEventName = "Activate" | "Deactivate"
type ThresholdEventListener = (
	pid: string,
    threshold: Readonly<ThresholdItem>,
    changed: boolean
) => any

// --- Condition
const ConditionItemSchema = ConditionSchema.pick({
    id: true, 
    type: true,
    value: true,
    satisfied: true,
    outputId: true,
    thresholdId: true,
})

type ConditionItem = z.infer<typeof ConditionItemSchema>

// --- Condition Event
type ConditionEventName = "Satisfied" | "Desatisfied"
type ConditionEventListener = (
	condition: Readonly<ConditionItem>,
	changed: boolean
) => any

//

export { ThresholdItemSchema, ConditionItemSchema }

export type {
    ThresholdItem, 
    ThresholdEventName, 
    ThresholdEventListener,
    ConditionItem, 
    ConditionEventName, 
    ConditionEventListener, 
}