<template>
    <v-card class="border" :loading>
        <v-card-item class="pa-0">
            <slot 
                name="canvas" 
                :="{ capture, onImageLoad, onImageDraw, onImageClick }"
            />
        </v-card-item>
        <v-card-subtitle class="text-wrap">
            <span>{{ capture.filename }}</span>
        </v-card-subtitle>
        <v-card-subtitle class="text-wrap">
            <span class="text-caption">
                {{ useDate().format(capture.createdAt, "fullDateTime12h") }}
            </span>
        </v-card-subtitle>
        <v-card-actions class="text-wrap overflow-wrap">
            <v-btn
                size="small"
                icon="mdi-image"
                class="text-green-darken-3 elevation-0"
                v-tooltip="`Download Image`"
                :disabled="!image || !canvas || !context"
                @click="onClickRaw"
            ></v-btn>
            <v-btn
                size="small"
                icon="mdi-download"
                class="text-green-darken-3 elevation-0"
                v-tooltip="`Download Image with Bounding Boxes`"
                :disabled="!image || !canvas || !context"
                @click="onClickSave"
            ></v-btn>
            <v-btn
                size="small"
                icon="mdi-image-search"
                class="text-green-darken-3 elevation-0"
                v-tooltip="`View Image with Bounding Boxes`"
                :disabled="!image || !canvas || !context"
                @click="onClickView"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { Capture } from '~~/shared/schema/capture';

//

// --- Data Binding
const props = defineProps<{ capture: Capture }>()

// --- State Binding
const emit = defineEmits<{
    raw: [
        capture: Capture,
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        opts: { loading: Ref<boolean> },
    ]
    save: [
        capture: Capture,
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        opts: { loading: Ref<boolean> },
    ]
    view: [
        capture: Capture,
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        opts: { loading: Ref<boolean> },
    ]
    load: [
        capture: Capture,
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        opts: { loading: Ref<boolean> },
    ]
    draw: [
        capture: Capture,
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        opts: { loading: Ref<boolean> },
    ]
}>()

// --- Local Actions
const loading = ref(true)

const onClickRaw = () => {
    const img = image.value as HTMLImageElement
    const cvs = canvas.value as HTMLCanvasElement
    const ctx = context.value as CanvasRenderingContext2D
    emit("raw", props.capture, img, cvs, ctx, { loading })
}

const onClickSave = () => {
    const img = image.value as HTMLImageElement
    const cvs = canvas.value as HTMLCanvasElement
    const ctx = context.value as CanvasRenderingContext2D
    emit("save", props.capture, img, cvs, ctx, { loading })
}

const onClickView = () => {
    const img = image.value as HTMLImageElement
    const cvs = canvas.value as HTMLCanvasElement
    const ctx = context.value as CanvasRenderingContext2D
    emit("view", props.capture, img, cvs, ctx, { loading })
}

// --- Child Actions
const image = ref<HTMLImageElement>()
const canvas = ref<HTMLCanvasElement>()
const context = ref<CanvasRenderingContext2D>()

const onImageLoad = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    image.value = img
    canvas.value = cvs
    context.value = ctx
    emit("load", props.capture, img, cvs, ctx, { loading })
}

const onImageDraw = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    image.value = img
    canvas.value = cvs
    context.value = ctx
    loading.value = false
    emit("draw", props.capture, img, cvs, ctx, { loading })
}

const onImageClick = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    image.value = img
    canvas.value = cvs
    context.value = ctx
    emit("view", props.capture, img, cvs, ctx, { loading })
}

//

</script>

<style scoped>

</style>