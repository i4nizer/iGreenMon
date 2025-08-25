<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="{ ...schedule }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Schedule</h2>
		<span class="text-grey">
			Please provide the schedule details.
		</span>
        <VeeField name="id" #="{ field }">
            <input type="hidden" :value="field.value" :="field">
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
		<VeeField name="days" #="{ field, errorMessage }">
			<v-select
				chips
                multiple
				label="Days"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="Array.from({ length: 30 }, (_, i) => i + 1)"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="times" #="{ field, errorMessage }">
            <schedule-time-field
                label="Times"
                v-model="(field.value as ScheduleTime[])"
                :name="field.name"
                :value="(field.value as ScheduleTime[])"
                :checked="field.checked"
                @blur="field.onBlur"
                @input="field.onInput"
                @change="field.onChange"
                @update:modelValue="field['onUpdate:modelValue']"
            ></schedule-time-field>
		</VeeField>
		<VeeField name="disabled" #="{ field, errorMessage }">
			<v-select
				chips
				label="Disabled"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="['Disabled', 'Enabled']"
                :item-title="i => i"
                :item-value="i => i == 'Disabled'"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<v-btn
			type="submit"
			text="Update"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import {
	ScheduleUpdateSchema,
	type Schedule,
	type ScheduleUpdate,
    type ScheduleTime,
} from '~~/shared/schema/schedule';

//

// --- Validation
const validationSchema = toTypedSchema(ScheduleUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [schedule: ScheduleUpdate]
	success: [schedule: Schedule]
}>()

const props = defineProps<{
    handler?: (values: ScheduleUpdate, event: any) => any
    schedule: Schedule
}>()

// --- CRUD
const { update } = useSchedule()

const onSubmit = async (values: any, event: any) => {
    const sched = values as ScheduleUpdate
    emit("submit", sched)
    if (props.handler) return await props.handler(sched, event)

	const updateResult = await update(sched)
	if (!updateResult.success) return emit("error", updateResult.error)
    emit("success", updateResult.data)
    event?.resetForm(props.schedule)
}

//

</script>

<style scoped></style>
