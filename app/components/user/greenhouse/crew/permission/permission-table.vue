<template>
    <v-data-table
        striped="even"
        class="border"
        :items="PermissionResource"
        :headers
    >
        <template #item.permission="{ item }">
            <span>{{ item }}</span>
        </template>
        <template #item.create="{ item }">
            <v-checkbox-btn
                hide-details
                :key="`${item}:Create`"
                :disabled="loading"
                :model-value="hasPermissionKey(`${item}:Create`)"
                @update:model-value="onClickCheckbox(`${item}:Create`)"
            ></v-checkbox-btn>
        </template>
        <template #item.retrieve="{ item }">
            <v-checkbox-btn
                hide-details
                :key="`${item}:Retrieve`"
                :disabled="loading"
                :model-value="hasPermissionKey(`${item}:Retrieve`)"
                @update:model-value="onClickCheckbox(`${item}:Retrieve`)"
            ></v-checkbox-btn>
        </template>
        <template #item.update="{ item }">
            <v-checkbox-btn
                hide-details
                :key="`${item}:Update`"
                :disabled="loading"
                :model-value="hasPermissionKey(`${item}:Update`)"
                @update:model-value="onClickCheckbox(`${item}:Update`)"
            ></v-checkbox-btn>
        </template>
        <template #item.delete="{ item }">
            <v-checkbox-btn
                hide-details
                :key="`${item}:Delete`"
                :disabled="loading"
                :model-value="hasPermissionKey(`${item}:Delete`)"
                @update:model-value="onClickCheckbox(`${item}:Delete`)"
            ></v-checkbox-btn>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { PermissionResource, PermissionType } from '~~/shared/schema/permission';

//

// --- Data Binding
const emit = defineEmits<{
    grant: [permKey: PermissionKey]
    revoke: [permission: Permission]
}>()

const props = defineProps<{
    loading?: boolean
    permissions: Permission[]
}>()

// --- Headers
const headers = ["Permission", ...PermissionType].map((pt) => ({
    title: pt,
    value: pt.toLowerCase(),
}))

// --- Items
const permissionKeys = computed(() => new Set(
    props.permissions.map((p) => `${p.resource}:${p.type}` as PermissionKey)
))

const getPermission = (permKey: PermissionKey) => {
    return props.permissions.find((p) => `${p.resource}:${p.type}` == permKey)
}

const hasPermissionKey = (permKey: PermissionKey) => {
    return permissionKeys.value.has(permKey)
}

// --- Grant/revoke handling
const onClickCheckbox = (permKey: PermissionKey) => {
    if (props.loading) return;
    const permission = getPermission(permKey)
    if (!permission) emit("grant", permKey)
    else emit("revoke", permission)
}

//

</script>

<style scoped>

</style>