<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
	>
		<v-col cols="12" md="6" order="2" order-md="1">
			<motion
				:initial="{ opacity: 0, scale: 0.9 }"
				:whileInView="{ opacity: 1, scale: 1 }"
				:inViewOptions="{ once: true }"
				:transition="{ duration: 0.4 }"
			>
				<v-img
					class="mx-auto"
					max-width="520"
					src="/assets/image/art-irrigation.png"
				/>
			</motion>
		</v-col>
		<v-col cols="12" md="6" order="1" order-md="2">
			<v-chip
				text="Bring Your Own Hardware"
				color="green"
				prepend-icon="mdi-chip"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>Built for&nbsp;</span>
					<span class="text-green">Makers</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5">
				Wire up your ESP32 boards and configure pins, sensors, and
				actuators right from the dashboard, no reflashing needed.
			</p>
			<v-row class="mt-4">
				<v-col
					v-for="(device, i) in devices"
					:key="device.title"
					cols="12"
					sm="6"
				>
					<motion
						class="h-100"
						:initial="{ opacity: 0, y: 40 }"
						:whileInView="{ opacity: 1, y: 0 }"
						:inViewOptions="{ once: true }"
						:transition="{ delay: i * 0.1, duration: 0.4 }"
					>
						<v-card class="h-100 pa-4 border" elevation="0">
							<v-avatar color="green-lighten-5" size="40">
								<v-icon color="green">{{ device.icon }}</v-icon>
							</v-avatar>
							<p class="font-weight-bold mt-3">{{ device.title }}</p>
							<p class="text-grey-darken-2 text-body-2 mt-1">
								{{ device.text }}
							</p>
						</v-card>
					</motion>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Devices
const devices = [
	{
		icon: "mdi-chip",
		title: "ESP32",
		text: "Connects over WebSocket and pulls its setup from the server on boot.",
	},
	{
		icon: "mdi-thermometer",
		title: "Sensors",
		text: "Read temperature, humidity, soil moisture, and more on an interval.",
	},
	{
		icon: "mdi-fan",
		title: "Actuators",
		text: "Drive fans, pumps, and lights from your rules or by hand.",
	},
	{
		icon: "mdi-cctv",
		title: "ESP32-CAM",
		text: "Captures crop images for NPK deficiency detection.",
	},
]

//
</script>

<style scoped></style>
