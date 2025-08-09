import { z } from "zod"

//

const UserSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1).max(128),
	email: z.string().email(),
	phone: z.string().length(11).optional().or(z.string().length(0)),
	password: z.string().min(8).max(128),
	verified: z.boolean(),
	disabled: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

//

const UserSafeSchema = UserSchema.omit({ password: true })
const UserSignUpSchema = UserSchema.pick({
	name: true,
	email: true,
	phone: true,
	password: true,
})

const UserSignInSchema = UserSchema.pick({ name: true, password: true })
const UserEmailSchema = UserSchema.pick({ email: true })
const UserPasswordResetSchema = UserSchema.pick({ password: true })
	.extend({ confirm: z.string().min(8).max(128), token: z.string().jwt() })
	.refine((data) => data.confirm === data.password, {
		message: "Passwords must match.",
		path: ["confirm"],
	})

const UserUpdateSchema = UserSchema.pick({ name: true, phone: true })

//

export {
	UserSchema,
	UserSafeSchema,
	UserSignUpSchema,
	UserSignInSchema,
	UserEmailSchema,
	UserPasswordResetSchema,
	UserUpdateSchema,
}
