import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
    InitOptions,
    InferAttributes,
    ForeignKey,
    CreationOptional,
    InferCreationAttributes,
} from "sequelize"
import { Esp32CamFormat, Esp32CamResolution } from "#shared/schema/esp32-cam"

//

class Esp32Cam extends Model<
    InferAttributes<Esp32Cam>,
    InferCreationAttributes<Esp32Cam>
> {
    declare id: CreationOptional<number>
    declare name: string
    declare description: CreationOptional<string>
    declare detect: CreationOptional<boolean>
    declare interval: CreationOptional<number>
    declare format: CreationOptional<Esp32CamFormat>
    declare quality: CreationOptional<number>
    declare resolution: CreationOptional<Esp32CamResolution>
    declare realtime: CreationOptional<boolean>
    declare disabled: CreationOptional<boolean>
    declare connected: CreationOptional<boolean>
    declare tokenId: ForeignKey<number>
    declare greenhouseId: ForeignKey<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

//

const esp32CamAttributes: ModelAttributes<
	Esp32Cam,
	InferAttributes<Esp32Cam>
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
	description: {
		type: DataTypes.STRING(500),
		allowNull: false,
		defaultValue: "",
	},
	detect: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
	interval: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 60000,
	},
	format: {
		type: DataTypes.ENUM(...Esp32CamFormat),
		allowNull: false,
		defaultValue: "PIXFORMAT_JPEG",
	},
	quality: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 12,
	},
	resolution: {
		type: DataTypes.ENUM(...Esp32CamResolution),
		allowNull: false,
		defaultValue: "FRAMESIZE_UXGA",
	},
	realtime: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
	connected: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	tokenId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "tokens", key: "id" },
		onDelete: "CASCADE",
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

const esp32CamOptions = (sequelize: Sequelize): InitOptions<Esp32Cam> => ({
    sequelize,
    tableName: "esp32cams",
    timestamps: true,
})

//

export { Esp32Cam, esp32CamAttributes, esp32CamOptions }
