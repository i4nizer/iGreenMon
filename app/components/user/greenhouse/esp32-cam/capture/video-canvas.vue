<template>
    <div class="text-center text-wrap overflow-wrap">
        <video
            autoplay
            ref="videoRef"
            class="position-absolute w-100 h-100"
            style="top: -999px; left: -999px;"
        ></video>
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
    load: [
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
    draw: [
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
    click: [
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
    ]
}>()

const props = defineProps<{
    flip?: boolean
    srcObject: MediaProvider
}>()

// --- Template Binding
const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const canvasCtx = ref<CanvasRenderingContext2D>()
const canvasSize = reactive({ width: 4000, height: 4000 })

// --- Video Rendering
const render = (
    now: DOMHighResTimeStamp,
    meta: VideoFrameCallbackMetadata
) => {
    // --- Check states & existence
    const { visible, resizing } = state
    const canDraw = !resizing && visible
    if (!videoRef.value || !canvasRef.value || !canvasCtx.value) return
    if (!canDraw) return videoRef.value.requestVideoFrameCallback(render)

    // --- Flip the canvas
    const { width, height } = canvasRef.value
    if (props.flip) {
        canvasCtx.value.save()
        canvasCtx.value.translate(width, 0)
        canvasCtx.value.scale(-1, 1)
    }

    // --- Draw video frame
    canvasCtx.value.imageSmoothingEnabled = false
    canvasCtx.value.drawImage(videoRef.value, 0, 0, width, height)

    // --- Restore from flip
    if (props.flip) canvasCtx.value.restore()

    // --- Emit and recursively draw
    emit("draw", videoRef.value, canvasRef.value, canvasCtx.value)
    videoRef.value.requestVideoFrameCallback(render)
}

// --- Resizing & Visibility Observing
const state = reactive({
    visible: true,
    resizing: false,
})

const sizeObserverUtil = useSizeObserver()
const intersectionObserver = ref<IntersectionObserver>()

const onIntersect: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[]
) => {
    for (const e of entries) {
        state.visible = e.isIntersecting
        if (!e.isIntersecting) continue
        videoRef.value?.requestVideoFrameCallback(render)
    }
}

const onClickCanvas = () => {
    if (!videoRef.value || !canvasRef.value || !canvasCtx.value) return
    emit("click", videoRef.value, canvasRef.value, canvasCtx.value)
}

const onResizeCanvas = (el: HTMLElement, w: number, h: number) => {
    state.resizing = true
    canvasSize.width = w
    canvasSize.height = h
    state.resizing = false
    videoRef.value?.requestVideoFrameCallback(render)
}

// --- Binding Data on LifeCycle
onMounted(() => {
    if (!videoRef.value) return
    videoRef.value.srcObject = props.srcObject
    
    if (!canvasRef.value) return
    canvasCtx.value = canvasRef.value.getContext("2d") ?? undefined
    sizeObserverUtil.observe(canvasRef.value, 250, onResizeCanvas)
    
    intersectionObserver.value = new IntersectionObserver(
        onIntersect,
        { threshold: 0.1 }
    )
    intersectionObserver.value.observe(canvasRef.value)

    if (!canvasCtx.value) return
    emit("load", videoRef.value, canvasRef.value, canvasCtx.value)
    videoRef.value.requestVideoFrameCallback(render)
})

onUnmounted(() => {
    sizeObserverUtil.stop()
    intersectionObserver.value?.disconnect()
})

//

</script>

<style lang="scss" scoped>

</style>