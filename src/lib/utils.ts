import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isServer() {
	return typeof window === "undefined";
}

export function urlValidator(url: string) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}
