<template>
    <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
        <v-card-text>
            <div class="d-flex flex-column align-center ga-3">
                <v-icon size="xxx-large" class="text-green">mdi-email</v-icon>
                <h2 class="text-green">Check Your Email</h2>
                <span class="text-wrap text-center text-grey-darken-3">
                    We've sent a password reset link to 
                    <span class="font-weight-bold">{{ email }}</span>.
                    Click the link in the email to create a new password for your Greenmon account.
                </span>
                <span class="text-wrap text-grey-darken-3 my-4">
                    Didn't receive the email? Check your spam folder or
                </span>
                <v-btn
                    class="w-100 border"
                    elevation="0"
                    :text="resendBtnText"
                    :disabled="counter.count.value != 0"
                    @click="onClickResend"
                ></v-btn>
                <nuxt-link 
                    to="/auth/sign-in"
                    class="text-grey-darken-2"
                >Go to Sign In</nuxt-link>
                <nuxt-link 
                    to="/auth/recovery/forgot"
                    class="text-grey-darken-2"
                >Use a different email.</nuxt-link>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	resend: [email: string]
	success: [nextResendTime: number]
}>()
const props = defineProps<{
	email: string
	handle?: boolean
	nextResendTime?: number
}>()

// --- Resend Counter
const counter = useCounter()
const resendBtnText = ref("Resend Password Reset Link")

counter.onUpdate((count) => resendBtnText.value = `Resend in ${count.toFixed(0)}s`)
counter.onFinish(() => resendBtnText.value = "Resend Password Reset Link")

const runCooldown = (nextResendTime: number) => {
    const cooldownMs = nextResendTime - Date.now()
    const cooldownSec = cooldownMs == 0 ? 0 : cooldownMs / 1000
    if (cooldownSec > 0) counter.run(cooldownSec, 0, 1, 1000)
}

watch(props, (nv) => runCooldown(nv.nextResendTime ?? 0), { deep: true })

onBeforeMount(() => runCooldown(props.nextResendTime ?? 0))
onBeforeUnmount(() => counter.stop())

// --- Resend Logic
const { resendResetPasswordEmail } = useAuthRecovery()

const onClickResend = async () => {
    emit("resend", props.email)
    if (props.handle) return;

    const resendResult = await resendResetPasswordEmail(props.email)
    if (!resendResult.success) return emit("error", resendResult.error)

    const { nextResendTime } = resendResult.data
    emit("success", nextResendTime)
    runCooldown(resendResult.data.nextResendTime)
}

//

</script>

<style scoped>

</style>