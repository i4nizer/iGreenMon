<template>
    <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
        <v-card-text>
            <div class="d-flex flex-column align-center ga-3">
                <v-icon size="xxx-large" class="text-green">
                    mdi-check-circle
                </v-icon>
                <h2 class="text-green">Password Updated Successfully!</h2>
                <span class="text-wrap text-grey-darken-3 text-center">
                    Your Greenmon account is now secured 
                    with your new password. All your ESP32 devices 
                    and automation settings remain intact.
                </span>
                <div class="bg-grey-lighten-4 rounded w-100 py-4 px-5">
                    <span class="text-grey-darken-1">
                        Redirecting to sign in page in:
                    </span>
                    <br>
                    <span class="text-grey-darken-3 text-h4 font-weight-bold">
                        {{ counter.count.value }}
                    </span>
                    <br>
                    <span class="text-grey-darken-1">seconds</span>
                </div>
                <span class="text-wrap text-grey-darken-3 text-center">
                    Sign in with your new password to access 
                    your greenhouse monitoring dashboard.
                </span>
                <v-btn
                    to="/auth/sign-in"
                    text="Sign In Now"
                    class="mt-4 w-100 border bg-green"
                    elevation="0"
                    append-icon="mdi-arrow-right"
                ></v-btn>
                <nuxt-link class="text-grey" to="/">Go to Home Page</nuxt-link>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{ redirect: [] }>()

// --- Counter
const counter = useCounter()

counter.onFinish(() => emit("redirect"))

onBeforeMount(() => counter.run(5, 0, 1, 1000))
onBeforeUnmount(() => counter.stop())

//

</script>

<style scoped>

</style>