<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex text-subtitle-1">
            <span>{{ output.name }} is</span>
            <span class="font-weight-bold">
                &nbsp;{{ condition.type.toUpperCase() }}
            </span>
            <span>&nbsp;{{ condition.value }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ output.icon }}</v-icon>
        </v-card-title>
        <v-card-actions>
            <v-card-subtitle>Unit: {{ output.unit }}</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-btn 
                v-if="!hideEdit"
                size="small"
                icon="mdi-pencil"
                color="blue" 
                @click="onClickEdit"
            ></v-btn>
            <v-btn 
                v-if="!hideDelete"
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="onClickDelete"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { Output } from '~~/shared/schema/output';
import type { Condition } from '~~/shared/schema/condition';

//

// --- Data Binding
const props = defineProps<{
    output: Output
    condition: Condition
    hideEdit?: boolean
    hideDelete?: boolean
}>();

// --- State Binding
const emit = defineEmits<{
    edit: [condition: Condition, opts: { loading: Ref<boolean> }]
    delete: [condition: Condition, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = () => emit("edit", props.condition, { loading })
const onClickDelete = () => emit("delete", props.condition, { loading })


</script>

<style lang="scss" scoped></style>
