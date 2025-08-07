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
					<password-changed-card @redirect="onRedirect" />
				</div>
			</v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Auto-redirect when countdown ends
const onRedirect = async () => await navigateTo(`/auth/sign-in`)

//

</script>

<style scoped>

</style>