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
                    :title="schedule.disabled ? 'Enable':'Disable'"
                    @click="onClickToggle"
                ></v-list-item>
            </v-list>
        </template>
    </v-menu>
</template>

<script setup lang="ts">
import type { Schedule } from '~~/shared/schema/schedule';

//

// --- Data Binding
const emit = defineEmits<{
    edit: [schedule: Schedule]
    toggle: [schedule: Schedule]
    delete: [schedule: Schedule]
}>()

const props = defineProps<{
    schedule: Schedule
    hideEdit?: boolean
    hideDelete?: boolean
    hideToggle?: boolean
}>()

// --- Actions
const onClickEdit = () => emit("edit", props.schedule)
const onClickDelete = () => emit("delete", props.schedule)

const onClickToggle = () => {
    const disabled = !props.schedule.disabled
    emit("toggle", { ...props.schedule, disabled })
}

//

</script>

<style scoped>

</style>