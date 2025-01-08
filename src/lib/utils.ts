import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isServer() {
	return typeof window === "undefined";
}

/**
 * Description: converts the data to json
 *
 * @export
 * @template T - (Generic type) will be inferred from the data
 * @param {T} data - data to be converted to json
 * @returns {number | string | boolean | object}
 */
export function toJson<T>(data: T): number | string | boolean | object {
	return JSON.parse(JSON.stringify(data)); // convert to string because data can be of any type and parse will convert it to json
}

/**
 * Description: converts the data to string
 *
 * @export
 * @template T - (Generic type) will be inferred from the data
 * @param {T} data - data to be converted to string
 * @returns {string}
 */
export function toStr<T>(data: T): string {
	return JSON.stringify(data);
}

/**
 * Binds the error message to the react-hook-form
 *
 * @export
 * @param {Error} errors - error object
 * @param {(name: any, error: { message: string }) => void} setError - react-hook-form setError function
 * @returns {void}
 *
 * @example
 * ```typescript
 * const { setError } = useForm();
 * const mutation = useMutation({
 *   mutationFn: (data: TRegisterForm) => AuthApiManager.register(data),
 *   onError: (err) => {
 *    bindReactHookFormError(errors, setError);
 *  },
 * });
 * ```
 */
export function bindReactHookFormError(
	errors: { data: { [key: string]: string[] } } | Error,
	setError: (name: any, error: { message: string }) => void
): void {
	//  Cast the errors to TErrorAPIResponse - since the response is originally TErrorAPIResponse
	const errorTemp = errors as unknown as TErrorAPIResponse;
	if (Object.hasOwnProperty.call(errorTemp, "path")) return;
	Object.entries(errorTemp.data!).forEach(([, paths]) => {
		paths.forEach((path: string) => {
			setError(path, { message: errorTemp.message });
		});
	});
}

export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (_) {
		return false;
	}
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
