<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>User SMS (Text Message)</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card class="pa-5">
                    <v-text-field
                        readonly
                        hide-details
                        label="SMS Api Key"
                        append-icon="mdi-clipboard-outline"
                        prepend-inner-icon="mdi-key-outline"
                        v-model="apiKey"
                        @click:append="onClickCopyApiKey"
                    ></v-text-field>
                </v-card>
            </v-col>
            <v-col cols="12" md="6" lg="4" xl="3">
                <v-card class="pa-0">
                    <sms-create-form
                        @error="(e) => toastUtil.error(e)"
                        @success="toastUtil.success(`SMS queued to the server.`)"
                    ></sms-create-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Preserve nuxt context between awaits
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- Notifs
const toastUtil = useToast()

// --- User
const { user } = useUser()

// --- Api Key
const apiKey = useState<string>(`${user.value?.name}-sms-api-key`, () => "")

const fetchApiKey = async () => {
    await $fetch(`/api/user/sms/key`)
        .then((k) => apiKey.value = k)
        .catch(() => toastUtil.error(`Something went wrong.`))
}

// --- Api Key Navs
const onClickCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey.value)
        .then(() => toastUtil.success(`SMS api key copied to clipboard.`))
        .catch(() => toastUtil.error(`Something went wrong.`))
}

// --- Fetch Data
const fetchData = async () => {
    await rwnctx(fetchApiKey)
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped></style>
