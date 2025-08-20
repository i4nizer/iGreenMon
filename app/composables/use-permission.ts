import type {
    Permission,
    PermissionGrant,
    PermissionResource,
    PermissionRevoke,
    PermissionType,
} from "~~/shared/schema/permission"

//

export const usePermission = () => {
	// --- CRUD
	const retrieve = async (
		crewId: number
	): Promise<SafeResult<Permission[]>> => {
		try {
			const url = `/api/user/greenhouse/crew/permission?crewid=${crewId}`
			const reqFetch = useRequestFetch()
			const res = await reqFetch<Permission[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	const retrieveAll = async (
		ghname: string
	): Promise<SafeResult<Permission[]>> => {
		try {
			const url = `/api/user/greenhouse/permission?ghname=${ghname}`
			const reqFetch = useRequestFetch()
			const res = await reqFetch<Permission[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	/** Request grant permission for a crew. */
	const grant = async (
		data: PermissionGrant
	): Promise<SafeResult<Permission>> => {
		try {
			const url = `/api/user/greenhouse/crew/permission`
			const res = await $fetch<Permission>(url, {
				method: "POST",
				body: data,
			})
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	/** Request revoke permission for a crew. */
	const revoke = async (data: PermissionRevoke): Promise<SafeResult> => {
		try {
			const url = `/api/user/greenhouse/crew/permission`
			const res = await $fetch(url, {
				method: "DELETE",
				body: data,
			})
			return { success: true, data: undefined }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	// --- Advanced utilities
	const canAccess = (
		resource: PermissionResource,
		permissions: Permission[],
	): boolean => {
		return permissions.some(
			(p) =>
				p.type == "Retrieve" &&
				p.resource == resource
		)
	}

	const canCreate = (
        resource: PermissionResource,
        permissions: Permission[],
	): boolean => {
		return permissions.some(
			(p) =>
				p.type == "Create" &&
				p.resource == resource
		)
	}

	const canModify = (
		resource: PermissionResource,
		permissions: Permission[],
	): boolean => {
		return permissions.some(
			(p) =>
				p.type == "Update" &&
				p.resource == resource
		)
	}

	const canDelete = (
		resource: PermissionResource,
		permissions: Permission[],
	): boolean => {
		return permissions.some(
			(p) =>
				p.type == "Delete" &&
				p.resource == resource
		)
	}

	const hasPermission = (
		type: PermissionType,
        resource: PermissionResource,
        permissions: Permission[],
	): boolean => {
		return permissions.some(
			(p) =>
				p.type == type &&
				p.resource == resource
		)
	}

	// --- Expose
    return {
        grant,
        revoke,
        retrieve,
        retrieveAll,
        canAccess,
        canCreate,
        canModify,
        canDelete,
        hasPermission,
    }
}
