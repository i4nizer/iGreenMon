import type {
	Permission,
	PermissionType,
	PermissionResource,
} from "~~/shared/schema/permission"

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

	// --- Expose
	return {
		permissions,
		append,
		change,
		remove,
	}
})
