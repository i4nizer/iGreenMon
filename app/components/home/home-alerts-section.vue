<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
		align-content="center"
	>
		<v-col cols="12" class="text-center">
			<v-chip
				text="Alerts"
				color="green"
				prepend-icon="mdi-bell-ring"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>Alerts That&nbsp;</span>
					<span class="text-green">Actually Reach You</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5 mx-auto" style="max-width: 640px">
				Away from the greenhouse, or even away from the internet?
				iGreenMon still lets you know when something needs attention.
			</p>
		</v-col>

		<!-- Email -->
		<v-col cols="12" md="6">
			<motion
				class="h-100"
				:initial="{ opacity: 0, y: 40 }"
				:whileInView="{ opacity: 1, y: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ duration: 0.4 }"
			>
				<v-card class="h-100 pa-5 border" elevation="0">
					<div class="d-flex align-center ga-3">
						<v-avatar color="green-lighten-5" size="48">
							<v-icon color="green">mdi-email-fast</v-icon>
						</v-avatar>
						<div>
							<p class="text-h6">Email Alerts</p>
							<p class="text-grey-darken-2">
								Straight to your inbox whenever your greenhouse
								needs you.
							</p>
						</div>
					</div>
					<v-list class="mt-4 pa-0 border rounded" lines="two">
						<template v-for="(email, i) in emails" :key="email.subject">
							<v-divider v-if="i > 0"></v-divider>
							<v-list-item>
								<template #prepend>
									<v-avatar :color="email.color" size="36">
										<v-icon size="small" color="white">{{ email.icon }}</v-icon>
									</v-avatar>
								</template>
								<v-list-item-title class="font-weight-bold">
									{{ email.subject }}
								</v-list-item-title>
								<v-list-item-subtitle>{{ email.preview }}</v-list-item-subtitle>
								<template #append>
									<span class="text-caption text-grey">{{ email.time }}</span>
								</template>
							</v-list-item>
						</template>
					</v-list>
				</v-card>
			</motion>
		</v-col>

		<!-- SMS -->
		<v-col cols="12" md="6">
			<motion
				class="h-100"
				:initial="{ opacity: 0, y: 40 }"
				:whileInView="{ opacity: 1, y: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ delay: 0.1, duration: 0.4 }"
			>
				<v-card class="h-100 pa-5 border" elevation="0">
					<div class="d-flex align-center ga-3">
						<v-avatar color="green-lighten-5" size="48">
							<v-icon color="green">mdi-message-alert</v-icon>
						</v-avatar>
						<div>
							<p class="text-h6">SMS Alerts</p>
							<p class="text-grey-darken-2">
								A companion phone app relays alerts as texts,
								perfect for farms with spotty internet.
							</p>
						</div>
					</div>
					<v-sheet class="mt-4 pa-4 bg-grey-lighten-4 rounded">
						<div
							v-for="sms in messages"
							:key="sms.text"
							class="mb-3"
						>
							<v-sheet
								class="pa-3 bg-white border rounded-lg"
								style="max-width: 85%"
							>
								<p class="text-body-2">{{ sms.text }}</p>
							</v-sheet>
							<p class="text-caption text-grey mt-1">{{ sms.time }}</p>
						</div>
					</v-sheet>
					<div class="d-flex flex-wrap ga-2 mt-4">
						<v-chip
							size="small"
							variant="outlined"
							color="green-darken-2"
							prepend-icon="mdi-refresh"
							text="Resent every minute until delivered"
						></v-chip>
						<v-chip
							size="small"
							variant="outlined"
							color="green-darken-2"
							prepend-icon="mdi-key"
							text="Paired with an API key"
						></v-chip>
					</div>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Sample Emails
const emails = [
	{
		icon: "mdi-thermometer-alert",
		color: "orange",
		subject: "Threshold Activated: High Temperature",
		preview: "Temperature is above 40 °C in Greenhouse A. The fan was turned on.",
		time: "2:14 PM",
	},
	{
		icon: "mdi-leaf",
		color: "green",
		subject: "NPK Deficiency Detected",
		preview: "Nitrogen deficiency found in a capture from Camera 1. Image attached.",
		time: "11:02 AM",
	},
	{
		icon: "mdi-alert-circle",
		color: "red",
		subject: "Warning: Sensor Reading Timed Out",
		preview: "Soil moisture sensor did not respond within 15 seconds.",
		time: "8:47 AM",
	},
]

// --- Sample SMS
const messages = [
	{
		text: "iGreenMon WARNING: Soil moisture sensor did not respond within 15 seconds.",
		time: "8:47 AM",
	},
	{
		text: "iGreenMon ERROR: ESP32 Main Board disconnected from Greenhouse A.",
		time: "9:03 AM",
	},
]

//
</script>

<style scoped></style>
