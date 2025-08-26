<template>
    <v-card class="border pt-3">
        <v-card-title 
            class="d-flex align-center justify-space-between text-wrap"
        >
            <span :class="sensor.disabled ? 'text-red' : 'text-green'">
                {{ sensor.name }}
            </span>
            <v-btn
                v-if="!hideView"
                icon="mdi-chevron-right"
                size="small"
                elevation="0"
                v-tooltip="`View`"
                @click="onClickView"
            ></v-btn>
        </v-card-title>
        <v-card-subtitle class="text-wrap">
            {{ sensor.description }}
        </v-card-subtitle>
        <v-card-text>
            <slot name="output" :="{ sensor }"></slot>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Sensor } from '~~/shared/schema/sensor';

//

// --- Data Binding
const props = defineProps<{
    sensor: Sensor
    hideView?: boolean
}>()

// --- State Binding
const emit = defineEmits<{
    view: [sensor: Sensor, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickView = (sensor: Sensor) => emit("view", sensor, { loading })

//

</script>

<style scoped>

</style>