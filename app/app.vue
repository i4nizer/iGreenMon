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
useHead({ title: "Greenmon" })

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
    else return "default"
})

//

</script>