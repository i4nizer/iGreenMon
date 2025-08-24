import type {
    Condition,
    ConditionCreate,
    ConditionUpdate,
} from "~~/shared/schema/condition"

//

export const useCondition = () => {
    // --- Main CRUD functions
    const create = async (
        condition: ConditionCreate
    ): Promise<SafeResult<Condition>> => {
        try {
            const url = "/api/user/greenhouse/threshold/condition"
            const res = await $fetch<Condition>(url, {
                method: "POST",
                body: condition,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Condition>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/threshold/condition/${id}`
            const res = await reqFetch<Condition>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (thresholdid: number): Promise<SafeResult<Condition[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/threshold/condition?thresholdid=${thresholdid}`
            const res = await reqFetch<Condition[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByGH = async (ghname: string): Promise<SafeResult<Condition[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/condition?ghname=${ghname}`
            const res = await reqFetch<Condition[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        condition: ConditionUpdate
    ): Promise<SafeResult<Condition>> => {
        try {
            const url = `/api/user/greenhouse/threshold/condition`
            const res = await $fetch<Condition>(url, {
                method: "PATCH",
                body: condition
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Condition>> => {
        try {
            const url = `/api/user/greenhouse/threshold/condition/${id}`
            const res = await $fetch<Condition>(url, { method: "DELETE" })
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
		retrieveAllByGH,
		update,
		destroy,
	}
}