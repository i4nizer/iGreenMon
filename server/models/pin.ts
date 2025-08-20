import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { PinMode, PinType } from "#shared/schema/pin"

//

class Pin extends Model<InferAttributes<Pin>, InferCreationAttributes<Pin>> {
	declare id: CreationOptional<number>
	declare type: CreationOptional<PinType>
	declare mode: CreationOptional<PinMode>
	declare number: number
	declare esp32Id: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const pinAttributes: ModelAttributes<Pin, InferAttributes<Pin>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.ENUM(...PinType),
		allowNull: false,
		defaultValue: PinType[0],
	},
	mode: {
		type: DataTypes.ENUM(...PinMode),
		allowNull: false,
		defaultValue: PinMode[0],
	},
	number: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	esp32Id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "esp32s", key: "id" },
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

const pinOptions = (sequelize: Sequelize): InitOptions<Pin> => ({
	sequelize,
	tableName: "pins",
	timestamps: true,
})

//

export { Pin, pinAttributes, pinOptions }
