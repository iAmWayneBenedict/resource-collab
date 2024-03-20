import { z } from "zod";

export const RegisterFormSchema = z
	.object({
		name: z.string().min(1, { message: "Name is required" }),
		email: z.string().email().min(5).max(255),
		password: z.string().min(8).max(255),

		// Confirm password should be the same as password
		confirm_password: z.string(),
	})
	.refine((values) => values.password === values.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type TRegisterForm = z.infer<typeof RegisterFormSchema>;
