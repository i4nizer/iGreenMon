import z from "zod"

//

const LogLevel = ["Info", "Success", "Warning", "Error"] as const
type LogLevel = (typeof LogLevel)[number]

//

const LogSchema = z.object({
    id: z.number().int(),
    title: z.string().min(1),
    message: z.string().min(1),
    level: z.enum(LogLevel),
    viewed: z.boolean(),
    emailed: z.boolean(),
    greenhouseId: z.number().int(),
    userId: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

//

type Log = z.infer<typeof LogSchema>

//

export { LogLevel, LogSchema }

export type { Log }