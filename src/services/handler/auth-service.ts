import { TUsers } from "@/data/schema";
import { generateEmailVerificationCode, validateRequest } from "@/lib/auth";
import { CustomError } from "@/lib/error";
import { userRepository } from "@/repositories";
import bcrypt from "bcrypt";
import { alphabet, generateRandomString } from "oslo/crypto";
import { sendVerificationRequest } from "../email/emailTemplateGenerator";
import { createSession } from "@/app/api/v1/rest/utils";

/**
 * Registers a new user
 *
 * @param {object} body - Request body
 * @param {string} body.name - Full name
 * @param {string} body.email - Email address
 * @param {string} body.password - Password
 * @param {boolean} [body.adminCreateUser=false] - If the user is created through admin
 * @param {"user"|"admin"|"guest"} [body.role="user"] - Role of the user
 * @returns {Promise<TSuccessAPIResponse<any> | TErrorAPIResponse>}
 */
export const register = async (
	body: any
): Promise<TSuccessAPIResponse<any> | TErrorAPIResponse> => {
	// Check if user already exists
	const userEmail = await userRepository.findUserBy("email", body.email);
	if (userEmail.length > 0) {
		throw new CustomError("Email already exists", { path: ["email"] }, 400);
	}

	const hashedPassword = await bcrypt.hash(body.password, 10);
	const userId = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));

	// created user through admin
	if (body.adminCreateUser) {
		await userRepository.save({
			id: userId,
			name: body.name,
			email: body.email,
			password: hashedPassword,
			email_verified: true,
			role: body.role,
		} as TUsers);

		return {
			message: "User created",
			data: { id: userId },
			status: 201,
		};
	}

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

/**
 * Logs in an existing user
 *
 * @param {object} body - Request body
 * @param {string} body.email - Email address
 * @param {string} body.password - Password
 * @returns {Promise<TSuccessAPIResponse<any> | TErrorAPIResponse>}
 */
export const login = async (body: {
	email: string;
	password: string;
}): Promise<TSuccessAPIResponse<any> | TErrorAPIResponse> => {
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

/**
 * Validates a login request.
 * @param {object} body - Request body
 * @param {string} body.email - Email address
 * @param {string} body.password - Password
 * @throws {CustomError} If the email or password is invalid
 * @returns {Promise<void>}
 */
const validateLogin = async (body: { email: string; password: string }): Promise<void> => {
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

/**
 * Validates that the request was made by an admin.
 * @throws {CustomError} If the request was not made by an admin.
 * @returns {Promise<void>}
 */
export const validateFromAdminRequest = async () => {
	const session = await validateRequest();
	if (!session || !session.user || session.user.role !== "admin") {
		throw new CustomError("Unauthorized", null, 401);
	}
};
