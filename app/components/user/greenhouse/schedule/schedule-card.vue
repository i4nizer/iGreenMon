<template>
	<v-card class="border pt-3">
		<v-card-title class="d-flex text-wrap">
			<v-icon 
                :color="schedule.disabled ? 'red' : 'green'"
            >mdi-arrow-decision-auto</v-icon>
			<span
				class="ml-2"
				:class="schedule.disabled ? 'text-red' : 'text-green'"
            >{{ schedule.name }}</span>
			<v-spacer></v-spacer>
			<slot name="menu" :="{ schedule, onEdit, onToggle, onDelete }"/>
		</v-card-title>
        <v-card-subtitle class="text-wrap">
            <span>These actions will be triggered every </span>
            <span>[{{ times }}] </span>
            <span>
                <span>in these days [</span>
                <span>{{ schedule.days.join(', ') }}</span>
                <span>] of the month.</span>
            </span>
        </v-card-subtitle>
		<v-card-text>
			<slot name="action" :="{ schedule }"></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { Schedule } from "~~/shared/schema/schedule"

//

// --- Data Binding
const props = defineProps<{ schedule: Schedule }>()

// --- State Binding
const emit = defineEmits<{
    edit: [schedule: Schedule, opts: { loading: Ref<boolean> }]
    toggle: [schedule: Schedule, opts: { loading: Ref<boolean> }]
    delete: [schedule: Schedule, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onEdit = (schedule: Schedule) => emit("edit", schedule, { loading })
const onToggle = (schedule: Schedule) => emit("toggle", schedule, { loading })
const onDelete = (schedule: Schedule) => emit("delete", schedule, { loading })

// --- Formatting
const date = useDate()

const times = computed(() =>
    props.schedule.times
        .map(t => date.format(`1970-01-01 ${t}`, 'fullTime12h'))
        .join(', ')
)

//
</script>

<style lang="scss" scoped></style>
