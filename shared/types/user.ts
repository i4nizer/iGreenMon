import z from "zod"
import {
	UserSchema,
	UserSafeSchema,
	UserSignUpSchema,
	UserSignInSchema,
	UserEmailSchema,
	UserPasswordResetSchema,
	UserSettingsSchema,
} from "#shared/schema/user"

//

type User = z.infer<typeof UserSchema>
type UserSafe = z.infer<typeof UserSafeSchema>
type UserSignUp = z.infer<typeof UserSignUpSchema>
type UserSignIn = z.infer<typeof UserSignInSchema>
type UserEmail = z.infer<typeof UserEmailSchema>
type UserPasswordReset = z.infer<typeof UserPasswordResetSchema>
type UserSettings = z.infer<typeof UserSettingsSchema>

//

export type {
	User,
	UserSafe,
	UserSignUp,
	UserSignIn,
	UserEmail,
	UserPasswordReset,
	UserSettings,
}
