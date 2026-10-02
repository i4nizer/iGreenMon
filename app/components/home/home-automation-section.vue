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
				<v-card class="pa-5 pa-md-8 bg-green-darken-4" elevation="0">
					<v-row align="center">
						<v-col cols="12" md="5">
							<v-chip
								text="Priority-Based Actions"
								prepend-icon="mdi-podium"
								variant="outlined"
							></v-chip>
							<p class="text-h5 font-weight-black mt-4">
								When rules collide,
								<span class="text-green-lighten-2">the most important one wins.</span>
							</p>
							<p class="text-green-lighten-4 mt-3">
								Every action has a priority. A higher priority
								action takes over the actuator, and a lower one
								that arrives late is simply skipped, so your
								equipment never gets mixed signals.
							</p>
						</v-col>
						<v-col cols="12" md="7">
							<v-card class="pa-4" elevation="0">
								<div class="d-flex align-center ga-2 mb-3">
									<v-icon color="green">mdi-fan</v-icon>
									<span class="font-weight-bold">Exhaust Fan</span>
									<span class="text-caption text-grey ml-auto">Sample</span>
								</div>
								<div
									v-for="(contender, i) in contenders"
									:key="contender.rule"
									class="d-flex align-center ga-3 py-3"
									:class="{ 'border-t': i > 0 }"
								>
									<span class="text-caption text-grey" style="min-width: 56px">
										{{ contender.time }}
									</span>
									<v-avatar color="green-lighten-5" size="36">
										<v-icon size="small" color="green">{{ contender.icon }}</v-icon>
									</v-avatar>
									<div class="flex-grow-1">
										<p
											class="font-weight-medium"
											:class="{ 'text-grey text-decoration-line-through': contender.status != `Active` }"
										>{{ contender.rule }}</p>
										<p class="text-caption text-grey">
											Priority {{ contender.priority }} · {{ contender.note }}
										</p>
									</div>
									<v-chip
										size="small"
										:color="StatusColor[contender.status]"
										:text="contender.status"
									></v-chip>
								</div>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Sample Priority Contest (higher number wins, as in the action invoker)
const StatusColor = {
	Active: "green",
	Interrupted: "orange",
	Discarded: "grey",
} as const

const contenders = [
	{
		time: "6:00 AM",
		icon: "mdi-calendar-clock",
		rule: "Daily ventilation, fan at low speed",
		priority: 1,
		note: "Taken over by the heat rule",
		status: "Interrupted",
	},
	{
		time: "6:12 AM",
		icon: "mdi-thermometer-alert",
		rule: "Above 40 °C, fan at full speed",
		priority: 3,
		note: "Now running the fan",
		status: "Active",
	},
	{
		time: "6:15 AM",
		icon: "mdi-hook",
		rule: "Before humidity reading, fan off",
		priority: 2,
		note: "Skipped, the heat rule outranks it",
		status: "Discarded",
	},
] as const

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
