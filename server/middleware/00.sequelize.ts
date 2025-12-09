
//

/**
 * This middleware holds the website unavailable while initializing the database.
 * This is to avoid anomalies and errors.
 */
export default defineEventHandler(async (event) => {
    // --- Check sequelize attachment
    const nitro = useNitroApp()
    if (!nitro.sequelize) throw createError({ statusCode: 503, statusMessage: "Server not ready." })
})
