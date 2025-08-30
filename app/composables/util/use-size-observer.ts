
//

type SizeCallback = (el: HTMLElement, w: number, h: number) => any

//

export const useSizeObserver = (
    el?: HTMLElement,
    delay: number = 250,
    callback?: SizeCallback
) => {
    // --- Data
    const last = ref(Date.now())
    const flag = ref(false)
    const prev = reactive({ w: 0, h: 0 })
    const target = ref<HTMLElement|undefined>(el)
    const handler = ref<SizeCallback|undefined>(callback)
    const interval = ref(delay)

    // --- Handler
    const loop = () => {
        if (!flag.value) return;
        if (!target.value) return;
        
        const isTime = Date.now() - last.value > interval.value
        if (!isTime) return;
        
        const { width, height } = target.value.getBoundingClientRect()
        const changed = prev.w != width || prev.h != height
        if (!changed) return;

        if (handler.value) handler.value(target.value, width, height)
        last.value = Date.now()
        
        prev.w = width
        prev.h = height

        requestAnimationFrame(loop)
    }

    const stop = () => flag.value = false

    const observe = (
		el: HTMLElement,
		delay: number = 250,
		callback?: SizeCallback
    ) => {
        flag.value = true
        target.value = el
        handler.value = callback
        interval.value = delay

        requestAnimationFrame(loop)
    }

    // --- Expose
    return { target, stop, observe }
}