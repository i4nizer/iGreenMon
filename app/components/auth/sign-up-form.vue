<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="signUp"
	>
		<h2 class="text-green">Create an account</h2>
		<span class="text-grey">Sign up for your IoT Dashboard account</span>
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
		<VeeField name="email" #="{ field, errorMessage }">
			<v-text-field
				label="Email"
				placeholder="example@email.com"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="phone" #="{ field, errorMessage }">
			<v-text-field
				label="Phone"
				placeholder="09123456789"
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
			text="Sign Up"
			type="submit"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
		<div class="text-center mt-3">
			<span>Already have an account? </span>
			<NuxtLink class="text-grey" to="/auth/sign-in">Sign In</NuxtLink>
		</div>
	</VeeForm>
</template>

<script setup lang="ts">
import { UserSignUpSchema } from "~~/shared/schema/user"
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Validation
const validationSchema = toTypedSchema(UserSignUpSchema)

// --- Data Binding
const emit = defineEmits<{
	error: []
	success: [user: UserSafe]
}>()

// --- View Password State
const revealPassword = ref(false)

// --- Pass Invoke
const signUp = (values: any) => emit("success", values as UserSafe)

//
</script>

<style scoped></style>
