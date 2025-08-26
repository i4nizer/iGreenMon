<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex ga-1 text-subtitle-1 text-wrap">
            <span class="text-truncate">
                Hook to <strong>{{ action.name }}</strong>
            </span>
            <v-spacer></v-spacer>
            <v-icon>mdi-hook</v-icon>
        </v-card-title>
        <v-card-actions>
            <v-card-subtitle class="pb-0">
                <span>
                    <span>Timing: {{ hook.type }}</span>
                </span>
            </v-card-subtitle>
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
import type { Action } from '~~/shared/schema/action';
import type { Hook } from '~~/shared/schema/hook';

//

// --- Data Binding
const props = defineProps<{
    hook: Hook
    action: Action
    hideEdit?: boolean
    hideDelete?: boolean
}>();

// --- State Binding
const emit = defineEmits<{
    edit: [hook: Hook, opts: { loading: Ref<boolean> }]
    delete: [hook: Hook, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onClickEdit = () => emit(`edit`, props.hook, { loading })
const onClickDelete = () => emit(`delete`, props.hook, { loading })

//

</script>

<style lang="scss" scoped></style>
