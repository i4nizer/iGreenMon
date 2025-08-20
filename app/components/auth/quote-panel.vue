<template>
	<div
		class="d-flex flex-column justify-center bg-green-darken-2 pa-12 h-md-screen"
	>
		<nuxt-link
			to="/"
			class="text-white text-decoration-none d-flex align-center ga-2"
		>
			<v-icon>mdi-sprout</v-icon>
			<h2>iGreenMon</h2>
		</nuxt-link>
		<span class="pa-5">
			"{{ quote?.quote }}" -
			<strong>{{ quote?.quotee }}</strong>
		</span>
	</div>
</template>

<script setup lang="ts">
//

// --- Quotes
const { getRandomQuote } = useQuote()
const quote = useState<ReturnType<typeof getRandomQuote>>("quote")

onMounted(() => (quote.value ??= getRandomQuote()))
onUnmounted(() => (quote.value = getRandomQuote()))
onServerPrefetch(() => (quote.value ??= getRandomQuote()))

//
</script>

<style scoped></style>
