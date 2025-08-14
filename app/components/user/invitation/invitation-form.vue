<template>
    <VeeForm
		class="pa-7 w-100"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Invite Crew</h2>
		<span class="text-grey">
			Invite a Crew to your Greenhouse.
		</span>
		<VeeField name="message" #="{ field, errorMessage }">
			<v-textarea
				label="Message"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-textarea>
		</VeeField>
		<VeeField name="inviteeId" #="{ field, errorMessage }">
            <v-number-input
                type="number"
				label="Invitee's ID"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="greenhouseId" #="{ field, errorMessage }">
			<v-select
				label="Greenhouse"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="greenhouses"
                :item-title="g => g.name"
                :item-value="g => g.id"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<v-btn
			type="submit"
			text="Sign In"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { InvitationCreateSchema } from '~~/shared/schema/invitation';

//

// --- Validation
const validationSchema = toTypedSchema(InvitationCreateSchema)

// --- Data Binding
const emit = defineEmits<{
    error: [msg: string]
    submit: [inv: InvitationCreate]
    success: [inv: InvitationGet]
}>()

const props = defineProps<{
    handler?: (inv: InvitationCreate, event: any) => any
    greenhouses: Greenhouse[]
}>()

// --- Handling
const invUtil = useInvitation()

const onSubmit = async (values: any, event: any) => {
    const inv = values as InvitationCreate
    emit("submit", inv)
    if (props.handler) return props.handler(inv, event)

    const invResult = await invUtil.create(inv)
    if (!invResult.success) return emit("error", invResult.error)

    emit("success", invResult.data)
    event?.resetForm()
}

//

</script>

<style scoped>

</style>