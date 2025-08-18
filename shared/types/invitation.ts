import type { User } from "#shared/schema/user"
import type { Invitation } from "#shared/schema/invitation"
import type { Greenhouse } from "#shared/schema/greenhouse"

//

type InvitationGet = Invitation
    & { invitee: Pick<User, "name"> }
    & { inviter: Pick<User, "name"> }
    & { greenhouse: Pick<Greenhouse, "name"> }

//

export type { InvitationGet }
