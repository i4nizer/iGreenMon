<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
	>
		<v-col cols="12" md="8" lg="6">
			<v-chip
				text="Automation"
				color="green"
				prepend-icon="mdi-robot"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>Your Greenhouse,&nbsp;</span>
					<span class="text-green">Running on Its Own</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5">
				Tell iGreenMon what to do and when. Every rule triggers actions
				on your actuators, so fans, pumps, and lights respond without
				you lifting a finger.
			</p>
		</v-col>
		<v-col cols="12">
			<v-row>
				<v-col
					v-for="(trigger, i) in triggers"
					:key="trigger.title"
					cols="12"
					md="4"
				>
					<motion
						class="h-100"
						:initial="{ opacity: 0, y: 40 }"
						:whileInView="{ opacity: 1, y: 0 }"
						:inViewOptions="{ once: true }"
						:transition="{ delay: i * 0.1, duration: 0.4 }"
					>
						<v-card class="h-100 pa-5 border" elevation="0">
							<v-avatar color="green-lighten-5" size="48">
								<v-icon color="green">{{ trigger.icon }}</v-icon>
							</v-avatar>
							<p class="text-h6 mt-4">{{ trigger.title }}</p>
							<p class="text-grey-darken-2 mt-1">
								{{ trigger.text }}
							</p>
							<v-sheet
								class="mt-4 pa-3 bg-green-lighten-5 rounded"
							>
								<p class="text-caption text-green-darken-2">
									<v-icon size="small">mdi-code-braces</v-icon>
									Example
								</p>
								<p class="font-weight-medium mt-1">
									{{ trigger.example }}
								</p>
							</v-sheet>
						</v-card>
					</motion>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols="12">
			<motion
				:initial="{ opacity: 0, y: 40 }"
				:whileInView="{ opacity: 1, y: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ delay: 0.3, duration: 0.4 }"
			>
				<v-alert
					class="border"
					color="green-darken-2"
					variant="tonal"
					icon="mdi-sort-numeric-ascending"
					title="Priority-Based Actions"
				>
					When two rules target the same actuator, the higher priority
					action interrupts the lower one, so conflicting rules never
					fight over your equipment.
				</v-alert>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Triggers
const triggers = [
	{
		icon: "mdi-thermometer-alert",
		title: "Thresholds",
		text: "Combine sensor conditions with All or Any and act once they are met.",
		example: "If temperature is above 40 °C and humidity is below 50%, turn on the fan.",
	},
	{
		icon: "mdi-calendar-clock",
		title: "Schedules",
		text: "Pick the days and times, and actions run like clockwork every month.",
		example: "Every day at 6:00 AM, turn on the grow lights.",
	},
	{
		icon: "mdi-hook",
		title: "Reading Hooks",
		text: "Run actions before, during, or after a sensor takes its reading.",
		example: "Before reading soil moisture, turn off the water pump.",
	},
]

//
</script>

<style scoped></style>
