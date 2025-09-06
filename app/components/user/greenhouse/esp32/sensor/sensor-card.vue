<template>
    <v-card class="border pt-3" :loading>
        <v-card-title class="d-flex ga-1 text-wrap">
            <span :class="sensor.disabled ? 'text-red':'text-green'">
                {{ sensor.name }}
            </span>
            <v-spacer></v-spacer>
            <slot name="menu" :="{ sensor, onEdit, onToggle, onDelete }" />
        </v-card-title>
        <v-card-subtitle class="text-wrap">
            Description: {{ sensor.description }}
        </v-card-subtitle>
        <v-card-text>
            <span class="w-100 text-wrap">
                Read Interval: Every {{ sensor.interval }}ms
            </span>
            <slot name="output" :="{ sensor }" />
            <slot name="hook" :="{ sensor }" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Sensor } from '~~/shared/schema/sensor';

//

// --- Data Binding
const props = defineProps<{ sensor: Sensor }>()

// --- State Binding
const emit = defineEmits<{
    edit: [sensor: Sensor, opts: { loading: Ref<boolean> }]
    toggle: [sensor: Sensor, opts: { loading: Ref<boolean> }]
    delete: [sensor: Sensor, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onEdit = (sensor: Sensor) => emit("edit", sensor, { loading })
const onToggle = (sensor: Sensor) => emit("toggle", sensor, { loading })
const onDelete = (sensor: Sensor) => emit("delete", sensor, { loading })

//

</script>

<style scoped>

</style>