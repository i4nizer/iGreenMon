import { User, userAttributes, userOptions } from "~~/server/models/user";
import { Token, tokenAttributes, tokenOptions } from "~~/server/models/token";
import { Greenhouse, greenhouseAttributes, greenhouseOptions } from "~~/server/models/greenhouse";
import { Invitation, invitationAttributes, invitationOptions } from "~~/server/models/invitation";
import { Crew, crewAttributes, crewOptions } from "~~/server/models/crew";
import { Permission, permissionAttributes, permissionOptions } from "~~/server/models/permission";
import { Esp32, esp32Attributes, esp32Options } from "~~/server/models/esp32";
import { Sequelize } from "sequelize";

//

/** Initializes model attributes and options. */
const initModels = (sequelize: Sequelize) => {
	// --- Model initializations
	User.init(userAttributes, userOptions(sequelize))
	Token.init(tokenAttributes, tokenOptions(sequelize))
	Greenhouse.init(greenhouseAttributes, greenhouseOptions(sequelize))
	Invitation.init(invitationAttributes, invitationOptions(sequelize))
	Crew.init(crewAttributes, crewOptions(sequelize))
	Permission.init(permissionAttributes, permissionOptions(sequelize))
	Esp32.init(esp32Attributes, esp32Options(sequelize))
}

/** Binds model relationships. (hasMany, belongsTo) */
const initModelRelationships = () => {
	// --- Model relationships
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Invitation, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Crew, { foreignKey: "userId", onDelete: "CASCADE" })
	
	Token.belongsTo(User, { as: "user", foreignKey: "userId" })
	
	Greenhouse.belongsTo(User, { as: "user", foreignKey: "userId" })
	Greenhouse.hasMany(Invitation, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
	Greenhouse.hasMany(Crew, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
	Greenhouse.hasMany(Permission, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

	Invitation.belongsTo(User, { as: "inviter", foreignKey: "inviterId" })
	Invitation.belongsTo(User, { as: "invitee", foreignKey: "inviteeId" })
	Invitation.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })

	Crew.belongsTo(User, { as: "user", foreignKey: "userId" })
	Crew.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
	Crew.hasMany(Permission, { foreignKey: "crewId", onDelete: "CASCADE" })

	Permission.belongsTo(Crew, { as: "crew", foreignKey: "crewId" })
	Permission.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
	
	Esp32.belongsTo(Token, { as: "token", foreignKey: "tokenId" })
	Esp32.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
}

//

export { initModels, initModelRelationships }