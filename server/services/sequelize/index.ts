import { User, userAttributes, userOptions } from "~~/server/models/user";
import { Token, tokenAttributes, tokenOptions } from "~~/server/models/token";
import { Greenhouse, greenhouseAttributes, greenhouseOptions } from "~~/server/models/greenhouse";
import { Invitation, invitationAttributes, invitationOptions } from "~~/server/models/invitation";
import { Crew, crewAttributes, crewOptions } from "~~/server/models/crew";
import { Permission, permissionAttributes, permissionOptions } from "~~/server/models/permission";
import { Esp32, esp32Attributes, esp32Options } from "~~/server/models/esp32";
import { Pin, pinAttributes, pinOptions } from "~~/server/models/pin";
import { Sensor, sensorAttributes, sensorOptions } from "~~/server/models/sensor";
import { Output, outputAttributes, outputOptions } from "~~/server/models/output";
import { Actuator, actuatorAttributes, actuatorOptions } from "~~/server/models/actuator";
import { Input, inputAttributes, inputOptions } from "~~/server/models/input";
import { Threshold, thresholdAttributes, thresholdOptions } from "~~/server/models/threshold";
import { Condition, conditionAttributes, conditionOptions } from "~~/server/models/condition";
import { Schedule, scheduleAttributes, scheduleOptions } from "~~/server/models/schedule";
import { Action, actionAttributes, actionOptions } from "~~/server/models/action";
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
	Pin.init(pinAttributes, pinOptions(sequelize))
	Sensor.init(sensorAttributes, sensorOptions(sequelize))
	Output.init(outputAttributes, outputOptions(sequelize))
	Actuator.init(actuatorAttributes, actuatorOptions(sequelize))
	Input.init(inputAttributes, inputOptions(sequelize))
	Threshold.init(thresholdAttributes, thresholdOptions(sequelize))
	Condition.init(conditionAttributes, conditionOptions(sequelize))
	Schedule.init(scheduleAttributes, scheduleOptions(sequelize))
	Action.init(actionAttributes, actionOptions(sequelize))
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
	Greenhouse.hasMany(Threshold, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
	Greenhouse.hasMany(Schedule, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
	Greenhouse.hasMany(Action, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

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
	Esp32.hasMany(Pin, { foreignKey: "esp32Id", onDelete: "CASCADE" })
	Esp32.hasMany(Sensor, { foreignKey: "esp32Id", onDelete: "CASCADE" })
	Esp32.hasMany(Actuator, { foreignKey: "esp32Id", onDelete: "CASCADE" })
	
	Pin.belongsTo(Esp32, { as: "esp32", foreignKey: "esp32Id" })
	Pin.hasMany(Output, { foreignKey: "outputId", onDelete: "CASCADE" })
	Pin.hasMany(Input, { foreignKey: "inputId", onDelete: "CASCADE" })
	
	Sensor.belongsTo(Esp32, { as: "esp32", foreignKey: "esp32Id" })
	Sensor.hasMany(Output, { foreignKey: "sensorId", onDelete: "CASCADE" })
	
	Output.belongsTo(Pin, { as: "pin", foreignKey: "pinId" })
	Output.belongsTo(Sensor, { as: "sensor", foreignKey: "sensorId" })
	Output.hasMany(Condition, { foreignKey: "outputId", onDelete: "CASCADE" })
	
	Actuator.belongsTo(Esp32, { as: "esp32", foreignKey: "esp32Id" })
	Actuator.hasMany(Pin, { as: "actuator", foreignKey: "actuatorId" })

	Input.belongsTo(Pin, { as: "pin", foreignKey: "pinId" })
	Input.belongsTo(Actuator, { as: "actuator", foreignKey: "actuatorId" })
	Input.hasMany(Action, { foreignKey: "actuatorId", onDelete: "CASCADE" })
	
	Threshold.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
	Threshold.hasMany(Condition, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
	Threshold.hasMany(Action, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

	Condition.belongsTo(Output, { as: "output", foreignKey: "outputId" })
	Condition.belongsTo(Threshold, { as: "threshold", foreignKey: "thresholdId" })

	Schedule.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
	Schedule.hasMany(Action, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

	Action.belongsTo(Input, { as: "input", foreignKey: "inputId" })
	Action.belongsTo(Schedule, { as: "schedule", foreignKey: "scheduleId" })
	Action.belongsTo(Threshold, { as: "threshold", foreignKey: "thresholdId" })
	Action.belongsTo(Greenhouse, { as: "greenhouse", foreignKey: "greenhouseId" })
}

//

export { initModels, initModelRelationships }