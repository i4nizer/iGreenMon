
//

export const usePermissionStore = defineStore("permission", () => {
	// --- Data
	const permissions = reactive<Permission[]>([])

	// --- Basic utilities
	const append = (permission: Permission) => {
		const idx = permissions.findIndex((g) => g.id == permission.id)
		if (idx != -1) permissions.splice(idx, 1, permission)
		else permissions.push(permission)
	}

	const change = (permission: Permission) => {
		const idx = permissions.findIndex((g) => g.id == permission.id)
		if (idx != -1) permissions.splice(idx, 1, permission)
	}

	const remove = (id: number) => {
		const filtered = permissions.filter((g) => g.id != id)
		permissions.splice(0, permissions.length)
		permissions.push(...filtered)
	}

	// --- Advanced utilities
	const canAccess = (
		crewId: number,
		greenhouseId: number,
		resource: PermissionResource
	): boolean => {
		return permissions.some(
			(p) =>
				p.crewId == crewId &&
				p.greenhouseId == greenhouseId &&
				p.type == "Retrieve" &&
				p.resource == resource
		)
	}

	const canCreate = (
		crewId: number,
		greenhouseId: number,
		resource: PermissionResource
	): boolean => {
		return permissions.some(
			(p) =>
				p.crewId == crewId &&
				p.greenhouseId == greenhouseId &&
				p.type == "Create" &&
				p.resource == resource
		)
	}

	const canModify = (
		crewId: number,
		greenhouseId: number,
		resource: PermissionResource
	): boolean => {
		return permissions.some(
			(p) =>
				p.crewId == crewId &&
				p.greenhouseId == greenhouseId &&
				p.type == "Update" &&
				p.resource == resource
		)
	}

	const canDelete = (
		crewId: number,
		greenhouseId: number,
		resource: PermissionResource
	): boolean => {
		return permissions.some(
			(p) =>
				p.crewId == crewId &&
				p.greenhouseId == greenhouseId &&
				p.type == "Delete" &&
				p.resource == resource
		)
	}

	const hasPermission = (
		crewId: number,
		greenhouseId: number,
		type: PermissionType,
		resource: PermissionResource
	): boolean => {
		return permissions.some(
			(p) =>
				p.crewId == crewId &&
				p.greenhouseId == greenhouseId &&
				p.type == type &&
				p.resource == resource
		)
	}

	// --- Expose
	return {
		permissions,
		append,
		change,
		remove,
		canAccess,
		canCreate,
		canModify,
		canDelete,
		hasPermission,
	}
})
