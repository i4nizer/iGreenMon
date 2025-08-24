import type {
    Input,
    InputCreate,
    InputUpdate,
} from "~~/shared/schema/input"

//

export const useInput = () => {
    // --- Main CRUD functions
    const create = async (
        input: InputCreate
    ): Promise<SafeResult<Input>> => {
        try {
            const res = await $fetch<Input>("/api/user/greenhouse/esp32/actuator/input", {
                method: "POST",
                body: input,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Input>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/actuator/input/${id}`
            const res = await reqFetch<Input>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (actuatorid: number): Promise<SafeResult<Input[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/actuator/input?actuatorid=${actuatorid}`
            const res = await reqFetch<Input[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByEsp32 = async (esp32id: number): Promise<SafeResult<Input[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/input?esp32id=${esp32id}`
            const res = await reqFetch<Input[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        input: InputUpdate
    ): Promise<SafeResult<Input>> => {
        try {
            const url = `/api/user/greenhouse/esp32/actuator/input`
            const res = await $fetch<Input>(url, {
                method: "PATCH",
                body: input
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Input>> => {
        try {
            const url = `/api/user/greenhouse/esp32/actuator/input/${id}`
            const res = await $fetch<Input>(url, { method: "DELETE" })
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