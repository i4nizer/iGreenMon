<template>
	<v-row
		class="bg-white px-5 px-md-8 px-lg-10 py-12 my-0"
		align="center"
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
		<v-col
			v-for="(channel, i) in channels"
			:key="channel.title"
			cols="12"
			md="6"
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
						<v-avatar color="green-lighten-5" size="48">
							<v-icon color="green">{{ channel.icon }}</v-icon>
						</v-avatar>
						<p class="text-h6">{{ channel.title }}</p>
					</div>
					<p class="text-grey-darken-2 mt-4">{{ channel.text }}</p>
					<v-list density="compact" class="mt-2">
						<v-list-item
							v-for="point in channel.points"
							:key="point"
							class="px-0"
							prepend-icon="mdi-check-circle"
							base-color="green"
						>
							<span class="text-grey-darken-3">{{ point }}</span>
						</v-list-item>
					</v-list>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
//

// --- Channels
const channels = [
	{
		icon: "mdi-email-fast",
		title: "Email Alerts",
		text: "Straight to your inbox whenever your greenhouse needs you.",
		points: [
			"Threshold activations, the moment conditions are met",
			"NPK deficiency detections, with the captured image",
			"Warning and error logs from your devices",
		],
	},
	{
		icon: "mdi-message-alert",
		title: "SMS Alerts",
		text: "A companion phone app relays alerts as text messages, perfect for farms with spotty internet.",
		points: [
			"Warning and error logs sent as SMS",
			"Resent every minute until delivered",
			"Pairs with your account through an API key",
		],
	},
]

//
</script>

<style scoped></style>
