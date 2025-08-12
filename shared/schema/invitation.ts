import { z } from "zod";

//

const InvitationSchema = z.object({
	id: z.number(),
	message: z.string(),
	emailed: z.boolean(),
	response: z.enum(["Unset", "Accepted", "Rejected", "Cancelled"]),
	inviteeId: z.number(),
	inviterId: z.number(),
	greenhouseId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const InvitationCreateSchema = InvitationSchema.pick({
    message: true,
    inviteeId: true,
    greenhouseId: true,
})

//

export { InvitationSchema, InvitationCreateSchema }