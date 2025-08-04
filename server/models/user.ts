import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>
	declare name: string
	declare email: string
	declare phone: CreationOptional<string>
	declare password: string
	declare verified: CreationOptional<boolean>
	declare disabled: CreationOptional<boolean>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const userAttributes: ModelAttributes<User, InferAttributes<User>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "name",
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "email",
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
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

const userOptions = (sequelize: Sequelize): InitOptions<User> => ({
	sequelize,
	tableName: "users",
	timestamps: true,
})

//

export { User, userAttributes, userOptions }
