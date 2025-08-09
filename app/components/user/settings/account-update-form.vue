<template>
	<VeeForm
		class="border-none pa-1"
		:initial-values="user"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<div class="d-flex align-center ga-2">
			<v-icon>mdi-account-cog</v-icon>
			<h4>User Account</h4>
		</div>
		<span class="text-grey">You can update your account details.</span>
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
		<v-text-field
			readonly
			label="Email"
			placeholder="example@email.com"
			aria-autocomplete="both"
			v-model="user.email"
		></v-text-field>
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
		<v-btn
			v-show="meta.dirty"
			text="Save"
			type="submit"
			color="green"
			class="w-100 mt-3"
			elevation="0"
			:disabled="!meta.valid || !isNameAvailable"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { UserSchema, UserUpdateSchema } from "~~/shared/schema/user"
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Validation
const validationSchema = toTypedSchema(UserUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [user: UserUpdate]
	success: [user: UserSafe]
}>()
const props = defineProps<{
	user: UserSafe,
	handler?: (values: UserUpdate, event: any) => any
}>()

// --- User handling
const { update } = useUser()

const onSubmit = async (values: any, event: any) => {
	const updates = values as UserUpdate
	emit("submit", updates)
	if (props.handler) return await props.handler(updates, event)

	const UdpateResult = await update(updates)
	if (!UdpateResult.success) return emit("error", UdpateResult.error)

	emit("success", UdpateResult.data)
	event?.resetForm({ values: props.user })
}

// --- Name and email checking
const authCheck = useAuthCheck()
const lastTypeName = ref(Date.now())
const isNameAvailable = ref(true)

const onTypeName = (name: string) => {
	if (props.user.name == name) return;
	lastTypeName.value = Date.now()
	const nameResult = UserSchema.pick({ name: true }).safeParse({ name })
	if (!nameResult.success) return

	setTimeout(async () => {
		if (Date.now() - lastTypeName.value < 500) return
		const checkResult = await authCheck.isNameAvailable(name)
		if (!checkResult.success) return emit("error", checkResult.error)
		isNameAvailable.value = checkResult.data
	}, 500)
}

//
</script>

<style scoped></style>
