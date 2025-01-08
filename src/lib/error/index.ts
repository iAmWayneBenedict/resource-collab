/**
 * CustomError class extends the built-in Error class to include additional
 * properties for error handling.
 *
 * @param {string} message - The error message.
 * @param {unknown} data - Additional data related to the error.
 * @param {unknown} code - A code representing the error type or category.
 */
class CustomError extends Error {
	data: unknown;
	code: unknown;

	constructor(message: string, data: unknown, code: unknown) {
		super(message);
		this.data = data;
		this.code = code;
	}
}

export { CustomError };
