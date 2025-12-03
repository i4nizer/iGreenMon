<template>
    <div class="overflow-auto">
        <Line 
            v-if="detections.length > 0"
            class="w-auto w-sm-100 h-auto h-sm-100 pt-3"
            :key="chartKey"
            :data="(chartData as any)"
            :options="(chartOptions as any)"
        ></Line>
        <v-empty-state
            v-else
            icon="mdi-chart-line"
            text="There are no data."
            title="No records found."
        ></v-empty-state>
    </div>
</template>

<script setup lang="ts">
import type { Detection } from '~~/shared/schema/detection'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import colors from 'vuetify/util/colors'
import { Line } from 'vue-chartjs'

//

// --- Chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    TimeScale
)

// --- Data Binding
const props = defineProps<{
    detections: Detection[]
    fill?: boolean
    label: string
    color?: string
    tension?: number
    background?: string
}>()

// --- Chart Display
const chartKey = ref(Date.now())
const chartData = reactive({ datasets: [] as any })
const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        x: {
            type: 'time',
            time: { unit: 'minute' },
            grid: { color: 'rgba(128, 128, 128, 0.5)' },
            ticks: { source: 'auto', autoSkip: true },
        },
        y: {
            grid: { color: 'rgba(128, 128, 128, 0.5)' },
        },
    },
})

// --- Utility
const getRandomColor = (): string => {
    const pool = Object
        .keys(colors)
        .map(key => (colors as any)[key].lighten2)
    const index = Math.floor((pool.length - 1) * Math.random())
    return pool.at(index) as string
}

const generateData = (detections: Detection[]) => {
    const datemap: Record<string, number> = {}
    const result = []

    for (const det of detections) {
        const d = new Date(det.createdAt)
        const key = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`
        if (!(key in datemap)) datemap[key] = 1
        else datemap[key]! += 1
    }

    for (const key in datemap) {
        const d = new Date(key)
        result.push({ x: d, y: datemap[key]! })
    }

    return result
}

const generateDatasets = () => {
    const classset = new Set<string>()
    props.detections.forEach((d) => classset.add(d.class))
    const classarr = [...classset.values()]

    const datasets = []
    for (const classstr of classarr) {
        const color = getRandomColor()
        const filtered = props.detections.filter((d) => d.class == classstr)

        const dataset = {
            data: generateData(filtered),
            fill: props.fill,
            label: props.label,
            tension: props.tension ?? 0.1,
            borderColor: props.color ?? color,
            backgroundColor: props.color ?? color,
            spanGaps: true,
        }

        datasets.push(dataset)
    }

    chartData.datasets.splice(0, chartData.datasets.length)
    chartData.datasets.push(...datasets)
    chartKey.value++
}

// --- Display data
watch(() => props.detections, nv => generateDatasets(), { deep: true })
onMounted(() => generateDatasets())

//

</script>

<style scoped>

</style>