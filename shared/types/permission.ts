import type { z } from "zod"
import type {
	PermissionType,
	PermissionResource,
	PermissionSchema,
	PermissionGrantSchema,
	PermissionRevokeSchema,
	PermissionKey,
} from "#shared/schema/permission"

//

type Permission = z.infer<typeof PermissionSchema>
type PermissionGrant = z.infer<typeof PermissionGrantSchema>
type PermissionRevoke = z.infer<typeof PermissionRevokeSchema>
type PermissionType = (typeof PermissionType)[number]
type PermissionResource = (typeof PermissionResource)[number]
type PermissionKey = (typeof PermissionKey)[number]

//

export type {
	Permission,
	PermissionGrant,
	PermissionRevoke,
	PermissionType,
	PermissionResource,
	PermissionKey,
}
