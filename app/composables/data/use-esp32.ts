import type {
    Esp32,
    Esp32Create,
    Esp32Update,
} from "~~/shared/schema/esp32"

//

export const useEsp32 = () => {
    // --- Main CRUD functions
    const create = async (
        esp32: Esp32Create
    ): Promise<SafeResult<Esp32>> => {
        try {
            const res = await $fetch<Esp32>("/api/user/greenhouse/esp32", {
                method: "POST",
                body: esp32,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Esp32>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/${id}`
            const res = await reqFetch<Esp32>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (ghid: number): Promise<SafeResult<Esp32[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32?ghid=${ghid}`
            const res = await reqFetch<Esp32[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        esp32: Esp32Update
    ): Promise<SafeResult<Esp32>> => {
        try {
            const url = `/api/user/greenhouse/esp32`
            const res = await $fetch<Esp32>(url, {
                method: "PATCH",
                body: esp32
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Esp32>> => {
        try {
            const url = `/api/user/greenhouse/esp32/${id}`
            const res = await $fetch<Esp32>(url, { method: "DELETE" })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    // --- Api Key
    const retrieveKey = async (id: number): Promise<SafeResult<string>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/key?esp32id=${id}`
            const res = await $fetch<string>(url)
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
        retrieveKey,
        update,
        destroy,
    }
}