<template>
    <v-card class="border pt-3">
        <v-card-title 
            class="d-flex align-center justify-space-between text-wrap"
        >
            <span :class="actuator.disabled ? 'text-red' : 'text-green'">
                {{ actuator.name }}
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
            {{ actuator.description }}
        </v-card-subtitle>
        <v-card-text>
            <slot name="input" :="{ actuator }"></slot>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Actuator } from '~~/shared/schema/actuator';

//

// --- Data Binding
const props = defineProps<{
    actuator: Actuator
    hideView?: boolean
}>()

// --- State Binding
const emit = defineEmits<{
    view: [actuator: Actuator, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickView = (actuator: Actuator) => emit("view", actuator, { loading })

//

</script>

<style scoped>

</style>