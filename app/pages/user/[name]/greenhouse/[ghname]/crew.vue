<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Crew</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <!-- Single instance of permission dialog for one crew. -->
                <v-dialog fullscreen v-model="permissionDialog">
                    <template #default="{ isActive }">
                        <v-card class="rounded">
                            <template #prepend>
                                <span class="text-wrap">
                                    Permission Table: <strong>{{ permissionCrew?.user.name }}</strong>'s 
                                    permissions in <strong>{{ ghname }}</strong> greenhouse.
                                </span>
                            </template>
                            <template #append>
                                <v-icon 
                                    size="large"
                                    color="red"
                                    @click="isActive.value = false"
                                >mdi-close</v-icon>
                            </template>
                            <template #text>
                                <permission-table 
                                    :loading="permissionTableLoading"
                                    :permissions="permissionSelection"
                                    @grant="onGrantPermission"
                                    @revoke="onRevokePermission"
                                />
                            </template>
                        </v-card>
                    </template>
                </v-dialog>
                <!-- List of crews and their permissions. -->
                <crew-table 
                    :crews 
                    :permissions
                    @remove="onRemoveCrew"
                    @permission="onClickCrewPermission"
                ></crew-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Utils
const toast = useToast()
const route = useRoute()
const ghname = route.params?.ghname as string

// --- Crew
const crews = useState<CrewGet[]>(`${ghname}-crews`, () => [])
const crewUtil = useCrew()

const fetchCrews = async () => {
    if (crews.value.length > 0) return;
    const res = await crewUtil.retrieveAll(ghname)
    if (!res.success) return toast.error(res.error)
    crews.value.push(...res.data)
}

const onRemoveCrew = async (crew: CrewGet) => {
    const removeResult = await crewUtil.destroy(crew.id)
    if (!removeResult.success) return toast.error(removeResult.error)
    const idx = crews.value.findIndex((c) => c.id == crew.id)
    if (idx != -1) crews.value.splice(idx, 1)
    toast.success(`${crew.user.name} will be informed of removal.`)
}

onBeforeMount(async () => await fetchCrews())
onServerPrefetch(async () => await fetchCrews())

// --- Permission Fetching
const permUtil = usePermission()
const permStore = usePermissionStore()
const { permissions } = permStore

const fetchPerms = async () => {
    if (permissions.length > 0) return;
    const res = await permUtil.retrieveAll(ghname)
    if (!res.success) return toast.error(res.error)
    res.data.forEach((p) => permStore.append(p))
}

onBeforeMount(async () => await fetchPerms())
onServerPrefetch(async () => await fetchPerms())

// --- Permission Selection
const permissionCrew = ref<CrewGet>()
const permissionDialog = ref(false)
const permissionSelection = reactive<Permission[]>([])
const permissionTableLoading = ref(false)

const onClickCrewPermission = (crew: CrewGet) => {
    const perms = permissions.filter((p) => p.crewId == crew.id)
    permissionSelection.splice(0, permissionSelection.length)
    permissionSelection.push(...perms)
    permissionCrew.value = crew
    permissionDialog.value = true
}

// --- Permission Actions
const onGrantPermission = async (permKey: PermissionKey) => {
    if (!permissionCrew.value) return;
    const crew = permissionCrew.value

    const [resource, type] = permKey.split(":") as [PermissionResource, PermissionType]
    const data: PermissionGrant = {
        type,
        resource,
        crewId: crew.id,
        greenhouseId: crew.greenhouseId,
    }

    permissionTableLoading.value = true
    const result = await permUtil.grant(data)
    permissionTableLoading.value = false
    
    if (!result.success) return toast.error(`${permKey}: ${result.error}`)
    permStore.append(result.data)
    permissionSelection.push(result.data)
    toast.success(`"${permKey}" permission granted to ${crew.user.name}.`)
}

const onRevokePermission = async (permission: Permission) => {
    if (!permissionCrew.value) return;
    const crew = permissionCrew.value

    permissionTableLoading.value = true
    const result = await permUtil.revoke(permission)
    permissionTableLoading.value = false

    const { name } = crew.user
    const { resource, type } = permission
    if (!result.success) return toast.error(`${resource}:${type}: ${result.error}`)
    
    permStore.remove(permission.id)
    const idx = permissionSelection.findIndex((ps) => ps.id == permission.id)
    const item = permissionSelection.at(idx)
    permissionSelection.splice(idx, 1)
    
    toast.success(`"${resource}:${type}" permission revoked from ${name}.`)
}

//

</script>

<style scoped>

</style>