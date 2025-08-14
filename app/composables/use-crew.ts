
//

export const useCrew = () => {
    /**
     * @param ghname - greenhouse.name
     */
    const retrieveAll = async (
        ghname: string
    ): Promise<SafeResult<CrewGet[]>> => {
        try {
            const url = `/api/user/greenhouse/crew?ghname=${ghname}`
            const reqFetch = useRequestFetch()
            const res = await reqFetch<CrewGet[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    // --- Expose
    return { retrieveAll }
}