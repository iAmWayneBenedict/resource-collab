import axios from "axios";
import { hasBlockedProfanity } from "@/lib/profanity";

/**
 * Asynchronously checks if the given text contains any profanity.
 *
 * This function uses both an external API and a local profanity bank to determine
 * if the provided text contains any profane words or phrases. It first checks for
 * profanity using an HTTP request to an external service, and then verifies against
 * a local list of known profane terms.
 *
 * @param {string} data - The text to be checked for profanity.
 * @returns {Promise<boolean>} A promise that resolves to `true` if profanity is detected,
 * otherwise resolves to `false`.
 */

export const hasProfanity: (data: string) => Promise<boolean> = async (
	data: string
): Promise<boolean> => {
	const profanityDetectedFromRequest: boolean = await profanityDetectedRequest(data);
	const profanityDetectedFromProfanityBank: boolean = hasBlockedProfanity(data);

	return profanityDetectedFromRequest || profanityDetectedFromProfanityBank;
};

/**
 * Makes an HTTP request to an external service to detect profanity in the provided text.
 * The external service used is Vector AI's profanity detection API.
 *
 * @param {string} data - The text to be checked for profanity.
 * @returns {Promise<boolean>} A promise that resolves to `true` if profanity is detected,
 * otherwise resolves to `false`.
 */

const profanityDetectedRequest: (data: string) => Promise<boolean> = async (
	data: string
): Promise<boolean> => {
	const hasProfanityResponse = await axios.post(
		"https://vector.profanity.dev",
		{
			message: data?.toString(),
		},
		{ headers: { "Content-Type": "application/json" } }
	);

	return hasProfanityResponse.data.isProfanity;
};
