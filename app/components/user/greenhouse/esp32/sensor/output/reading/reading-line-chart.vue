<template>
    <div class="overflow-auto">
        <Line 
            v-if="readings.length > 0"
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
import type { Reading } from '~~/shared/schema/reading'
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
    readings: Reading[]
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
            time: { unit: 'second' },
            grid: { color: 'rgba(128, 128, 128, 0.5)' },
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

const generateDataset = () => {
    const color = getRandomColor()

    const dataset = {
        data: [] as { x: Date, y: number }[],
        fill: props.fill,
        label: props.label,
        tension: props.tension ?? 0.1,
        borderColor: props.color ?? color,
        backgroundColor: props.color ?? color,
        spanGaps: true,
    }

    props.readings.forEach((r) => dataset.data.push({
        x: r.createdAt,
        y: r.value,
    }))

    chartData.datasets.splice(0, chartData.datasets.length)
    chartData.datasets.push(dataset)
    chartKey.value++
}

// --- Display data
watch(() => props, nv => generateDataset(), { deep: true })
onMounted(() => generateDataset())

//

</script>

<style scoped>

</style>