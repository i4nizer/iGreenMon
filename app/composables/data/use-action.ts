import type {
    Action,
    ActionCreate,
    ActionUpdate,
} from "~~/shared/schema/action"

//

export const useAction = () => {
    // --- Main CRUD functions
    const create = async (
        action: ActionCreate
    ): Promise<SafeResult<Action>> => {
        try {
            const res = await $fetch<Action>("/api/user/greenhouse/action", {
                method: "POST",
                body: action,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Action>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/action/${id}`
            const res = await reqFetch<Action>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (ghid: number): Promise<SafeResult<Action[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/action?ghid=${ghid}`
            const res = await reqFetch<Action[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        action: ActionUpdate
    ): Promise<SafeResult<Action>> => {
        try {
            const url = `/api/user/greenhouse/action`
            const res = await $fetch<Action>(url, {
                method: "PATCH",
                body: action
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Action>> => {
        try {
            const url = `/api/user/greenhouse/action/${id}`
            const res = await $fetch<Action>(url, { method: "DELETE" })
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