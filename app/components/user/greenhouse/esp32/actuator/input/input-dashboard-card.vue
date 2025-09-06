<template>
    <v-card class="pt-3" :loading="loading">
        <v-card-title class="d-flex align-center text-wrap">
            <v-icon size="xx-large" class="me-5">{{ input.icon }}</v-icon>
            <strong class="text-wrap">
                {{ input.name }}
            </strong>
            <v-spacer></v-spacer>
            <span class="text-grey text-caption">
                {{ input.status != input.flag ? "(Inputting)" : "" }}
            </span>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-space-between px-5">
            <span v-if="input.type == 'Boolean'" class="w-50">
                Status: {{ !!input.status ? "On" : "Off" }}
            </span>
            <span v-if="input.type == 'Number'" class="w-50">
                Status: {{ input.status }}
            </span>
            <!-- Boolean Input = ON/OFF -->
            <v-switch
                v-if="!hideInput && input.type == 'Boolean'"
                inset
                hide-details
                class="w-50"
                density="compact"
                :label="input.flag ? 'Turn Off' : 'Turn On'"
                :loading="loading"
                :model-value="input.flag > 0"
                @update:model-value="(v) => onUpdate(Number(v))"
            ></v-switch>
            <!-- Numerical Input -->
            <v-number-input
                v-if="!hideInput && input.type == 'Number'"
                hide-details
                type="number"
                class="w-50"
                label="Input"
                v-model="input.flag"
                :loading="loading"
                @update:model-value="(v) => onUpdate(v)"
            ></v-number-input>
            <span 
                v-if="hideInput" 
                class="text-grey"
            >No permission to modify</span>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { Input } from '~~/shared/schema/input';

//

// --- Data  Binding
const props = defineProps<{
    input: Input
    hideInput?: boolean
}>()

// --- State Binding
const emit = defineEmits<{
    update: [input: Input, opts: { loading: Ref<boolean> }]
}>()

const loading = ref(false)

const onUpdate = (v: number) => {
    const input = { ...props.input, flag: v ?? 0 }
    emit("update", input, { loading })
}

//

</script>

<style scoped></style>
