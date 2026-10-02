<template>
	<v-row
		class="bg-green-lighten-5 px-5 px-md-8 px-lg-10 py-12 my-0"
		align="stretch"
	>
		<v-col
			v-for="(highlight, i) in highlights"
			:key="highlight.title"
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
				<v-card class="h-100 pa-5 pa-md-8 border" elevation="0">
					<v-chip
						color="green"
						:text="highlight.chip"
						:prepend-icon="highlight.icon"
					></v-chip>
					<h1 class="text-h5 font-weight-black mt-4 my-0">
						<span>{{ highlight.title }}&nbsp;</span>
						<span class="text-green">{{ highlight.accent }}</span>
					</h1>
					<p class="text-grey-darken-2 mt-4">{{ highlight.text }}</p>
					<div class="d-flex flex-wrap ga-2 mt-5">
						<v-chip
							v-for="tag in highlight.tags"
							:key="tag"
							size="small"
							variant="outlined"
							color="green-darken-2"
							:text="tag"
						></v-chip>
					</div>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
import { PermissionType } from '~~/shared/schema/permission'

//

// --- Highlights
const highlights = [
	{
		icon: "mdi-account-group",
		chip: "Crew Access",
		title: "Grow Together,",
		accent: "Stay in Control",
		text: "Invite your farmhands to a greenhouse and decide exactly what each crew member can create, view, update, or delete.",
		tags: [...PermissionType],
	},
	{
		icon: "mdi-chip",
		chip: "Bring Your Own Hardware",
		title: "Built for",
		accent: "Makers",
		text: "Wire up your ESP32 boards and configure pins, sensors, and actuators right from the dashboard, no reflashing needed.",
		tags: ["ESP32", "ESP32-CAM", "Sensors", "Actuators"],
	},
]

//
</script>

<style scoped></style>
