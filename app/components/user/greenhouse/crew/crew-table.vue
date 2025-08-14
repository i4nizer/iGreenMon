<template>
    <v-data-table
        class="border"
        :headers
        :items="crews"
    >
        <template #item.user="{ item }">
            {{ item.user.name }}
        </template>
        <template #item.createdAt="{ item }">
            {{ date.format(item.createdAt, "fullDateTime12h") }}
        </template>
    </v-data-table>
</template>

<script setup lang="ts">

//

// --- Data binding
const props = defineProps<{ crews: CrewGet[] }>()

// --- Format
const headers = [
    { title: "Crew", value: "user" },
    { title: "Date Joined", value: "createdAt" },
]

const date = useDate()

//

</script>

<style scoped>

</style>