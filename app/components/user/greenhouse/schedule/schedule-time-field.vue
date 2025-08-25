<template>
    <v-list bg-color="transparent" density="compact">
        <v-list-subheader>Set the times of this schedule.</v-list-subheader>
        <v-list-item class="d-flex justify-end w-100">
            <v-text-field
                hide-details
                type="time"
                label="Time"
                class="mt-2"
                append-icon="mdi-plus-circle"
                v-model="time"
                :name
                @blur="(e: FocusEvent) => emit(`blur`, e)"
                @click:append="onClickAdd(time)"
            ></v-text-field>
        </v-list-item>
        <v-list-item v-for="(time, index) in times">
            <v-text-field
                hide-details
                type="time"
                label="Time"
                class="mt-2"
                append-icon="mdi-minus-circle"
                :key="index"
                :model-value="time"
                @click:append="onClickRemove(index)"
                @update:model-value="t => onUpdateTime(t as ScheduleTime, index)"
            ></v-text-field>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import type { ScheduleTime } from '~~/shared/schema/schedule';

//

// --- VeeField Binding
const emit = defineEmits<{
    blur: [e: FocusEvent]
    input: [e: Event]
    change: [e: Event]
    "update:modelValue": [v: ScheduleTime[]]
}>()

const props = defineProps<{
    name: string,
    label: string,
    value: ScheduleTime[],
    checked?: boolean,
}>()

// --- Data Binding
const times = defineModel<ScheduleTime[]>({
    required: true,
    default: [],
})

watch(() => props.value, (nv) => times.value = nv, { deep: true })

// --- Input & Actions
const time = ref<ScheduleTime>("00:00")

const onClickAdd = (time: ScheduleTime) => {
    if (!time || times.value.includes(time)) return;
    times.value.unshift(time)
    emit("update:modelValue", times.value)
}

const onUpdateTime = (time: ScheduleTime, index: number) => {
    times.value.splice(index, 1, time)
    emit("update:modelValue", times.value)
}

const onClickRemove = (index: number) => {
    times.value.splice(index, 1)
    emit("update:modelValue", times.value)
}

//

</script>

<style scoped>

</style>