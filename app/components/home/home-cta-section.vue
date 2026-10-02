<template>
	<v-row
		class="bg-green-darken-2 px-5 px-md-8 px-lg-10 py-16 my-0"
		align="center"
		justify="center"
	>
		<v-col cols="12" md="8" class="text-center">
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<v-icon size="48">mdi-sprout</v-icon>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					Ready to Grow Smarter?
				</h1>
				<p class="mt-5">
					Set up your first greenhouse in minutes and let iGreenMon
					watch over your crops day and night.
				</p>
				<div class="d-flex flex-wrap justify-center ga-3 mt-8">
					<v-btn
						link
						to="/auth/sign-up"
						size="large"
						text="Sign Up"
						color="white"
						class="text-green-darken-2"
						elevation="0"
						append-icon="mdi-login"
					></v-btn>
					<v-btn
						link
						to="/auth/sign-in"
						size="large"
						text="Sign In"
						variant="outlined"
						elevation="0"
					></v-btn>
				</div>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

//
</script>

<style scoped></style>
