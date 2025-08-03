import { Sequelize } from "sequelize"
import {
	initModels,
	initModelRelationships,
} from "~~/server/services/sequelize"

//

export default defineNitroPlugin(async () => {
	// --- Instance and config
	const config = useRuntimeConfig()
	const isProd = config.nodeEnv == "production"
	const logging = isProd ? false : console.info
	const sequelize = new Sequelize(config.databaseUrl, { logging })

	// --- Run initializations
	initModels(sequelize)
	initModelRelationships()

	// --- Authenticate
	await sequelize.authenticate()
	if (!isProd) console.info("Sequelize database authenticated.")

	// --- Sync on command
	const syncDB = config.databaseSync === "sync"
	if (syncDB) await sequelize.sync({ alter: true })
	if (!isProd) console.info("Sequelize database tables synced.")
})
