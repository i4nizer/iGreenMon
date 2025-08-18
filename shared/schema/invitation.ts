import { z } from "zod";

//

const InvitationResponse = [
	"Unset",
	"Accepted",
	"Rejected",
	"Cancelled",
] as const

//

const InvitationSchema = z.object({
	id: z.number(),
	message: z.string(),
	emailed: z.boolean(),
	response: z.enum(InvitationResponse),
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

type Invitation = z.infer<typeof InvitationSchema>
type InvitationCreate = z.infer<typeof InvitationCreateSchema>
type InvitationResponse = (typeof InvitationResponse)[number]

//

export {
	InvitationResponse,
	InvitationSchema,
	InvitationCreateSchema,
}

export type { Invitation, InvitationCreate }