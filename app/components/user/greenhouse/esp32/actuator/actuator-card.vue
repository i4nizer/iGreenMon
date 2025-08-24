<template>
    <v-card class="border pt-3" :loading>
        <v-card-title class="d-flex ga-1 text-wrap">
            <span :class="actuator.disabled ? 'text-red':'text-green'">
                {{ actuator.name }}
            </span>
            <v-spacer></v-spacer>
            <slot name="menu" :="{ actuator, onEdit, onToggle, onDelete }" />
        </v-card-title>
        <v-card-subtitle class="text-wrap">
            Description: {{ actuator.description }}
        </v-card-subtitle>
        <v-card-text>
            <slot name="input" :="{ actuator }" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Actuator } from '~~/shared/schema/actuator';

//

// --- Data Binding
const props = defineProps<{ actuator: Actuator }>()

// --- State Binding
const emit = defineEmits<{
    edit: [actuator: Actuator, opts: { loading: Ref<boolean> }]
    toggle: [actuator: Actuator, opts: { loading: Ref<boolean> }]
    delete: [actuator: Actuator, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onEdit = (actuator: Actuator) => emit("edit", actuator, { loading })
const onToggle = (actuator: Actuator) => emit("toggle", actuator, { loading })
const onDelete = (actuator: Actuator) => emit("delete", actuator, { loading })

//

</script>

<style scoped>

</style>