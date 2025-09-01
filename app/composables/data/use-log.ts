import type { Log } from "~~/shared/schema/log"

//

export const useLog = () => {
    // --- Main CRUD functions
    const retrieveAll = async (
		alpha?: Date,
		omega?: Date,
		limit?: number,
		offset?: number
	): Promise<SafeResult<Log[]>> => {
		try {
			const reqFetch = useRequestFetch()
            let url = `/api/user/log`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
			const res = await reqFetch<Log[]>(url)
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
	): Promise<SafeResult<Log[]>> => {
		try {
			const reqFetch = useRequestFetch()
            let url = `/api/user/greenhouse/log?ghname=${ghname}`
            if (alpha) url += `&alpha=${alpha}`
			if (omega) url += `&omega=${omega}`
			if (limit) url += `&limit=${limit}`
			if (offset) url += `&offset=${offset}`
			const res = await reqFetch<Log[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

    // --- Expose
    return {
        retrieveAll,
        retrieveAllByGH,
    }
}