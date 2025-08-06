<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Sign in to your account</h2>
		<span class="text-grey">
			Enter your credentials to access your IoT Dashboard
		</span>
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
		<VeeField name="password" #="{ field, errorMessage }">
			<v-text-field
				label="Password"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:type="revealPassword ? 'text' : 'password'"
				:error-messages="errorMessage ? [errorMessage] : []"
				:append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="revealPassword = !revealPassword"
			></v-text-field>
		</VeeField>
		<v-btn
			type="submit"
			text="Sign In"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
		<div class="text-center mt-3">
			<span>Don't have an account? </span>
			<nuxt-link to="/auth/sign-up" class="text-grey">Sign Up</nuxt-link>
			<br />
			<nuxt-link to="/auth/recovery/forgot" class="text-grey">
                Forgot your password?
            </nuxt-link>
		</div>
	</VeeForm>
</template>

<script setup lang="ts">
import type { UserSignIn } from "~~/shared/types/user"
import { UserSchema, UserSignInSchema } from "~~/shared/schema/user"

//

// --- Validation
const validationSchema = toTypedSchema(UserSignInSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [user: UserSignIn]
	success: [redirectUrl: string]
}>()
const props = defineProps<{ handle?: boolean }>()

// --- Password toggle
const revealPassword = ref(false)

// --- Auth handling
const auth = useAuth()

const onSubmit = async (values: any) => {
	if (props.handle) return emit("submit", values as UserSignIn)

	const signInResult = await auth.signIn(values as UserSignIn)
	if (!signInResult.success) return emit("error", signInResult.error)

	emit("success", signInResult.data.redirectUrl)
}

//

</script>

<style scoped></style>
