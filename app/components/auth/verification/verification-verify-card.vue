<template>
	<v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
		<v-card-text>
			<div class="d-flex flex-column align-center ga-3">
				<v-icon size="xxx-large" class="text-green"
					>mdi-progress-clock</v-icon
				>
				<h2 class="text-green">Verifying Your Account...</h2>
				<span class="text-wrap text-grey-darken-3 text-center">
					Please wait while we verify your iGreenMon account. This
					ensures secure access to your ESP32 devices and greenhouse
					data.
				</span>
				<v-progress-linear
					color="green"
					height="6"
					indeterminate
					rounded
				></v-progress-linear>
				<div class="text-grey-darken-1 d-flex align-center ga-2">
					<v-icon>mdi-email</v-icon>
					<span>Secure verification in progress.</span>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
