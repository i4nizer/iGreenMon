import { z } from "zod"

//

const PermissionType = ["Create", "Retrieve", "Update", "Delete"] as const
const PermissionResource = [
	"Esp32",
	"Pin",
	"Sensor",
	"Output",
	"Hook",
	"Reading",
	"Actuator",
	"Input",
	"Esp32-Cam",
	"Action",
	"Condition",
	"Schedule",
	"Threshold",
] as const
const PermissionKey = PermissionResource.map((pr) =>
	PermissionType.map((pt) => `${pr}:${pt}`)
).flat() as `${(typeof PermissionResource)[number]}:${(typeof PermissionType)[number]}`[]

//

const PermissionSchema = z.object({
	id: z.number(),
	type: z.enum(PermissionType),
	resource: z.enum(PermissionResource),
	crewId: z.number(),
	greenhouseId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const PermissionGrantSchema = PermissionSchema.pick({
	type: true,
	resource: true,
	crewId: true,
	greenhouseId: true,
})

const PermissionRevokeSchema = PermissionSchema.pick({
	id: true,
	type: true,
	resource: true,
	crewId: true,
	greenhouseId: true,
})

//

export {
	PermissionType,
	PermissionResource,
	PermissionKey,
	PermissionSchema,
	PermissionGrantSchema,
	PermissionRevokeSchema,
}
