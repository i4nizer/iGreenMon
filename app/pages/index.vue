<template>
	<v-container class="pa-0" fluid>
		<v-row
			class="d-flex flex-xs-column flex-md-row justify-xs-center align-md-center bg-green-lighten-5 w-screen py-5 px-5 px-md-8 px-lg-10"
			style="min-height: calc(100dvh - 64px)"
			align="center"
		>
			<v-col cols="12" sm="12" md="6">
				<v-chip
					text="Greenhouse Automation"
					prepend-icon="mdi-lightning-bolt"
				></v-chip>
				<h1 class="text-h3 font-weight-black mt-4 my-0">
					Connect Everything.
				</h1>
				<h1 class="text-h3 font-weight-black text-green my-0">
					Transform Everything.
				</h1>
				<p class="text-grey-darken-2 mt-5">
					Unlock the power of the Internet of Things with our
					comprehensive platform. Connect devices, analyze data, and
					automate processes to drive innovation and efficiency.
				</p>
				<v-btn
					link
					to="/auth/sign-up"
					size="large"
					text="Sign Up"
					color="green"
					class="mt-5"
					elevation="0"
					append-icon="mdi-login"
				></v-btn>
			</v-col>
			<v-col
				cols="12"
				sm="12"
				md="6"
				class="d-flex justify-center align-center"
			>
				<v-card
					class="w-100 pa-0 pa-md-10 bg-transparent"
					elevation="0"
				>
					<v-card-text class="d-flex justify-center align-center">
						<v-img
							src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/art-greenhouse.png"
						/>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-row 
			class="bg-white px-5 px-md-8 px-lg-10 my-0" 
			style="min-height: 100dvh" 
			align="center"
		>
			<v-col cols="12" sm="12" md="6">
				<v-chip 
					text="Featured Innovation" 
					color="green" 
					prepend-icon="mdi-lightning-bolt"
				></v-chip>
				<h1 class="text-h4 font-weight-black mt-4 my-0">
					<span>Smart IoT Greenhouse:&nbsp;</span>
					<span class="text-green">
						Lettuce NPK Deficiency Detection
					</span>
				</h1>
				<p class="text-grey-darken-2 mt-5">
					Revolutionary AI-powered camera system that automatically 
					detects nutrient deficiencies in lettuce crops,
					enabling farmers to take immediate action 
					and optimize yield quality.
				</p>
				<p class="text-h6 mt-5">How It Works:</p>
				<v-list>
					<v-list-item>
						<template #prepend>
							<v-chip 
								text="1" 
								class="font-weight-bold" 
								color="green"
							></v-chip>
						</template>
						<div class="pl-4">
							<p>IoT Camera Capture</p>
							<p class="text-grey">
								IoT camera such as esp32cam captures
								image and sends it to the server.
							</p>
						</div>
					</v-list-item>
					<v-list-item>
						<template #prepend>
							<v-chip 
								text="2" 
								class="font-weight-bold" 
								color="green"
							></v-chip>
						</template>
						<div class="pl-4">
							<p>AI Model Image Analysis</p>
							<p class="text-grey">
								The machine learning model then processes 
								the image containing lettuce to 
								check for nutrient deficiencies.
							</p>
						</div>
					</v-list-item>
					<v-list-item>
						<template #prepend>
							<v-chip 
								text="3" 
								class="font-weight-bold" 
								color="green"
							></v-chip>
						</template>
						<div class="pl-4">
							<p>Alert & Recommendation</p>
							<p class="text-grey">
								Once deficiencies are found, the user is 
								alerted  with the image and given 
								recommendations to solve the deficiency.
							</p>
						</div>
					</v-list-item>
				</v-list>
				<v-btn
					text="Use Device Camera"
					class="mt-2 mb-5 border"
					color="green"
					elevation="0"
					append-icon="mdi-camera"
				></v-btn>
			</v-col>
			<v-col cols="12" sm="12" md="6">
				<v-file-upload
					v-if="imageUploads.length <= 0"
					clearable
					title="Drag and Drop Lettce Image Here"
					v-model="imageUploads"
					:density="'compact'"
					@update:model-value="onUploadImage"
				></v-file-upload>
				<div v-if="imageUrls.length > 0">
					<image-canvas
						:src="(imageUrls.at(0) as string)"
						@draw="onDrawImage"
					></image-canvas>
					<v-btn
						color="white"
						class="mt-3 w-100 border"
						elevation="0"
						:text="'Reset'"
						@click="imageUrls.splice(0, imageUrls.length)"
					></v-btn>
				</div>
			</v-col>
		</v-row>
		<v-footer class="bg-green-darken-4 pa-5">
			<span>© 2025 iGreenMon. All rights reserved.</span>
		</v-footer>
	</v-container>
</template>

<script setup lang="ts">
import type { DetectionBBox } from '~~/shared/schema/detection'

//

// --- Notif
const toastUtil = useToast()

// --- Detection WebSocket
const websocketUrl = "/api/websocket/model/npk"
const detectionBBoxWebSocket = useDetectionBBoxWebSocket(websocketUrl, {
	onOpen: () => console.log(`WebSocket opened.`),
	onError: (ws, event) => toastUtil.error(`Something went wrong.`),
	onMessage: (ws, bboxes) => onReceiveDetectionBBoxes(ws, bboxes)
})

const {
	detections,
	send: sendDetectionWebSocket,
	open: openDetectionWebSocket
} = detectionBBoxWebSocket

const onReceiveDetectionBBoxes = async (
	ws: WebSocket,
	bboxes: DetectionBBox[]
) => {
	imageUrls.splice(0, imageUrls.length)

	const onLoadReader = (e: ProgressEvent<FileReader>) => {
		if (!e.target?.result) return
		imageUrls.push(e.target.result as string)
	}

	for (const file of imageUploads) {
		const reader = new FileReader()
		reader.onload = onLoadReader
		reader.readAsDataURL(file)
	}

	console.log(`Received ${bboxes.length} from websocket.`)
}

// --- Detection Rendering
const detectionBBoxRenderer = useDetectionBBoxRenderer()
const { drawDetectionBBoxes } = detectionBBoxRenderer

const onDrawImage = (
	image: HTMLImageElement,
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D
) => {
	drawDetectionBBoxes(
		context,
		canvas.width,
		canvas.height,
		detections,
		NPKModelClassColor as any
	)

	console.log(`Drawn ${detections.length} on canvas.`)
}

// --- Image Uploading
const imageUrls = reactive<string[]>([])
const imageUploads = reactive<File[]>([])

const onUploadImage = async (files: File[]) => {
	for (const file of files) {
		sendDetectionWebSocket(await file.arrayBuffer())
		console.log(`Sent image on websocket.`, file)
	}
}

// --- LifeCycle Hooks
onBeforeMount(openDetectionWebSocket)

//

</script>

<style scoped></style>
