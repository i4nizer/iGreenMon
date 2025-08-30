
//

type Callback<Args extends any[] = any[]> =
    (...args: Args) => void | Promise<void>
    
//

export const useDebounce = <Args extends any[] = any[]>(
    callback: Callback<Args>,
    delay: number = 500
) => {
    const queued = ref<() => ReturnType<Callback<Args>>>()
    const timeout = ref<NodeJS.Timeout>()

    const flush = () => {
        if (!queued.value) return;
        clearTimeout(timeout.value)
        queued.value()
        queued.value = undefined
		timeout.value = undefined
    }

    const cancel = () => {
        clearTimeout(timeout.value)
        queued.value = undefined
        timeout.value = undefined
    }
    
    const execute = (...args: Args): void => {
        clearTimeout(timeout.value)
        const cb = () => callback(...args)
        queued.value = cb
        timeout.value = setTimeout(cb, delay)
    }

    return { flush, cancel, execute }
}