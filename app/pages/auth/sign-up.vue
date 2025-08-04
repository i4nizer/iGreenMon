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
					<sign-up-form @success="onSignedIn" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">

//

// --- Redirect on success
const onSignedIn = async (redirectUrl: string) => {
	await navigateTo(redirectUrl)
}

//

</script>

<style lang="css" scoped></style>
