import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { ActionStatus } from "#shared/schema/action"

//

class Action extends Model<
	InferAttributes<Action>,
	InferCreationAttributes<Action>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare value: number
	declare delay: CreationOptional<number>
	declare timeout: CreationOptional<number>
	declare duration: CreationOptional<number>
	declare priority: CreationOptional<number>
	declare status: CreationOptional<ActionStatus>
	declare inputId: ForeignKey<number>
	declare scheduleId: ForeignKey<number> | null
	declare thresholdId: ForeignKey<number> | null
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const actionAttributes: ModelAttributes<Action, InferAttributes<Action>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	value: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	delay: {
		type: DataTypes.INTEGER,	// all ms
		allowNull: false,
		defaultValue: 0,
	},
	timeout: {
		type: DataTypes.INTEGER, 	// limits execution time, must be inactive before this
		allowNull: false,
		defaultValue: 10000, 		// purpose is to avoid hanging actions
	},
	duration: {
		type: DataTypes.INTEGER, 	// returns to previous state after this duration
		allowNull: false,
		defaultValue: -1, 			// purpose is to make actions that reverts input to its previous state
	},
	priority: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
	status: {
		type: DataTypes.ENUM(...ActionStatus),
		allowNull: false,
		defaultValue: ActionStatus[0],
	},
	inputId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "inputs", key: "id" },
		onDelete: "CASCADE",
	},
	scheduleId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "schedules", key: "id" },
		onDelete: "SET NULL",
	},
	thresholdId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "thresholds", key: "id" },
		onDelete: "SET NULL",
	},
	greenhouseId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: { model: "greenhouses", key: "id" },
		onDelete: "SET NULL",
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
}

//

const actionOptions = (sequelize: Sequelize): InitOptions<Action> => ({
	sequelize,
	tableName: "actions",
	timestamps: true,
})

//

export { Action, actionAttributes, actionOptions }
