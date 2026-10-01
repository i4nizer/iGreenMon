import { Options, Sequelize } from "sequelize"
import {
	initModels,
	initModelRelationships,
} from "~~/server/services/sequelize"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Config
	const config = useRuntimeConfig()
	const user = encodeURIComponent(config.databaseUser)
	const pass = encodeURIComponent(config.databasePass)
	const url = `${config.databaseDialect}://${user}:${pass}@${config.databaseHost}:${config.databasePort}`
	const logging = config.databaseLog ? console.log : false

	// --- Certificate (e.g. Aiven CA), env values may carry escaped newlines
	const certificate = String(config.databaseCertificate || "").replace(/\n/g, "\n")
	const options: Options = { logging, ...(!!certificate && { dialectOptions: { ssl: { ca: certificate } } }) }

	// --- Ensure database exists
	const rawsqlize = new Sequelize(url, options)
	await rawsqlize.query(`CREATE DATABASE IF NOT EXISTS \`${config.databaseName}\`;`)
	await rawsqlize.close()
	console.info("Sequelize database connected and checked.")

	// --- Instance
	const sequelize = new Sequelize(`${url}/${config.databaseName}`, options)

	// --- Run initializations
	initModels(sequelize)
	initModelRelationships()

	// --- Authenticate
	await sequelize.authenticate()
	console.info("Sequelize database authenticated.")

	// --- Sync on command
	const sync = !!config.databaseSync
	if (sync) await sequelize.sync({ alter: !!config.databaseAlter, force: !!config.databaseForce })
	if (sync) console.info("Sequelize database tables synced.")

	// --- Attach to nitro
	nitro.sequelize = sequelize
})
