import { User, userAttributes, userOptions } from "~~/server/models/user";
import { Token, tokenAttributes, tokenOptions } from "~~/server/models/token";
import { Greenhouse, greenhouseAttributes, greenhouseOptions } from "~~/server/models/greenhouse";
import { Invitation, invitationAttributes, invitationOptions } from "~~/server/models/invitation";
import { Sequelize } from "sequelize";

//

/** Initializes model attributes and options. */
const initModels = (sequelize: Sequelize) => {
	// --- Model initializations
	User.init(userAttributes, userOptions(sequelize))
	Token.init(tokenAttributes, tokenOptions(sequelize))
	Greenhouse.init(greenhouseAttributes, greenhouseOptions(sequelize))
	Invitation.init(invitationAttributes, invitationOptions(sequelize))
}

/** Binds model relationships. (hasMany, belongsTo) */
const initModelRelationships = () => {
	// --- Model relationships
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Invitation, { foreignKey: "userId", onDelete: "CASCADE" })
	
	Token.belongsTo(User, { as: "user", foreignKey: "userId" })
	
	Greenhouse.belongsTo(User, { as: "user", foreignKey: "userId" })
	Greenhouse.hasMany(Invitation, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

	Invitation.belongsTo(User, { as: "inviter", foreignKey: "inviterId" })
	Invitation.belongsTo(User, { as: "invitee", foreignKey: "inviteeId" })
	Invitation.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
}

//

export { initModels, initModelRelationships }