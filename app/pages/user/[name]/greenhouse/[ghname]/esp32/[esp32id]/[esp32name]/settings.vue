<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Esp32 Settings</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6" lg="4" xl="3">
                <v-card class="pa-5">
                    <esp32-settings-form
                        v-if="esp32"
                        :esp32
                        @error="(e) => toastUtil.error(e)"
                        @success="onEsp32UpdateSuccess"
                    ></esp32-settings-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Esp32 } from '~~/shared/schema/esp32'

//

// --- Nuxt CTX
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- Notif
const toastUtil = useToast()

// --- Route Data
const routeUtil = useRoute()
const esp32id = routeUtil.params?.esp32id as string

// --- Esp32
const esp32Util = useEsp32()
const esp32 = useState<Esp32|undefined>(`${esp32id}-esp32`)

const fetchEsp32 = async () => {
    if (esp32.value) return;
    const esp32Id = parseInt(esp32id)
    const res = await esp32Util.retrieve(esp32Id)
    if (!res.success) return toastUtil.error(res.error)
    esp32.value = res.data
}

const onEsp32UpdateSuccess = (e: Esp32) => {
    esp32.value = e
    toastUtil.success("Esp32 updated successfully.")
}

// --- Data Fetching
const fetchData = async () => await rwnctx(fetchEsp32)

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>