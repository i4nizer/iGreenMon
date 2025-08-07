<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ token: props.token }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create New Password</h2>
		<span class="text-grey">
            Enter a strong password to secure your Greenmon account.
        </span>
		<VeeField name="password" #="{ field, errorMessage }">
			<v-text-field
				label="New Password"
                class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:type="revealPassword ? 'text' : 'password'"
				:error-messages="errorMessage ? [errorMessage] : []"
				:append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="revealPassword = !revealPassword"
			></v-text-field>
		</VeeField>
		<VeeField name="confirm" #="{ field, errorMessage }">
			<v-text-field
				label="Confirm Password"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:type="revealPassword ? 'text' : 'password'"
				:error-messages="errorMessage ? [errorMessage] : []"
				:append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="revealPassword = !revealPassword"
			></v-text-field>
		</VeeField>
		<VeeField name="token" #="{ field }">
			<input type="hidden" :value="props.token" :="field" />
		</VeeField>
		<v-btn
			type="submit"
			text="Reset Password"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
		<div class="text-center mt-3">
			<nuxt-link to="/auth/sign-in" class="text-grey">
                Back to Sign In
            </nuxt-link>
		</div>
	</VeeForm>
</template>

<script setup lang="ts">
import { UserPasswordResetSchema } from "~~/shared/schema/user"
import type { UserPasswordReset } from "~~/shared/types/user"

//

// --- Validation
const validationSchema = toTypedSchema(UserPasswordResetSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [user: UserPasswordReset]
	success: [redirectUrl: string]
}>()
const props = defineProps<{ token: string, handle?: boolean }>()

// --- Password View State
const revealPassword = ref(false)

// --- Auth handling
const { resetPassword } = useAuthRecovery()

const onSubmit = async (values: any) => {
    const formData = values as UserPasswordReset
    emit("submit", formData)
    if (props.handle) return;

    const { password, confirm, token } = formData
    const resetResult = await resetPassword(password, confirm, token)
    if (!resetResult.success) return emit("error", resetResult.error)

    emit("success", resetResult.data.redirectUrl)
}

//
</script>

<style scoped></style>
