<template>
    <v-menu open-on-hover>
        <template #activator="{ props: menuProps }">
            <v-btn
                icon="mdi-dots-vertical"
                size="small"
                color="white"
                elevation="0"
                :="menuProps"
            ></v-btn>
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
                    :title="threshold.disabled ? 'Enable':'Disable'"
                    @click="onClickToggle"
                ></v-list-item>
            </v-list>
        </template>
    </v-menu>
</template>

<script setup lang="ts">
import type { Threshold } from '~~/shared/schema/threshold';

//

// --- Data Binding
const emit = defineEmits<{
    edit: [threshold: Threshold]
    toggle: [threshold: Threshold]
    delete: [threshold: Threshold]
}>()

const props = defineProps<{
    threshold: Threshold
    hideEdit?: boolean
    hideDelete?: boolean
    hideToggle?: boolean
}>()

// --- Actions
const onClickEdit = () => emit("edit", props.threshold)
const onClickDelete = () => emit("delete", props.threshold)

const onClickToggle = () => {
    const disabled = !props.threshold.disabled
    emit("toggle", { ...props.threshold, disabled })
}

//

</script>

<style scoped>

</style>