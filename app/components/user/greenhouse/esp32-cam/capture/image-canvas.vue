<template>
    <div class="text-center text-wrap overflow-wrap">
        <canvas
            ref="canvasRef"
            class="w-100 aspect-ratio-1"
            :width="canvasSize.width"
            :height="canvasSize.height"
            @click="onClickCanvas"
        ></canvas>
    </div>
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{
    "load": [
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
    "draw": [
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
    "click": [
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
}>()

const props = defineProps<{ src: string }>()

// --- Template Binding
const imageRef = ref<HTMLImageElement>()
const canvasRef = ref<HTMLCanvasElement>()
const canvasCtx = ref<CanvasRenderingContext2D>()
const canvasSize = reactive({ width: 4000, height: 4000 })

// --- Resizing & Visibility Observing
const state = reactive({
    loaded: false,
    visible: true,
    painted: false,
    resizing: false,
})

const sizeObserverUtil = useSizeObserver()
const intersectionObserver = ref<IntersectionObserver>()

watch(
    () => props,
    (nv, ov) => {
        state.painted = nv.src != ov.src
        if (imageRef.value) imageRef.value.src = nv.src
    },
    { deep: true }
)

// --- Image Rendering
const render = () => {
    // --- Check states & existence
    const { loaded, visible, painted, resizing } = state
    if (!loaded || painted || resizing || !visible) return
    if (!imageRef.value || !canvasRef.value || !canvasCtx.value) return

    // --- Calc aspect ratio to center image
    const { naturalWidth: imgW, naturalHeight: imgH } = imageRef.value
    const side = Math.min(imgW, imgH)
    const sideX = (imgW - side) / 2
    const sideY = (imgH - side) / 2

    // --- Draw image first
    const { width, height } = canvasRef.value
    canvasCtx.value.imageSmoothingEnabled = false
    canvasCtx.value.drawImage(
        imageRef.value,
        sideX, 
        sideY, 
        side, 
        side, 
        0, 
        0, 
        width, 
        height
    )

    // --- Emit drawn image in canvas
    emit("draw", imageRef.value, canvasRef.value, canvasCtx.value)
    state.painted = true
}

// --- Event Handling
const onImageLoad = (event: Event) => {
    if (!imageRef.value || !canvasRef.value || !canvasCtx.value) return
    emit("load", imageRef.value, canvasRef.value, canvasCtx.value)
    state.loaded = true
    requestAnimationFrame(render)
}

const onIntersect: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[]
) => {
    for (const e of entries) {
        state.visible = e.isIntersecting
        if (e.isIntersecting) render()
        else state.painted = false
    }
}

const onClickCanvas = () => {
    if (!imageRef.value || !canvasRef.value || !canvasCtx.value) return
    emit("click", imageRef.value, canvasRef.value, canvasCtx.value)
}

const onResizeCanvas = (el: HTMLElement, w: number, h: number) => {
    state.painted = false

    state.resizing = true
    canvasSize.width = w
    canvasSize.height = h
    state.resizing = false

    render()
}

// --- Binding Data on LifeCycle
onMounted(() => {
    imageRef.value = new Image()
    imageRef.value.onload = onImageLoad
    imageRef.value.src = props.src

    if (!canvasRef.value) return
    canvasCtx.value = canvasRef.value.getContext('2d') ?? undefined
    sizeObserverUtil.observe(canvasRef.value, 250, onResizeCanvas)

    intersectionObserver.value = new IntersectionObserver(
        onIntersect,
        { threshold: 0.1 }
    )
    intersectionObserver.value.observe(canvasRef.value)
})

onUnmounted(() => {
    sizeObserverUtil.stop()
    intersectionObserver.value?.disconnect()
})

//

</script>

<style lang="scss" scoped>

</style>