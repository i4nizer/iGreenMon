import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { ConditionType } from "#shared/schema/condition"

//

class Condition extends Model<
	InferAttributes<Condition>,
	InferCreationAttributes<Condition>
> {
	declare id: CreationOptional<number>
	declare type: CreationOptional<ConditionType>
	declare value: number
	declare satisfied: CreationOptional<boolean>
	declare outputId: ForeignKey<number>
	declare thresholdId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const conditionAttributes: ModelAttributes<
	Condition,
	InferAttributes<Condition>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.ENUM(...ConditionType),
		allowNull: false,
		defaultValue: ConditionType[0],
	},
	value: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	satisfied: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	outputId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "outputs", key: "id" },
		onDelete: "CASCADE",
	},
	thresholdId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "thresholds", key: "id" },
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

const conditionOptions = (sequelize: Sequelize): InitOptions<Condition> => ({
	sequelize,
	tableName: "conditions",
	timestamps: true,
})

//

export { Condition, conditionAttributes, conditionOptions }
