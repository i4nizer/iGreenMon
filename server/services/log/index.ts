import { Op } from "sequelize";
import { Greenhouse } from "~~/server/models/greenhouse";
import { Log } from "~~/server/models/log";
import { User } from "~~/server/models/user";
import { queueEmail } from "../email";

//

// --- Indicates if the current queued email is sent
let sent = true

//

const pull = async () => {
    // --- Find oldest unemailed warn/error log
    const log = await Log.findOne({
        where: {
            level: { [Op.or]: ["Warning", "Error"] },
            emailed: false,
        },
        attributes: ["id", "title", "level", "message"],
        include: [
            {
                model: User,
                as: "user",
                required: true,
                attributes: ["name", "email"],
            },
            {
                model: Greenhouse,
                as: "greenhouse",
                required: true,
                attributes: ["name"]
            },
        ],
	})
    
    if (!log) return
    const user = (log as any).user
    const greenhouse = (log as any).greenhouse
    
    const ssres = await useTemplate({
        type: "Log",
        safe: true,
        data: {
            user: user.name,
            greenhouse: greenhouse.name,
            title: log.title,
            level: log.level,
            message: log.message,
        }
    })
    if (!ssres.success) return 

    queueEmail(
        user.name,
        "Log - iGreenMon",
        undefined,
        ssres.data,
        (e, i) => sent = !e
    )
}

const loop = async () => {
    if (!sent) return
    await pull().catch(console.error)
}

//

export default { loop }
