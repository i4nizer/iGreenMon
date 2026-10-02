<template>
	<v-row
		class="bg-green-darken-2 px-5 px-md-8 px-lg-10 py-16 my-0"
		style="min-height: calc(100dvh - 64px)"
		align="center"
		align-content="center"
		justify="center"
	>
		<v-col cols="12" md="8" class="text-center">
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<v-icon size="64">mdi-sprout</v-icon>
				<h1 class="text-h3 font-weight-black mt-4 my-0">
					Ready to Grow Smarter?
				</h1>
				<p class="text-h6 font-weight-regular mt-5">
					Set up your first greenhouse in minutes and let iGreenMon
					watch over your crops day and night.
				</p>
				<div class="d-flex flex-wrap justify-center ga-3 mt-8">
					<v-btn
						link
						to="/auth/sign-up"
						size="x-large"
						text="Sign Up"
						color="white"
						class="text-green-darken-2"
						elevation="0"
						append-icon="mdi-login"
					></v-btn>
					<v-btn
						link
						to="/auth/sign-in"
						size="x-large"
						text="Sign In"
						variant="outlined"
						elevation="0"
					></v-btn>
				</div>
			</motion>
		</v-col>
		<v-col cols="12" lg="10" class="mt-12">
			<p class="text-overline text-center text-green-lighten-4">
				Everything Included
			</p>
			<v-row class="mt-2">
				<v-col
					v-for="(item, i) in included"
					:key="item.title"
					cols="6"
					md="4"
				>
					<motion
						class="h-100"
						:initial="{ opacity: 0, y: 40 }"
						:whileInView="{ opacity: 1, y: 0 }"
						:inViewOptions="{ once: true }"
						:transition="{ delay: i * 0.05, duration: 0.4 }"
					>
						<v-card
							class="h-100 pa-4 bg-green-darken-3"
							elevation="0"
							:href="item.href"
						>
							<v-icon size="large">{{ item.icon }}</v-icon>
							<p class="font-weight-bold mt-2">{{ item.title }}</p>
							<p class="text-body-2 text-green-lighten-4">{{ item.text }}</p>
						</v-card>
					</motion>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Recap
const included = [
	{ icon: "mdi-leaf", title: "NPK Detection", text: "Spot deficiencies from photos.", href: "#npk-detection" },
	{ icon: "mdi-robot", title: "Automation", text: "Thresholds, schedules, hooks.", href: "#automation" },
	{ icon: "mdi-chart-line", title: "Live Monitoring", text: "Charts and CSV export.", href: "#monitoring" },
	{ icon: "mdi-bell-ring", title: "Email & SMS Alerts", text: "Even with spotty internet.", href: "#alerts" },
	{ icon: "mdi-account-group", title: "Crew Access", text: "Per-resource permissions.", href: "#crew" },
	{ icon: "mdi-chip", title: "Your Hardware", text: "ESP32 and ESP32-CAM.", href: "#hardware" },
]

//
</script>

<style scoped></style>
