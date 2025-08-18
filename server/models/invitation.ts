import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { InvitationResponse } from "#shared/schema/invitation"

//

class Invitation extends Model<
	InferAttributes<Invitation>,
	InferCreationAttributes<Invitation>
> {
	declare id: CreationOptional<number>
	declare message: string
	declare emailed: CreationOptional<boolean>
	declare response: CreationOptional<InvitationResponse>
	declare inviteeId: ForeignKey<number>
	declare inviterId: ForeignKey<number>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const invitationAttributes: ModelAttributes<
	Invitation,
	InferAttributes<Invitation>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	message: {
		type: DataTypes.STRING(500),
		allowNull: false,
	},
	emailed: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	response: {
		type: DataTypes.ENUM(...InvitationResponse),
		allowNull: false,
		defaultValue: "Unset",
	},
	inviteeId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users", key: "id" },
		onDelete: "CASCADE",
	},
	inviterId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users", key: "id" },
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

const invitationOptions = (sequelize: Sequelize): InitOptions<Invitation> => ({
	sequelize,
	tableName: "invitations",
	timestamps: true,
})

//

export { Invitation, invitationAttributes, invitationOptions }
