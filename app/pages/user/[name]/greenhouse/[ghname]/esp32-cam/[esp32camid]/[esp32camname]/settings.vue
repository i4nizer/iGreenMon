<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Esp32Cam Settings</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6" lg="4" xl="3">
                <v-card class="pa-5">
                    <esp32-cam-settings-form
                        v-if="esp32Cam"
                        :esp32-cam
                        @error="(e) => toastUtil.error(e)"
                        @success="onEsp32CamUpdateSuccess"
                    ></esp32-cam-settings-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Esp32Cam } from '~~/shared/schema/esp32-cam'

//

// --- Nuxt CTX
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- Notif
const toastUtil = useToast()

// --- Route Data
const routeUtil = useRoute()
const esp32camid = routeUtil.params?.esp32camid as string

// --- Esp32Cam
const esp32CamUtil = useEsp32Cam()
const esp32Cam = useState<Esp32Cam|undefined>(`${esp32camid}-esp32-cam`)

const fetchEsp32Cam = async () => {
    if (esp32Cam.value) return;
    const esp32CamId = parseInt(esp32camid)
    const res = await esp32CamUtil.retrieve(esp32CamId)
    if (!res.success) return toastUtil.error(res.error)
    esp32Cam.value = res.data
}

const onEsp32CamUpdateSuccess = (e: Esp32Cam) => {
    esp32Cam.value = e
    toastUtil.success("Esp32Cam updated successfully.")
}

// --- Data Fetching
const fetchData = async () => await rwnctx(fetchEsp32Cam)

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>