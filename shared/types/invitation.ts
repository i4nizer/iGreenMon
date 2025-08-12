import type { z } from "zod"
import type {
	InvitationCreateSchema,
	InvitationSchema,
} from "#shared/schema/invitation"

//

type Invitation = z.infer<typeof InvitationSchema>
type InvitationCreate = z.infer<typeof InvitationCreateSchema>

//

export type { Invitation, InvitationCreate }
