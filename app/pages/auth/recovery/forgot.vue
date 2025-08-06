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
					<forgot-password-form
                        @error="onForgotError"
						@success="onForgotSuccess"
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

// --- Display results
const onForgotError = (msg: string) => {
	toast.error(msg)
}

const onForgotSuccess = async (redirectUrl: string) => {
	toast.success("Email with password reset link sent.")
	await navigateTo(redirectUrl)
}

//

</script>

<style scoped>

</style>