<template>
    <v-data-table
        class="border"
        striped="even"
        :items="logs"
        :headers
        :header-props="{ class: `bg-green-darken-2 py-5` }"
    >
        <template #item.title="{ item }">
            <strong>{{ item.title }}</strong>
        </template>
        <template #item.message="{ item }">
            <span class="text-wrap">{{ item.message }}</span>
        </template>
        <template #item.level="{ item }">
            <span :class="`text-${getLogLevelColor(item.level)}`">
                {{ item.level }}
            </span>
        </template>
        <template #item.status="{ item }">
            <div class="d-flex ga-1">
                <v-icon
                    v-tooltip="item.viewed ? `Viewed` : `Not Viewed`"
                    :color="item.viewed ? `blue-darken-4` : `grey`"
                >mdi-eye</v-icon>
                <v-icon
                    v-tooltip="item.emailed ? `Emailed` : `Not Emailed`"
                    :color="item.emailed ? `blue-darken-4` : `grey`"
                >mdi-email</v-icon>
            </div>
        </template>
        <template #item.createdAt="{ item }">
            <span class="text-grey">
                {{ date.format(item.createdAt, `fullDateTime12h`) }}
            </span>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import type { Log, LogLevel } from '~~/shared/schema/log';

//

// --- Data Binding
const props = defineProps<{ logs: Log[] }>()

// --- Formatting
const date = useDate()
const headers = [
    { title: "Log", value: "title" },
    { title: "Message", value: "message", width: "25%" },
    { title: "Level", value: "level" },
    { title: "Status", value: "status" },
    { title: "Date Created", value: "createdAt" },
]

const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
        case "Info": return "black"
        case "Success": return "green"
        case "Warning": return "yellow"
        case "Error": return "red"
        default: return "black"
    }
}

//

</script>

<style scoped>

</style>