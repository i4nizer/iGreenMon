<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		align="center"
	>
		<v-col cols="12" class="text-center">
			<v-chip
				text="How It Works"
				color="green"
				prepend-icon="mdi-lightning-bolt"
			></v-chip>
			<h1 class="text-h4 font-weight-black mt-4 my-0">
				<span>From Seedling to Harvest,&nbsp;</span>
				<span class="text-green">in Four Steps</span>
			</h1>
		</v-col>
		<v-col
			v-for="(step, i) in steps"
			:key="step.title"
			cols="12"
			sm="6"
			md="3"
		>
			<motion
				class="h-100"
				:initial="{ opacity: 0, y: 40 }"
				:whileInView="{ opacity: 1, y: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ delay: i * 0.1, duration: 0.4 }"
			>
				<v-card class="h-100 pa-5 border" elevation="0">
					<div class="d-flex align-center ga-3">
						<v-chip
							class="font-weight-bold"
							color="green"
							:text="`${i + 1}`"
						></v-chip>
						<v-icon color="green" size="large">{{ step.icon }}</v-icon>
					</div>
					<p class="text-h6 mt-4">{{ step.title }}</p>
					<p class="text-grey-darken-2 mt-1">{{ step.text }}</p>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Steps
const steps = [
	{
		icon: "mdi-chip",
		title: "Connect",
		text: "Plug in your ESP32 sensors, actuators, and ESP32-CAM, then link them to your greenhouse.",
	},
	{
		icon: "mdi-tune-variant",
		title: "Set Rules",
		text: "Create thresholds, schedules, and reading hooks that run your actuators for you.",
	},
	{
		icon: "mdi-bell-ring",
		title: "Get Alerted",
		text: "Receive email and SMS alerts the moment something in your greenhouse needs attention.",
	},
	{
		icon: "mdi-leaf",
		title: "Detect",
		text: "Let the camera spot nitrogen, phosphorus, and potassium deficiencies in your lettuce.",
	},
]

//
</script>

<style scoped></style>
