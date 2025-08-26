<template>
    <v-card>
        <template #prepend>
            <v-icon size="xx-large" class="me-5">{{ output.icon }}</v-icon>
        </template>
        <template #title>
            <div>
                <span class="text-caption text-grey">
                    {{ output.name }}
                </span>
            </div>
            <span v-if="lastReading">
                <span class="text-h4 text-wrap font-weight-black">
                    {{ lastReading }}
                </span>
                <strong class="text-wrap">{{ output.unit }}</strong>
            </span>
            <span class="text-grey" v-else>No records yet</span>
        </template>
        <template #append>
            <v-btn
                v-if="!hideView"
                link
                size="small"
                icon="mdi-chevron-right"
                color="transparent"
                elevation="0"
                @click="onClickView"
            ></v-btn>
        </template>
        <slot name="reading" :="{ output }"></slot>
    </v-card>
</template>

<script setup lang="ts">
import type { Output } from '~~/shared/schema/output';

//

// --- Data Binding
const props = defineProps<{
    output: Output
    hideView?: boolean
    lastReading?: number
}>()

// --- State Binding
const emit = defineEmits<{
    view: [output: Output, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickView = () => emit("view", props.output, { loading })

//

</script>

<style scoped>

</style>