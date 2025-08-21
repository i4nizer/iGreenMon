<template>
    <v-menu open-on-hover>
        <template #activator="{ props: menuProps }">
            <slot name="activator">
                <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    color="white"
                    elevation="0"
                    :="menuProps"
                ></v-btn>
            </slot>
        </template>
        <template #default>
            <v-list>
                <v-list-item 
                    v-if="!hideEdit"
                    link 
                    rounded 
                    title="Edit"
                    @click="onClickEdit"
                ></v-list-item>
                <v-list-item 
                    v-if="!hideDelete"
                    link 
                    rounded 
                    title="Delete"
                    @click="onClickDelete"
                ></v-list-item>
                <v-list-item 
                    v-if="!hideToggle"
                    link 
                    rounded 
                    :title="sensor.disabled ? 'Enable':'Disable'"
                    @click="onClickToggle"
                ></v-list-item>
            </v-list>
        </template>
    </v-menu>
</template>

<script setup lang="ts">
import type { Sensor } from '~~/shared/schema/sensor';

//

// --- Data Binding
const emit = defineEmits<{
    edit: [sensor: Sensor]
    delete: [sensor: Sensor]
    toggle: [sensor: Sensor]
}>()

const props = defineProps<{
    sensor: Sensor
    loading?: Ref<boolean>
    hideEdit?: boolean
    hideDelete?: boolean
    hideToggle?: boolean
}>()

// --- Actions
const onClickEdit = () => emit("edit", props.sensor)
const onClickDelete = () => emit("delete", props.sensor)

const onClickToggle = () => {
    const disabled = !props.sensor.disabled
    emit("toggle", { ...props.sensor, disabled })
}

//

</script>

<style scoped>

</style>