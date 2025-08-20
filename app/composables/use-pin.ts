import type {
    Pin,
    PinCreate,
    PinUpdate,
} from "~~/shared/schema/pin"

//

export const usePin = () => {
    // --- Main CRUD functions
    const create = async (
        pin: PinCreate
    ): Promise<SafeResult<Pin>> => {
        try {
            const res = await $fetch<Pin>("/api/user/greenhouse/esp32/pin", {
                method: "POST",
                body: pin,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Pin>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/pin/${id}`
            const res = await reqFetch<Pin>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (esp32id: number): Promise<SafeResult<Pin[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/pin?esp32id=${esp32id}`
            const res = await reqFetch<Pin[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        pin: PinUpdate
    ): Promise<SafeResult<Pin>> => {
        try {
            const url = `/api/user/greenhouse/esp32/pin`
            const res = await $fetch<Pin>(url, {
                method: "PATCH",
                body: pin
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Pin>> => {
        try {
            const url = `/api/user/greenhouse/esp32/pin/${id}`
            const res = await $fetch<Pin>(url, { method: "DELETE" })
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