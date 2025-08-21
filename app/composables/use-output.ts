import type {
    Output,
    OutputCreate,
    OutputUpdate,
} from "~~/shared/schema/output"

//

export const useOutput = () => {
    // --- Main CRUD functions
    const create = async (
        output: OutputCreate
    ): Promise<SafeResult<Output>> => {
        try {
            const res = await $fetch<Output>("/api/user/greenhouse/esp32/sensor/output", {
                method: "POST",
                body: output,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Output>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/output/${id}`
            const res = await reqFetch<Output>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (sensorid: number): Promise<SafeResult<Output[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/output?sensorid=${sensorid}`
            const res = await reqFetch<Output[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByEsp32 = async (esp32id: number): Promise<SafeResult<Output[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/output?esp32id=${esp32id}`
            const res = await reqFetch<Output[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        output: OutputUpdate
    ): Promise<SafeResult<Output>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor/output`
            const res = await $fetch<Output>(url, {
                method: "PATCH",
                body: output
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Output>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor/output/${id}`
            const res = await $fetch<Output>(url, { method: "DELETE" })
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
        update,
        destroy,
    }
}