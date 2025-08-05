//

export const useCounter = () => {
	// --- Event hooks
	const startHooks = reactive<(() => any)[]>([])
	const updateHooks = reactive<((count: number) => any)[]>([])
	const finishHooks = reactive<(() => any)[]>([])

	// --- Subscriptions
	const onStart = (callback: () => any) => {
		startHooks.push(callback)
	}

	const onUpdate = (callback: (count: number) => any) => {
		updateHooks.push(callback)
	}

	const onFinish = (callback: () => any) => {
		finishHooks.push(callback)
	}

	// --- Logic
	const count = ref(0)
	const interval = ref<NodeJS.Timeout>()
	const settings = reactive({
		step: 1,
		speed: 1000,
		target: 0,
		increasing: true,
	})

	// --- Controls
	const run = (
		start: number,
		target: number,
		step: number = 1,
		speed: number = 1000
	) => {
		count.value = start
		settings.step = step
		settings.speed = speed
		settings.target = target
		settings.increasing = start < target

		clearInterval(interval.value)
		interval.value = setInterval(handler, settings.speed)

		startHooks.forEach((h) => h())
	}

	const stop = () => {
		clearInterval(interval.value)
		interval.value = undefined
	}

	const handler = () => {
		const { step, target, increasing } = settings
        count.value += increasing ? step : -step
        const done =
			(increasing && count.value >= target) ||
            (!increasing && count.value <= target)

        count.value = done ? target : count.value
		updateHooks.forEach((h) => h(count.value))

		if (done) {
			clearInterval(interval.value)
			finishHooks.forEach((h) => h())
		}
	}

	// --- Expose
	return {
		count,
		settings,
		run,
		stop,
		onStart,
		onUpdate,
		onFinish,
	}
}
