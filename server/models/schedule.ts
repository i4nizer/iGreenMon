import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { ScheduleTime } from "~~/shared/schema/schedule"

//

class Schedule extends Model<
	InferAttributes<Schedule>,
	InferCreationAttributes<Schedule>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare days: CreationOptional<number[]>
	declare times: CreationOptional<ScheduleTime[]>
	declare disabled: CreationOptional<boolean>
	declare activated: CreationOptional<boolean>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const scheduleAttributes: ModelAttributes<
	Schedule,
	InferAttributes<Schedule>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	days: {
		type: DataTypes.JSON,
		defaultValue: [],
	},
	times: {
		type: DataTypes.JSON,
		defaultValue: [],
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	activated: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	greenhouseId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "greenhouses", key: "id" },
		onDelete: "CASCADE",
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

const scheduleOptions = (sequelize: Sequelize): InitOptions<Schedule> => ({
	sequelize,
	tableName: "schedules",
	timestamps: true,
})

//

export { Schedule, scheduleAttributes, scheduleOptions }
