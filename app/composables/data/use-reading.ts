import type { Reading } from "~~/shared/schema/reading"

//

export const useReading = () => {
    // --- Main CRUD functions
    const retrieveAllByOutput = async (
		outputid: number,
		alpha?: Date,
		omega?: Date,
		limit?: number,
		offset?: number
	): Promise<SafeResult<Reading[]>> => {
		try {
			const reqFetch = useRequestFetch()
            let url = `/api/user/greenhouse/esp32/sensor/output/reading`
			url += `?outputid${outputid}`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
			const res = await reqFetch<Reading[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}
    
    const retrieveAllByEsp32 = async (
		esp32id: number,
		alpha?: Date,
		omega?: Date,
		limit?: number,
		offset?: number
	): Promise<SafeResult<Reading[]>> => {
		try {
			const reqFetch = useRequestFetch()
            let url = `/api/user/greenhouse/esp32/reading?esp32id=${esp32id}`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
			const res = await reqFetch<Reading[]>(url)
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
	): Promise<SafeResult<Reading[]>> => {
		try {
			const reqFetch = useRequestFetch()
            let url = `/api/user/greenhouse/reading?ghname=${ghname}`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
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