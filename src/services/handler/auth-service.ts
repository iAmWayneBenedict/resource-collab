import { TUsers } from "@/data/schema";
import { generateEmailVerificationCode } from "@/lib/auth";
import { CustomError } from "@/lib/error";
import { userRepository } from "@/repositories";
import bcrypt from "bcrypt";
import { alphabet, generateRandomString } from "oslo/crypto";
import { sendVerificationRequest } from "../email/emailTemplateGenerator";
import { createSession } from "@/app/api/v1/rest/utils";

export const register = async (body: any) => {
	// Check if user already exists
	const userEmail = await userRepository.findUserBy("email", body.email);
	if (userEmail.length > 0) {
		throw new CustomError("Email already exists", { path: ["email"] }, 400);
	}

	const hashedPassword = await bcrypt.hash(body.password, 10);
	const userId = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));

	// save user
	try {
		await userRepository.save({
			id: userId,
			name: body.name,
			email: body.email,
			password: hashedPassword,
		} as TUsers);
	} catch (error) {
		console.log("Error creating user", error);
		throw error;
	}

	const verificationCode = await generateEmailVerificationCode(userId, body.email);

	// send verification email
	try {
		await sendVerificationRequest({ identifier: body.email, code: verificationCode });
	} catch (error) {
		console.log("Error sending verification email", error);

		throw new CustomError("Error sending verification email", null, 500);
	}

	return {
		message: "User created",
		data: { id: userId },
		status: 201,
	};
};

export const login = async (body: { email: string; password: string }) => {
	try {
		await validateLogin(body);
	} catch (error) {
		throw error;
	}

	return {
		message: "User logged in",
		data: null,
		status: 200,
	};
};

const validateLogin = async (body: { email: string; password: string }) => {
	const { email, password } = body;

	// Check if user exists
	const user = await userRepository.findUserBy("email", email);
	if (user.length === 0) {
		throw new CustomError("Invalid email or password", { path: ["alert"] }, 400);
	}

	const userRecord = user[0];

	const passwordMatch = await bcrypt.compare(password, userRecord.password as string);

	if (!passwordMatch) {
		throw new CustomError("Invalid email or password", { path: ["alert"] }, 400);
	}

	await createSession(userRecord.id as string);
};
