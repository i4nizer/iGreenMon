<template>
	<v-card class="border pt-3">
		<v-card-title class="d-flex text-wrap">
			<v-icon 
                :color="threshold.disabled ? 'red' : 'green'"
            >mdi-arrow-decision-auto</v-icon>
			<span
				class="ml-2"
				:class="threshold.disabled ? 'text-red' : 'text-green'"
            >{{ threshold.name }}</span>
			<v-spacer></v-spacer>
			<slot name="menu" :="{ threshold, onEdit, onToggle, onDelete }"></slot>
		</v-card-title>
		<v-card-text>
			<slot name="condition" :="{ threshold }"></slot>
            <v-card-subtitle class="text-center text-wrap">
				<span>If </span>
				<span class="font-weight-bold">
                    {{ threshold.operator.toUpperCase() }}
                </span>
				<span>
					of these
					<span class="font-weight-bold">CONDITIONS</span> 
                    above are met then
				</span>
				<span>these 
                    <span class="font-weight-bold">ACTIONS</span> 
                    below will be triggered.
                </span>
			</v-card-subtitle>
			<slot name="action" :="{ threshold }"></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { Threshold } from "~~/shared/schema/threshold"

//

// --- Data Binding
const props = defineProps<{ threshold: Threshold }>()

// --- State Binding
const emit = defineEmits<{
    edit: [threshold: Threshold, opts: { loading: Ref<boolean> }]
    toggle: [threshold: Threshold, opts: { loading: Ref<boolean> }]
    delete: [threshold: Threshold, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onEdit = (threshold: Threshold) => emit("edit", threshold, { loading })
const onToggle = (threshold: Threshold) => emit("toggle", threshold, { loading })
const onDelete = (threshold: Threshold) => emit("delete", threshold, { loading })

//
</script>

<style lang="scss" scoped></style>
