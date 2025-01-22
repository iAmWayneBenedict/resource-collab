import { lucia } from "@/config/auth/auth";
import { CustomError } from "@/lib/error";
import { cookies } from "next/headers";

export const createSession = async (id: string) => {
	const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
};

/**
 * Formats a given CustomError into a structured array containing error details.
 *
 * @param error - The CustomError instance to format.
 * @returns An array with two objects: one containing the error message and data,
 *          and the other containing the error status code.
 *
 * @example
 * const error = new CustomError('Invalid input', { field: 'username' }, 400);
 * const formattedError = globalErrorFormatter(error);
 * // formattedError will be:
 * // [
 * //   { message: 'Invalid input', data: { field: 'username' } },
 * //   { status: 400 }
 * // ]
 */
export const globalErrorFormatter = (error: CustomError) => {
	return [
		{
			message: error.message,
			data: error.data,
		},
		{
			status: error.code as number,
		},
	];
};
