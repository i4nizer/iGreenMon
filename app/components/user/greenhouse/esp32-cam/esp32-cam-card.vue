<template>
	<v-card class="border pt-3" :loading>
		<v-card-title class="d-flex">
			<v-icon>mdi-chip</v-icon>
			<span class="ml-2">{{ esp32Cam.name }}</span>
		</v-card-title>
		<v-card-text class="text-grey">
			{{
				esp32Cam.description.length > 0
					? esp32Cam.description
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
import type { Esp32Cam } from '~~/shared/schema/esp32-cam';

//

// --- Data binding
const emit = defineEmits<{
	view: [esp32Cam: Esp32Cam, opts: { loading: Ref<boolean> }]
	edit: [esp32Cam: Esp32Cam, opts: { loading: Ref<boolean> }]
	delete: [esp32Cam: Esp32Cam, opts: { loading: Ref<boolean> }]
}>()

const props = defineProps<{
	esp32Cam: Esp32Cam
	hideView?: boolean
	hideEdit?: boolean
	hideDelete?: boolean
}>()

// --- State binding
const loading = ref(false)

const onClickView = () => emit("view", props.esp32Cam, { loading })
const onClickEdit = () => emit("edit", props.esp32Cam, { loading })
const onClickDelete = () => emit("delete", props.esp32Cam, { loading })

//

</script>

<style lang="scss" scoped></style>
