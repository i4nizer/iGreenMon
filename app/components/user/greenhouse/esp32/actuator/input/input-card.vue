<template>
    <v-card class="border pt-3" :loading>
        <v-card-title class="d-flex text-subtitle-1 text-wrap">
            <span>{{ input.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ input.icon }}</v-icon>
        </v-card-title>
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">
                <span>Type: {{ input.type == 'Boolean' ? 'ON/OFF':'Numerical Input' }}</span>
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
import type { Input } from '~~/shared/schema/input';

//

// --- Data Binding
const props = defineProps<{
    input: Input
    hideEdit?: boolean
    hideDelete?: boolean
}>();

// --- State Binding
const emit = defineEmits<{
    edit: [input: Input, opts: { loading: Ref<boolean> }]
    delete: [input: Input, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = () => emit("edit", props.input, { loading })
const onClickDelete = () => emit("delete", props.input, { loading })

//

</script>

<style lang="scss" scoped></style>
