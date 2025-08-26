<template>
    <v-sheet color="transparent">
        <v-sparkline
            auto-draw
            key="id"
            stroke-linecap="round"
            :smooth="16"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            :line-width="3"
            :model-value="readings"
        ></v-sparkline>
    </v-sheet>
</template>

<script setup lang="ts">
import type { Reading } from '~~/shared/schema/reading';

//

// --- Data Binding
const props = defineProps<{ readings: Reading[] }>()

//

</script>

<style scoped>

</style>