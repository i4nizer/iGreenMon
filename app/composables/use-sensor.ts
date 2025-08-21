import type {
    Sensor,
    SensorCreate,
    SensorUpdate,
} from "~~/shared/schema/sensor"

//

export const useSensor = () => {
    // --- Main CRUD functions
    const create = async (
        sensor: SensorCreate
    ): Promise<SafeResult<Sensor>> => {
        try {
            const res = await $fetch<Sensor>("/api/user/greenhouse/esp32/sensor", {
                method: "POST",
                body: sensor,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Sensor>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/${id}`
            const res = await reqFetch<Sensor>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (esp32id: number): Promise<SafeResult<Sensor[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor?esp32id=${esp32id}`
            const res = await reqFetch<Sensor[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        sensor: SensorUpdate
    ): Promise<SafeResult<Sensor>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor`
            const res = await $fetch<Sensor>(url, {
                method: "PATCH",
                body: sensor
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Sensor>> => {
        try {
            const url = `/api/user/greenhouse/esp32/sensor/${id}`
            const res = await $fetch<Sensor>(url, { method: "DELETE" })
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