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
        <template #item.actions="{ item }">
            <v-btn
                text="Remove"
                color="red"
                class="border"
                elevation="0"
                @click="emit('remove', item)"
            ></v-btn>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">

//

// --- Data binding
const emit = defineEmits<{ remove: [crew: CrewGet] }>()
const props = defineProps<{ crews: CrewGet[] }>()

// --- Format
const headers = [
    { title: "Crew", value: "user" },
    { title: "Date Joined", value: "createdAt" },
    { title: "Actions", value: "actions" },
]

const date = useDate()

//

</script>

<style scoped>

</style>