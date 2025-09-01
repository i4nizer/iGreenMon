import type { Log } from "~~/shared/schema/log"

//

export const useLog = () => {
    // --- Main CRUD functions
    const retrieveAll = async (): Promise<SafeResult<Log[]>> => {
		try {
			const reqFetch = useRequestFetch()
			const url = `/api/user/log`
			const res = await reqFetch<Log[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}
    
    const retrieveAllByGH = async (
        ghname: string
    ): Promise<SafeResult<Log[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/log?ghname=${ghname}`
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