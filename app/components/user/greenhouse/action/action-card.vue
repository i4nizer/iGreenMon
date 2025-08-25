<template>
	<v-card class="border pt-3">
		<v-card-title class="d-flex ga-1 text-subtitle-1">
			<span class="text-wrap">
				<span>{{ action.name }} inputs </span>
				<strong>{{ action.value }} </strong>
				<span> to </span>
				<strong>{{ input.name }}</strong>
			</span>
			<v-spacer></v-spacer>
			<v-icon>{{ input.icon }}</v-icon>
		</v-card-title>
		<v-card-actions>
			<v-card-subtitle v-if="$vuetify.display.smAndUp" class="text-wrap">
				<span>Duration: {{ duration }}</span>
			</v-card-subtitle>
			<v-spacer></v-spacer>
			<v-btn
				size="small"
				icon="mdi-pencil"
				color="blue"
                @click="onClickEdit(action)"
			></v-btn>
			<v-btn
				size="small"
				icon="mdi-delete"
				color="red"
				@click="onClickDelete(action)"
			></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
import type { Input } from "~~/shared/schema/input"
import type { Action } from "~~/shared/schema/action"
import type { Schedule } from "~~/shared/schema/schedule"
import type { Threshold } from "~~/shared/schema/threshold"

//

// --- Data Binding
const props = defineProps<{
	input: Input
	action: Action
	schedule?: Schedule
	threshold?: Threshold
}>()

// --- State Binding
const emit = defineEmits < {
    edit: [action: Action, opts: { loading: Ref<boolean> }]
    delete: [action: Action, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = (action: Action) => emit("edit", action, { loading })
const onClickDelete = (action: Action) => emit("delete", action, { loading })

// --- Formatting
const duration = computed(() =>
    props.action.duration <= -1
        ? "Endless"
        : `${props.action.duration}ms`
)

//
</script>

<style lang="scss" scoped></style>
