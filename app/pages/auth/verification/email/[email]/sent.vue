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
					<verification-sent-card 
                        :email
                        :nextResendTime
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

// --- Get email in params
const route = useRoute()
const email = route.params.email as string

// --- Initial time for counter
const { getNextResendTime } = useAuthVerification()
const nextResendTime = ref(0)

onBeforeMount(async () => {
    const getTimeResult = await getNextResendTime(email)
    if (!getTimeResult.success) return;
    nextResendTime.value = getTimeResult.data.nextResendTime
})

// --- Notifications & Redirect
const toast = useToast()

const onResendError = (msg: string) => {
    toast.error(msg)
}

const onResendSuccess = async (nextResendTime: number) => {
    toast.success("Email verification sent.")
}

//
</script>

<style lang="css" scoped></style>
