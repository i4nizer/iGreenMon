import z from "zod"

//

const SmsSchema = z.object({
	phone: z.string().min(11),
	message: z.string().min(1),
})

//

type Sms = z.infer<typeof SmsSchema>

//

export { SmsSchema }

export type { Sms }
