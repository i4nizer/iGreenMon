<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Forgot Password?</h2>
		<span class="text-grey">
			Enter your email address and we'll send you a link to reset your
			password.
		</span>
		<VeeField name="email" #="{ field, errorMessage }">
			<v-text-field
				label="Email"
				class="mt-6"
				placeholder="example@email.com"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<v-btn
			type="submit"
			text="Send Reset Link"
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
import { UserEmailSchema } from "~~/shared/schema/user"
import type { UserEmail } from "~~/shared/schema/user"

//

// --- Types & Validation
const validationSchema = toTypedSchema(UserEmailSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [user: UserEmail]
	success: [redirectUrl: string]
}>()
const props = defineProps<{ handle?: boolean }>()

// --- Auth handling
const { forgotPassword } = useAuthRecovery()

const onSubmit = async (values: any) => {
	const form = values as UserEmail
	emit("submit", form)
	if (props.handle) return;

	const forgotResult = await forgotPassword(form.email)
	if (!forgotResult.success) return emit("error", forgotResult.error)

	emit("success", forgotResult.data.redirectUrl)
}

//
</script>

<style scoped></style>
