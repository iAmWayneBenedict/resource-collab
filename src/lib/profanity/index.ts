import { profanityBank } from "./profanity-bank";

export const hasBlockedProfanity: (test: string) => boolean = (text: string) => {
    return profanityBank.some((word: string) => text.toLowerCase().includes(word));
}