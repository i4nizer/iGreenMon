<template>
    <v-card class="border pt-3" :loading>
        <v-card-title class="d-flex text-subtitle-1 text-wrap">
            <span>{{ output.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ output.icon }}</v-icon>
        </v-card-title>
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">
                Unit: {{ output.unit }}
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <v-btn 
                v-if="!hideEdit"
                size="small"
                icon="mdi-pencil"
                color="blue" 
                v-tooltip="`Edit`"
                @click="onClickEdit"
            ></v-btn>
            <v-btn 
                v-if="!hideDelete"
                size="small"
                icon="mdi-delete"
                color="red" 
                v-tooltip="`Delete`"
                @click="onClickDelete"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { Output } from '~~/shared/schema/output';

//

// --- Data Binding
const props = defineProps<{
    output: Output
    hideEdit?: boolean
    hideDelete?: boolean
}>();

// --- State Binding
const emit = defineEmits<{
    edit: [output: Output, opts: { loading: Ref<boolean> }]
    delete: [output: Output, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = () => emit("edit", props.output, { loading })
const onClickDelete = () => emit("delete", props.output, { loading })

//

</script>

<style lang="scss" scoped></style>
