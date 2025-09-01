
//

export const useReadingCsv = () => {
    // --- Main Utils
    const downloadByOutput = async (
		outputid: number,
		alpha?: Date,
		omega?: Date,
		limit?: number,
		offset?: number
    ): Promise<SafeResult<Blob>> => {
        try {
            let url = `/api/user/greenhouse/esp32/sensor/output/reading`
            url += `/csv?outputid=${outputid}`
            if (alpha) url += `&alpha=${alpha}`
            if (omega) url += `&omega=${omega}`
            if (limit) url += `&limit=${limit}`
            if (offset) url += `&offset=${offset}`
            
            const res = await fetch(url)
            if (!res.ok) throw new Error(res.statusText)
            const blob = await res.blob()
            return { success: true, data: blob }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    // --- Expose
    return { downloadByOutput }
}