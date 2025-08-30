import type {
    Schedule,
    ScheduleCreate,
    ScheduleUpdate,
} from "~~/shared/schema/schedule"

//

export const useSchedule = () => {
    // --- Main CRUD functions
    const create = async (
        schedule: ScheduleCreate
    ): Promise<SafeResult<Schedule>> => {
        try {
            const res = await $fetch<Schedule>("/api/user/greenhouse/schedule", {
                method: "POST",
                body: schedule,
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieve = async(
        id: number
    ): Promise<SafeResult<Schedule>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/schedule/${id}`
            const res = await reqFetch<Schedule>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }

    const retrieveAll = async (ghid: number): Promise<SafeResult<Schedule[]>> => {
        try {
            const reqFetch = useRequestFetch()
            const url = `/api/user/greenhouse/schedule?ghid=${ghid}`
            const res = await reqFetch<Schedule[]>(url)
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const update = async (
        schedule: ScheduleUpdate
    ): Promise<SafeResult<Schedule>> => {
        try {
            const url = `/api/user/greenhouse/schedule`
            const res = await $fetch<Schedule>(url, {
                method: "PATCH",
                body: schedule
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
            return { success: false, error: msg }
        }
    }
    
    const destroy = async (
        id: number
    ): Promise<SafeResult<Schedule>> => {
        try {
            const url = `/api/user/greenhouse/schedule/${id}`
            const res = await $fetch<Schedule>(url, { method: "DELETE" })
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