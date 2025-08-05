<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
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
				:error-messages="
					[
						errorMessage,
						isNameAvailable ? undefined : 'Name is not available.',
					].filter((e) => e != undefined)
				"
				@update:model-value="onTypeName"
			></v-text-field>
		</VeeField>
		<VeeField name="email" #="{ field, errorMessage }">
			<v-text-field
				label="Email"
				placeholder="example@email.com"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="
					[
						errorMessage,
						isEmailAvailable ? undefined : 'Email already in use.',
					].filter((e) => e != undefined)
				"
				@update:model-value="onTypeEmail"
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
import { UserSchema, UserSignUpSchema } from "~~/shared/schema/user"
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Validation
const validationSchema = toTypedSchema(UserSignUpSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [user: UserSignUp]
	success: [redirectUrl: string]
}>()
const props = defineProps<{ handle?: boolean }>()

// --- Password toggle
const revealPassword = ref(false)

// --- Auth handling
const auth = useAuth()
const onSubmit = async (values: any) => {
	if (props.handle) return emit("submit", values as UserSignUp)

	const signUpResult = await auth.signUp(values as UserSignUp)
	if (!signUpResult.success) return emit("error", signUpResult.error)

	emit("success", signUpResult.data.redirectUrl)
}

// --- Name and email checking
const authCheck = useAuthCheck()
const lastTypeName = ref(Date.now())
const lastTypeEmail = ref(Date.now())
const isNameAvailable = ref(true)
const isEmailAvailable = ref(true)

const onTypeName = (name: string) => {
	if (name.length <= 0) return
	lastTypeName.value = Date.now()

	const nameResult = UserSchema.pick({ name: true }).safeParse({ name })
	if (!nameResult.success) return

	setTimeout(async () => {
		if (Date.now() - lastTypeName.value < 500) return
		isNameAvailable.value = await authCheck.isNameAvailable(name)
	}, 500)
}

const onTypeEmail = (email: string) => {
	if (email.length <= 0) return
	lastTypeEmail.value = Date.now()

	const emailResult = UserSchema.pick({ email: true }).safeParse({ email })
	if (!emailResult.success) return

	setTimeout(async () => {
		if (Date.now() - lastTypeEmail.value < 500) return
		isEmailAvailable.value = await authCheck.isEmailAvailable(email)
	}, 500)
}

//
</script>

<style scoped></style>
