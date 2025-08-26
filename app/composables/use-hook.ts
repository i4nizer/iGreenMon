import type {
    Hook,
    HookCreate,
    HookUpdate,
} from "~~/shared/schema/hook"

//

export const useHook = () => {
    // --- Main CRUD functions
    const create = async (
        hook: HookCreate
    ): Promise<SafeResult<Hook>> => {
        try {
            const res = await $fetch<Hook>("/api/user/greenhouse/esp32/sensor/hook", {
                method: "POST",
                body: hook,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Hook>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/hook/${id}`
            const res = await reqFetch<Hook>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (sensorid: number): Promise<SafeResult<Hook[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/hook?sensorid=${sensorid}`
            const res = await reqFetch<Hook[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByEsp32 = async (esp32id: number): Promise<SafeResult<Hook[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/hook?esp32id=${esp32id}`
            const res = await reqFetch<Hook[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByGH = async (ghname: string): Promise<SafeResult<Hook[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/hook?ghname=${ghname}`
            const res = await reqFetch<Hook[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        hook: HookUpdate
    ): Promise<SafeResult<Hook>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor/hook`
            const res = await $fetch<Hook>(url, {
                method: "PATCH",
                body: hook
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Hook>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor/hook/${id}`
            const res = await $fetch<Hook>(url, { method: "DELETE" })
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
        retrieveAllByEsp32,
        retrieveAllByGH,
        update,
        destroy,
    }
}