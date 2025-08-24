import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { ThresholdOperator } from "#shared/schema/threshold"

//

class Threshold extends Model<
	InferAttributes<Threshold>,
	InferCreationAttributes<Threshold>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare operator: CreationOptional<ThresholdOperator>
	declare activated: CreationOptional<boolean>
	declare disabled: CreationOptional<boolean>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const thresholdAttributes: ModelAttributes<Threshold, InferAttributes<Threshold>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	operator: {
		type: DataTypes.ENUM(...ThresholdOperator),
		allowNull: false,
		defaultValue: ThresholdOperator[0],
	},
	activated: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
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

const thresholdOptions = (sequelize: Sequelize): InitOptions<Threshold> => ({
	sequelize,
	tableName: "thresholds",
	timestamps: true,
})

//

export { Threshold, thresholdAttributes, thresholdOptions }
