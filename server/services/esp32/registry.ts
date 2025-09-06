import reading from "./reading"
import schedule from "./schedule"
import threshold from "./threshold"
import { Op } from "sequelize"
import { Peer } from "crossws"
import { Esp32 } from "#shared/schema/esp32"
import { Sensor as SensorModel } from "~~/server/models/sensor"
import { Output as OutputModel } from "~~/server/models/output"
import { Actuator as ActuatorModel } from "~~/server/models/actuator"
import { Input as InputModel } from "~~/server/models/input"
import { Schedule as ScheduleModel } from "~~/server/models/schedule"
import { Threshold as ThresholdModel } from "~~/server/models/threshold"
import { Condition as ConditionModel } from "~~/server/models/condition"
import { Action as ActionModel } from "~~/server/models/action"

//

// --- Registry
const esp32s = new Map<Peer, Esp32>()

//

const register = async (peer: Peer, esp32: Esp32) => {
    // --- Dedup esp32
    for (const [p, e] of esp32s) {
        if (e.id != esp32.id) continue
        unregister(p)
    }

    // --- Keep esp32 new
    esp32s.set(peer, esp32)
    console.info(`Esp32::Registered ${esp32.name} esp32.`)
    
    // --- Register sensors
    const promises: Promise<any>[] = []
    const { register: sreg } = reading.registry
    const sensors = await SensorModel.findAll({ where: { esp32Id: esp32.id } })
    sensors.forEach((s) => promises.push(sreg(peer.id, s.dataValues)))
    
    const sids = sensors.map((s) => s.id)
    const outputs = await OutputModel.findAll({
        where: { sensorId: { [Op.in]: sids } }
    })

    // --- Find and register thresholds
    const oids = outputs.map((o) => o.id)
    const conditions = await ConditionModel.findAll({
        where: { outputId: { [Op.in]: oids } },
        attributes: ["id"],
        include: [
            {
                model: ThresholdModel,
                as: "threshold",
                required: true,
            },
        ],
    })
    
    const { register: treg } = threshold.registry
    const thresholds = conditions.map((c) => (c as any).threshold)
    thresholds.forEach((t) => promises.push(treg(peer.id, t)))

    // --- Find and register schedules
    const inputs = await InputModel.findAll({
        attributes: ["id"],
        include: [
            {
                model: ActuatorModel,
                as: "actuator",
                where: { esp32Id: esp32.id },
                required: true,
                attributes: ["id"],
            },
        ],
    })
    
    const iids = inputs.map((i) => i.id)
    const actions = await ActionModel.findAll({
        where: { inputId: { [Op.in]: iids } },
        attributes: ["id"],
        include: [
            {
                model: ScheduleModel,
                as: "schedule",
                required: true,
            },
        ],
    })

    const schedules = actions.map((a) => (a as any).schedule)
    const { register: screg } = schedule.registry
    schedules.forEach((s) => promises.push(screg(peer.id, s)))

    await Promise.all(promises).catch(console.error)
}

const unregister = (peer: Peer) => {
    console.info(`Esp32::Unregistered ${esp32s.get(peer)?.name} esp32.`)
    esp32s.delete(peer)
    reading.registry.unregister(peer.id)
    threshold.registry.unregister(peer.id)
    schedule.registry.unregister(peer.id)
}

//

export default {
    esp32s,
    register,
    unregister,
}
