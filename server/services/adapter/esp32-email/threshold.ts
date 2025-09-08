import esp32 from "../../esp32"
import { queueEmail } from "../../email"
import { Threshold } from "~~/shared/schema/threshold"
import { User as UserModel } from "~~/server/models/user"
import { Output as OutputModel } from "~~/server/models/output"
import { Condition as ConditionModel } from "~~/server/models/condition"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const onUpdate = async (threshold: Threshold) => {
    const greenhouse = await GreenhouseModel.findOne({
        where: { id: threshold.greenhouseId },
        attributes: ["name"],
        include: [
            {
                model: UserModel,
                as: "user",
                required: true,
                attributes: ["name", "email"],
            },
        ],
    })
    
    if (!greenhouse) return console.warn(`Threshold activated, greenhouse not found.`)
    const user = (greenhouse as any).user
    
    const conditions = await ConditionModel.findAll({
        where: { thresholdId: threshold.id },
        attributes: ["type", "value"],
        include: [
            {
                model: OutputModel,
                as: "output",
                required: true,
                attributes: ["name"],
            },
        ],
    })

    const cmap = conditions.map((c) => ({
        type: c.type,
        value: c.value,
        output: (c as any).output.name as string,
    }))

    const ssres = await useTemplate({
        type: "Threshold-Activated",
        safe: true,
        data: {
            user: user.name,
            threshold: threshold.name,
            conditions: cmap,
            greenhouse: greenhouse.name,
        },
    })

    if (!ssres.success) return console.error(ssres.error)
    queueEmail(
        user.email,
        "Threshold Activated",
        undefined,
        ssres.data,
        (e, i) => e ? console.error(e) : console.info(`Email threshold sent.`)
    )
}

//

const init = () => {
    esp32.hook.threshold.onUpdate(onUpdate)
}

//

export default { init }
