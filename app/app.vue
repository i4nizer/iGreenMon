<template>
	<div>
		<nuxt-layout :name="layout">
			<nuxt-page />
		</nuxt-layout>
		<v-snackbar-queue
			closable
			location="right"
			v-model="toasts"
		></v-snackbar-queue>
	</div>
</template>

<script setup lang="ts">
//

// --- Meta
useHead({ title: "iGreenMon" })

// --- Notifications
const { toasts } = useToast()

// ---- Layout is based on route
const route = useRoute()
const layout = computed(() => {
	const segments = route.path.split("/")
	const slen = segments.length
	const path = route.path

	if (slen <= 1) return "default"
	else if (path.startsWith("/auth")) return "auth"
	else if (path.startsWith("/user") && slen == 4) return "user"
	else if (slen == 6 && segments[3] == "greenhouse") return "greenhouse"
	else if (slen == 9 && segments[5] == "esp32") return "esp32"
	else if (slen == 9 && segments[5] == "esp32-cam") return "esp32-cam"
	else return "default"
})

//
</script>
