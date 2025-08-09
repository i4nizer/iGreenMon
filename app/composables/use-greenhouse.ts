
//

export const useGreenhouse = () => {
    // --- Main CRUD functions
    const create = async (
        greenhouse: GreenhouseCreate
    ): Promise<SafeResult<Greenhouse>> => {
        try {
            const res = await $fetch<Greenhouse>("/api/user/greenhouse", {
                method: "POST",
                body: greenhouse,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    const retrieve = async(
        name: string
    ): Promise<SafeResult<Greenhouse>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/${name}`
            const res = await reqFetch<Greenhouse>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    const retrieveAll = async (): Promise<SafeResult<Greenhouse[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse`
            const res = await reqFetch<Greenhouse[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }
    
    const update = async (
        greenhouse: GreenhouseUpdate
    ): Promise<SafeResult<Greenhouse>> => {
        try {
            const res = await $fetch<Greenhouse>(`/api/user/greenhouse`, {
                method: "PATCH",
                body: greenhouse
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        name: string
    ): Promise<SafeResult<Greenhouse>> => {
        try {
            const res = await $fetch<Greenhouse>(`/api/user/greenhouse`, {
                method: "DELETE",
                body: { name }
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    // --- Utilities
    const isGHNameAvailable = async(
        name: string
    ): Promise<SafeResult<boolean>> => {
        try {
            const res = await $fetch(`/api/user/greenhouse/${name}/check`)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    // --- Expose
    return {
        create,
        retrieve,
        retrieveAll,
        update,
        destroy,
        isGHNameAvailable,
    }
}