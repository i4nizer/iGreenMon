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
				<div class="w-100 w-md-75 w-xl-50 d-flex align-center justify-center">
					<sign-up-form 
						@error="onSignUpError"
						@success="onSignUpSuccess" 
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

// --- Redirect on success
const onSignUpSuccess = async (redirectUrl: string) => {
	await navigateTo(redirectUrl)
}

const onSignUpError = async (msg: string) => {
	toast.error(msg)
}

//

</script>

<style lang="css" scoped></style>
