<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Crew</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <crew-table 
                    :crews 
                    @remove="onRemoveCrew"
                />
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

//

</script>

<style scoped>

</style>