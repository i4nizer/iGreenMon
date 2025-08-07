<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col cols="12" md="4" class="pa-0">
				<quote-panel />
			</v-col>
			<v-col
				cols="12"
				md="8"
				class="pa-0 d-flex align-center justify-center h-md-screen"
			>
				<div
					class="w-100 w-md-75 w-xl-50 d-flex align-center justify-center"
				>
					<forgot-sent-card
                        :email
                        :next-resend-time="nextResetResendTime"
                        @error="onResendError"
                        @success="onResendSuccess"
                    />
				</div>
			</v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Notifications
const toast = useToast()

// --- Get email from params
const route = useRoute()
const email = route.params.email as string

// --- Get initial resend time
const { getNextResetResendTime } = useAuthRecovery()
const nextResetResendTime = ref(0)

onBeforeMount(async () => {
    const getTimeResult = await getNextResetResendTime(email)
    if (!getTimeResult.success) return;
    nextResetResendTime.value = getTimeResult.data.nextResendTime
})

// --- Display action results
const onResendError = (msg: string) => {
    toast.error(msg)
}

const onResendSuccess = async (nextResendTime: number) => {
    toast.success("Email verification sent.")
    nextResetResendTime.value = nextResendTime
}

//

</script>

<style scoped>

</style>