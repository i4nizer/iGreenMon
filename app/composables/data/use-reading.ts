import type { Reading } from "~~/shared/schema/reading"

//

export const useReading = () => {
    // --- Main CRUD functions
    const retrieveAllByOutput = async(
        outputid: number
    ): Promise<SafeResult<Reading[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/sensor/output/reading`
            const query = `?outputid${outputid}`
            const res = await reqFetch<Reading[]>(url + query)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByEsp32 = async (
        esp32id: number
    ): Promise<SafeResult<Reading[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/esp32/reading?esp32id=${esp32id}`
            const res = await reqFetch<Reading[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByGH = async (
        ghname: string
    ): Promise<SafeResult<Reading[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/reading?ghname=${ghname}`
            const res = await reqFetch<Reading[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    // --- Expose
    return {
        retrieveAllByOutput,
        retrieveAllByEsp32,
        retrieveAllByGH,
    }
}