<template>
	<v-container class="pa-0" fluid>
		<v-row
			class="d-flex flex-xs-column flex-md-row justify-xs-center align-md-center bg-green-lighten-5 w-screen py-5 px-5 px-md-8 px-lg-10"
			style="min-height: calc(100dvh - 64px)"
			align="center"
		>
			<v-col cols="12" sm="12" md="6">
				<v-chip
					text="Greenhouse Automation"
					prepend-icon="mdi-lightning-bolt"
				></v-chip>
				<h1 class="text-h3 font-weight-black mt-4 my-0">
					Connect Everything.
				</h1>
				<h1 class="text-h3 font-weight-black text-green my-0">
					Transform Everything.
				</h1>
				<p class="text-grey-darken-2 mt-5">
					Unlock the power of the Internet of Things with our
					comprehensive platform. Connect devices, analyze data, and
					automate processes to drive innovation and efficiency.
				</p>
				<v-btn
					link
					to="/auth/sign-up"
					size="large"
					text="Sign Up"
					color="green"
					class="mt-5"
					elevation="0"
					append-icon="mdi-login"
				></v-btn>
			</v-col>
			<v-col
				cols="12"
				sm="12"
				md="6"
				class="d-flex justify-center align-center"
			>
				<v-card
					class="w-100 pa-0 pa-md-10 bg-transparent"
					elevation="0"
				>
					<v-card-text class="d-flex justify-center align-center">
						<v-img
							src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/art-greenhouse.png"
						/>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-footer class="bg-green-darken-4 pa-5">
			<span>© 2025 Greenmon. All rights reserved.</span>
		</v-footer>
	</v-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
