<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ ...initialValues, greenhouseId }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Esp32Cam</h2>
		<span class="text-grey">
			Please provide the esp32-cam details.
		</span>
		<VeeField name="greenhouseId" #="{ field }">
			<input type="hidden" :="field">
		</VeeField>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="description" #="{ field, errorMessage }">
			<v-text-field
				label="Description"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="detect" #="{ field, errorMessage }">
			<v-select
				chips
				persistent-hint
				hint="Set Detect to Apply Lettuce NPK Deficiency Detection"
				label="Detect"
				v-model="field.value"
				:="field"
				:items="['Detect', 'Ignore']"
				:item-title="v => v"
				:item-value="v => v == 'Detect'"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="interval" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Interval"
				aria-autocomplete="both"
				prefix="ms"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="format" #="{ field, errorMessage }">
			<v-select
                chips
				persistent-hint
				hint="Default recommended is PIXFORMAT_JPEG."
				label="Format"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="Esp32CamFormat"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="quality" #="{ field, errorMessage }">
			<v-number-input
				persistent-hint
				hint="Lower is better quality, default 6."
				type="number"
				label="Quality"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:min="0"
				:max="63"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="resolution" #="{ field, errorMessage }">
			<v-select
                chips
				persistent-hint
				hint="Default recommended is FRAMESIZE_UXGA."
				label="Resolution"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="Esp32CamResolution"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="disabled" #="{ field, errorMessage }">
			<v-select
                chips
				label="Disabled"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="[`Disabled`, `Enabled`]"
				:item-title="i => i"
				:item-value="i => i == `Disabled`"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<v-btn
			type="submit"
			text="Create"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import {
	Esp32CamCreateSchema,
	Esp32CamFormat,
	Esp32CamResolution,
	type Esp32Cam,
	type Esp32CamCreate,
} from '~~/shared/schema/esp32-cam';

//

// --- Validation
const initialValues: Esp32CamCreate = {
	name: "",
	description: "",
	detect: false,
	interval: 60000,
	format: Esp32CamFormat[4],
	quality: 6,
	resolution: Esp32CamResolution[13],
	disabled: true,
	greenhouseId: 0,
}
const validationSchema = toTypedSchema(Esp32CamCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [esp32Cam: Esp32CamCreate]
	success: [esp32Cam: Esp32Cam]
}>()

const props = defineProps<{
	handler?: (values: Esp32CamCreate, event: any) => any
	greenhouseId: number
}>()

// --- CRUD
const { create } = useEsp32Cam()

const onSubmit = async (values: any, event: any) => {
	const esp32Cam = values as Esp32CamCreate
    emit("submit", esp32Cam)
    if (props.handler) return await props.handler(esp32Cam, event)

	const res = await create(esp32Cam)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ greenhouseId: props.greenhouseId })
}

//

</script>

<style scoped></style>
