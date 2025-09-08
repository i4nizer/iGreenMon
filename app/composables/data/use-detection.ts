import type { Detection } from "~~/shared/schema/detection"

//

export const useDetection = () => {
    // --- Main CRUD functions
    const retrieveAllByCapture = async (
        captureid: number,
        alpha?: Date,
        omega?: Date,
        limit?: number,
        offset?: number,
    ): Promise<SafeResult<Detection[]>> => {
        try {
            let url = `/api/user/greenhouse/esp32-cam/capture/detection`
            url += `?captureid=${captureid}`
            if (alpha) url += `&alpha=${alpha}`
            if (omega) url += `&omega=${omega}`
            if (limit) url += `&limit=${limit}`
            if (offset) url += `&offset=${offset}`
            
            const reqFetch = useRequestFetch()
            const res = await reqFetch<Detection[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAllByEsp32Cam = async (
        esp32camid: number,
        alpha?: Date,
        omega?: Date,
        limit?: number,
        offset?: number,
    ): Promise<SafeResult<Detection[]>> => {
        try {
            let url = `/api/user/greenhouse/esp32-cam/detection?esp32camid=${esp32camid}`
            if (alpha) url += `&alpha=${alpha}`
            if (omega) url += `&omega=${omega}`
            if (limit) url += `&limit=${limit}`
            if (offset) url += `&offset=${offset}`
            
            const reqFetch = useRequestFetch()
            const res = await reqFetch<Detection[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const retrieveAllByGH = async (
        ghname: string,
        alpha?: Date,
        omega?: Date,
        limit?: number,
        offset?: number
    ): Promise<SafeResult<Detection[]>> => {
        try {
            let url = `/api/user/greenhouse/detection?ghname=${ghname}`
            if (alpha) url += `&alpha=${alpha}`
            if (omega) url += `&omega=${omega}`
            if (limit) url += `&limit=${limit}`
            if (offset) url += `&offset=${offset}`
            
            const reqFetch = useRequestFetch()
            const res = await reqFetch<Detection[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    // --- Expose
    return {
        retrieveAllByCapture,
        retrieveAllByEsp32Cam,
        retrieveAllByGH,
    }
}