<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col cols="12" md="4" class="pa-0">
				<quote-panel />
			</v-col>
			<v-col
				cols="12"
				md="8"
				class="pa-0 d-flex align-center justify-center h-md-screen"
			>
				<div
					class="w-100 w-md-75 w-xl-50 d-flex align-center justify-center"
				>
					<password-reset-form
                        :token
                        @error="onResetError"
                        @success="onResetSuccess"
                    />
				</div>
			</v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Notifications
const toast = useToast()

// --- Get email from params & require token from query
const route = useRoute()
const email = route.params.email as string
const token = route.query.token as string
if (!token) await navigateTo(`/auth/recovery/email/${email}/sent`)

// --- Display action results
const onResetError = (msg: string) => {
    toast.error(msg)
}

const onResetSuccess = async (redirectUrl: string) => {
    toast.success("Password changed successfully.")
    await navigateTo(redirectUrl)
}

//

</script>

<style scoped>

</style>