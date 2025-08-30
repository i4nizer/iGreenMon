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
                :disabled="!image"
                @click="onClickRaw"
            ></v-btn>
            <v-btn
                size="small"
                icon="mdi-download"
                class="text-green-darken-3 elevation-0"
                v-tooltip="`Download Image with Bounding Boxes`"
                :disabled="!canvas"
                @click="onClickSave"
            ></v-btn>
            <v-btn
                size="small"
                icon="mdi-image-search"
                class="text-green-darken-3 elevation-0"
                v-tooltip="`View Image with Bounding Boxes`"
                :disabled="!canvas"
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
        opts: { loading: Ref<boolean> },
    ]
    save: [
        capture: Capture,
        canvas: HTMLCanvasElement,
        opts: { loading: Ref<boolean> },
    ]
    view: [
        capture: Capture,
        canvas: HTMLCanvasElement,
        opts: { loading: Ref<boolean> },
    ]
    load: [
        capture: Capture,
        image: HTMLImageElement,
        opts: { loading: Ref<boolean> },
    ]
    draw: [
        capture: Capture,
        canvas: HTMLCanvasElement,
        opts: { loading: Ref<boolean> },
    ]
}>()

// --- Local Actions
const loading = ref(true)

const onClickRaw = () => {
    const img = image.value as HTMLImageElement
    emit("raw", props.capture, img, { loading })
}

const onClickSave = () => {
    const cvs = canvas.value as HTMLCanvasElement
    emit("save", props.capture, cvs, { loading })
}

const onClickView = () => {
    const cvs = canvas.value as HTMLCanvasElement
    emit("view", props.capture, cvs, { loading })
}

// --- Child Actions
const image = ref<HTMLImageElement>()
const canvas = ref<HTMLCanvasElement>()

const onImageLoad = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    image.value = img
    emit("load", props.capture, img, { loading })
}

const onImageDraw = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    canvas.value = cvs
    loading.value = false
    emit("draw", props.capture, cvs, { loading })
}

const onImageClick = (
    img: HTMLImageElement,
    cvs: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    canvas.value = cvs
    emit("view", props.capture, cvs, { loading })
}

//

</script>

<style scoped>

</style>