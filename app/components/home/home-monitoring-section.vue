<template>
	<v-row
		class="bg-green-lighten-5 px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
	>
		<v-col cols="12" md="6" order="2" order-md="1">
			<motion
				:initial="{ opacity: 0, x: -40 }"
				:whileInView="{ opacity: 1, x: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ duration: 0.4 }"
			>
				<v-card class="pa-5 border" elevation="0">
					<div class="d-flex align-center justify-space-between">
						<div class="d-flex align-center ga-2">
							<v-icon color="green">mdi-thermometer</v-icon>
							<span class="font-weight-bold">Temperature</span>
						</div>
						<v-chip
							size="small"
							color="green"
							prepend-icon="mdi-circle-medium"
							text="Live"
						></v-chip>
					</div>
					<p class="text-h4 font-weight-black mt-4">
						{{ readings[readings.length - 1] }} °C
					</p>
					<p class="text-caption text-grey">Sample readings</p>
					<v-sparkline
						smooth
						auto-draw
						fill
						color="green"
						line-width="2"
						padding="8"
						:model-value="readings"
					></v-sparkline>
					<v-btn
						class="mt-3 w-100 border"
						color="white"
						elevation="0"
						prepend-icon="mdi-file-delimited"
						text="Export CSV"
						:ripple="false"
					></v-btn>
				</v-card>
			</motion>
		</v-col>
		<v-col cols="12" md="6" order="1" order-md="2">
			<v-chip
				text="Real-Time Monitoring"
				color="green"
				prepend-icon="mdi-chart-line"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>See Every Reading&nbsp;</span>
					<span class="text-green">as It Happens</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5">
				Sensor readings stream straight to your dashboard the moment
				your ESP32 sends them. No refreshing, no waiting.
			</p>
			<v-list class="bg-transparent">
				<motion
					v-for="(feature, i) in features"
					:key="feature.title"
					:initial="{ opacity: 0, x: 40 }"
					:whileInView="{ opacity: 1, x: 0 }"
					:inViewOptions="{ once: true }"
					:transition="{ delay: i * 0.1, duration: 0.4 }"
				>
					<v-list-item>
						<template #prepend>
							<v-icon color="green">{{ feature.icon }}</v-icon>
						</template>
						<div class="pl-2">
							<p>{{ feature.title }}</p>
							<p class="text-grey">{{ feature.text }}</p>
						</div>
					</v-list-item>
				</motion>
			</v-list>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Sample Chart
const readings = [27.4, 28.1, 29.6, 31.2, 32.8, 33.5, 32.9, 31.4, 30.2, 29.8]

// --- Features
const features = [
	{
		icon: "mdi-access-point",
		title: "Live Dashboard",
		text: "Readings, actuator states, and action statuses update instantly.",
	},
	{
		icon: "mdi-chart-bell-curve-cumulative",
		title: "Reading History",
		text: "Line charts show how each sensor output changes over time.",
	},
	{
		icon: "mdi-file-delimited",
		title: "CSV Export",
		text: "Download readings for your own analysis or reports.",
	},
]

//
</script>

<style scoped></style>
