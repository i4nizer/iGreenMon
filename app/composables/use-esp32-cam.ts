import type {
    Esp32Cam,
    Esp32CamCreate,
    Esp32CamUpdate,
} from "~~/shared/schema/esp32-cam"

//

export const useEsp32Cam = () => {
    // --- Main CRUD functions
    const create = async (
        esp32Cam: Esp32CamCreate
    ): Promise<SafeResult<Esp32Cam>> => {
        try {
            const res = await $fetch<Esp32Cam>("/api/user/greenhouse/esp32-cam", {
                method: "POST",
                body: esp32Cam,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Esp32Cam>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32-cam/${id}`
            const res = await reqFetch<Esp32Cam>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (ghid: number): Promise<SafeResult<Esp32Cam[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32-cam?ghid=${ghid}`
            const res = await reqFetch<Esp32Cam[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        esp32Cam: Esp32CamUpdate
    ): Promise<SafeResult<Esp32Cam>> => {
        try {
            const url = `/api/user/greenhouse/esp32-cam`
            const res = await $fetch<Esp32Cam>(url, {
                method: "PATCH",
                body: esp32Cam,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Esp32Cam>> => {
        try {
            const url = `/api/user/greenhouse/esp32-cam/${id}`
            const res = await $fetch<Esp32Cam>(url, { method: "DELETE" })
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