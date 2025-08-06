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
					<verification-verify-card />
				</div>
			</v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Notifications
const toast = useToast()

// --- Get email in params and token in query
const route = useRoute()
const email = route.params.email as string
const token = route.query.token as string
if (!token) await navigateTo(`/auth/verification/email/${email}/sent`)

// --- Verify after load
const { verifyUser } = useAuthVerification()

onBeforeMount(async () => {
    const verificationResult = await verifyUser(email, token)
    if (!verificationResult.success) {
        toast.error(verificationResult.error)
        await navigateTo(`/auth/verification/email/${email}/failed`)
	} else {
		toast.success("User verified successfully.")
        await navigateTo(verificationResult.data.redirectUrl)
    }
})

//

</script>

<style scoped>

</style>