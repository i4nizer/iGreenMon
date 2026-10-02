<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
		align-content="center"
	>
		<v-col cols="12" class="text-center">
			<v-chip
				text="How It Works"
				color="green"
				prepend-icon="mdi-lightning-bolt"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>From Seedling to Harvest,&nbsp;</span>
					<span class="text-green">in Four Steps</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5 mx-auto" style="max-width: 640px">
				Everything runs on hardware you can wire up yourself, managed
				from a single dashboard.
			</p>
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
				<v-card class="h-100 border d-flex flex-column" elevation="0">
					<v-sheet
						class="d-flex justify-center align-center bg-green-lighten-5 position-relative"
						height="160"
					>
						<v-chip
							class="font-weight-bold position-absolute"
							style="top: 12px; left: 12px"
							color="green"
							:text="`${i + 1}`"
						></v-chip>
						<v-icon color="green" size="72">{{ step.icon }}</v-icon>
					</v-sheet>
					<div class="pa-5">
						<p class="text-h6">{{ step.title }}</p>
						<p class="text-grey-darken-2 mt-1">{{ step.text }}</p>
						<v-list density="compact" class="mt-2 pa-0">
							<v-list-item
								v-for="point in step.points"
								:key="point"
								class="px-0"
								prepend-icon="mdi-check-circle"
								base-color="green"
							>
								<span class="text-grey-darken-3">{{ point }}</span>
							</v-list-item>
						</v-list>
					</div>
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
		text: "Link your ESP32 boards and ESP32-CAM to your greenhouse.",
		points: [
			"Sensors and actuators",
			"Pins set from the dashboard",
			"Cameras for crop images",
		],
	},
	{
		icon: "mdi-tune-variant",
		title: "Set Rules",
		text: "Decide when your actuators should run.",
		points: [
			"Sensor thresholds",
			"Daily schedules",
			"Before and after reading hooks",
		],
	},
	{
		icon: "mdi-bell-ring",
		title: "Get Alerted",
		text: "Hear about problems the moment they happen.",
		points: [
			"Email notifications",
			"SMS through a phone app",
			"Warning and error logs",
		],
	},
	{
		icon: "mdi-leaf",
		title: "Detect",
		text: "Let the camera check your lettuce for nutrient problems.",
		points: [
			"Nitrogen deficiency",
			"Phosphorus deficiency",
			"Potassium deficiency",
		],
	},
]

//
</script>

<style scoped></style>
