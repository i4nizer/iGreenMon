import type {
    Threshold,
    ThresholdCreate,
    ThresholdUpdate,
} from "~~/shared/schema/threshold"

//

export const useThreshold = () => {
    // --- Main CRUD functions
    const create = async (
        threshold: ThresholdCreate
    ): Promise<SafeResult<Threshold>> => {
        try {
            const res = await $fetch<Threshold>("/api/user/greenhouse/threshold", {
                method: "POST",
                body: threshold,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Threshold>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/threshold/${id}`
            const res = await reqFetch<Threshold>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (ghid: number): Promise<SafeResult<Threshold[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/threshold?ghid=${ghid}`
            const res = await reqFetch<Threshold[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        threshold: ThresholdUpdate
    ): Promise<SafeResult<Threshold>> => {
        try {
            const url = `/api/user/greenhouse/threshold`
            const res = await $fetch<Threshold>(url, {
                method: "PATCH",
                body: threshold
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Threshold>> => {
        try {
            const url = `/api/user/greenhouse/threshold/${id}`
            const res = await $fetch<Threshold>(url, { method: "DELETE" })
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
    }
}