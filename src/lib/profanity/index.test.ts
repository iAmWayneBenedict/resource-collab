import { describe, it, expect, vi } from "vitest";
import { hasBlockedProfanity } from "@/lib/profanity/index";


describe("hasBlockedProfanity", () => {

    describe("profanity detection", () => {
        it("should detect profanity in lower case text", () => {
            const result = hasBlockedProfanity("This contains a ass.");
            expect(result).toBe(true);
        });

        it("should detect profanity in upper case text", () => {
            const result = hasBlockedProfanity("This contains a ASS.");
            expect(result).toBe(true);
        });

        it("should detect multiple profane words in text", () => {
            const result = hasBlockedProfanity("This contains a ass and a bitch.");
            expect(result).toBe(true);
        });

        it("should not detect non-profanity words", () => {
            const result = hasBlockedProfanity("This is a clean sentence.");
            expect(result).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("should handle empty string input", () => {
            const result = hasBlockedProfanity("");
            expect(result).toBe(false);
        });

        it("should handle very long input text", () => {
            const longText = "This is a very long text that might contain profanity.";
            const result = hasBlockedProfanity(longText);
            expect(result).toBe(false);
        });
    });
});
