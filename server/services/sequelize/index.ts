import { User, userAttributes, userOptions } from "~~/server/models/user";
import { Token, tokenAttributes, tokenOptions } from "~~/server/models/token";
import { Sequelize } from "sequelize";

//

/** Initializes model attributes and options. */
const initModels = (sequelize: Sequelize) => {
	// --- Model initializations
	User.init(userAttributes, userOptions(sequelize))
	Token.init(tokenAttributes, tokenOptions(sequelize))
}

/** Binds model relationships. (hasMany, belongsTo) */
const initModelRelationships = () => {
	// --- Model relationships
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
	Token.belongsTo(User, { foreignKey: "userId" })
}

//

export { initModels, initModelRelationships }