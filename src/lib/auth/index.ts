import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

import type { Session, User } from "lucia";
import { eq } from "drizzle-orm";

import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { lucia } from "@/config/auth/auth";
import { db } from "@/data/connection";
import { emailVerificationCodes } from "@/data/schema";
import {
	addVerificationCode,
	deleteVerificationCode,
} from "@/repositories/email-verification-codes";

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);

export async function logout(): Promise<ActionResult> {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
			status: 403,
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return {
		error: null,
		status: 200,
	};
}

interface ActionResult {
	error: string | null;
	status: number;
}

export async function generateEmailVerificationCode(
	userId: string,
	email: string
): Promise<string> {
	await deleteVerificationCode(userId);

	const code = generateRandomString(6, alphabet("0-9"));

	await addVerificationCode({
		user_id: userId,
		email,
		code,
		expires_at: createDate(new TimeSpan(15, "m")), // 15 minutes
	});

	return code;
}
