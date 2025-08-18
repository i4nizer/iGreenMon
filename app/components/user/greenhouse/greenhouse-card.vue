<template>
	<v-card class="border pt-3" :loading>
		<v-card-title class="d-flex">
			<v-icon>mdi-sprout</v-icon>
			<span class="ml-2">{{ greenhouse.name }}</span>
		</v-card-title>
		<v-card-text class="text-grey">
			{{
				greenhouse.description.length > 0
					? greenhouse.description
					: "No description."
			}}
		</v-card-text>
		<v-card-actions>
			<v-btn 
				v-if="!hideView" 
				@click="onClickView"
			>
				<v-icon class="mr-1">mdi-cog</v-icon>
				<span v-if="$vuetify.display.smAndUp">View</span>
			</v-btn>
			<v-btn 
				v-if="!hideEdit" 
				color="blue" 
				@click="onClickEdit"
			>
				<v-icon class="mr-1">mdi-pencil</v-icon>
				<span v-if="$vuetify.display.smAndUp">Edit</span>
			</v-btn>
			<v-btn 
				v-if="!hideDelete" 
				color="red" 
				@click="onClickDelete"
			>
				<v-icon class="mr-1">mdi-delete</v-icon>
				<span v-if="$vuetify.display.smAndUp">Delete</span>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
import type { Greenhouse } from '~~/shared/schema/greenhouse';

//

// --- Data binding
const emit = defineEmits<{
	view: [greenhouse: Greenhouse, opts: { loading: Ref<boolean> }]
	edit: [greenhouse: Greenhouse, opts: { loading: Ref<boolean> }]
	delete: [greenhouse: Greenhouse, opts: { loading: Ref<boolean> }]
}>()

const props = defineProps<{
	greenhouse: Greenhouse
	hideView?: boolean
	hideEdit?: boolean
	hideDelete?: boolean
}>()

// --- State binding
const loading = ref(false)

const onClickView = () => emit("view", props.greenhouse, { loading })
const onClickEdit = () => emit("edit", props.greenhouse, { loading })
const onClickDelete = () => emit("delete", props.greenhouse, { loading })

//

</script>

<style lang="scss" scoped></style>
