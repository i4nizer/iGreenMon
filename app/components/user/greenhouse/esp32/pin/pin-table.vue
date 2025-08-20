<template>
    <v-data-table
        class="border"
        striped="even"
        :headers
        :items="pins"
        :header-props="{ class: `bg-green-darken-2 py-5` }"
    >
        <template #item.actions="{ item }">
            <v-btn
                v-if="!hideEdit"
                text="Edit"
                color="blue"
                elevation="0"
                @click="onClickEdit(item)"
            ></v-btn>
            <v-btn
                v-if="!hideDelete"
                text="Delete"
                color="red"
                class="ml-1"
                elevation="0"
                @click="onClickDelete(item)"
            ></v-btn>
            <em 
                v-if="hideEdit && hideDelete"
                class="text-grey"
            >No actions permitted</em>
        </template>
        <template #item.updatedAt="{ item }">
            {{ date.format(item.updatedAt, "fullDateTime12h") }}
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import type { Pin } from '~~/shared/schema/pin';

//

// --- Data binding
const props = defineProps<{
    pins: Pin[]
    hideEdit?: boolean
    hideDelete?: boolean
}>()

// --- State Binding
const emit = defineEmits<{
    edit: [pin: Pin, opts: { loading: Ref<boolean> }]
    delete: [pin: Pin, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = (pin: Pin) => emit("edit", pin, { loading })
const onClickDelete = (pin: Pin) => emit("delete", pin, { loading })


// --- Format
const date = useDate()
const headers = [
    { title: "Pin", value: "number" },
    { title: "Type", value: "type" },
    { title: "Mode", value: "mode" },
    { title: "Actions", value: "actions" },
    { title: "Date Modified", value: "updatedAt" },
]

//

</script>

<style scoped>

</style>