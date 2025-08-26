<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Settings</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6" lg="4" xl="3">
                <v-card class="pa-5">
                    <greenhouse-settings-form
                        v-if="greenhouse"
                        :greenhouse
                        @error="(e) => toastUtil.error(e)"
                        @success="onGHUpdateSuccess"
                    ></greenhouse-settings-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Greenhouse } from '~~/shared/schema/greenhouse'

//

// --- Nuxt CTX
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- Notif
const toastUtil = useToast()

// --- Route Data
const routeUtil = useRoute()
const ghname = routeUtil.params?.ghname as string

// --- Greenhouse
const ghUtil = useGreenhouse()
const greenhouse = useState<Greenhouse|undefined>(`gh-${ghname}`)

const fetchGH = async () => {
    if (greenhouse.value) return;
    const res = await ghUtil.retrieve(ghname)
    if (!res.success) return toastUtil.error(res.error)
    greenhouse.value = res.data
}

const onGHUpdateSuccess = (gh: Greenhouse) => {
    greenhouse.value = gh
    toastUtil.success("Greenhouse updated successfully.")
}

// --- Data Fetching
const fetchData = async () => await rwnctx(fetchGH)

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>