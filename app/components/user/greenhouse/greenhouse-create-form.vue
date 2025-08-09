<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Greenhouse</h2>
		<span class="text-grey">
			Please provide the greenhouse details.
		</span>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="
					[
						errorMessage,
						isNameAvailable ? undefined : 'Name is not available.',
					].filter((e) => e != undefined)
				"
				@update:model-value="onTypeName"
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
		<v-btn
			type="submit"
			text="Create"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid || !isNameAvailable"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { GreenhouseCreateSchema, GreenhouseSchema } from '~~/shared/schema/greenhouse';

//

// --- Validation
const validationSchema = toTypedSchema(GreenhouseCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [greenhouse: GreenhouseCreate]
	success: [greenhouse: Greenhouse]
}>()
const props = defineProps<{
    handler?: (values: GreenhouseCreate, event: any) => any
}>()

// --- CRUD
const { create, isGHNameAvailable } = useGreenhouse()

const onSubmit = async (values: any, event: any) => {
    const gh = values as GreenhouseCreate
    emit("submit", gh)
    if (props.handler) return await props.handler(gh, event)

	const createResult = await create(gh)
	if (!createResult.success) return emit("error", createResult.error)
	emit("success", createResult.data)
}

// --- Name Check
const lastTypeName = ref(Date.now())
const isNameAvailable = ref(true)

const onTypeName = (name: string) => {
	lastTypeName.value = Date.now()
    const nameResult = GreenhouseSchema.pick({ name: true }).safeParse({ name })
	if (!nameResult.success) return

	setTimeout(async () => {
		if (Date.now() - lastTypeName.value < 500) return
		const checkResult = await isGHNameAvailable(name)
		if (!checkResult.success) return emit("error", checkResult.error)
		isNameAvailable.value = checkResult.data
	}, 500)
}

//

</script>

<style scoped></style>
