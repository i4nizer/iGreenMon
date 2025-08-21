import type {
    Actuator,
    ActuatorCreate,
    ActuatorUpdate,
} from "~~/shared/schema/actuator"

//

export const useActuator = () => {
    // --- Main CRUD functions
    const create = async (
        actuator: ActuatorCreate
    ): Promise<SafeResult<Actuator>> => {
        try {
            const res = await $fetch<Actuator>("/api/user/greenhouse/esp32/actuator", {
                method: "POST",
                body: actuator,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Actuator>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/actuator/${id}`
            const res = await reqFetch<Actuator>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (esp32id: number): Promise<SafeResult<Actuator[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/actuator?esp32id=${esp32id}`
            const res = await reqFetch<Actuator[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        actuator: ActuatorUpdate
    ): Promise<SafeResult<Actuator>> => {
        try {
            const url = `/api/user/greenhouse/esp32/actuator`
            const res = await $fetch<Actuator>(url, {
                method: "PATCH",
                body: actuator
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Actuator>> => {
        try {
            const url = `/api/user/greenhouse/esp32/actuator/${id}`
            const res = await $fetch<Actuator>(url, { method: "DELETE" })
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