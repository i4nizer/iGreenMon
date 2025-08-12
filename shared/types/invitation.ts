import type { z } from "zod"
import type { User } from "#shared/types/user"
import type { Greenhouse } from "#shared/types/greenhouse"
import type {
	InvitationSchema,
	InvitationCreateSchema,
} from "#shared/schema/invitation"

//

type Invitation = z.infer<typeof InvitationSchema>
type InvitationGet = Invitation
    & { invitee: Pick<User, "name"> }
    & { inviter: Pick<User, "name"> }
    & { greenhouse: Pick<Greenhouse, "name"> }
type InvitationCreate = z.infer<typeof InvitationCreateSchema>

//

export type { Invitation, InvitationGet, InvitationCreate }
