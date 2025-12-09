import { Sequelize } from "sequelize"
import {
	initModels,
	initModelRelationships,
} from "~~/server/services/sequelize"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Instance and config
	const config = useRuntimeConfig()
	const sequelize = new Sequelize(config.databaseUrl, { logging: false })

	// --- Run initializations
	initModels(sequelize)
	initModelRelationships()

	// --- Authenticate
	await sequelize.authenticate()
	console.info("Sequelize database authenticated.")

	// --- Sync on command
	const syncDB = config.databaseSync === "sync"
	if (syncDB) await sequelize.sync({ alter: true })
	if (syncDB) console.info("Sequelize database tables synced.")
	
	// --- Attach to nitro
	nitro.sequelize = sequelize
})
