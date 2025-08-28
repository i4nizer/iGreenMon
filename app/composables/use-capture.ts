import type { Capture } from "~~/shared/schema/capture"

//

export const useCapture = () => {
    // --- Main CRUD functions
    const retrieveAllByEsp32Cam = async (
        esp32camid: number,
        alpha?: Date,
        omega?: Date,
        limit?: number,
        offset?: number,
    ): Promise<SafeResult<Capture[]>> => {
        try {
            let url = `/api/user/greenhouse/esp32-cam/capture?esp32camid=${esp32camid}`
            if (alpha) url += `&alpha=${alpha}`
            if (omega) url += `&omega=${omega}`
            if (limit) url += `&limit=${limit}`
            if (offset) url += `&offset=${offset}`
            
            const reqFetch = useRequestFetch()
            const res = await reqFetch<Capture[]>(url)
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
	): Promise<SafeResult<Capture[]>> => {
		try {
            let url = `/api/user/greenhouse/capture?ghname=${ghname}`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
			
			const reqFetch = useRequestFetch()
            const res = await reqFetch<Capture[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

    // --- Expose
    return {
        retrieveAllByEsp32Cam,
        retrieveAllByGH,
    }
}