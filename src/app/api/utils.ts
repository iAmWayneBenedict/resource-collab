import { lucia } from "@/config/auth/auth";
import { cookies } from "next/headers";

export const createSession = async (id: string) => {
	const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
};
