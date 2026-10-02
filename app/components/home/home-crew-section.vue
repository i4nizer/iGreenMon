<template>
	<v-row
		class="bg-green-lighten-5 px-5 px-md-8 px-lg-10 py-12 my-0"
		style="min-height: 100dvh"
		align="center"
	>
		<v-col cols="12" md="6">
			<v-chip
				text="Crew Access"
				color="green"
				prepend-icon="mdi-account-group"
			></v-chip>
			<motion
				:initial="{ scale: 0.9, opacity: 0 }"
				:whileInView="{ scale: 1, opacity: 1 }"
				:inViewOptions="{ once: true }"
			>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>Grow Together,&nbsp;</span>
					<span class="text-green">Stay in Control</span>
				</h1>
			</motion>
			<p class="text-grey-darken-2 mt-5">
				Invite your farmhands to a greenhouse and decide exactly what
				each crew member can create, view, update, or delete.
			</p>
			<v-list class="bg-transparent">
				<motion
					v-for="(feature, i) in features"
					:key="feature.title"
					:initial="{ opacity: 0, x: -40 }"
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
		<v-col cols="12" md="6">
			<motion
				:initial="{ opacity: 0, x: 40 }"
				:whileInView="{ opacity: 1, x: 0 }"
				:inViewOptions="{ once: true }"
				:transition="{ duration: 0.4 }"
			>
				<v-card class="border" elevation="0">
					<v-card-item>
						<template #prepend>
							<v-avatar color="green" size="40">
								<span class="font-weight-bold">JD</span>
							</v-avatar>
						</template>
						<v-card-title>Juan Dela Cruz</v-card-title>
						<v-card-subtitle>Crew member · Greenhouse A</v-card-subtitle>
					</v-card-item>
					<v-table density="comfortable">
						<thead>
							<tr class="bg-green-darken-2">
								<th>Permission</th>
								<th
									v-for="type in PermissionType"
									:key="type"
									class="text-center"
								>{{ type }}</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in sample" :key="row.resource">
								<td>{{ row.resource }}</td>
								<td
									v-for="(allowed, j) in row.allowed"
									:key="j"
									class="text-center"
								>
									<v-icon
										:color="allowed ? `green` : `grey-lighten-1`"
									>{{ allowed ? `mdi-checkbox-marked` : `mdi-checkbox-blank-outline` }}</v-icon>
								</td>
							</tr>
						</tbody>
					</v-table>
				</v-card>
			</motion>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
import { PermissionType } from '~~/shared/schema/permission'

//

// --- Features
const features = [
	{
		icon: "mdi-email-plus",
		title: "Email Invitations",
		text: "Crew members accept or decline right from their inbox.",
	},
	{
		icon: "mdi-shield-check",
		title: "Fine-Grained Permissions",
		text: "Grant access per resource, from sensors to schedules and logs.",
	},
	{
		icon: "mdi-account-remove",
		title: "Revoke Anytime",
		text: "Remove a crew member and their access ends immediately.",
	},
]

// --- Sample Permissions (Create, Retrieve, Update, Delete)
const sample = [
	{ resource: "Sensor", allowed: [false, true, false, false] },
	{ resource: "Reading", allowed: [false, true, false, false] },
	{ resource: "Action", allowed: [true, true, true, false] },
	{ resource: "Schedule", allowed: [true, true, true, true] },
	{ resource: "Threshold", allowed: [false, true, true, false] },
	{ resource: "Log", allowed: [false, true, false, false] },
]

//
</script>

<style scoped></style>
