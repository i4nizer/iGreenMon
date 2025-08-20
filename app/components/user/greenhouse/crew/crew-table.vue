<template>
    <v-data-table
        class="border"
        striped="even"
        :headers
        :items="crewsWithPermissions"
        :header-props="{ class: `bg-green-darken-2 py-5` }"
    >
        <template #item.user="{ item }">
            {{ item.user.name }}
        </template>
        <template #item.permissions="{ item }">
            <div class="d-flex flex-wrap gx-1">
                <v-chip
                    v-for="perm in getPermissionCruds(item.permissions)"
                    class="ma-1 bg-white"
                    :key="perm"
                    :text="perm"
                    v-tooltip="getPermissionCrudTooltip(item, perm)"
                ></v-chip>
                <em 
                    v-if="item.permissions.length <= 0"
                    class="text-grey"
                >No permissions granted</em>
            </div>
        </template>
        <template #item.actions="{ item }">
            <v-btn
                text="Remove"
                color="red"
                elevation="0"
                v-tooltip="`Remove Crew`"
                @click="emit('remove', item)"
            ></v-btn>
            <v-btn
                text="Permission"
                color="blue"
                class="ml-1"
                elevation="0"
                v-tooltip="`Edit Permissions`"
                @click="emit('permission', item)"
            ></v-btn>
        </template>
        <template #item.createdAt="{ item }">
            {{ date.format(item.createdAt, "fullDateTime12h") }}
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { PermissionKey, PermissionResource, PermissionType, type Permission } from '~~/shared/schema/permission';

//

// --- Data binding
const emit = defineEmits<{
    remove: [crew: CrewGet]
    permission: [permission: CrewGet]
}>()

const props = defineProps<{
    crews: CrewGet[]
    permissions: Permission[]
}>()

// --- Format
const date = useDate()
const headers = [
    { title: "Crew", value: "user" },
    { title: "Permissions", value: "permissions", width: "50%" },
    { title: "Actions", value: "actions" },
    { title: "Date Joined", value: "createdAt" },
]

// --- Mapped Crew Permissions
const crewsWithPermissions = computed(() =>
    props.crews.map((c) => ({
        ...c,
        permissions: props.permissions.filter((p) => p.crewId == c.id),
    }))
)

const getPermissionCruds = (permission: Permission[]) => {
    const permKeys = permission.map((p) => `${p.resource}:${p.type}`)
    const permKeySet = new Set(permKeys as PermissionKey[])
    const permResources = permission.map((p) => p.resource)
    const permResourceSet = new Set(permResources)

    return [...permResourceSet].map((pr) => {
        const affix = PermissionType
            .filter((pt) => permKeySet.has(`${pr}:${pt}`))
            .map((pt) => pt.at(0) as string)
            .join("")
        return `${pr}:${affix}`
    }) as `${PermissionResource}:${string}`[]
}

const getPermissionCrudTooltip = (
    crew: CrewGet,
    permCrud: `${PermissionResource}:${string}`
) => {
    const resCrud = permCrud.split(":") as [PermissionResource, string]
    const [resource, crud] = resCrud
    const types = PermissionType
        .filter((pt) => crud.includes(pt.at(0) as string))
        .map((pt) => pt.toLowerCase())
        .join(", ")
    return `${crew.user.name} can ${types} your ${resource.toLowerCase()}s.`
}

//

</script>

<style scoped>

</style>