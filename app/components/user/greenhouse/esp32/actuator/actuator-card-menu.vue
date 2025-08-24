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
                    :title="actuator.disabled ? 'Enable':'Disable'"
                    @click="onClickToggle"
                ></v-list-item>
            </v-list>
        </template>
    </v-menu>
</template>

<script setup lang="ts">
import type { Actuator } from '~~/shared/schema/actuator';

//

// --- Data Binding
const emit = defineEmits<{
    edit: [actuator: Actuator]
    delete: [actuator: Actuator]
    toggle: [actuator: Actuator]
}>()

const props = defineProps<{
    actuator: Actuator
    loading?: Ref<boolean>
    hideEdit?: boolean
    hideDelete?: boolean
    hideToggle?: boolean
}>()

// --- Actions
const onClickEdit = () => emit("edit", props.actuator)
const onClickDelete = () => emit("delete", props.actuator)

const onClickToggle = () => {
    const disabled = !props.actuator.disabled
    emit("toggle", { ...props.actuator, disabled })
}

//

</script>

<style scoped>

</style>