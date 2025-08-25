import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { HookType } from "#shared/schema/hook"

//

class Hook extends Model<
	InferAttributes<Hook>,
	InferCreationAttributes<Hook>
> {
	declare id: CreationOptional<number>
	declare type: HookType
	declare actionId: ForeignKey<number>
	declare sensorId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const hookAttributes: ModelAttributes<Hook, InferAttributes<Hook>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.ENUM(...HookType),
		allowNull: false,
		defaultValue: HookType[0],
	},
	actionId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "sensors", key: "id" },
		onDelete: "CASCADE",
	},
	sensorId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "actions", key: "id" },
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

const hookOptions = (sequelize: Sequelize): InitOptions<Hook> => ({
	sequelize,
	tableName: "actions",
	timestamps: true,
})

//

export { Hook, hookAttributes, hookOptions }
